# Changelog

## Não publicado (auditoria 18/11/2026)

- `output.js`: o som volta sozinho depois de ligação, tela bloqueada ou troca de app: religa em qualquer estado que não seja "running" nem "closed" (inclui o "interrupted" do iPhone), com `.catch`, e uma vez por contexto escuta `visibilitychange`, `pageshow`, `statechange` e o próximo toque ou tecla, só com a régua ligada. `RJ.setAudioSession`: "playback" ao criar o contexto (toca com a chave de silencioso do iPhone), "play-and-record" com o microfone aberto no `RJ.Sampler` (P0-01, P0-02).
- `store.js`: `put` devolve `false` também quando a gravação aborta sem erro (cota cheia), em vez de ficar pendurado (`tx.onabort`); a conexão fecha ao fim de cada transação; novo `getStrict` (também no store com prefixo) que rejeita em erro e devolve `undefined` quando a chave não existe; `get` continua igual (P0-06, P0-05, P2-07).
- `dsp.js` `downloadBlob`: a URL do arquivo só é revogada depois de 60 s (era 2 s); devolve `true`/`false` (ou uma Promise disso, quando usa o gancho ou o compartilhar); gancho opcional `RJ.saveHook(blob, nome)` para o app; em aparelho de toque, com gesto recente, usa `navigator.share` com o arquivo. No desktop o caminho é o mesmo (P0-04).
- `host.js`: `power()` pede armazenamento persistente (`navigator.storage.persist`); `pagehide` também salva tudo; o boot de cada aparelho ganhou `try`/`.catch`, com `console.error` e o recado `"bootError"` (id, erro) em vez de erro solto; trava de tela única e opcional: `setPlaying(bool)` na vista do aparelho pede `navigator.wakeLock` enquanto algum aparelho toca e solta quando todos param (nenhum aparelho usa ainda) (P1-14, P0-08, P1-15).
- MIDI Learn: sem Web MIDI (iPhone, WebView) ou com o acesso negado, a barra mostra "MIDI unavailable" e não fica no modo Learn (o painel não trava); no Learn, Ctrl/Cmd/Alt e F1-F12 passam para o navegador; note-on solta antes de apertar; quando uma entrada MIDI cai, o host solta os botões aprendidos apertados (novo recado `midi.on("disconnect")`) (P1-01, P2-11, P2-10).
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
