/* DCX Audio - barra de MIDI Learn para uma pagina sem o SP
 *
 * No Studio, o MIDI Learn abre pelo SET-UP 22 do RJ-2000. Numa pagina solo,
 * esta barra faz o mesmo com o learn do host:
 *   Learn         liga o MIDI e entra no modo de aprender (de novo: sai)
 *   tocar         num controle do aparelho escolhe o que ele vai aprender
 *   mexer         no controlador: a mensagem fica esperando
 *   Enter         (ou Save) salva; Delete apaga o do controle escolhido; Esc sai
 *
 *   new RJ.LearnBar(host, { root, bar })
 *     root  onde ficam os controles que aprendem (o aparelho)
 *     bar   elemento vazio onde a barra e montada
 */
window.RJ = window.RJ || {};

RJ.LearnBar = class {
  constructor(host, o) {
    this.host = host;
    this.L = host.learn;
    this.root = o.root;
    this.msg = "";
    const bar = o.bar;
    bar.classList.add("learnbar");
    bar.innerHTML = '<button type="button" class="learnbar-btn">MIDI Learn</button>' +
      '<button type="button" class="learnbar-save" hidden>Save</button>' +
      '<span class="learnbar-text" aria-live="polite"></span>';
    this.btn = bar.querySelector(".learnbar-btn");
    this.save = bar.querySelector(".learnbar-save");
    this.text = bar.querySelector(".learnbar-text");
    this.btn.addEventListener("click", () => this.toggle());
    this.save.addEventListener("click", () => this.enter());

    const prev = this.L.onChange;
    this.L.onChange = () => { if (prev) prev(); this.render(); };
    host.midi.on("change", () => this.render());

    // no Learn, tocar num controle escolhe; a funcao dele nao roda
    const grab = e => {
      if (!this.L.learning || !e.target.closest || !this.root.contains(e.target)) return;
      const el = e.target.closest("[data-learn]");
      if (e.type === "wheel") { if (el) { e.preventDefault(); e.stopPropagation(); } return; }
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "pointerdown" && el) { this.L.select(el.dataset.learn); this.msg = ""; this.render(); }
    };
    ["pointerdown", "click", "dblclick"].forEach(ev => window.addEventListener(ev, grab, true));
    window.addEventListener("wheel", grab, { capture: true, passive: false });

    window.addEventListener("keydown", e => {
      if (!this.L.learning) return;
      if (e.code === "Tab") return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (e.repeat) return;
      if (e.code === "Enter" || e.code === "NumpadEnter") this.enter();
      else if (e.code === "Escape") this.toggle(false);
      else if ((e.code === "Backspace" || e.code === "Delete") && this.L.sel) { const n = this.L.clear(this.L.sel); if (n) { this.msg = "Cleared " + n; this.render(); } }
    }, true);
    this.render();
  }

  async toggle(on = !this.L.learning) {
    if (on) {
      if (!this.host.on) this.host.power();
      this.L.start();
      this.msg = "";
      try { await this.host.enableMidi(); } catch (e) { this.msg = "MIDI unavailable in this browser"; }
    } else {
      this.L.stop();
      this.msg = "";
    }
    this.render();
  }

  enter() {
    const name = this.L.save();
    if (name) this.msg = "Saved " + name;
    this.render();
  }

  render() {
    const L = this.L, M = this.host.midi, label = RJ.MidiMap.label;
    this.btn.classList.toggle("on", L.learning);
    this.btn.setAttribute("aria-pressed", L.learning ? "true" : "false");
    const t = L.sel && L.targets.get(L.sel);
    this.save.hidden = !(L.learning && t && L.cand);
    let s;
    if (!L.learning) s = this.msg || (Object.keys(L.map).length ? Object.keys(L.map).length + " learned" : "");
    else if (this.msg && !t) s = this.msg;
    else if (!M.access) s = M.failed ? "MIDI unavailable" : "Starting MIDI...";
    else if (!t) s = L.cand ? label(L.cand.key) + ": touch a control" : M.inputs.length ? "Touch a control" : "No MIDI input";
    else if (L.cand) s = t.name + " ← " + label(L.cand.key) + " (Enter)";
    else { const b = L.bound(t.id); s = t.name + ": " + (b ? "now " + label(b) : "send MIDI..."); }
    this.text.textContent = s;
  }
};
