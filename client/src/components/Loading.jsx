import gsap from "gsap";
import { useEffect } from "react";
export const Loading = () => {
    useEffect(() => {
    const animation = gsap.to(".loader-dot", {
      y: -6,
      duration: 0.35,
      stagger: 0.15,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
    });

    return () => {
      animation.kill();
    };
  }, []);
    return (
        <div class="loader flex items-center gap-2 justify-center p-4">
            <span class="loader-dot w-4 h-4 bg-primary rounded-full"></span>
            <span class="loader-dot w-4 h-4 bg-primary rounded-full"></span>
            <span class="loader-dot w-4 h-4 bg-primary rounded-full"></span>
        </div>
    )
}