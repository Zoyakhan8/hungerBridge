
import { NavLink } from "react-router-dom";
import { Feature } from "../components/Feature";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { timeLine } from "../utils/timeLine";
import { ParticleBackground } from "../components/ParticleBackground";

gsap.registerPlugin(ScrollTrigger);

export const Home = () => {
    const lineRef = useRef(null);
    const timelineRef = useRef(null);
    const cardRef = useRef(null);
    const iotRef = useRef(null);
    const researchRef = useRef(null);

    // Workflow timeline animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            const circles = gsap.utils.toArray(".circle", timelineRef.current);
            const leftCards = gsap.utils.toArray(".left", timelineRef.current);
            const rightCards = gsap.utils.toArray(".right", timelineRef.current);
            const connectors = gsap.utils.toArray(
                ".connectors",
                timelineRef.current
            );

            circles.forEach((circle) => {
                gsap.to(circle, {
                    backgroundColor: "#FE7F42",
                    scale: 1.3,
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: circle,
                        start: "top center",
                        toggleActions: "play none none reverse",
                    },
                });
            });

            leftCards.forEach((card) => {
                gsap.fromTo(
                    card,
                    { opacity: 0, x: 100, scale: 0.9 },
                    {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        duration: 0.5,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            });

            rightCards.forEach((card) => {
                gsap.fromTo(
                    card,
                    { opacity: 0, x: -100, scale: 0.9 },
                    {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        duration: 0.5,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            });

            connectors.forEach((connector) => {
                gsap.fromTo(
                    connector,
                    { scaleX: 0 },
                    {
                        scaleX: 1,
                        backgroundColor: "#FE7F42",
                        duration: 0.5,
                        scrollTrigger: {
                            trigger: connector,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            });
        }, timelineRef);

        return () => ctx.revert();
    }, []);

    // Vertical workflow progress line
    useEffect(() => {
        if (!lineRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                lineRef.current,
                { scaleY: 0 },
                {
                    scaleY: 1,
                    scrollTrigger: {
                        trigger: lineRef.current,
                        start: "top 80%",
                        end: "bottom center",
                        toggleActions: "play none none reverse",
                        scrub: true,
                    },
                }
            );
        });

        return () => ctx.revert();
    }, []);

    // Reusable staggered feature-card animation
    function animateCards(container) {
        if (!container) return;

        const cards = gsap.utils.toArray(".featureCard", container);

        gsap.fromTo(
            cards,
            { y: 80, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: container,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            }
        );
    }

    useEffect(() => {
        const ctx = gsap.context(() => {
            animateCards(cardRef.current);
            animateCards(iotRef.current);
            animateCards(researchRef.current);
        });

        return () => ctx.revert();
    }, []);

    return (
        <section className="min-h-screen overflow-x-clip bg-brown">
            {/* HERO SECTION */}
            <div className="relative isolate">
                <div className="relative z-10 mx-auto flex max-w-[1600px] flex-col justify-between gap-10 px-4 py-10 sm:px-6 sm:py-14 md:px-8 lg:flex-row lg:items-center lg:gap-12 lg:px-12 lg:py-20 xl:px-16">
                    {/* Hero content */}
                    <div className="flex w-full flex-col justify-center gap-5 p-1 sm:p-3 lg:w-[52%]">
                        <div className="flex w-fit max-w-full flex-wrap items-center gap-1 rounded-[20px] border border-white/20 bg-background px-3 py-2 shadow-xl shadow-black/10 sm:px-4">
                            <h4 className="font-body text-sm font-bold sm:text-base">
                                <span className="text-primary">Safe Food.</span>{" "}
                                <span className="text-inactive">
                                    Trusted Delivery.
                                </span>{" "}
                                <span className="text-secondary">
                                    Zero Waste.
                                </span>
                            </h4>
                        </div>

                        <div className="flex flex-col gap-1 font-heading text-4xl font-extrabold text-inactive sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                            <h1>Donate.Protect.</h1>
                            <span className="text-secondary">Nourish.</span>
                        </div>

                        <h3 className="max-w-2xl font-body text-sm font-medium leading-relaxed text-inactive sm:text-base lg:text-lg">
                            HungerBridge connects food donors with verified
                            NGOs while ensuring food safety during
                            transportation through our innovative IoT-enabled
                            ZeroWaste Box.
                        </h3>

                        {/* Hero buttons */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                            <NavLink
                                to="/register"
                                className="inline-block rounded-[10px] border border-white/20 bg-primary px-5 py-3 text-base font-bold text-brown shadow-lg shadow-primary/30 backdrop-blur-3xl transition-all duration-300 hover:scale-105 hover:shadow-xl sm:px-8 sm:text-lg lg:px-10 lg:text-xl"
                            >
                                Start Now
                            </NavLink>

                            <NavLink
                                to="/about"
                                className="inline-block rounded-[10px] border border-white/20 bg-background px-5 py-3 text-base font-bold text-heading shadow-xl shadow-black/10 backdrop-blur-3xl transition-all duration-300 hover:scale-105 sm:px-8 sm:text-lg lg:px-10 lg:text-xl"
                            >
                                Explore
                            </NavLink>
                        </div>

                        {/* Hero trust indicators */}
                        <div className="flex w-full flex-wrap items-center gap-x-5 gap-y-3 py-2 font-body font-medium text-inactive sm:gap-x-6 lg:gap-x-5 xl:gap-x-8">
                            <div className="flex items-center gap-2 text-sm sm:text-base">
                                <img
                                    src="/src/assets/Verified.png"
                                    alt=""
                                    className="h-6 w-6 shrink-0 object-contain"
                                />
                                <h4>Verified NGOs</h4>
                            </div>

                            <div className="flex items-center gap-2 text-sm sm:text-base">
                                <img
                                    src="/src/assets/safety.png"
                                    alt=""
                                    className="h-6 w-6 shrink-0 object-contain"
                                />
                                <h4>Food Safety</h4>
                            </div>

                            <div className="flex items-center gap-2 text-sm sm:text-base">
                                <img
                                    src="/src/assets/landing3.png"
                                    alt=""
                                    className="h-6 w-6 shrink-0 object-contain"
                                />
                                <h4>IoT Monitoring</h4>
                            </div>

                            <div className="flex items-center gap-2 text-sm sm:text-base">
                                <img
                                    src="/src/assets/Container.png"
                                    alt=""
                                    className="h-6 w-6 shrink-0 object-contain"
                                />
                                <h4>Transparent</h4>
                            </div>
                        </div>
                    </div>

                    {/* Hero visual placeholder */}
                    <div className="flex min-h-56 w-full items-center justify-center rounded-2xl border border-white/10 bg-background/5 text-inactive/60 sm:min-h-72 lg:min-h-96 lg:w-[44%]">
                        {/* Replace with your existing hero image when ready */}
                        Image
                    </div>
                </div>

                {/* Decorative glow */}
                <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
                    <div className="absolute right-0 top-20 h-40 w-40 rounded-full bg-primary/30 blur-[90px] sm:h-52 sm:w-52" />
                    <div className="absolute right-0 top-40 h-40 w-40 rounded-full bg-primary/45 blur-[90px] sm:h-52 sm:w-52" />
                </div>
            </div>

            {/* WHY HUNGERBRIDGE */}
            <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 md:px-8 lg:px-12 lg:py-16 xl:px-16">
                <div className="flex flex-col items-center gap-4 text-center text-inactive">
                    <h4 className="font-heading text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                        Why HungerBridge?
                    </h4>

                    <div className="mt-1 h-1 w-24 rounded-full bg-cta" />

                    <h4 className="max-w-3xl text-sm text-inactive/80 sm:text-base">
                        Bridging the gap between surplus food and those in need
                        with precision and care.
                    </h4>
                </div>

                <div
                    ref={cardRef}
                    className="grid grid-cols-1 items-stretch gap-5 px-1 py-6 sm:grid-cols-2 sm:gap-6 sm:px-2 lg:grid-cols-4 lg:p-6"
                >
                    <div className="featureCard min-w-0">
                        <Feature
                            image="/src/assets/waste.png"
                            title="Food Waste"
                            text="Millions of tons of edible food are wasted daily due to lack of connection."
                        />
                    </div>

                    <div className="featureCard min-w-0">
                        <Feature
                            image="/src/assets/hunger.png"
                            title="Hunger"
                            text="Vulnerable communities suffer from malnutrition while resources vanish nearby."
                        />
                    </div>

                    <div className="featureCard min-w-0">
                        <Feature
                            image="/src/assets/danger.png"
                            title="Unsafe Transportation"
                            text="Traditional logistics fail to maintain food temperature and hygiene during transit."
                        />
                    </div>

                    <div className="featureCard min-w-0">
                        <Feature
                            image="/src/assets/trust.png"
                            title="Lack Of Trust"
                            text="Donors often worry if their food actually reaches the intended recipients safely."
                        />
                    </div>
                </div>
            </div>

            {/* WORKFLOW TIMELINE */}
            <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 md:px-8 lg:px-12 lg:py-16 xl:px-16">
                <div className="flex flex-col items-center justify-center gap-4 text-center text-inactive">
                    <h4 className="font-heading text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                        The Workflow
                    </h4>

                    <h4 className="text-sm text-inactive/80 sm:text-base">
                        A seamless, tech-enabled journey from surplus to
                        sustenance.
                    </h4>
                </div>

                <div className="flex justify-center px-0 py-8 sm:px-3 lg:px-8">
                    <div
                        ref={timelineRef}
                        className="relative w-full max-w-5xl"
                    >
                        {/* Progress line: left on mobile, centered on desktop */}
                        <div className="absolute bottom-0 left-[15px] top-0 w-1 -translate-x-1/2 bg-gray-300/60 md:left-1/2" />

                        <div
                            ref={lineRef}
                            className="absolute bottom-0 left-[15px] top-0 w-1 origin-top -translate-x-1/2 bg-primary/60 md:left-1/2"
                        />

                        <div className="relative flex flex-col gap-8 sm:gap-10 md:gap-12">
                            {timeLine.map((item, index) => {
                                const isEven = index % 2 === 0;

                                return (
                                    <div
                                        key={index}
                                        className="relative grid grid-cols-[32px_minmax(0,1fr)] items-center gap-3 md:grid-cols-[minmax(0,1fr)_80px_minmax(0,1fr)] md:gap-0"
                                    >
                                        {/* Timeline circle */}
                                        <div className="relative z-10 col-start-1 row-start-1 flex justify-center md:col-start-2">
                                            <div className="circle h-6 w-6 rounded-full border-4 border-brown bg-gray-400 sm:h-7 sm:w-7" />
                                        </div>

                                        {/* Connector line: desktop only */}
                                        <div
                                            className={`connectors absolute top-1/2 hidden h-[2px] w-10 -translate-y-1/2 bg-gray-300/60 md:block ${
                                                isEven
                                                    ? "right-1/2"
                                                    : "left-1/2"
                                            }`}
                                        />

                                        {/* Timeline card */}
                                        <div
                                            className={`${
                                                isEven ? "left" : "right"
                                            } min-w-0 col-start-2 row-start-1 ${
                                                isEven
                                                    ? "md:col-start-1 md:row-start-1 md:pr-3"
                                                    : "md:col-start-3 md:row-start-1 md:pl-3"
                                            }`}
                                        >
                                            <Feature
                                                image={item.image}
                                                title={item.title}
                                                text={item.text}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* IOT-POWERED SAFETY */}
            <div
                ref={researchRef}
                className="mx-auto grid max-w-[1600px] grid-cols-1 items-stretch gap-5 px-4 py-10 sm:grid-cols-2 sm:px-6 md:px-8 lg:grid-cols-3 lg:px-12 lg:py-16 xl:px-16"
            >
                <div className="flex min-w-0 flex-col gap-4 text-inactive">
                    <h4 className="font-heading text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                        IoT-Powered
                    </h4>

                    <span className="font-heading text-3xl font-extrabold text-secondary/70 sm:text-4xl lg:text-5xl">
                        Safety
                    </span>

                    <h4 className="text-sm text-inactive/80 sm:text-base">
                        The heart of HungerBridge is our proprietary ZeroWaste
                        Box. Engineered for resilience and transparency.
                    </h4>
                </div>

                <div className="featureCard min-w-0">
                    <Feature
                        image="/src/assets/temperature.png"
                        title="Temperature Monitoring"
                        text="Prevents spoilage by alerting NGOs if internal temperature exceeds safety thresholds."
                    />
                </div>

                <div className="featureCard min-w-0">
                    <Feature
                        image="/src/assets/humidity.png"
                        title="Humidity Control"
                        text="Monitors moisture levels to keep dry foods fresh and perishable items stable."
                    />
                </div>

                <div className="featureCard min-w-0">
                    <Feature
                        image="/src/assets/written.png"
                        title="Real-time Telemetry"
                        text="Our custom dashboard streams data every 30 seconds directly from the box."
                    />
                </div>

                <div className="featureCard min-w-0">
                    <Feature
                        image="/src/assets/open.png"
                        title="Tamper Detection"
                        text="Magnetic sensors detect unauthorized opening during the delivery route."
                    />
                </div>

                <div className="featureCard min-w-0">
                    <Feature
                        image="/src/assets/admin.png"
                        title="Admin Control"
                        text="Unified command center to monitor all boxes in the field simultaneously."
                    />
                </div>
            </div>

            {/* RESEARCH-DRIVEN IMPACT */}
            <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 md:px-8 lg:px-12 lg:py-16 xl:px-16">
                <div className="flex flex-col items-center gap-4 p-2 text-center text-inactive sm:p-4">
                    <h4 className="font-heading text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                        Research Driven Impact
                    </h4>

                    <h4 className="max-w-3xl text-sm text-inactive/80 sm:text-base">
                        The heart of HungerBridge is our proprietary ZeroWaste
                        Box. Engineered for resilience and transparency.
                    </h4>
                </div>

                <div
                    ref={iotRef}
                    className="grid grid-cols-1 items-stretch gap-5 p-2 sm:grid-cols-2 sm:gap-6 sm:p-4 lg:grid-cols-4"
                >
                    <div className="featureCard min-w-0">
                        <Feature
                            image="/src/assets/safe.png"
                            title="Safer Distribution"
                            text="Designed in alignment with FSSAI food transportation and hygiene guidelines. Provides digital records of donation time, transport conditions, and delivery status."
                        />
                    </div>

                    <div className="featureCard min-w-0">
                        <Feature
                            image="/src/assets/open.png"
                            title="Sustainability"
                            text="Promotes sustainable reuse of food-grade containers, reducing single-use packaging waste."
                        />
                    </div>

                    <div className="featureCard min-w-0">
                        <Feature
                            image="/src/assets/admin.png"
                            title="Social Impact"
                            text="Reduces edible food waste. Helps connect donors with verified NGOs. Supports food access for people in need."
                        />
                    </div>

                    <div className="featureCard min-w-0">
                        <Feature
                            image="/src/assets/written.png"
                            title="Academic Innovation"
                            text="Integrates IoT sensors with a web platform. Enables QR/NFC-based traceability. Provides live monitoring and transport records."
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
