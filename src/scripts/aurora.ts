export function initAurora(canvas: HTMLCanvasElement): void {
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = reduceQuery.matches;
  const mouse = [0.62, 0.38];
  const start = performance.now();
  let running = false;

  function showFallback(): void {
    document.body.classList.add('is-fallback');
    const fallback = document.querySelector('[data-od-id="webgl-fallback"]');
    if (fallback instanceof HTMLElement) fallback.hidden = false;
  }

  const vertSrc = [
    '#version 300 es',
    'precision highp float;',
    'const vec2 V[3] = vec2[3](vec2(-1.0,-1.0), vec2(3.0,-1.0), vec2(-1.0,3.0));',
    'void main(){ gl_Position = vec4(V[gl_VertexID], 0.0, 1.0); }',
  ].join('\n');

  const fragSrc = [
    '#version 300 es',
    'precision highp float;',
    'uniform vec2 u_res;',
    'uniform float u_time;',
    'uniform vec2 u_mouse;',
    'out vec4 outColor;',
    'float hash(vec2 p){',
    '  p = fract(p * vec2(123.34, 456.21));',
    '  p += dot(p, p + 45.32);',
    '  return fract(p.x * p.y);',
    '}',
    'float noise(vec2 p){',
    '  vec2 i = floor(p);',
    '  vec2 f = fract(p);',
    '  f = f * f * (3.0 - 2.0 * f);',
    '  float a = hash(i);',
    '  float b = hash(i + vec2(1.0, 0.0));',
    '  float c = hash(i + vec2(0.0, 1.0));',
    '  float d = hash(i + vec2(1.0, 1.0));',
    '  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);',
    '}',
    'float fbm(vec2 p){',
    '  float v = 0.0;',
    '  float a = 0.5;',
    '  for (int i = 0; i < 6; i++){',
    '    v += a * noise(p);',
    '    p = p * 2.07 + vec2(1.7, 9.2);',
    '    a *= 0.5;',
    '  }',
    '  return v;',
    '}',
    'void main(){',
    '  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;',
    '  float t = u_time * 0.065;',
    '  vec2 m = (u_mouse - 0.5) * 0.35;',
    '  vec2 p = uv + m * 0.15;',
    '  float warp = fbm(p * vec2(1.15, 0.42) + vec2(t * 0.55, t * 0.18));',
    '  float curtains = fbm(vec2(p.x * 1.35 + warp * 1.8, p.y * 0.28 - t));',
    '  float ribbons = fbm(vec2(p.x * 0.55 - t * 0.4, p.y * 0.9 + warp));',
    '  float height = smoothstep(-0.95, 0.05, uv.y) * smoothstep(1.15, -0.05, uv.y);',
    '  float sheet = pow(max(curtains * 0.78 + ribbons * 0.34, 0.0), 1.55) * height;',
    '  float edge = pow(sheet, 6.5);',
    '  vec3 deep = vec3(0.043, 0.048, 0.052);',
    '  vec3 teal = vec3(0.10, 0.34, 0.32);',
    '  vec3 leaf = vec3(0.30, 0.70, 0.46);',
    '  vec3 violet = vec3(0.22, 0.14, 0.34);',
    '  vec3 warm = vec3(0.72, 0.42, 0.28);',
    '  vec3 col = deep;',
    '  col = mix(col, teal, sheet * 0.92);',
    '  col = mix(col, leaf, pow(sheet, 2.1) * 0.62);',
    '  col += violet * pow(max(ribbons, 0.0), 3.0) * height * 0.28;',
    '  col += warm * edge * 0.22;',
    '  float stars = step(0.996, hash(gl_FragCoord.xy * 0.37));',
    '  col += stars * (1.0 - height * 0.65) * 0.35;',
    '  float vig = smoothstep(1.35, 0.15, length(uv * vec2(0.72, 1.0)));',
    '  col *= mix(0.55, 1.0, vig);',
    '  float grain = (hash(gl_FragCoord.xy + t) - 0.5) * 0.028;',
    '  col += grain;',
    '  outColor = vec4(col, 1.0);',
    '}',
  ].join('\n');

  function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const context = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
  });
  if (!context) {
    showFallback();
    return;
  }
  const gl: WebGL2RenderingContext = context;

  const vs = compile(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) {
    showFallback();
    return;
  }

  const prog = gl.createProgram();
  if (!prog) {
    showFallback();
    return;
  }
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    showFallback();
    return;
  }
  gl.useProgram(prog);
  const locRes = gl.getUniformLocation(prog, 'u_res');
  const locTime = gl.getUniformLocation(prog, 'u_time');
  const locMouse = gl.getUniformLocation(prog, 'u_mouse');
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  function resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.floor(window.innerWidth * dpr));
    const h = Math.max(1, Math.floor(window.innerHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  let first = true;
  function draw(now: number): void {
    resize();
    const t = reduce ? 4.8 : (now - start) / 1000;
    gl.uniform2f(locRes, canvas.width, canvas.height);
    gl.uniform1f(locTime, t);
    gl.uniform2f(locMouse, mouse[0], mouse[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (first) {
      const err = gl.getError();
      if (err !== gl.NO_ERROR) console.error('WebGL error', err);
      canvas.classList.add('is-ready');
      first = false;
    }
  }

  function tick(now: number): void {
    running = true;
    draw(now);
    if (reduce || document.hidden) {
      running = false;
      return;
    }
    requestAnimationFrame(tick);
  }

  function startLoop(): void {
    if (running || reduce || document.hidden) {
      draw(performance.now());
      return;
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => {
    draw(performance.now());
  });
  window.addEventListener(
    'pointermove',
    (e) => {
      mouse[0] = e.clientX / Math.max(window.innerWidth, 1);
      mouse[1] = 1.0 - e.clientY / Math.max(window.innerHeight, 1);
    },
    { passive: true },
  );

  reduceQuery.addEventListener('change', (e) => {
    reduce = e.matches;
    startLoop();
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) startLoop();
  });

  startLoop();
}
