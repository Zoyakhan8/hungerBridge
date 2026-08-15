import { useEffect, useRef } from "react";
export const ParticleBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener("resize", resize);
        const colors = [
            "#FE7F42",
            "#8F1003",
            "#FFFB97",
        ];

        const particles = [];

        for (let i = 0; i < 20; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,

                radius: Math.random() * 2 + 1,

                color: colors[Math.floor(Math.random() * colors.length)],

                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,

                opacity: Math.random() * 0.5 + 0.2,
            });
        }
        function drawParticle(particle) {

            const glowRadius = particle.radius * 8;

            const gradient = ctx.createRadialGradient(
                particle.x,
                particle.y,
                0,
                particle.x,
                particle.y,
                glowRadius
            );

            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(0.3, particle.color);
            gradient.addColorStop(1, "transparent");

            ctx.save();

            // Glow
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 25;

            // Outer glow
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(
                particle.x,
                particle.y,
                glowRadius,
                0,
                Math.PI * 2
            );
            ctx.fill();

            // Bright center
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );
            ctx.fill();

            ctx.restore();
        }
        function animate() {

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {

                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;

                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                drawParticle(particle);
            });

            requestAnimationFrame(animate);
        }

        animate();
        return () => {
            window.removeEventListener("resize", resize);
        };
    }, []);
    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none blur-md"
        />
    );
};