
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    Activity,
    ArrowDown,
    ArrowRight,
    BookOpen,
    BrainCircuit,
    CheckCircle2,
    Code2,
    ExternalLink,
    GraduationCap,
    HeartHandshake,
    Leaf,
    MapPin,
    PackageCheck,
    Recycle,
    ShieldCheck,
    Thermometer,
    Truck,
    Users,
    Waves,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Replace these placeholders with your actual project links.
const GITHUB_URL = "https://github.com/YOUR-USERNAME/YOUR-REPOSITORY";
const RESEARCH_DRIVE_URL = "https://drive.google.com/drive/my-drive";

const researchReferences = [
    {
        title: "Food Safety and Standards Act, 2006",
        organization: "FSSAI · Government of India",
        description:
            "The legal framework for food safety standards and the regulation of food handling, storage and distribution in India.",
        url: "https://www.fssai.gov.in/food-law/act-2006",
        icon: ShieldCheck,
    },
    {
        title: "Surplus Food Recovery Guidelines",
        organization: "Indian Food Sharing Alliance · FSSAI initiative",
        description:
            "Guidance on recovering surplus food and maintaining hygiene and appropriate temperature conditions during transportation.",
        url: "https://sharefood.eatrightindia.gov.in/guidance-for-fresh-cooked-food.html",
        icon: PackageCheck,
    },
    {
        title: "Surplus Food Sharing Initiative",
        organization: "Save Food, Share Food, Share a Smile",
        description:
            "Background on connecting food donors with recovery organizations to reduce food waste and help people in need.",
        url: "https://sharefood.eatrightindia.gov.in/",
        icon: HeartHandshake,
    },
];

const problemCards = [
    {
        icon: Recycle,
        title: "Surplus food goes to waste",
        description:
            "Restaurants, bakeries, caterers and households can have edible surplus food while people nearby need meals.",
    },
    {
        icon: HeartHandshake,
        title: "Donors and NGOs need coordination",
        description:
            "Finding a suitable recipient, confirming acceptance and coordinating collection can take time.",
    },
    {
        icon: Thermometer,
        title: "Food safety matters",
        description:
            "Food handling, storage temperature, elapsed time and transportation conditions influence food safety.",
    },
    {
        icon: ShieldCheck,
        title: "Trust and traceability",
        description:
            "A donation process benefits from clear records, verified accounts and visible status updates.",
    },
];

const workflow = [
    {
        number: "01",
        icon: Users,
        title: "Register and verify",
        description:
            "Donors, NGOs and delivery partners register on the platform. The system supports role-based access and donor profile information.",
    },
    {
        number: "02",
        icon: BrainCircuit,
        title: "Describe the food",
        description:
            "The donor enters the food name and ingredients. The AI classifier predicts relevant food categories to support the safety-rule workflow.",
    },
    {
        number: "03",
        icon: ShieldCheck,
        title: "Assess handling conditions",
        description:
            "Food category, recorded storage conditions and elapsed time can be evaluated against configured safety rules. Sensor readings can provide additional context.",
    },
    {
        number: "04",
        icon: HeartHandshake,
        title: "Coordinate a donation",
        description:
            "Donation details can help the donor, recipient organization and delivery partner coordinate collection and handover.",
    },
    {
        number: "05",
        icon: PackageCheck,
        title: "Track the handover",
        description:
            "Donation status and delivery records can support traceability. QR/NFC-based identification and return tracking are planned for the ZeroWaste Box workflow.",
    },
];

const technologyCards = [
    {
        icon: Code2,
        title: "Web application",
        description:
            "A React-based interface with an Express.js backend and PostgreSQL data storage using Drizzle ORM.",
        tag: "Full-stack development",
    },
    {
        icon: BrainCircuit,
        title: "AI-assisted classification",
        description:
            "A DistilBERT-based multi-label model uses food names and ingredients to predict categories that inform the rule-selection workflow.",
        tag: "Machine learning",
    },
    {
        icon: Activity,
        title: "IoT monitoring concept",
        description:
            "The proposed ZeroWaste Box uses temperature and humidity sensing to add environmental context to food transport records.",
        tag: "Hardware + telemetry",
    },
    {
        icon: MapPin,
        title: "Traceability",
        description:
            "Donation, collection and handover records are intended to make the journey easier to follow and review.",
        tag: "Transparency",
    },
];

const impactCards = [
    {
        icon: Leaf,
        title: "Environmental impact",
        description:
            "Help redirect suitable surplus food instead of letting it go to waste, supporting more responsible resource use.",
    },
    {
        icon: HeartHandshake,
        title: "Social impact",
        description:
            "Create a digital connection between food donors and organizations that support people experiencing food insecurity.",
    },
    {
        icon: ShieldCheck,
        title: "Safety awareness",
        description:
            "Bring food category, storage information and handling considerations into the donation workflow.",
    },
    {
        icon: GraduationCap,
        title: "Academic impact",
        description:
            "Explore how full-stack development, machine learning and IoT can work together to address a real-world problem.",
    },
];

const projectPillars = [
    {
        icon: Users,
        title: "Food donors",
        text: "Restaurants · Caterers · Households",
    },
    {
        icon: BrainCircuit,
        title: "Smart food workflow",
        text: "Classification · Configured rules",
    },
    {
        icon: Truck,
        title: "Collection and delivery",
        text: "Recipient coordination · Handover",
    },
    {
        icon: Leaf,
        title: "Community benefit",
        text: "Food recovery · Less avoidable waste",
    },
];

function SectionHeading({ eyebrow, title, description }) {
    return (
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-primary">
                {eyebrow}
            </p>

            <h2 className="font-heading text-3xl font-extrabold leading-tight text-heading sm:text-4xl lg:text-5xl">
                {title}
            </h2>

            {description && (
                <p className="mx-auto mt-4 max-w-2xl font-body text-sm leading-7 text-inactive sm:text-base">
                    {description}
                </p>
            )}
        </div>
    );
}

function InfoCard({ icon: Icon, title, description, tag }) {
    return (
        <article className="about-card h-full rounded-2xl border border-black/5 bg-background p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={24} strokeWidth={1.8} />
            </div>

            {tag && (
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                    {tag}
                </p>
            )}

            <h3 className="font-heading text-lg font-bold text-heading sm:text-xl">
                {title}
            </h3>

            <p className="mt-3 font-body text-sm leading-7 text-inactive">
                {description}
            </p>
        </article>
    );
}

function CheckItem({ children }) {
    return (
        <span className="flex items-center gap-2 text-sm text-inactive">
            <CheckCircle2 size={17} className="shrink-0 text-primary" />
            {children}
        </span>
    );
}

export const About = () => {
    const pageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".about-hero-content",
                { opacity: 0, y: 28 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.75,
                    stagger: 0.1,
                    ease: "power3.out",
                }
            );

            gsap.utils.toArray(".about-reveal").forEach((element) => {
                gsap.fromTo(
                    element,
                    { opacity: 0, y: 24 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.65,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: element,
                            start: "top 88%",
                            once: true,
                        },
                    }
                );
            });

            gsap.fromTo(
                ".about-card",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".about-cards-grid",
                        start: "top 85%",
                        once: true,
                    },
                }
            );
        }, pageRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={pageRef} className="overflow-x-clip bg-background text-heading">
            {/* HERO */}
            <section className="relative isolate overflow-hidden bg-brown">
                <div className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl sm:h-96 sm:w-96" />
                <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

                <div className="relative mx-auto grid max-w-[1600px] items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:px-12 xl:px-20">
                    <div className="max-w-3xl">
                        <p className="about-hero-content mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-4 py-2 font-body text-xs font-semibold tracking-wide text-heading sm:text-sm">
                            <GraduationCap size={17} className="text-primary" />
                            Final-Year B.Sc. Computer Science Academic Project
                        </p>

                        <h1 className="about-hero-content font-heading text-4xl font-extrabold leading-tight text-heading sm:text-5xl md:text-6xl xl:text-7xl">
                            Turning surplus food into{" "}
                            <span className="text-primary">
                                meaningful impact.
                            </span>
                        </h1>

                        <p className="about-hero-content mt-6 max-w-2xl font-body text-base leading-8 text-inactive sm:text-lg">
                            HungerBridge is an academic project exploring how
                            technology can connect food donors with recipient
                            organizations while bringing food-safety awareness,
                            delivery coordination and traceability into one
                            platform.
                        </p>

                        <p className="about-hero-content mt-5 max-w-2xl font-body text-sm leading-7 text-inactive sm:text-base">
                            Developed as part of my Bachelor of Science in
                            Computer Science, this project combines full-stack
                            web development with AI-assisted food classification
                            and a proposed IoT-enabled food transport solution.
                        </p>

                        <div className="about-hero-content mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <a
                                href="#how-it-works"
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-heading text-sm font-bold text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                                Explore the workflow
                                <ArrowDown size={18} />
                            </a>

                            <a
                                href={GITHUB_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-heading/20 bg-background px-6 py-3 font-heading text-sm font-bold text-heading transition hover:border-primary hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                                <Code2 size={18} />
                                View source code
                                <ExternalLink size={15} />
                            </a>
                        </div>

                        <div className="about-hero-content mt-9 flex flex-wrap gap-x-5 gap-y-3">
                            <CheckItem>Food donation coordination</CheckItem>
                            <CheckItem>AI-assisted classification</CheckItem>
                            <CheckItem>Safety-focused design</CheckItem>
                        </div>
                    </div>

                    {/* PROJECT OVERVIEW */}
                    <div className="about-hero-content relative mx-auto w-full max-w-lg">
                        <div className="absolute -inset-3 rounded-[2rem] bg-primary/10 blur-2xl" />

                        <div className="relative rounded-3xl border border-black/5 bg-background p-5 shadow-xl sm:p-7">
                            <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-5">
                                <div>
                                    <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                                        The HungerBridge model
                                    </p>

                                    <h2 className="mt-2 font-heading text-2xl font-extrabold text-heading sm:text-3xl">
                                        From surplus to service
                                    </h2>
                                </div>

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <HeartHandshake size={27} />
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                {projectPillars.map((item, index) => {
                                    const Icon = item.icon;

                                    return (
                                        <div
                                            key={item.title}
                                            className="flex items-center gap-4 rounded-2xl border border-black/5 bg-brown p-4"
                                        >
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <Icon size={22} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="font-heading text-sm font-bold text-heading sm:text-base">
                                                    {item.title}
                                                </p>

                                                <p className="mt-1 font-body text-xs leading-5 text-inactive sm:text-sm">
                                                    {item.text}
                                                </p>
                                            </div>

                                            <span className="font-heading text-xs font-bold text-primary">
                                                0{index + 1}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <p className="mt-5 font-body text-xs leading-6 text-inactive">
                                Proposed end-to-end workflow. Actual features
                                depend on the modules implemented and tested
                                in the application.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* STUDENT AND MOTIVATION */}
            <section className="mx-auto grid max-w-[1400px] gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-12 lg:px-12">
                <article className="about-reveal rounded-3xl border border-black/5 bg-tertiary p-6 sm:p-9">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <GraduationCap size={29} />
                    </div>

                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                        The student behind the project
                    </p>

                    <h2 className="font-heading text-2xl font-extrabold text-heading sm:text-3xl">
                        A computer science student building for social good.
                    </h2>

                    <p className="mt-5 font-body text-sm leading-7 text-inactive sm:text-base">
                        I am a B.Sc. Computer Science student at Ramniranjan
                        Jhunjhunwala College. HungerBridge is my academic project
                        through which I am applying my learning in software
                        development to a practical community challenge.
                    </p>

                    <p className="mt-4 font-body text-sm leading-7 text-inactive sm:text-base">
                        The project gives me an opportunity to explore how web
                        technologies, databases, machine learning and connected
                        hardware can complement one another in a single
                        problem-solving system.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {[
                            "Full-stack development",
                            "AI / ML",
                            "IoT concepts",
                            "Social impact",
                        ].map((skill) => (
                            <span
                                key={skill}
                                className="rounded-full border border-primary/20 bg-background px-3 py-2 font-body text-xs font-semibold text-heading"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </article>

                <article className="about-reveal flex flex-col justify-center py-2 lg:py-6">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                        Why I chose this problem
                    </p>

                    <h2 className="font-heading text-3xl font-extrabold leading-tight text-heading sm:text-4xl">
                        Food should reach people, not become avoidable waste.
                    </h2>

                    <p className="mt-5 font-body text-sm leading-7 text-inactive sm:text-base">
                        Edible surplus food and food insecurity can exist at
                        the same time. Yet redirecting surplus food involves
                        more than finding a donor: someone must identify a
                        suitable recipient, coordinate collection, consider
                        handling conditions and complete the handover.
                    </p>

                    <p className="mt-4 font-body text-sm leading-7 text-inactive sm:text-base">
                        I chose this problem because it brings together
                        technology and a meaningful social need. My aim is to
                        explore a practical digital workflow that makes food
                        recovery easier to coordinate, more transparent and
                        more conscious of food safety.
                    </p>

                    <div className="mt-7 flex items-start gap-3 rounded-2xl border-l-4 border-primary bg-tertiary p-5">
                        <Leaf size={22} className="mt-1 shrink-0 text-primary" />

                        <p className="font-body text-sm leading-7 text-heading">
                            <strong>The central idea:</strong> make suitable
                            surplus food easier to identify, coordinate and
                            deliver through a connected, safety-conscious
                            donation workflow.
                        </p>
                    </div>
                </article>
            </section>

            {/* PROBLEM STATEMENT */}
            <section className="bg-tertiary px-5 py-16 sm:px-8 sm:py-20">
                <div className="mx-auto max-w-[1400px]">
                    <SectionHeading
                        eyebrow="The problem"
                        title="Four challenges HungerBridge addresses"
                        description="The project is designed around the coordination, safety and transparency challenges involved in surplus food recovery."
                    />

                    <div className="about-cards-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {problemCards.map((item) => (
                            <InfoCard key={item.title} {...item} />
                        ))}
                    </div>
                </div>
            </section>

            {/* WORKFLOW */}
            <section
                id="how-it-works"
                className="scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20"
            >
                <div className="mx-auto max-w-5xl">
                    <SectionHeading
                        eyebrow="How it works"
                        title="From donation listing to handover"
                        description="HungerBridge brings the key participants and information into one workflow. The exact steps available to users depend on which modules are currently implemented."
                    />

                    <div className="relative">
                        <div className="absolute bottom-8 left-[23px] top-8 w-px bg-primary/25 sm:left-[27px]" />

                        <div className="space-y-5 sm:space-y-6">
                            {workflow.map((step) => {
                                const Icon = step.icon;

                                return (
                                    <article
                                        key={step.number}
                                        className="about-reveal relative grid grid-cols-[48px_minmax(0,1fr)] gap-4 sm:grid-cols-[56px_minmax(0,1fr)] sm:gap-6"
                                    >
                                        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-background text-primary shadow-sm sm:h-14 sm:w-14">
                                            <Icon size={24} />
                                        </div>

                                        <div className="rounded-2xl border border-black/5 bg-tertiary p-5 sm:p-6">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="font-heading text-xs font-extrabold tracking-widest text-primary">
                                                    STEP {step.number}
                                                </span>

                                                <h3 className="font-heading text-lg font-bold text-heading sm:text-xl">
                                                    {step.title}
                                                </h3>
                                            </div>

                                            <p className="mt-3 font-body text-sm leading-7 text-inactive">
                                                {step.description}
                                            </p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOD SAFETY */}
            <section className="bg-brown px-5 py-16 sm:px-8 sm:py-20">
                <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
                    <div className="about-reveal">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                            Safety-aware by design
                        </p>

                        <h2 className="font-heading text-3xl font-extrabold leading-tight text-heading sm:text-4xl lg:text-5xl">
                            Food safety is part of the workflow, not an afterthought.
                        </h2>

                        <p className="mt-5 font-body text-sm leading-7 text-inactive sm:text-base">
                            The proposed safety workflow combines food
                            classification with configured rules and, where
                            available, recorded storage information and sensor
                            readings. The intention is to support better-informed
                            handling and transport decisions.
                        </p>

                        <p className="mt-4 font-body text-sm leading-7 text-inactive sm:text-base">
                            The project uses food-safety references as research
                            inputs. Its category rules and time estimates are
                            an academic implementation, not a substitute for
                            official guidance, qualified inspection or
                            laboratory testing.
                        </p>

                        <a
                            href={researchReferences[0].url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-7 inline-flex items-center gap-2 font-heading text-sm font-bold text-primary hover:underline"
                        >
                            Explore the official Food Safety Act
                            <ArrowRight size={17} />
                        </a>
                    </div>

                    <div className="about-reveal grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {[
                            {
                                icon: BrainCircuit,
                                title: "AI classification",
                                description:
                                    "Food names and ingredients are used to predict categories that can guide selection of configured rules.",
                            },
                            {
                                icon: Thermometer,
                                title: "Temperature awareness",
                                description:
                                    "Temperature and storage records can provide context for evaluating the food's handling history.",
                            },
                            {
                                icon: Waves,
                                title: "Environmental monitoring",
                                description:
                                    "The proposed ZeroWaste Box adds temperature and humidity sensing to support transport monitoring.",
                            },
                            {
                                icon: ShieldCheck,
                                title: "Safety-rule checks",
                                description:
                                    "Configured rules can flag conditions that need review. Sensor data alone cannot prove that food is safe to eat.",
                            },
                        ].map(({ icon: Icon, title, description }) => (
                            <article
                                key={title}
                                className="rounded-2xl border border-black/5 bg-background p-5 sm:p-6"
                            >
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Icon size={25} />
                                </div>

                                <h3 className="font-heading text-lg font-bold text-heading">
                                    {title}
                                </h3>

                                <p className="mt-3 font-body text-sm leading-7 text-inactive">
                                    {description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* TECHNOLOGY */}
            <section className="px-5 py-16 sm:px-8 sm:py-20">
                <div className="mx-auto max-w-[1400px]">
                    <SectionHeading
                        eyebrow="Technology behind the project"
                        title="Connecting software, AI and IoT"
                        description="HungerBridge explores a multi-layered architecture in which each technology has a defined role in the donation journey."
                    />

                    <div className="about-cards-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {technologyCards.map((item) => (
                            <InfoCard key={item.title} {...item} />
                        ))}
                    </div>

                    <div className="about-reveal mt-8 rounded-3xl border border-primary/15 bg-tertiary p-6 sm:p-8">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <PackageCheck size={24} />
                            </div>

                            <div>
                                <h3 className="font-heading text-xl font-extrabold text-heading sm:text-2xl">
                                    The ZeroWaste Box concept
                                </h3>

                                <p className="mt-3 max-w-4xl font-body text-sm leading-7 text-inactive sm:text-base">
                                    ZeroWaste Box is the proposed reusable food
                                    transport container associated with
                                    HungerBridge. Its intended design combines
                                    temperature and humidity sensing with
                                    transport records and container
                                    identification. Additional ideas include
                                    an on-box display, opening logs, QR or NFC
                                    handover, and a return-points mechanism.
                                    Describe these as planned or in progress
                                    unless the relevant features have been
                                    built and verified.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {[
                                "Reusable container",
                                "Temperature sensor",
                                "Humidity sensor",
                                "Transport monitoring",
                                "QR / NFC concept",
                                "Return tracking concept",
                            ].map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border border-primary/20 bg-background px-3 py-2 font-body text-xs font-semibold text-heading"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* IMPACT */}
            <section className="bg-tertiary px-5 py-16 sm:px-8 sm:py-20">
                <div className="mx-auto max-w-[1400px]">
                    <SectionHeading
                        eyebrow="Expected impact"
                        title="More than a donation website"
                        description="The project aims to demonstrate how digital coordination and safety-aware design could contribute to a more responsible food recovery process."
                    />

                    <div className="about-cards-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {impactCards.map((item) => (
                            <InfoCard key={item.title} {...item} />
                        ))}
                    </div>

                    <div className="about-reveal mt-8 rounded-3xl bg-background p-6 sm:p-9">
                        <h3 className="font-heading text-xl font-extrabold text-heading sm:text-2xl">
                            How impact can be evaluated
                        </h3>

                        <p className="mt-3 max-w-4xl font-body text-sm leading-7 text-inactive sm:text-base">
                            Rather than claiming impact without evidence, the
                            project can be evaluated through measurable
                            indicators such as the number of registered
                            participants, donations listed, donations
                            accepted, successful handovers, quantity of food
                            redirected and user feedback. Report values only
                            after collecting actual application or survey data.
                        </p>

                        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                "Donation listings",
                                "Completed handovers",
                                "Food quantity redirected",
                                "User feedback",
                            ].map((metric) => (
                                <div
                                    key={metric}
                                    className="flex items-center gap-3 rounded-xl border border-black/5 p-4"
                                >
                                    <CheckCircle2
                                        size={19}
                                        className="shrink-0 text-primary"
                                    />
                                    <span className="font-body text-sm font-semibold text-heading">
                                        {metric}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* RESEARCH AND REFERENCES */}
            <section
                id="research"
                className="scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20"
            >
                <div className="mx-auto max-w-[1400px]">
                    <SectionHeading
                        eyebrow="Research and references"
                        title="Built on research, developed through practice"
                        description="These are useful starting points for the food-safety and surplus-food recovery research behind HungerBridge. Review the original documents and cite the exact material used in your report."
                    />

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                        {researchReferences.map((reference) => {
                            const Icon = reference.icon;

                            return (
                                <article
                                    key={reference.title}
                                    className="about-reveal flex h-full flex-col rounded-2xl border border-black/5 bg-tertiary p-6 transition hover:-translate-y-1 hover:shadow-lg sm:p-7"
                                >
                                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Icon size={24} />
                                    </div>

                                    <p className="mb-2 font-body text-xs font-bold uppercase tracking-wider text-primary">
                                        {reference.organization}
                                    </p>

                                    <h3 className="font-heading text-lg font-bold text-heading sm:text-xl">
                                        {reference.title}
                                    </h3>

                                    <p className="mt-3 flex-1 font-body text-sm leading-7 text-inactive">
                                        {reference.description}
                                    </p>

                                    <a
                                        href={reference.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-6 inline-flex items-center gap-2 font-heading text-sm font-bold text-primary hover:underline"
                                    >
                                        Read reference
                                        <ExternalLink size={16} />
                                    </a>
                                </article>
                            );
                        })}
                    </div>

                    <div className="about-reveal mt-8 rounded-3xl border border-primary/15 bg-tertiary p-6 sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <BookOpen size={24} />
                                </div>

                                <div>
                                    <h3 className="font-heading text-xl font-extrabold text-heading">
                                        My research collection
                                    </h3>

                                    <p className="mt-2 max-w-2xl font-body text-sm leading-7 text-inactive">
                                        Research papers, official guidance,
                                        survey summaries, technical notes and
                                        supporting documents for the project.
                                    </p>
                                </div>
                            </div>

                            <a
                                href={RESEARCH_DRIVE_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-heading text-sm font-bold text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                                Open research folder
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="px-5 pb-16 sm:px-8 sm:pb-20">
                <div className="about-reveal relative mx-auto max-w-[1400px] overflow-hidden rounded-3xl border border-primary/20 bg-brown px-6 py-12 text-center sm:px-12 sm:py-16">
                    <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

                    <div className="relative mx-auto max-w-3xl">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                            Explore HungerBridge
                        </p>

                        <h2 className="font-heading text-3xl font-extrabold leading-tight text-heading sm:text-4xl lg:text-5xl">
                            Technology with a purpose.
                            <br />
                            A future with less food waste.
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl font-body text-sm leading-7 text-inactive sm:text-base">
                            Explore the project, review the implementation and
                            discover how a safety-conscious food donation
                            workflow can be designed.
                        </p>

                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <Link
                                to="/"
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-heading text-sm font-bold text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                                Back to Home
                                <ArrowRight size={17} />
                            </Link>

                            <a
                                href={GITHUB_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-heading/20 bg-background px-6 py-3 font-heading text-sm font-bold text-heading transition hover:border-primary hover:bg-primary/5"
                            >
                                <Code2 size={18} />
                                Explore the code
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};
