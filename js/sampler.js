/* DCX Audio - sampling pelo microfone ou pela entrada de audio
 *
 * RJ.Sampler(output): output e a saida comum (RJ.Output ou host.engine), com
 * ensure() e ctx. Usado pelo RJ-2000 (SAMPLE) e pelo RJ-950 (Mic/Input).
 */
window.RJ = window.RJ || {};

/**
 * Sampler pelo microfone/entrada de audio.
 * Fluxo: open() pede permissao e liga o medidor; arm() espera o sinal passar
 * do limiar (threshold) e grava ate stop() ou ate o tempo maximo.
 */
RJ.Sampler = class {
  constructor(engine) {
    this.engine = engine;
    this.stream = null;
    this.state = "off"; // off | monitor | armed | recording
    this.level = 0;
    this.threshold = 0.05;
    this.gain = 1;
    this.peak = 0;
    this.onLevel = null;
    this.onDone = null;
  }

  async open() {
    const ctx = this.engine.ensure();
    if (this.stream) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Este navegador nao permite gravar audio aqui");
    }
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    });
    this.src = ctx.createMediaStreamSource(this.stream);
    // ScriptProcessor: antigo, mas funciona em todos os navegadores e ate abrindo o arquivo direto
    this.proc = ctx.createScriptProcessor(2048, 1, 1);
    this.mute = ctx.createGain();
    this.mute.gain.value = 0;
    this.src.connect(this.proc);
    this.proc.connect(this.mute);
    this.mute.connect(ctx.destination);
    this.proc.onaudioprocess = (ev) => this.process(ev.inputBuffer.getChannelData(0));
    this.state = "monitor";
  }

  process(input) {
    const data = new Float32Array(input.length);
    let pk = 0;
    for (let i = 0; i < input.length; i++) {
      const v = Math.max(-1, Math.min(1, input[i] * this.gain));
      data[i] = v;
      const a = Math.abs(v); if (a > pk) pk = a;
    }
    this.level = Math.max(pk, this.level * 0.85);
    this.peak = Math.max(pk, this.peak * 0.97);
    if (this.state === "armed" && pk >= this.threshold) this.begin();
    if (this.state === "recording") {
      this.chunks.push(data);
      this.count += data.length;
      if (pk > this.recPeak) this.recPeak = pk;
      if (this.count >= this.maxSamples) this.stop();
    }
    const now = performance.now();
    if (this.onLevel && now - (this.lastUi || 0) > 50) { this.lastUi = now; this.onLevel(this.level, this.state); }
  }

  begin() {
    this.state = "recording";
    this.chunks = [];
    this.count = 0;
    this.recPeak = 0;
  }

  /** Grava na hora, sem esperar o limiar (SAMPLE 9). */
  force(maxSeconds) {
    if (this.state === "off") return;
    this.maxSamples = Math.floor(maxSeconds * this.engine.ctx.sampleRate);
    this.begin();
  }

  arm(maxSeconds) {
    if (this.state === "off") return;
    this.maxSamples = Math.floor(maxSeconds * this.engine.ctx.sampleRate);
    this.state = "armed";
  }

  stop() {
    if (this.state === "recording") {
      const total = Math.min(this.count, this.maxSamples);
      const out = new Float32Array(total);
      let o = 0;
      for (const c of this.chunks) {
        const n = Math.min(c.length, total - o);
        out.set(c.subarray(0, n), o);
        o += n;
        if (o >= total) break;
      }
      this.chunks = [];
      this.state = "monitor";
      if (this.onDone) this.onDone(out, this.engine.ctx.sampleRate, this.recPeak);
    } else if (this.state === "armed") {
      this.state = "monitor";
    }
  }

  close() {
    if (this.proc) { this.proc.onaudioprocess = null; this.proc.disconnect(); }
    if (this.src) this.src.disconnect();
    if (this.mute) this.mute.disconnect();
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    this.stream = null; this.state = "off"; this.level = 0;
  }
};
