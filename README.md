# dcx-core

O código comum aos aparelhos da [DCX Audio](https://github.com/dcxaudio), samplers que rodam no navegador. São HTML, CSS e JavaScript puros, sem build e sem dependências.

| Arquivo | O que faz |
|---|---|
| `js/dsp.js` | reamostragem, redução de bits, WAV, base64, cruzamento por zero |
| `js/decode.js` | decodificação de áudio (WAV, MP3, AIFF...) para mono |
| `js/store.js` | armazenamento local (IndexedDB) |
| `js/output.js` | saída comum: um AudioContext e o limitador |
| `js/sampler.js` | sampling pelo microfone ou pela entrada de áudio |
| `js/midi.js` | entrada MIDI; ignora as portas de DAW (`RJ.MIDI_IGNORE`) |
| `js/midimap.js` | MIDI Learn: mapa de mensagens MIDI para os controles |
| `js/host.js` | o host: liga os aparelhos (saída, store, MIDI, envio de som entre eles) |
| `js/learnbar.js` | barra de MIDI Learn para uma página sem o RJ-2000 |
| `js/tape.js` | `RJ.Tape`: saturação de fita (AudioWorklet, tanh com ADAA); Drive 0 = som igual |
| `css/base.css` | cores, fontes, teclas, LEDs, knobs, LCD e rack |
| `css/solo.css` | página de um aparelho só: tela de ligar e barra de Learn |
| `fonts/` | Archivo Narrow e VT323 (woff2, licença SIL OFL 1.1 junto) |
| `tools/midi-teste.html` | testa um controlador MIDI e gera um relatório |

## Como um aparelho usa o core

Cada aparelho traz o core como submódulo do git em `vendor/dcx-core`, preso numa tag:

```bash
git submodule add https://github.com/dcxaudio/dcx-core.git vendor/dcx-core
git -C vendor/dcx-core checkout v1.0.0
```

A página carrega o core antes do aparelho e monta um host:

```html
<link rel="stylesheet" href="vendor/dcx-core/css/base.css">
<script src="vendor/dcx-core/js/dsp.js"></script>
<!-- decode, store, output, sampler, midi, midimap, host -->
<script>
  const host = RJ.Host.solo("rj950");        // página de um aparelho só
  const dev = new RJ.S950(host.view("rj950"));
  host.add("rj950", dev, { label: "RJ-950" });
  dev.build();
  // host.power() depois de um toque do usuário
</script>
```

O aparelho só recebe a vista dele (`host.view(id)`): `engine`, `store` (com prefixo), `learn`, `midi`, `on`, `targets()`, `send()`, `output()`, `input()`, `route()` e os recados `emit()` / `listen()`. A interface completa está no começo de `js/host.js`.

Para atualizar o core num aparelho, use `git -C vendor/dcx-core fetch --tags && git -C vendor/dcx-core checkout v1.x.y`, teste e faça o commit.

## Versões

Este repositório segue semver. Mudar a interface do host ou o nome de uma classe do CSS base sobe a versão maior. Veja o [CHANGELOG](CHANGELOG.md).

## Licença

GPL-3.0 ([LICENSE](LICENSE)). As fontes em `fonts/` são SIL OFL 1.1 (`fonts/OFL-*.txt`).


---

Projeto independente, sem vínculo com os fabricantes dos equipamentos que inspiraram as máquinas. Os nomes SP-1200, SP-404, S950 e 1202 pertencem a seus donos e aparecem só em texto, como referência.

*Independent project, not affiliated with the makers of the gear that inspired the machines; names belong to their owners and appear as text only, for reference.*
