import { NavLink } from "react-router-dom"
import { Feature } from "../components/Feature"
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
    useEffect(() => {
        const circles = gsap.utils.toArray(".circle", timelineRef.current);
        const left = gsap.utils.toArray(".left", timelineRef.current);
        const right = gsap.utils.toArray(".right", timelineRef.current);
        const connectors = gsap.utils.toArray(".connectors", timelineRef.current);
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
        left.forEach((card) => {
            gsap.fromTo(
                card,
                { opacity: 0, x: 100, scale: 0.9, },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        })
        right.forEach((card) => {
            gsap.fromTo(
                card,
                { opacity: 0, x: -100, scale: 0.9, },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        })
        connectors.forEach((connector) => {
            gsap.fromTo(connector,
                { scaleX: 0, },
                {
                    scaleX: 1.2,
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: connector,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                })
        })
    }, []);
    useEffect(() => {
        gsap.fromTo(
            lineRef.current,
            { scaleY: 0, },
            {
                scaleY: 1,
                scrollTrigger: {
                    trigger: lineRef.current,
                    start: "top 80%",
                    end: "bottom center",
                    toggleActions: "play none none reverse",
                    scrub: true,
                }
            }
        );
    }, []);
    function animateCards(container) {
        const cards = gsap.utils.toArray(".featureCard", container);
        gsap.fromTo(
            cards,
            { y: 80, opacity: 0, },
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.5,
                scrollTrigger: {
                    trigger: container,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }
    useEffect(() => {
        animateCards(cardRef.current);
        animateCards(iotRef.current);
        animateCards(researchRef.current);
    }, [])
    return (
        <section className="bg-brown ">
            <div className="relative z-10 overflow-hidden ">
               <ParticleBackground/>
                <div className="flex flex-row justify-between p-24">
                    <div className="flex flex-col justify-center gap-5 w-[30%] p-4">
                        <div className="flex flex-row items-center bg-background/30 backdrop-blur-3xl px-4 py-1 rounded-[20px] w-max border border-white/20">
                            <h4 className=" text-cta font-body font-bold ">
                                Safe Food.
                                <span className="text-inactive">Trusted Delivery.</span>
                                <span className="text-secondary">Zero Waste.</span>
                            </h4>
                        </div>
                        <div className="font-heading font-extrabold text-6xl text-inactive flex flex-col gap-2">
                            <h1>
                                Donate.Protect.
                            </h1>
                            <span className="text-primary">Nourish.</span>
                        </div>
                        <h3 className="font-body font-medium text-inactive">HungerBridge connects food donors with
                            verified NGOs while ensuring food safety
                            during transportation through our innovative IoT-enabled ZeroWaste Box.
                        </h3>
                        <div className="flex flex-row items-center gap-6">
                            <NavLink to="/register" className={({ isActive }) =>
                                `inline-block backdrop-blur-3xl px-10 py-3 shadow-[0_4px_20px] shadow-primary/50
                            bg-gradient-to-r from-primary/90 from-30 via-primary/80 to-inactive/75 to-70
                            border border-white/20 text-brown rounded-[10px] text-xl font-bold
                            ${isActive ? "" : "hover:shadow-[0_4px_30px] shadow-primary/50 hover:scale-105 transition-all duration-300"}`
                            }>Start Now</NavLink>
                            <NavLink to="/about" className={({ isActive }) =>
                                `inline-block bg-background/30 backdrop-blur-3xl px-10 py-3
                            border border-white/20 text-inactive rounded-[10px] text-xl font-bold
                            ${isActive ? "" : "hover:scale-105 transition-all duration-300"}`
                            }>Explore</NavLink>
                        </div>
                        <div className="font-body font-medium text-inactive/70 flex flex-row items-center gap-8 w-max py-2 ">
                            <div className="flex flex-row gap-4 ">
                                <img src="/src/assets/Verified.png" alt="" />
                                <h4>Verified NGOs</h4>
                            </div>
                            <div className="flex flex-row gap-4 ">
                                <img src="./src/assets/safety.png" alt="" />
                                <h4>Food Safety</h4>
                            </div>
                            <div className="flex flex-row gap-4 ">
                                <img src="./src/assets/landing3.png" alt="" />
                                <h4>IOT Monitoring</h4>
                            </div>
                            <div className="flex flex-row gap-4 ">
                                <img src="./src/assets/Container.png" alt="" />
                                <h4>Transparent</h4>
                            </div>
                        </div>
                    </div>
                    <div>Image</div>
                </div>
            </div>
            <div className="absolute z-0 ">
                <div
                    className=" absolute bottom-0 -right-260 w-[200px] h-[200px] 
                    rounded-full bg-primary/15 blur-[90px]"
                />
                <div
                    className=" absolute bottom-0 -right-150 w-[200px] h-[200px] rounded-full bg-primary/15 blur-[90px]"
                />
            </div>
            <div className="py-14 p-24">
                <div className="flex flex-col items-center gap-4 text-inactive">
                    <h4 className="font-heading font-extrabold text-5xl">Why HungerBridge ?</h4>
                    <div className="w-24 h-1 bg-cta rounded-full mt-1"></div>
                    <h4 className="text-inactive/80">Bridging the gap between surplus food and those in need with precision and care.</h4>
                </div>
                <div
                    ref={cardRef}
                    className=" grid grid-cols-4 gap-6 p-6">
                    <div className="featureCard">
                        <Feature
                            image="./src/assets/waste.png"
                            title="Food Waste"
                            text="Millions of tons of edible food are wasted daily due to lack of connection."
                        />
                    </div>
                    <div className="featureCard">
                        <Feature
                            image="./src/assets/hunger.png"
                            title="Hunger"
                            text="Vulnerable communities suffer from malnutrition while resources vanish nearby."
                        />
                    </div>
                    <div className="featureCard">
                        <Feature
                            image="./src/assets/danger.png"
                            title="Unsafe Transportation"
                            text="Traditional logistics fail to maintain food temperature and hygiene during transit."
                        />
                    </div>
                    <div className="featureCard">
                        <Feature
                            image="./src/assets/trust.png"
                            title="Lack Of Trust"
                            text="Donors often worry if their food actually reaches the intended recipients safely."
                        />
                    </div>
                </div>
            </div>
            <div className="p-24">
                <div className="flex flex-col items-center justify-center gap-4 text-inactive ">
                    <h4 className="font-heading font-extrabold text-5xl">The Workflow</h4>
                    <h4 className="text-inactive/80">A seamless, tech-enabled journey from surplus to sustenance.</h4>
                </div>
                <div className="flex justify-center p-8">
                    <div className="relative">
                        <div className="absolute left-163 top-0 h-full w-1 bg-gray-300/60 "></div>
                        <div
                            ref={lineRef}
                            className="absolute left-163 top-0 h-full w-1 bg-primary/60 origin-top"></div>
                        <div className="flex items-center">
                            <div
                                ref={timelineRef}
                                className="relative z-50  pl-10">
                                {timeLine.map((item, index) => {
                                    return (
                                        <div key={index} className="relative grid grid-cols-3 items-center">
                                            <div className="left flex justify-end">
                                                {index % 2 === 0 ? (<Feature image={item.image} title={item.title} text={item.text} />) : (<div></div>)}
                                            </div>
                                            <div className="flex items-center justify-center ">
                                                {index % 2 === 0 ? (
                                                    <div className="connectors h-[2px] w-50 bg-gray-300/60 absolute left-1/3 top-1/2 -translate-y-1/2"></div>
                                                ) : (<div></div>)}

                                                <div className="flex justify-center z-10">
                                                    <div className="circle w-7 h-7 rounded-full bg-gray-400"></div>
                                                </div>
                                                {index % 2 !== 0 && (
                                                    <div className=" connectors left-155 h-[2px] w-50 bg-gray-300/60 absolute right-1/3 top-1/2 -translate-y-1/2"></div>
                                                )}
                                            </div>
                                            <div className="right flex justify-start">
                                                {index % 2 !== 0 ? (
                                                    <Feature image={item.image} title={item.title} text={item.text} />
                                                ) : (
                                                    <div></div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                ref={researchRef}
                className="grid grid-cols-3 grid-rows-2 gap-5 py-10 p-24">
                <div className="flex flex-col gap-4 text-inactive">
                    <h4 className="font-heading font-extrabold text-5xl">IoT-Powered</h4>
                    <span className="font-heading font-extrabold text-5xl text-secondary/70">Safety</span>
                    <h4 className="text-inactive/80">The heart of HungerBridge is our proprietary ZeroWaste Box. Engineered for resilience and transparency.</h4>
                </div>
                <div className="featureCard">
                    <Feature
                        image="./src/assets/temperature.png"
                        title="Temperature Monitoring"
                        text="Prevents spoilage by alerting NGOs if internal temperature exceeds safety thresholds."
                    />
                </div>
                <div className="featureCard">
                    <Feature
                        image="./src/assets/humidity.png"
                        title="Humidity Control"
                        text="Monitors moisture levels to keep dry foods fresh and perishable items stable."
                    />
                </div>
                <div className="featureCard">
                    <Feature
                        image="./src/assets/written.png"
                        title="Real-time Telemetry"
                        text="Our custom dashboard streams data every 30 seconds directly from the box."
                    />
                </div>
                <div className="featureCard">
                    <Feature
                        image="./src/assets/open.png"
                        title="Tamper Detection"
                        text="Magnetic sensors detect unauthorized opening during the delivery route."
                    />
                </div>
                <div className="featureCard">
                    <Feature
                        image="./src/assets/admin.png"
                        title="Admin Control"
                        text="Unified command center to monitor all boxes in the field simultaneously."
                    />
                </div>
            </div>
            <div className="py-10 p-24">
                <div className="flex flex-col items-center gap-4 text-inactive p-4">
                    <h4 className="font-heading font-extrabold text-5xl">Research Driven Impact</h4>
                    <h4 className="text-inactive/80">The heart of HungerBridge is our proprietary ZeroWaste Box. Engineered for resilience and transparency.</h4>
                </div>
                <div
                    ref={iotRef}
                    className="grid grid-cols-3 rows-2 gap-5 p-4">
                    <div className="featureCard">
                        <Feature
                            image="./src/assets/safe.png"
                            title="Safer Distribution"
                            text="Designed in alignment with FSSAI food transportation and hygiene guidelines.
                    Provides digital records of donation time, transport conditions, and delivery status."
                        />
                    </div>
                    <div className="featureCard">
                        <Feature
                            image="./src/assets/open.png"
                            title="Sustainability"
                            text="Promotes sustainable reuse of food-grade containers, reducing single-use packaging waste"
                        />
                    </div>
                    <div className="featureCard">
                        <Feature
                            image="./src/assets/admin.png"
                            title="Social Impact"
                            text="Reduces edible food waste.Helps connect donors with verified NGOs.Supports food access for people in need."
                        />
                    </div>
                    <div className="featureCard col-span-3">
                        <Feature
                            image="./src/assets/written.png"
                            title="Academic Innovation"
                            text="Integrates IoT sensors with a web platform.Enables QR/NFC-based traceability.Provides live monitoring and transport records."
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}