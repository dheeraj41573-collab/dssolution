"use strict";

export function sporeCanvas(
  targetElementClassName,
  particleCount = 400,
  particleMinSize = 1,
  particleMaxSize = 3.5,
  particleMinSpeed = 0.1,
  particleMaxSpeed = 1.5,
  particleWobbleSpeed = 0.1,
  particleWobble = 0,
  canvasSize = 2000,
) {
  const particleColors = ["#FFFFFF"];
  // Reduce particle count on mobile devices
  if (window.innerWidth < 768) {
    particleCount = particleCount > 40 ? 20 : particleCount;
  }

  const canvasElements = document.querySelectorAll(targetElementClassName);

  canvasElements.forEach((canvas) => {
    const ctx = canvas.getContext("2d");
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const backingWidth = Math.max(1, Math.round(width * pixelRatio));
      const backingHeight = Math.max(1, Math.round(height * pixelRatio));
      if (canvas.width !== backingWidth) canvas.width = backingWidth;
      if (canvas.height !== backingHeight) canvas.height = backingHeight;
      ctx.setTransform(
        backingWidth / canvasSize,
        0,
        0,
        backingHeight / canvasSize,
        0,
        0,
      );
    };
    resizeCanvas();
    const particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * canvasSize;
        this.y = Math.random() * canvasSize;
        this.size =
          Math.random() * (particleMaxSize - particleMinSize) + particleMinSize;
        this.speedY =
          Math.random() * (particleMaxSpeed - particleMinSpeed) -
          particleMaxSpeed;
        this.wobble = Math.random() * particleWobble;
        this.wobbleSpeed = Math.random() * particleWobbleSpeed;
        // Assign a random color from particleColors
        this.color =
          particleColors[Math.floor(Math.random() * particleColors.length)];
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * this.wobbleSpeed) * this.wobble;

        if (this.y < -20) {
          this.y = canvasSize + Math.random() * 20;
          this.x = Math.random() * canvasSize;
          // Optionally, assign a new random color when respawned
          this.color =
            particleColors[Math.floor(Math.random() * particleColors.length)];
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let isVisible = false;
    let frameId = null;
    function animate() {
      if (!isVisible) return;
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      frameId = requestAnimationFrame(animate);
    }

    if ("ResizeObserver" in window) {
      new ResizeObserver(resizeCanvas).observe(canvas);
    } else {
      window.addEventListener("resize", resizeCanvas);
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && frameId === null) {
          frameId = requestAnimationFrame(animate);
        } else if (!isVisible && frameId !== null) {
          cancelAnimationFrame(frameId);
          frameId = null;
        }
      }).observe(canvas);
    } else {
      isVisible = true;
      frameId = requestAnimationFrame(animate);
    }
  });
}
