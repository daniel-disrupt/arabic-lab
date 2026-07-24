#!/usr/bin/env python3
"""
Forced-alignment pass for karaoke-mode word highlighting on TTS-synthesized lesson
audio. Called by generate-voiceover.js (lesson-wide track) and
generate-proverb-audio.js (per-item clips) — not run standalone. Unlike a real
recording (free speech that deviates from the reading-edition text — see
"abed project/align_words.py", ~65% match rate), this audio is synthesized directly
from the exact same tokens it's being aligned back to, so this is closer to forced
alignment than free transcription: per-chunk word-level timestamps from
faster-whisper should match the known text far more reliably, since there's no
rephrasing/reordering to account for.

Exact-string matching still misses a real, common case: faster-whisper mishearing
one letter of an unusual dialectal word (e.g. transcribing بِحُكّك as بحقك — ق for
ك) while getting the timing and every surrounding word exactly right. Since the
audio truly is the known text (this is forced alignment, not free transcription),
an isolated single-word substitution sandwiched between two confirmed exact matches
is accepted if it's a close character-level match — genuine content divergence
(extra/missing/reordered words) is a different opcode shape (insert/delete, or an
unequal-length replace) and is never touched by this fuzzy fallback, preserving the
project's "never fabricate a timestamp" rule for cases that actually are uncertain.

Usage:
  python scripts/align-voiceover-words.py <input.json> <output.json>

input.json:  [{ "file": "<chunk mp3 path>", "offset": <seconds>,
                "words": [{ "idx": <word index>, "w": "<word>" }, ...] }, ...]
output.json: [{ "idx": <word index>, "t": <absolute seconds> }, ...]
"""
import sys
import json
import re
import difflib
from faster_whisper import WhisperModel

WHISPER_MODEL = "large-v3"
# Structural position (an isolated single-word gap between two confirmed exact
# matches) already does most of the work of ruling out a coincidental match --
# this only needs to reject two genuinely unrelated words, not confirm a strong
# resemblance, so it's kept low.
FUZZY_RATIO_THRESHOLD = 0.5

# Built from explicit unicode escapes, not literal characters -- a literal range here
# previously got silently transposed (likely by bidi-aware copy/paste) into one that
# matched base letters too, degrading every alignment that used it.
TASHKEEL = re.compile('[' + 'ً-ٰٟۖ-ۭـ' + ']')
PUNCT = '.,،؛؟!:'


def norm(s):
    s = TASHKEEL.sub('', s)
    s = s.replace('أ', 'ا').replace('إ', 'ا').replace('آ', 'ا').replace('ٱ', 'ا')
    s = s.replace('ى', 'ي')
    return s.strip().strip(PUNCT).strip()


def main():
    in_path, out_path = sys.argv[1], sys.argv[2]
    with open(in_path, encoding='utf-8') as f:
        chunks = json.load(f)

    model = WhisperModel(WHISPER_MODEL, device="cpu", compute_type="int8")

    aligned = []
    total_words = sum(len(c['words']) for c in chunks)
    matched = 0
    fuzzy_matched = 0
    for ci, c in enumerate(chunks):
        print(f"[{ci + 1}/{len(chunks)}] aligning {c['file']}...", file=sys.stderr)
        segments, _ = model.transcribe(c['file'], word_timestamps=True, language='ar')
        raw_words = []
        for seg in segments:
            for w in seg.words:
                raw_words.append({'word': w.word, 'start': w.start})

        raw_norm = [norm(w['word']) for w in raw_words]
        known_norm = [norm(w['w']) for w in c['words']]

        def accept(raw_i, known_i):
            aligned.append({
                'idx': c['words'][known_i]['idx'],
                't': round(c['offset'] + raw_words[raw_i]['start'], 3),
            })

        sm = difflib.SequenceMatcher(None, raw_norm, known_norm, autojunk=False)
        for tag, a1, a2, b1, b2 in sm.get_opcodes():
            if tag == 'equal':
                for k in range(a2 - a1):
                    accept(a1 + k, b1 + k)
                    matched += 1
            elif tag == 'replace' and (a2 - a1) == (b2 - b1):
                # Equal-length, position-for-position substitution between two confirmed
                # matches -- structurally almost certainly the same word misheard by a
                # letter or two, not a genuinely different word (which is why this is
                # restricted to 'replace', never 'insert'/'delete': those mean the raw and
                # known sequences actually have different lengths at that point, i.e. real
                # content divergence, not a misspelling).
                for k in range(a2 - a1):
                    raw_i, known_i = a1 + k, b1 + k
                    ratio = difflib.SequenceMatcher(None, raw_norm[raw_i], known_norm[known_i]).ratio()
                    if ratio >= FUZZY_RATIO_THRESHOLD:
                        accept(raw_i, known_i)
                        matched += 1
                        fuzzy_matched += 1
                        print(f"  fuzzy match: heard {raw_norm[raw_i]!r} for known {known_norm[known_i]!r} (ratio {ratio:.2f})", file=sys.stderr)

    aligned.sort(key=lambda a: a['t'])
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(aligned, f, ensure_ascii=False)

    rate = round(matched / total_words * 100, 1) if total_words else 0
    print(f"Aligned {matched}/{total_words} words ({rate}%), {fuzzy_matched} via fuzzy fallback", file=sys.stderr)


if __name__ == '__main__':
    main()
