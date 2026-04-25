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

    let animationFrameId: number;
    let stars: Star[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

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

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#07040f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;
        star.a += Math.sin(Date.now() * star.twinkleSpeed) * 0.05;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
        
        if (star.a < 0.2) star.a = 0.2;
        if (star.a > 1) star.a = 1;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        // Golden / purple tint for stars
        const isGold = Math.random() > 0.8;
        ctx.fillStyle = isGold 
          ? `rgba(201, 168, 76, ${star.a})` 
          : `rgba(216, 205, 184, ${star.a})`;
        ctx.fill();
      });

      // Add a subtle glowing orb in the background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height * 0.3, 0,
        canvas.width / 2, canvas.height * 0.3, canvas.width * 0.6
      );
      gradient.addColorStop(0, "rgba(45, 27, 94, 0.15)"); // purple
      gradient.addColorStop(0.5, "rgba(26, 15, 58, 0.05)");
      gradient.addColorStop(1, "rgba(7, 4, 15, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`${fixed ? "fixed" : "absolute"} inset-0 z-0 pointer-events-none`}
      style={{ opacity: 0.8 }}
    />
  );
}