# Changelog

## v1.1.0

- Novo `js/tape.js`: `RJ.Tape`, saturação de fita em AudioWorklet (tanh com ADAA de 1ª ordem, pré e de-ênfase, perda de agudos e wow/flutter leve). Entra um sinal, sai o mesmo com cara de fita; Drive 0 sai bit a bit igual. Veio do RJ-42, onde nasceu; o RJ-42 e a mesa (master) do DCX Studio passam a usar esta cópia.

## v1.0.0

Primeira versão separada do [RJ-2000](https://github.com/dcxaudio/rj-2000). O histórico dos arquivos vem junto.

- `js/`: `dsp`, `decode`, `store`, `output` (AudioContext e limitador), `sampler` (microfone), `midi`, `midimap` (MIDI Learn), `host` e `learnbar`.
- `css/base.css` (cores, fontes, teclas, LEDs, knobs, LCD e rack, com os nomes neutros `.rack-ear` e `--rack-*`) e `css/solo.css` (página de um aparelho).
- `fonts/`: Archivo Narrow e VT323 em woff2 (latin e latin-ext), com as licenças OFL. Funciona offline.
- MIDI: as entradas com "MCU", "HUI" ou "DAW" no nome são ignoradas (`RJ.MIDI_IGNORE`).
- Novos em relação ao RJ-2000 b0.3: `RJ.Sampler` (antes no `io.js` do SP) e `RJ.nearZero` (antes no `project.js`) vieram para o core, porque o RJ-950 também usa os dois. `RJ.LearnBar` e `css/solo.css` são das páginas solo.
- `tools/midi-teste.html`: página para testar controladores MIDI.
