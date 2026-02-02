'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  displaced: boolean;
}

interface Geometry {
  positionBuffer: WebGLBuffer;
  colorBuffer: WebGLBuffer;
  vertexCount: number;
}

interface ParticleBackgroundProps {
  logoPath?: string;
  backgroundColor?: string;
  onLoadComplete?: () => void;
}

export function ParticleBackground({
  logoPath = '/images/hcs-logo.png',
  backgroundColor = '#0a0a0a',
  onLoadComplete,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const geometryRef = useRef<Geometry | null>(null);
  const particleGridRef = useRef<Particle[]>([]);
  const posArrayRef = useRef<Float32Array | null>(null);
  const colorArrayRef = useRef<Float32Array | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const execCountRef = useRef(0);
  const isCleanedUpRef = useRef(false);
  const logoDimensionsRef = useRef({ width: 0, height: 0 });

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1000;
    }
    return false;
  });

  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window !== 'undefined') {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    return false;
  });

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1000);
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    isCleanedUpRef.current = false;

    const dpr = window.devicePixelRatio || 1;
    const effectiveDpr = isMobile ? Math.min(dpr, 1.5) : Math.min(dpr, 2);

    const getViewportSize = () => {
      if (isMobile && window.visualViewport) {
        return {
          width: window.visualViewport.width,
          height: window.visualViewport.height,
        };
      }
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    };

    const { width: canvasWidth, height: canvasHeight } = getViewportSize();

    canvas.width = canvasWidth * effectiveDpr;
    canvas.height = canvasHeight * effectiveDpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: !isMobile,
      powerPreference: isMobile ? 'default' : 'high-performance',
      premultipliedAlpha: true,
    });

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    glRef.current = gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const precision = isMobile ? 'mediump' : 'highp';
    const pointSize = isMobile ? 2.5 : 3.5;
    const NORMALIZED_SIZE = isMobile ? 400 : 700;

    const vertexShaderSource = `
      precision ${precision} float;
      uniform vec2 u_resolution;
      attribute vec2 a_position;
      attribute vec4 a_color;
      varying vec4 v_color;
      void main() {
        vec2 zeroToOne = a_position / u_resolution;
        vec2 clipSpace = (zeroToOne * 2.0 - 1.0);
        v_color = a_color;
        gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
        gl_PointSize = ${pointSize.toFixed(1)};
      }
    `;

    const fragmentShaderSource = `
      precision ${precision} float;
      varying vec4 v_color;
      void main() {
        if (v_color.a < 0.05) discard;

        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        float alpha = 1.0 - smoothstep(0.35, 0.5, dist);

        float finalAlpha = v_color.a * alpha * 0.95;
        gl_FragColor = vec4(v_color.rgb * finalAlpha, finalAlpha);
      }
    `;

    function createShader(
      gl: WebGLRenderingContext,
      type: number,
      source: string
    ): WebGLShader | null {
      if (!gl || isCleanedUpRef.current) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function createProgram(
      gl: WebGLRenderingContext,
      vs: WebGLShader,
      fs: WebGLShader
    ): WebGLProgram | null {
      if (!gl || !vs || !fs || isCleanedUpRef.current) return null;
      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      return program;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    programRef.current = program;

    const positionAttr = gl.getAttribLocation(program, 'a_position');
    const colorAttr = gl.getAttribLocation(program, 'a_color');
    const resolutionUniform = gl.getUniformLocation(program, 'u_resolution');

    const loadLogo = () => {
      const image = new Image();
      image.crossOrigin = 'anonymous';

      image.onload = () => {
        if (isCleanedUpRef.current) return;

        const aspectRatio = image.width / image.height;
        let renderWidth: number, renderHeight: number;

        if (aspectRatio > 1) {
          renderWidth = NORMALIZED_SIZE;
          renderHeight = Math.round(NORMALIZED_SIZE / aspectRatio);
        } else {
          renderHeight = NORMALIZED_SIZE;
          renderWidth = Math.round(NORMALIZED_SIZE * aspectRatio);
        }

        if (isMobile) {
          const MAX_WIDTH = 350;
          const MAX_HEIGHT = 500;
          if (renderWidth > MAX_WIDTH) {
            const scale = MAX_WIDTH / renderWidth;
            renderWidth = MAX_WIDTH;
            renderHeight = Math.round(renderHeight * scale);
          }
          if (renderHeight > MAX_HEIGHT) {
            const scale = MAX_HEIGHT / renderHeight;
            renderHeight = MAX_HEIGHT;
            renderWidth = Math.round(renderWidth * scale);
          }
        }

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        tempCanvas.width = renderWidth;
        tempCanvas.height = renderHeight;
        tempCtx.drawImage(image, 0, 0, renderWidth, renderHeight);
        const imageData = tempCtx.getImageData(0, 0, renderWidth, renderHeight);

        initParticleSystem(imageData.data, renderWidth, renderHeight);

        // Notify that loading is complete
        setTimeout(() => {
          onLoadComplete?.();
        }, 500);
      };

      image.onerror = () => {
        console.error('Failed to load logo:', logoPath);
        onLoadComplete?.();
      };

      image.src = logoPath;
    };

    function initParticleSystem(
      pixels: Uint8ClampedArray,
      width: number,
      height: number
    ) {
      if (isCleanedUpRef.current || !gl || !canvas) return;

      logoDimensionsRef.current = { width, height };

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      particleGridRef.current = [];
      const validPositions: number[] = [];
      const validColors: number[] = [];
      const validParticles: Particle[] = [];

      const step = 1;

      for (let i = 0; i < height; i += step) {
        for (let j = 0; j < width; j += step) {
          const pixelIndex = (i * width + j) * 4;
          const alpha = pixels[pixelIndex + 3];

          if (alpha > 10) {
            const x = centerX + (j - width / 2);
            const y = centerY + (i - height / 2);

            validPositions.push(x, y);

            const r = pixels[pixelIndex] / 255;
            const g = pixels[pixelIndex + 1] / 255;
            const b = pixels[pixelIndex + 2] / 255;
            const a = pixels[pixelIndex + 3] / 255;

            validColors.push(r, g, b, a);

            validParticles.push({
              ox: x,
              oy: y,
              vx: 0,
              vy: 0,
              displaced: false,
            });
          }
        }
      }

      particleGridRef.current = validParticles;
      posArrayRef.current = new Float32Array(validPositions);
      colorArrayRef.current = new Float32Array(validColors);

      const positionBuffer = gl.createBuffer();
      const colorBuffer = gl.createBuffer();

      if (!positionBuffer || !colorBuffer) return;

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, posArrayRef.current, gl.DYNAMIC_DRAW);

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, colorArrayRef.current, gl.STATIC_DRAW);

      geometryRef.current = {
        positionBuffer,
        colorBuffer,
        vertexCount: validParticles.length,
      };

      console.log(`Created ${validParticles.length} particles`);
      startAnimation();
    }

    function startAnimation() {
      let lastTime = 0;
      const targetFPS = isMobile ? 45 : 60;
      const interval = 1000 / targetFPS;

      function animate(currentTime: number) {
        if (
          isCleanedUpRef.current ||
          !gl ||
          !programRef.current ||
          !geometryRef.current ||
          !canvas
        ) {
          return;
        }

        if (isMobile && currentTime - lastTime < interval) {
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }
        lastTime = currentTime;

        if (execCountRef.current > 0) {
          execCountRef.current -= 1;

          const distortionRadius = isMobile ? 2000 : 3000;
          const rad = distortionRadius * distortionRadius;
          const forceStrength = isMobile ? 0.002 : 0.003;
          const maxDisplacement = isMobile ? 80 : 100;

          const mx = mouseRef.current.x;
          const my = mouseRef.current.y;

          for (let i = 0; i < particleGridRef.current.length; i++) {
            if (!posArrayRef.current) continue;

            const x = posArrayRef.current[i * 2];
            const y = posArrayRef.current[i * 2 + 1];
            const d = particleGridRef.current[i];

            const dx = mx - x;
            const dy = my - y;
            const dis = dx * dx + dy * dy;

            if (dis < rad && dis > 0) {
              const f = -rad / dis;
              const t = Math.atan2(dy, dx);

              const distFromOrigin = Math.sqrt(
                (x - d.ox) * (x - d.ox) + (y - d.oy) * (y - d.oy)
              );

              const forceMultiplier = Math.max(
                0.1,
                1 - distFromOrigin / (maxDisplacement * 2)
              );

              d.vx += f * Math.cos(t) * forceStrength * forceMultiplier;
              d.vy += f * Math.sin(t) * forceStrength * forceMultiplier;
            }

            const newX = x + (d.vx *= 0.82) + (d.ox - x) * 0.025;
            const newY = y + (d.vy *= 0.82) + (d.oy - y) * 0.025;

            const dx_origin = newX - d.ox;
            const dy_origin = newY - d.oy;
            const distFromOrigin = Math.sqrt(
              dx_origin * dx_origin + dy_origin * dy_origin
            );

            if (distFromOrigin > maxDisplacement) {
              const scale = maxDisplacement / distFromOrigin;
              const dampedScale = scale + (1 - scale) * Math.exp(-distFromOrigin * 0.02);

              posArrayRef.current[i * 2] = d.ox + dx_origin * dampedScale;
              posArrayRef.current[i * 2 + 1] = d.oy + dy_origin * dampedScale;

              d.vx *= 0.7;
              d.vy *= 0.7;
            } else {
              posArrayRef.current[i * 2] = newX;
              posArrayRef.current[i * 2 + 1] = newY;
            }
          }

          if (posArrayRef.current && geometryRef.current) {
            gl.bindBuffer(gl.ARRAY_BUFFER, geometryRef.current.positionBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, posArrayRef.current);
          }
        }

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(programRef.current);

        if (resolutionUniform) {
          gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, geometryRef.current.positionBuffer);
        gl.enableVertexAttribArray(positionAttr);
        gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, geometryRef.current.colorBuffer);
        gl.enableVertexAttribArray(colorAttr);
        gl.vertexAttribPointer(colorAttr, 4, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.POINTS, 0, geometryRef.current.vertexCount);

        animationFrameRef.current = requestAnimationFrame(animate);
      }

      animate(0);
    }

    const handleInteraction = (clientX: number, clientY: number) => {
      if (isCleanedUpRef.current || !canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) * effectiveDpr;
      const y = (clientY - rect.top) * effectiveDpr;

      mouseRef.current.x = x;
      mouseRef.current.y = y;
      execCountRef.current = 300;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isTouch) {
        handleInteraction(e.clientX, e.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isTouch && e.touches.length > 0) {
        const touch = e.touches[0];
        handleInteraction(touch.clientX, touch.clientY);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isTouch && e.touches.length > 0) {
        const touch = e.touches[0];
        handleInteraction(touch.clientX, touch.clientY);
      }
    };

    const handleResize = () => {
      if (isCleanedUpRef.current || !gl || !canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const currentDpr = isMobile ? Math.min(dpr, 1.5) : Math.min(dpr, 2);

      const { width, height } = getViewportSize();

      canvas.width = width * currentDpr;
      canvas.height = height * currentDpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      gl.viewport(0, 0, canvas.width, canvas.height);

      if (
        geometryRef.current &&
        particleGridRef.current.length > 0 &&
        posArrayRef.current
      ) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const { width: logoWidth, height: logoHeight } = logoDimensionsRef.current;

        for (let i = 0; i < particleGridRef.current.length; i++) {
          const particle = particleGridRef.current[i];
          const originalX = posArrayRef.current[i * 2];
          const originalY = posArrayRef.current[i * 2 + 1];

          const offsetX = originalX - particle.ox;
          const offsetY = originalY - particle.oy;

          particle.ox = centerX + (particle.ox - canvas.width / 2);
          particle.oy = centerY + (particle.oy - canvas.height / 2);

          posArrayRef.current[i * 2] = particle.ox + offsetX;
          posArrayRef.current[i * 2 + 1] = particle.oy + offsetY;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, geometryRef.current.positionBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, posArrayRef.current);
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    loadLogo();

    return () => {
      isCleanedUpRef.current = true;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }

      if (gl && !gl.isContextLost()) {
        try {
          if (geometryRef.current) {
            gl.deleteBuffer(geometryRef.current.positionBuffer);
            gl.deleteBuffer(geometryRef.current.colorBuffer);
          }
          if (programRef.current) {
            const shaders = gl.getAttachedShaders(programRef.current);
            shaders?.forEach((shader) => {
              gl.detachShader(programRef.current!, shader);
              gl.deleteShader(shader);
            });
            gl.deleteProgram(programRef.current);
          }
        } catch (e) {
          console.warn('WebGL cleanup error:', e);
        }
      }

      particleGridRef.current = [];
      posArrayRef.current = null;
      colorArrayRef.current = null;
    };
  }, [logoPath, isMobile, isTouch, backgroundColor, onLoadComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'auto',
        backgroundColor: 'transparent',
      }}
    />
  );
}
