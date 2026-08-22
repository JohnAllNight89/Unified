import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
  vx: number;
  vy: number;
  twinkleSpeed: number;
}

export function Starfield({ fixed = false }: { fixed?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrameId: number;
    let stars: Star[] = [];

    const initStars = () => {
      stars = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 1500);
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.5,
          a: Math.random(),
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
        });
      }
    };

    const drawFrame = (animate: boolean) => {
      ctx.fillStyle = "#07040f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        if (animate) {
          star.x += star.vx;
          star.y += star.vy;
          star.a += Math.sin(Date.now() * star.twinkleSpeed) * 0.05;
          if (star.x < 0) star.x = canvas.width;
          if (star.x > canvas.width) star.x = 0;
          if (star.y < 0) star.y = canvas.height;
          if (star.y > canvas.height) star.y = 0;
          if (star.a < 0.2) star.a = 0.2;
          if (star.a > 1) star.a = 1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        const isGold = Math.random() > 0.8;
        ctx.fillStyle = isGold
          ? `rgba(201, 168, 76, ${star.a})`
          : `rgba(216, 205, 184, ${star.a})`;
        ctx.fill();
      });

      if (animate) {
        animationFrameId = requestAnimationFrame(() => drawFrame(true));
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
      if (prefersReducedMotion) drawFrame(false);
    };

    window.addEventListener("resize", handleResize);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
    drawFrame(!prefersReducedMotion);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`${fixed ? "fixed" : "absolute"} inset-0 z-0 pointer-events-none`}
      style={{ opacity: 0.8 }}
    />
  );
}
