import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
    ArrowUpRight,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Filter,
    MapPin,
    ShieldAlert,
    Utensils,
    Building2,
    HandCoins,
    TriangleAlert,
} from "lucide-react";

import {
    AdminSidebar,
    DEFAULT_ADMIN_NAVIGATION,
} from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
const DEFAULT_STATS = [
    { label: "Total Registered NGOs", value: "4,281", badge: "+12%", icon: Building2 },
    { label: "Active Donors", value: "12,409", badge: "+5%", icon: HandCoins },
    { label: "Meals Distributed", value: "842k", badge: "This Month", icon: Utensils },
    { label: "Open Complaints", value: "14", badge: "Action Required", icon: TriangleAlert, alert: true },
];


const DEFAULT_TASKS = [
    {
        type: "NGO APPROVAL",
        time: "2h ago",
        title: "City Harvest Foundation",
        description: "Requires review of updated documents.",
    },
    {
        type: "HIGH PRIORITY",
        time: "4h ago",
        title: "Logistics Delay · Route B",
        description: "Driver reported a vehicle breakdown near Andheri.",
        priority: "high",
    },
    {
        type: "DONOR REQUEST",
        time: "5h ago",
        title: "Community Meal Center",
        description: "A new food donation is waiting for confirmation.",
    },
];

const DEFAULT_MAP_URL =
    "https://www.openstreetmap.org/export/embed.html?bbox=72.795%2C18.91%2C72.91%2C19.13&layer=mapnik&marker=19.076%2C72.8777";

const StatCard = ({ label, value, badge, icon: Icon, alert = false }) => (
    <article
        className={`stat-card min-w-0 rounded-xl border p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${alert ? "border-red-200 bg-[#FDDAD6]" : "border-[#E9E6DB] bg-[#F0EEE5]"
            }`}
    >
        <div className="mb-3 flex items-start justify-between gap-2">
            <span className={`grid h-8 w-8 place-items-center rounded-lg bg-white/80 ${alert ? "text-[#B42318]" : "text-[#A9430B]"}`}>
                <Icon size={17} />
            </span>
            <span className={`max-w-[120px] rounded-full bg-white/80 px-2 py-1 text-[9px] font-semibold leading-tight ${alert ? "text-[#B42318]" : "text-[#6D625A]"}`}>
                {badge}
            </span>
        </div>
        <p className={`mb-1 font-app-body text-[10px] tracking-wide ${alert ? "text-[#9E2720]" : "text-[#75685E]"}`}>
            {label}
        </p>
        <p className={`font-app-heading text-[29px] font-bold leading-none tracking-tight ${alert ? "text-[#9F1515]" : "text-[#111827]"}`}>
            {value}
        </p>
    </article>
);

const PanelHeader = ({ title, description, action }) => (
    <div className="flex items-center justify-between gap-3 px-4 py-4 md:px-5">
        <div>
            <h2 className="font-app-heading text-base font-bold text-[#171717]">{title}</h2>
            <p className="mt-1 font-body text-[10px] text-[#806D61]">{description}</p>
        </div>
        {action}
    </div>
);

const DistributionMap = ({ mapUrl = DEFAULT_MAP_URL }) => (
    <div className="relative h-full min-h-[270px] overflow-hidden bg-[#E4F0E9]">
        <iframe
            title="Mumbai distribution network map"
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            src={mapUrl}
        />

        <div className="pointer-events-none absolute left-3 top-3 max-w-[235px] rounded-lg border border-white/80 bg-[#FBF9F1]/95 p-3 shadow-md">
            <p className="mb-2 font-app-body text-[9px] font-bold tracking-wide text-[#74675C]">
                ZERO-WASTE ALERTS · MUMBAI
            </p>
            <p className="mb-1.5 flex items-center gap-2 font-app-body text-[10px] text-[#433A34]">
                <span className="h-2 w-2 rounded-full bg-[#D94736]" />
                Box #402 · Near capacity (95%)
            </p>
            <p className="flex items-center gap-2 font-app-body text-[10px] text-[#433A34]">
                <span className="h-2 w-2 rounded-full bg-[#E5A23D]" />
                Box #118 · Scheduled pickup
            </p>
        </div>

        <div className="pointer-events-none absolute inset-0">
            <span className="absolute left-[52%] top-[48%] grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-[#FF6D29] text-white shadow-lg">
                <MapPin size={14} fill="currentColor" />
            </span>
            {["left-[30%] top-[67%]", "left-[73%] top-[34%]", "left-[67%] top-[72%]"].map((position) => (
                <span
                    key={position}
                    className={`absolute ${position} grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-[#1BAA78] text-white shadow`}
                >
                    <CheckCircle2 size={11} />
                </span>
            ))}
        </div>
    </div>
);

const TaskCard = ({ task }) => {
    const highPriority = task.priority === "high";

    return (
        <article className="rounded-lg border border-[#E9E5DA] bg-[#FBF9F1] p-3 transition hover:border-[#E8B49A] hover:shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-2">
                <span className={`flex items-center gap-1 font-app-body text-[8px] font-bold tracking-wide ${highPriority ? "text-[#B42318]" : "text-[#A9430B]"}`}>
                    {highPriority ? <TriangleAlert size={10} /> : <ShieldAlert size={10} />}
                    {task.type}
                </span>
                <span className="flex shrink-0 items-center gap-1 font-app-body text-[8px] text-[#8A7A6E]">
                    <Clock3 size={9} />
                    {task.time}
                </span>
            </div>

            <h3 className="mb-1 font-app-heading text-[11px] font-bold leading-snug text-[#201A17]">
                {task.title}
            </h3>
            <p className="mb-3 line-clamp-2 font-app-body text-[9px] leading-relaxed text-[#7B6A5F]">
                {task.description}
            </p>
            <button
                type="button"
                onClick={task.onReview}
                className={`rounded-md px-3 py-1.5 font-app-body text-[9px] font-bold text-white transition hover:brightness-110 ${highPriority ? "bg-[#8F1003]" : "bg-[#A9430B]"
                    }`}
            >
                Review
            </button>
        </article>
    );
};

export const AdminDashboard = ({
    stats = DEFAULT_STATS,
    tasks = DEFAULT_TASKS,
    navigation = DEFAULT_ADMIN_NAVIGATION,
    mapUrl = DEFAULT_MAP_URL,
    onNavigate,
    onSearch,
    onFilter,
    onViewAllTasks,
}) => {
    const pageRef = useRef(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const context = gsap.context(() => {
            gsap.from(".dashboard-header", {
                y: -10,
                opacity: 0,
                duration: 0.45,
                ease: "power2.out",
            });
            gsap.from(".stat-card", {
                y: 14,
                opacity: 0,
                duration: 0.4,
                stagger: 0.01,
                delay: 0.01,
                ease: "power2.out",
            });
            gsap.from(".dashboard-panel", {
                y: 16,
                opacity: 0,
                duration: 0.45,
                stagger: 0.1,
                delay: 0.18,
                ease: "power2.out",
            });
        }, pageRef);

        return () => context.revert();
    }, []);

    const handleNavigate = (label) => {
        setMobileOpen(false);
        onNavigate?.(label);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        onSearch?.(event.currentTarget.elements.search.value);
    };

    return (
        <div ref={pageRef} className="min-h-screen bg-[#FBF9F1] text-[#2D3436]">
            <div className="mx-auto flex min-h-screen max-w-[1600px] overflow-hidden bg-[#FBF9F1] shadow-[0_12px_35px_rgba(48,40,20,0.08)]">
                <AdminSidebar
                    items={navigation}
                    mobileOpen={mobileOpen}
                    onNavigate={handleNavigate}
                />

                <main className="min-w-0 flex-1">

                    <AdminHeader
                        onMenuClick={() => setMobileOpen((open) => !open)}
                        onSearch={onSearch}
                    />


                    <div className="px-4 py-6 md:px-8 md:py-8">
                        <div className="dashboard-header mb-7 flex items-start justify-between gap-4">
                            <div>
                                <h1 className="font-app-heading text-[23px] font-bold tracking-tight text-[#111827] md:text-[26px]">
                                    System Overview
                                </h1>
                                <p className="mt-1 font-body text-[11px] text-[#806D61]">
                                    Real-time insights and network health metrics.
                                </p>
                            </div>
                            <button
                                type="button"
                                className="hidden items-center gap-1 rounded-md border border-[#E7E1D6] bg-white/50 px-3 py-2 font-app-body text-[9px] text-[#6D625A] hover:bg-white sm:flex"
                            >
                                This month <ChevronDown size={12} />
                            </button>
                        </div>

                        <section aria-label="Key metrics" className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
                        </section>

                        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.9fr)]">
                            <section className="dashboard-panel min-w-0 overflow-hidden rounded-xl border border-[#E9E5DA] bg-[#FBF9F1] shadow-sm">
                                <PanelHeader
                                    title="Live Distribution Network"
                                    description="Monitoring active routes and ZeroWaste box statuses."
                                    action={
                                        <button
                                            type="button"
                                            onClick={onFilter}
                                            className="flex shrink-0 items-center gap-1.5 rounded-md border border-[#E9E5DA] px-3 py-2 font-app-body text-[9px] text-[#6D625A] hover:bg-[#F0EEE5]"
                                        >
                                            <Filter size={12} /> Filter
                                        </button>
                                    }
                                />

                                <div className="h-[300px] border-t border-[#E9E5DA] sm:h-[340px] xl:h-[390px]">
                                    <DistributionMap mapUrl={mapUrl} />
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#E9E5DA] px-4 py-3 font-app-body text-[9px] text-[#76695F]">
                                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#1BAA78]" /> Active NGO</span>
                                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#FF6D29]" /> Distribution hub</span>
                                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#D94736]" /> Attention needed</span>
                                    <button type="button" onClick={onFilter} className="ml-auto flex items-center gap-1 text-[#A9430B]">
                                        View network <ArrowUpRight size={11} />
                                    </button>
                                </div>
                            </section>

                            <aside className="dashboard-panel min-w-0 overflow-hidden rounded-xl border border-[#E9E5DA] bg-[#F0EEE5] shadow-sm">
                                <div className="bg-[#FBF9F1] px-4 py-4 md:px-5">
                                    <div className="flex items-center justify-between gap-2">
                                        <h2 className="font-app-heading text-base font-bold text-[#171717]">Quick Actions</h2>
                                        <span className="rounded-full bg-[#FCE7DF] px-2 py-1 font-app-body text-[8px] font-bold text-[#A9430B]">
                                            {tasks.length} pending
                                        </span>
                                    </div>
                                    <p className="mt-1 font-body text-[10px] text-[#806D61]">
                                        Pending approvals and urgent tasks.
                                    </p>
                                </div>

                                <div className="max-h-[430px] space-y-3 overflow-y-auto p-3 md:p-4">
                                    {tasks.map((task) => <TaskCard key={task.title} task={task} />)}
                                </div>

                                <button
                                    type="button"
                                    onClick={onViewAllTasks}
                                    className="flex w-full items-center justify-center gap-1 border-t border-[#E4DFD3] bg-[#F7F5ED] py-3 font-app-body text-[10px] font-bold text-[#A9430B] hover:bg-white"
                                >
                                    View all tasks <ArrowUpRight size={12} />
                                </button>
                            </aside>
                        </section>

                        <footer className="mt-5 flex flex-wrap items-center justify-between gap-2 font-app-body text-[9px] text-[#9A8E83]">
                            <span>HungerBridge Admin Console · Network overview</span>
                            <span>Last synced just now</span>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
};
