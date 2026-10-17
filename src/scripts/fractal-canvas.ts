import { clamp, computeScrollProgress, ETHER_PALETTE, lerp } from '../lib/fractal';

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

varying vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_scroll;
uniform vec3 u_paper;
uniform vec3 u_wash;
uniform vec3 u_accent;
uniform vec3 u_deep;

mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i + vec2(0.0, 0.0)), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = rot(0.58);
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = m * p * 2.02 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  vec2 p = (v_uv - 0.5) * aspect * 1.95;
  vec2 ptr = (u_pointer - 0.5) * aspect * 1.95;

  p.y -= (u_scroll - 0.5) * 0.36;

  vec2 q = vec2(
    fbm(p * 1.3 + vec2(0.0, u_time * 0.12)),
    fbm(p * 1.3 + vec2(5.2, 1.3 - u_time * 0.1))
  );

  vec2 r = vec2(
    fbm(p * 1.18 + 3.1 * q + vec2(1.7, 9.2) + 0.15 * u_time + ptr * 0.5),
    fbm(p * 1.18 + 3.1 * q + vec2(8.3, 2.8) + 0.12 * u_time - ptr * 0.42)
  );

  float f = fbm(p * 1.12 + 2.75 * r);
  float ridges = smoothstep(0.18, 0.88, sin((f + length(q) * 0.58) * 9.5));
  float cursorHalo = exp(-2.6 * length(p - ptr));

  vec3 col = mix(u_paper, u_wash, clamp(f * f * 1.9, 0.0, 1.0));
  col = mix(col, u_accent, clamp(length(q) * 0.44 * ridges, 0.0, 0.58));
  col = mix(col, u_deep, clamp(r.y * r.x * 0.38 + cursorHalo * 0.24, 0.0, 0.46));

  float vignette = smoothstep(1.9, 0.25, length(p * 0.72));
  col = mix(u_paper, col, 0.56 + 0.34 * vignette);

  gl_FragColor = vec4(col, 1.0);
}
`;

type FractalState = {
  pointerX: number;
  pointerY: number;
  targetPointerX: number;
  targetPointerY: number;
  scrollProgress: number;
  targetScroll: number;
};

type DynamicUniforms = {
  uRes: WebGLUniformLocation | null;
  uTime: WebGLUniformLocation | null;
  uPtr: WebGLUniformLocation | null;
  uScroll: WebGLUniformLocation | null;
};

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function linkProgram(
  gl: WebGLRenderingContext,
  vs: WebGLShader,
  fs: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) {
    return null;
  }
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

function initShaderProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vs || !fs) {
    return null;
  }
  const program = linkProgram(gl, vs, fs);
  if (program) {
    gl.useProgram(program);
  }
  return program;
}

function bindQuadAndPalette(gl: WebGLRenderingContext, program: WebGLProgram): DynamicUniforms {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const posLoc = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform3fv(gl.getUniformLocation(program, 'u_paper'), ETHER_PALETTE.paper);
  gl.uniform3fv(gl.getUniformLocation(program, 'u_wash'), ETHER_PALETTE.wash);
  gl.uniform3fv(gl.getUniformLocation(program, 'u_accent'), ETHER_PALETTE.accent);
  gl.uniform3fv(gl.getUniformLocation(program, 'u_deep'), ETHER_PALETTE.deep);

  return {
    uRes: gl.getUniformLocation(program, 'u_resolution'),
    uTime: gl.getUniformLocation(program, 'u_time'),
    uPtr: gl.getUniformLocation(program, 'u_pointer'),
    uScroll: gl.getUniformLocation(program, 'u_scroll'),
  };
}

function resizeWebGLCanvas(canvas: HTMLCanvasElement, gl: WebGLRenderingContext): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const width = Math.max(1, Math.floor(window.innerWidth * dpr));
  const height = Math.max(1, Math.floor(window.innerHeight * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
}

function stepState(state: FractalState): void {
  state.pointerX = lerp(state.pointerX, state.targetPointerX, 0.06);
  state.pointerY = lerp(state.pointerY, state.targetPointerY, 0.06);
  state.scrollProgress = lerp(state.scrollProgress, state.targetScroll, 0.08);
}

function bindInputTracking(state: FractalState): void {
  const updateScroll = () => {
    state.targetScroll = computeScrollProgress(
      window.scrollY,
      document.documentElement.scrollHeight,
      window.innerHeight,
    );
    document.documentElement.style.setProperty('--scroll-progress', state.targetScroll.toFixed(4));
  };

  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  window.addEventListener(
    'pointermove',
    (event) => {
      state.targetPointerX = clamp(event.clientX / Math.max(1, window.innerWidth), 0, 1);
      state.targetPointerY = clamp(1 - event.clientY / Math.max(1, window.innerHeight), 0, 1);
    },
    { passive: true },
  );
}

function drawFallbackWave(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  state: FractalState,
): void {
  ctx.clearRect(0, 0, w, h);
  const grad = ctx.createRadialGradient(
    w * state.pointerX,
    h * (1 - state.pointerY),
    20,
    w * 0.5,
    h * 0.5,
    Math.max(w, h) * 0.75,
  );
  grad.addColorStop(0, 'rgba(213, 226, 245, 0.65)');
  grad.addColorStop(0.55, 'rgba(236, 242, 250, 0.4)');
  grad.addColorStop(1, 'rgba(250, 251, 253, 0.95)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(90, 127, 184, 0.14)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 28) {
    const y = h * 0.5 + Math.sin(x * 0.006 + t) * 36 - state.scrollProgress * 40;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function mountCanvas2DFallback(
  canvas: HTMLCanvasElement,
  state: FractalState,
  reducedMotion: MediaQueryList,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  const resize = () => {
    canvas.width = Math.max(1, window.innerWidth);
    canvas.height = Math.max(1, window.innerHeight);
  };
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const start = performance.now();
  const loop = (now: number) => {
    stepState(state);
    const t = reducedMotion.matches ? 1.5 : (now - start) * 0.0008;
    drawFallbackWave(ctx, canvas.width, canvas.height, t, state);
    if (!reducedMotion.matches && !document.hidden) {
      requestAnimationFrame(loop);
    }
  };
  requestAnimationFrame(loop);
}

export function mountFractalCanvas(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-fractal-canvas]');
  if (!canvas) {
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const state: FractalState = {
    pointerX: 0.65,
    pointerY: 0.45,
    targetPointerX: 0.65,
    targetPointerY: 0.45,
    scrollProgress: 0,
    targetScroll: 0,
  };

  bindInputTracking(state);

  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    powerPreference: 'low-power',
  });
  if (!gl) {
    mountCanvas2DFallback(canvas, state, reducedMotion);
    return;
  }

  const program = initShaderProgram(gl);
  if (!program) {
    return;
  }

  const uniforms = bindQuadAndPalette(gl, program);
  const onResize = () => resizeWebGLCanvas(canvas, gl);
  window.addEventListener('resize', onResize, { passive: true });
  onResize();

  const start = performance.now();
  const render = (now: number) => {
    if (document.hidden) {
      return;
    }
    stepState(state);
    const elapsed = reducedMotion.matches ? 2.4 : (now - start) * 0.001;
    gl.uniform2f(uniforms.uRes, canvas.width, canvas.height);
    gl.uniform1f(uniforms.uTime, elapsed);
    gl.uniform2f(uniforms.uPtr, state.pointerX, state.pointerY);
    gl.uniform1f(uniforms.uScroll, state.scrollProgress);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (!reducedMotion.matches) {
      requestAnimationFrame(render);
    }
  };

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      requestAnimationFrame(render);
    }
  });
  reducedMotion.addEventListener('change', () => requestAnimationFrame(render));
  requestAnimationFrame(render);
}
