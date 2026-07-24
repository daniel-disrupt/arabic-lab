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

Exact-string matching misses two real, common cases:
1. faster-whisper mishearing one letter of an unusual dialectal word (e.g.
   transcribing بِحُكّك as بحقك — ق for ك) while getting the timing and every
   surrounding word exactly right.
2. faster-whisper splitting one written word into two adjacent ASR tokens (e.g.
   منصلي heard as separate "من" + "صلي" tokens, عالكتاب heard as "على" + "الكتاب") —
   the sounds are heard correctly, just not grouped the way the text is written.

Since the audio truly is the known text (this is forced alignment, not free
transcription), a 'replace' opcode block (raw and known words disagree over some
span) is resolved by finding the best way to partition that span's raw tokens into
contiguous groups, one per known word in order, and checking each group's
concatenation against its known word. This only ever *uses* an already-measured
token start time (the earliest sub-token in a group) — it never interpolates a new
one, so a known word that's actually merged into a larger ASR token elsewhere (the
reverse direction — more known words than raw tokens) still can't be split with any
confidence and is correctly left unaligned, preserving the project's "never
fabricate a timestamp" rule for cases that really are uncertain. Likewise
insert/delete opcodes (raw and known genuinely have different content, not just
different tokenization) are never touched.

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


def best_partition(raw_block, known_block):
    """Partition raw_block (>= len(known_block)) into len(known_block) contiguous,
    non-empty, ordered groups maximizing the sum of each group's concatenation
    similarity to its known word. Returns a list of (start, end) index pairs into
    raw_block, one per known word, or None if no valid partition exists (only
    possible when raw_block is shorter than known_block)."""
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
            elif tag == 'replace' and (a2 - a1) >= (b2 - b1):
                # raw has at least as many tokens as known words in this span -- try
                # grouping raw tokens (1 or more per known word) to recover from both a
                # misheard letter (group size 1) and a word faster-whisper split into
                # multiple ASR tokens (group size >1). Never attempted when raw has FEWER
                # tokens than known (more known words than raw tokens) -- that would mean
                # guessing where inside a single measured span an unmeasured word boundary
                # falls, which is fabrication, not measurement.
                groups = best_partition(raw_norm[a1:a2], known_norm[b1:b2])
                for m, (j, i) in enumerate(groups):
                    raw_i, known_i = a1 + j, b1 + m
                    concat = ''.join(raw_norm[a1 + j:a1 + i])
                    kn = known_norm[b1 + m]
                    ratio = 1.0 if concat == kn else difflib.SequenceMatcher(None, concat, kn).ratio()
                    if ratio >= FUZZY_RATIO_THRESHOLD:
                        accept(raw_i, known_i)
                        matched += 1
                        if ratio < 1.0 or (i - j) > 1:
                            fuzzy_matched += 1
                            note = f"merged {i - j} tokens " if (i - j) > 1 else ""
                            print(f"  fuzzy match: {note}heard {concat!r} for known {kn!r} (ratio {ratio:.2f})", file=sys.stderr)

    aligned.sort(key=lambda a: a['t'])
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(aligned, f, ensure_ascii=False)

    rate = round(matched / total_words * 100, 1) if total_words else 0
    print(f"Aligned {matched}/{total_words} words ({rate}%), {fuzzy_matched} via fuzzy fallback", file=sys.stderr)


if __name__ == '__main__':
    main()
