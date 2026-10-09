// Canvas hero "Data Grid" (DESIGN.md §5.2): bidang sel bermotif ikon grid di logo,
// digambar satu fragment shader WebGL2 tanpa library. Dimuat dinamis oleh HeroCanvas.

const VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform float uLight; // 1 = tema terang: grid navy di latar terang perlu jauh lebih tipis
out vec4 o;

const float HORIZON = 1.9;          // garis horizon di atas layar = perspektif miring
const vec2 DENS = vec2(26.0, 40.0); // ± 40 x 24 sel terlihat di layar 16:9
const vec3 BLUE = vec3(0.180, 0.549, 0.910);  // brand-blue #2E8CE8
const vec3 NAVY = vec3(0.039, 0.165, 0.369);  // brand-navy #0A2A5E
const vec3 GREEN = vec3(0.310, 0.682, 0.271); // brand-green #4FAE45

vec2 ground(vec2 p) {
  float z = 1.0 / (HORIZON - p.y);
  return vec2(p.x * z, z) * DENS;
}

float hash(vec2 c) {
  return fract(sin(dot(c, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2((uv.x * 2.0 - 1.0) * aspect, uv.y * 2.0 - 1.0);

  vec2 g = ground(p);
  vec2 cell = floor(g);
  vec2 f = fract(g) - 0.5;

  // Sel di sekitar kursor terangkat; tanpa kursor, gelombang pelan.
  vec2 gm = ground(vec2(uMouse.x * aspect, uMouse.y));
  float d = length(cell + 0.5 - gm);
  float hover = exp(-d * d / 7.0) * uHover;
  float wave = (0.5 + 0.5 * sin(cell.y * 0.42 + cell.x * 0.12 - uTime * 1.1)) * 0.3 * (1.0 - uHover);
  float lift = max(hover, wave);

  float box = max(abs(f.x), abs(f.y));
  float size = 0.34 + 0.1 * lift;
  float aa = fwidth(box) * 1.2;
  float shape = 1.0 - smoothstep(size - aa, size + aa, box);

  // Sesekali satu sel acak menyala hijau lalu memudar (sudut dokumen di logo).
  float period = 2.6;
  float k = fract(uTime / period);
  float flash = step(0.9988, hash(cell + floor(uTime / period) * 17.0)) * (1.0 - k);

  float depthFade = smoothstep(0.0, 0.35, uv.y) * (1.0 - smoothstep(0.75, 1.0, uv.y));
  vec3 base = mix(BLUE, NAVY, clamp(uv.x * 0.6 + (1.0 - uv.y) * 0.5, 0.0, 1.0));
  vec3 col = mix(base, BLUE, lift);
  col = mix(col, GREEN, flash);
  float alpha = shape * depthFade * (0.1 + 0.55 * lift + 0.6 * flash) * mix(1.0, 0.4, uLight);
  o = vec4(col * alpha, alpha);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

/** Mengembalikan fungsi stop, atau null bila WebGL2 tidak tersedia (fallback CSS tetap tampil). */
export function startDataGrid(canvas: HTMLCanvasElement, onFirstFrame: () => void) {
  // failIfMajorPerformanceCaveat: tanpa GPU (WebGL lewat software, mis. SwiftShader) kembalikan
  // null, jadi fallback CSS yang tampil; shader ini menyita CPU bila tidak dipercepat GPU.
  const gl = canvas.getContext("webgl2", {
    antialias: false,
    powerPreference: "low-power",
    failIfMajorPerformanceCaveat: true,
  });
  if (!gl) return null;
  // Chrome tidak selalu mematuhi failIfMajorPerformanceCaveat; cek renderer software langsung.
  const debug = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = debug ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : "";
  if (/swiftshader|llvmpipe|basic render|software/i.test(renderer)) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  // biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram adalah API WebGL, bukan React hook
  gl.useProgram(prog);

  // Satu segitiga yang menutupi seluruh layar.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "uRes");
  const uTime = gl.getUniformLocation(prog, "uTime");
  const uMouse = gl.getUniformLocation(prog, "uMouse");
  const uHover = gl.getUniformLocation(prog, "uHover");
  const uLight = gl.getUniformLocation(prog, "uLight");

  const dpr = Math.min(window.devicePixelRatio, 1.5);
  const resize = () => {
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // Posisi kursor dalam koordinat layar [-1, 1], diredam 0,08 per frame.
  const target = { x: 0, y: 0, hover: 0 };
  const mouse = { x: 0, y: 0, hover: 0 };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = canvas.getBoundingClientRect();
    const inside =
      e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    target.hover = inside ? 1 : 0;
    target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    target.y = 1 - ((e.clientY - r.top) / r.height) * 2;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  let raf = 0;
  let visible = true;
  let first = true;
  const t0 = performance.now();
  const frame = (now: number) => {
    mouse.x += (target.x - mouse.x) * 0.08;
    mouse.y += (target.y - mouse.y) * 0.08;
    mouse.hover += (target.hover - mouse.hover) * 0.05;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - t0) / 1000);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.uniform1f(uHover, mouse.hover);
    gl.uniform1f(uLight, document.documentElement.dataset.theme === "light" ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (first) {
      first = false;
      onFirstFrame();
    }
    raf = requestAnimationFrame(frame);
  };
  const run = () => {
    cancelAnimationFrame(raf);
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
  };

  // Berhenti merender saat hero keluar layar atau tab disembunyikan.
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    run();
  });
  io.observe(canvas);
  document.addEventListener("visibilitychange", run);
  run();

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    document.removeEventListener("visibilitychange", run);
    window.removeEventListener("pointermove", onMove);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}
