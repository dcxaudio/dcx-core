# Changelog

## v1.0.0

Primeira versão separada do [RJ-2000](https://github.com/dcxaudio/rj-2000). O histórico dos arquivos vem junto.

- `js/`: `dsp`, `decode`, `store`, `output` (AudioContext e limitador), `sampler` (microfone), `midi`, `midimap` (MIDI Learn), `host` e `learnbar`.
- `css/base.css` (cores, fontes, teclas, LEDs, knobs, LCD e rack, com os nomes neutros `.rack-ear` e `--rack-*`) e `css/solo.css` (página de um aparelho).
- `fonts/`: Archivo Narrow e VT323 em woff2 (latin e latin-ext), com as licenças OFL. Funciona offline.
- MIDI: as entradas com "MCU", "HUI" ou "DAW" no nome são ignoradas (`RJ.MIDI_IGNORE`).
- Novos em relação ao RJ-2000 b0.3: `RJ.Sampler` (antes no `io.js` do SP) e `RJ.nearZero` (antes no `project.js`) vieram para o core, porque o RJ-950 também usa os dois. `RJ.LearnBar` e `css/solo.css` são das páginas solo.
- `tools/midi-teste.html`: página para testar controladores MIDI.
