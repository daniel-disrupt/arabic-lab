#!/usr/bin/env python3
"""
Word-level karaoke alignment for a lesson built from a REAL recording (not
TTS-synthesized audio) — e.g. a podcast/interview clip used directly, as
opposed to align-voiceover-words.py's forced-alignment case where the audio
was synthesized from the exact known text.

This is inherently less reliable than the TTS case (the "known" text is a
literal-cleanup transcript, not a guaranteed word-for-word match to what was
said), but far more reliable than aligning a real recording against a
*heavily rewritten* reading-edition essay — see files/CONTENT_PROJECT_BRIEF.md's
pilot notes (~65% cross-text vs ~87% same-audio-same-transcript on the Watch
tab). Measured on the Sami Abu Shehadeh Jaffa-story lesson: 91.7% (1009/1100
words) using this script's approach.

Two differences from align-voiceover-words.py, both because there's one real
continuous audio file rather than per-chunk synthesized clips:
1. A single whisper pass over the whole file (word_timestamps=True) produces
   all raw words up front; segment windowing (each known segment's own
   [start,end] +/- a small margin) then narrows the raw-word search space
   per segment, instead of one raw-word stream per synthesized chunk file.
2. Word indices are global across the whole lesson (matching the
   wordEls[].globalIdx convention documented in the lesson-voice-karaoke
   skill), not per-item.

Reuses the exact same normalization + best_partition fuzzy-matching algorithm
as align-voiceover-words.py (misheard-letter and split-token recovery) — see
that file's docstring for the full rationale. Only ever uses an
already-measured raw word's start time; never interpolates one, so a segment
where a known word has no defensible match is simply left out of the output,
not guessed.

Usage:
  python scripts/align-real-audio-words.py <audio.wav> <transcript.txt> <output.json>

audio.wav: the real lesson audio (16kHz mono PCM recommended).
transcript.txt: literal-cleanup transcript, one segment per line, format:
  [  12.34 ->   18.90] some cleaned-up text for this segment
  (a "[؟uncertain guess]" bracket is treated as literal text for matching
  purposes — the brackets themselves are stripped before alignment.)
output.json: [{ "idx": <global word index>, "word": <text>,
                 "start": <seconds>, "end": <seconds> }, ...]
              (a word with no "start"/"end" key was not confidently matched.)
"""
import sys
import re
import json
import difflib
from faster_whisper import WhisperModel

WHISPER_MODEL = "large-v3"
FUZZY_RATIO_THRESHOLD = 0.5
SEGMENT_WINDOW_MARGIN = 1.0  # seconds of slack on each side of a segment's own timestamps

TASHKEEL = re.compile('[' + 'ً-ٰٟۖ-ۭـ' + ']')
PUNCT = '.,،؛؟!:'
UNCERTAIN_FLAG = re.compile(r"\[؟([^\]]*)\]")

SEG_RE = re.compile(r"\[\s*([\d.]+)\s*->\s*([\d.]+)\s*\]\s*(.*)")


def norm(s):
    s = TASHKEEL.sub('', s)
    s = s.replace('أ', 'ا').replace('إ', 'ا').replace('آ', 'ا').replace('ٱ', 'ا')
    s = s.replace('ى', 'ي')
    return s.strip().strip(PUNCT).strip()


def best_partition(raw_block, known_block):
    """Same as align-voiceover-words.py: partition raw_block (>= len(known_block))
    into len(known_block) contiguous, ordered groups maximizing concatenation
    similarity to each known word. None if raw_block is shorter than known_block."""
    R, K = len(raw_block), len(known_block)
    if R < K:
        return None
    NEG = float('-inf')
    best = [[NEG] * (K + 1) for _ in range(R + 1)]
    back = [[None] * (K + 1) for _ in range(R + 1)]
    best[0][0] = 0.0
    for k in range(1, K + 1):
        for i in range(k, R + 1):
            for j in range(k - 1, i):
                if best[j][k - 1] == NEG:
                    continue
                concat = ''.join(raw_block[j:i])
                sim = 1.0 if concat == known_block[k - 1] else difflib.SequenceMatcher(None, concat, known_block[k - 1]).ratio()
                score = best[j][k - 1] + sim
                if score > best[i][k]:
                    best[i][k] = score
                    back[i][k] = j
    if best[R][K] == NEG:
        return None
    groups = []
    i, k = R, K
    while k > 0:
        j = back[i][k]
        groups.append((j, i))
        i, k = j, k - 1
    groups.reverse()
    return groups


def parse_transcript(path):
    segments = []
    with open(path, encoding='utf-8') as f:
        for line in f:
            m = SEG_RE.match(line.strip())
            if not m:
                continue
            s, e, text = float(m.group(1)), float(m.group(2)), m.group(3)
            text = UNCERTAIN_FLAG.sub(r'\1', text)
            segments.append({'start': s, 'end': e, 'words': text.split()})
    return segments


def main():
    audio_path, transcript_path, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
    segments = parse_transcript(transcript_path)

    print(f"Transcribing {audio_path} with word_timestamps=True...", file=sys.stderr)
    model = WhisperModel(WHISPER_MODEL, device="cpu", compute_type="int8")
    whisper_segments, _ = model.transcribe(audio_path, language='ar', vad_filter=True, beam_size=5, word_timestamps=True)
    raw_words = []
    for seg in whisper_segments:
        if seg.words:
            for w in seg.words:
                raw_words.append({'word': w.word, 'start': w.start})
    print(f"Got {len(raw_words)} raw words from whisper.", file=sys.stderr)

    out_words = []
    matched = 0
    fuzzy_matched = 0
    total = 0
    global_idx = 0

    for seg in segments:
        lo, hi = seg['start'] - SEGMENT_WINDOW_MARGIN, seg['end'] + SEGMENT_WINDOW_MARGIN
        window = [w for w in raw_words if lo <= w['start'] <= hi]
        raw_norm = [norm(w['word']) for w in window]
        known_norm = [norm(w) for w in seg['words']]

        assigned = [None] * len(seg['words'])

        sm = difflib.SequenceMatcher(None, raw_norm, known_norm, autojunk=False)
        for tag, a1, a2, b1, b2 in sm.get_opcodes():
            if tag == 'equal':
                for k in range(a2 - a1):
                    assigned[b1 + k] = window[a1 + k]
            elif tag == 'replace' and (a2 - a1) >= (b2 - b1):
                groups = best_partition(raw_norm[a1:a2], known_norm[b1:b2])
                if groups is None:
                    continue
                for m, (j, i) in enumerate(groups):
                    concat = ''.join(raw_norm[a1 + j:a1 + i])
                    kn = known_norm[b1 + m]
                    ratio = 1.0 if concat == kn else difflib.SequenceMatcher(None, concat, kn).ratio()
                    if ratio >= FUZZY_RATIO_THRESHOLD:
                        assigned[b1 + m] = window[a1 + j]
                        if ratio < 1.0 or (i - j) > 1:
                            fuzzy_matched += 1
                            note = f"merged {i - j} tokens " if (i - j) > 1 else ""
                            print(f"  fuzzy match: {note}heard {concat!r} for known {kn!r} (ratio {ratio:.2f})", file=sys.stderr)

        for i, w in enumerate(seg['words']):
            total += 1
            entry = {'idx': global_idx, 'word': w}
            rw = assigned[i]
            if rw is not None:
                entry['start'] = round(rw['start'], 3)
                matched += 1
            out_words.append(entry)
            global_idx += 1

    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(out_words, f, ensure_ascii=False, indent=2)

    rate = round(matched / total * 100, 1) if total else 0
    print(f"Matched {matched}/{total} words ({rate}%), {fuzzy_matched} via fuzzy fallback", file=sys.stderr)


if __name__ == '__main__':
    main()
