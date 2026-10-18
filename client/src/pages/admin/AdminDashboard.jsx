
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import {
    Activity,
    ArrowUpRight,
    Building2,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Filter,
    HandCoins,
    MapPin,
    PackageCheck,
    RefreshCw,
    Search,
    ShieldAlert,
    Thermometer,
    TriangleAlert,
    Truck,
    Utensils,
} from "lucide-react";

import {
    AdminSidebar,
    DEFAULT_ADMIN_NAVIGATION,
} from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

const API_URL = "/api/admin";

const STAT_CONFIG = {
    totalNgos: {
        label: "Registered NGOs",
        icon: Building2,
    },
    activeDonors: {
        label: "Active Donors",
        icon: HandCoins,
    },
    mealsDistributed: {
        label: "Delivered Donations",
        icon: Utensils,
    },
    openComplaints: {
        label: "Open Complaints",
        icon: TriangleAlert,
        alert: true,
    },
};

const DEFAULT_MAP_URL =
    "https://www.openstreetmap.org/export/embed.html?bbox=72.795%2C18.91%2C72.91%2C19.13&layer=mapnik&marker=19.076%2C72.8777";

const numberFormat = new Intl.NumberFormat("en-IN");

function formatValue(value) {
    if (value === null || value === undefined) return "—";

    if (typeof value === "number") {
        return numberFormat.format(value);
    }

    return value;
}

function formatTime(value) {
    if (!value) return "Time unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    const elapsed = Math.max(0, Date.now() - date.getTime());
    const minutes = Math.floor(elapsed / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);

    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });
}

function StatCard({ label, value, badge, icon: Icon, alert }) {
    return (
        <article
            className={`stat-card min-w-0 rounded-xl border p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${alert
                ? "border-red-200 bg-[#FDDAD6]"
                : "border-[#E9E6DB] bg-[#F0EEE5]"
                }`}
        >
            <div className="mb-3 flex items-start justify-between gap-2">
                <span
                    className={`grid h-9 w-9 place-items-center rounded-lg bg-white/80 ${alert ? "text-[#B42318]" : "text-[#A9430B]"
                        }`}
                >
                    <Icon size={18} />
                </span>

                {badge && (
                    <span
                        className={`max-w-[125px] rounded-full bg-white/80 px-2 py-1 text-[9px] font-semibold leading-tight ${alert ? "text-[#B42318]" : "text-[#6D625A]"
                            }`}
                    >
                        {badge}
                    </span>
                )}
            </div>

            <p
                className={`mb-2 font-app-body text-[10px] tracking-wide ${alert ? "text-[#9E2720]" : "text-[#75685E]"
                    }`}
            >
                {label}
            </p>

            <p
                className={`break-words font-app-heading text-2xl font-bold leading-tight tracking-tight sm:text-[29px] ${alert ? "text-[#9F1515]" : "text-[#111827]"
                    }`}
            >
                {formatValue(value)}
            </p>
        </article>
    );
}

function PanelHeader({ title, description, action }) {
    return (
        <div className="flex items-center justify-between gap-3 px-4 py-4 md:px-5">
            <div className="min-w-0">
                <h2 className="font-app-heading text-base font-bold text-[#171717]">
                    {title}
                </h2>

                <p className="mt-1 font-body text-[10px] text-[#806D61]">
                    {description}
                </p>
            </div>

            {action}
        </div>
    );
}

function DistributionMap({ mapUrl, alerts }) {
    const alertCount = alerts.length;

    return (
        <div className="relative h-full min-h-[270px] overflow-hidden bg-[#E4F0E9]">
            <iframe
                title="HungerBridge distribution network map"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                src={mapUrl || DEFAULT_MAP_URL}
            />

            <div className="absolute left-3 top-3 z-10 max-w-[260px] rounded-xl border border-white/80 bg-[#FBF9F1]/95 p-3 shadow-md backdrop-blur-sm">
                <p className="mb-2 font-app-body text-[9px] font-bold tracking-wide text-[#74675C]">
                    DISTRIBUTION ALERTS
                </p>

                {alertCount === 0 ? (
                    <p className="flex items-center gap-2 font-app-body text-[10px] text-[#433A34]">
                        <CheckCircle2
                            size={13}
                            className="shrink-0 text-[#1BAA78]"
                        />
                        No active alerts reported
                    </p>
                ) : (
                    <div className="max-h-40 space-y-2 overflow-y-auto">
                        {alerts.slice(0, 5).map((alert, index) => {
                            const urgent =
                                alert.priority === "high" ||
                                alert.severity === "critical";

                            return (
                                <div
                                    key={alert.id ?? alert._id ?? `${alert.title}-${index}`}
                                    className="flex items-start gap-2 font-app-body text-[10px] text-[#433A34]"
                                >
                                    <span
                                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${urgent
                                            ? "bg-[#D94736]"
                                            : "bg-[#E5A23D]"
                                            }`}
                                    />

                                    <span>
                                        <span className="font-bold">
                                            {alert.title || alert.type || "Network alert"}
                                        </span>

                                        {alert.location
                                            ? ` · ${alert.location}`
                                            : ""}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {alertCount > 5 && (
                    <p className="mt-2 text-[9px] text-[#74675C]">
                        +{alertCount - 5} more alerts
                    </p>
                )}
            </div>
        </div>
    );
}

function TaskCard({ task, onReview }) {
    const highPriority =
        task.priority === "high" ||
        task.severity === "critical";

    const taskTime = formatTime(
        task.createdAt || task.updatedAt || task.timestamp
    );

    return (
        <article className="rounded-lg border border-[#E9E5DA] bg-[#FBF9F1] p-3 transition hover:border-[#E8B49A] hover:shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-2">
                <span
                    className={`flex items-center gap-1 font-app-body text-[8px] font-bold tracking-wide ${highPriority ? "text-[#B42318]" : "text-[#A9430B]"
                        }`}
                >
                    {highPriority ? (
                        <TriangleAlert size={11} />
                    ) : (
                        <ShieldAlert size={11} />
                    )}

                    {task.type || "PENDING TASK"}
                </span>

                <span className="flex shrink-0 items-center gap-1 font-app-body text-[8px] text-[#8A7A6E]">
                    <Clock3 size={9} />
                    {taskTime}
                </span>
            </div>

            <h3 className="mb-1 font-app-heading text-[11px] font-bold leading-snug text-[#201A17]">
                {task.title || task.name || "Untitled task"}
            </h3>

            <p className="mb-3 line-clamp-2 font-app-body text-[9px] leading-relaxed text-[#7B6A5F]">
                {task.description || "Open this task to review its details."}
            </p>

            <button
                type="button"
                onClick={() => onReview?.(task)}
                className={`rounded-md px-3 py-1.5 font-app-body text-[9px] font-bold text-white transition hover:brightness-110 ${highPriority ? "bg-[#8F1003]" : "bg-[#A9430B]"
                    }`}
            >
                Review
            </button>
        </article>
    );
}

function EmptyState({ message }) {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
            <CheckCircle2 size={25} className="mb-2 text-[#1BAA78]" />

            <p className="font-app-heading text-sm font-bold text-[#433A34]">
                Nothing to show
            </p>

            <p className="mt-1 font-body text-xs text-[#806D61]">
                {message}
            </p>
        </div>
    );
}

export const AdminDashboard = ({
    navigation = DEFAULT_ADMIN_NAVIGATION,
    mapUrl: suppliedMapUrl,
    onNavigate,
    onSearch,
    onFilter,
    onViewAllTasks,
    onReviewTask,
}) => {
    const pageRef = useRef(null);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [period, setPeriod] = useState("month");
    const [searchTerm, setSearchTerm] = useState("");
    const [attentionOnly, setAttentionOnly] = useState(false);

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const fetchDashboard = useCallback(
        async ({ silent = false } = {}) => {
            if (silent) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            try {
                const response = await fetch(
                    `${API_URL}?period=${encodeURIComponent(period)}`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            Accept: "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        throw new Error(
                            "Your admin session may have expired. Please sign in again."
                        );
                    }

                    if (response.status === 404) {
                        throw new Error(
                            "Dashboard API not found. Create GET /api/admin/dashboard in your backend."
                        );
                    }

                    throw new Error(
                        `Unable to load dashboard data (${response.status}).`
                    );
                }

                const result = await response.json();

                // Supports either { stats, tasks, alerts } or { data: {...} }.
                const data = result.data ?? result;

                setDashboard({
                    stats: data.stats ?? {},
                    tasks: Array.isArray(data.tasks) ? data.tasks : [],
                    alerts: Array.isArray(data.alerts) ? data.alerts : [],
                    mapUrl: data.mapUrl ?? suppliedMapUrl ?? DEFAULT_MAP_URL,
                    lastSyncedAt: new Date().toISOString(),
                });
            } catch (err) {
                setError(
                    err.message || "Something went wrong while loading the dashboard."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [period, suppliedMapUrl]
    );

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    useEffect(() => {
        const context = gsap.context(() => {
            gsap.from(".dashboard-header", {
                y: -10,
                opacity: 0,
                duration: 0.4,
                ease: "power2.out",
            });

            gsap.from(".stat-card", {
                y: 12,
                opacity: 0,
                duration: 0.04,
                stagger: 0.01,
                ease: "power2.out",
            });

            gsap.from(".dashboard-panel", {
                y: 14,
                opacity: 0,
                duration: 0.4,
                stagger: 0.08,
                delay: 0.1,
                ease: "power2.out",
            });
        }, pageRef);

        return () => context.revert();
    }, [loading, error]);

    const stats = dashboard?.stats ?? {};
    const tasks = dashboard?.tasks ?? [];
    const alerts = dashboard?.alerts ?? [];

    const visibleTasks = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return tasks.filter((task) => {
            const isUrgent =
                task.priority === "high" ||
                task.severity === "critical";

            if (attentionOnly && !isUrgent) return false;

            if (!query) return true;

            const searchableText = [
                task.title,
                task.name,
                task.type,
                task.description,
                task.location,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query);
        });
    }, [tasks, searchTerm, attentionOnly]);

    const handleNavigate = (label) => {
        setMobileOpen(false);
        onNavigate?.(label);
    };

    const handleSearch = (value) => {
        const query =
            typeof value === "string"
                ? value
                : value?.target?.value ?? "";

        setSearchTerm(query);
        onSearch?.(query);
    };

    const handleReview = (task) => {
        onReviewTask?.(task);
    };

    const lastSynced = dashboard?.lastSyncedAt
        ? new Date(dashboard.lastSyncedAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        })
        : null;

    return (
        <div
            ref={pageRef}
            className="min-h-screen bg-[#FBF9F1] text-[#2D3436]"
        >
            <div className="mx-auto flex min-h-screen max-w-[1600px] overflow-hidden bg-[#FBF9F1] shadow-[0_12px_35px_rgba(48,40,20,0.08)]">
                <AdminSidebar
                    items={navigation}
                    mobileOpen={mobileOpen}
                    onNavigate={handleNavigate}
                />

                <main className="min-w-0 flex-1">
                    <AdminHeader
                        onMenuClick={() => setMobileOpen((open) => !open)}
                        onSearch={handleSearch}
                    />

                    <div className="px-4 py-6 md:px-8 md:py-8">
                        <div className="dashboard-header mb-7 flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h1 className="font-app-heading text-[23px] font-bold tracking-tight text-[#111827] md:text-[26px]">
                                    System Overview
                                </h1>

                                <p className="mt-1 font-body text-[11px] text-[#806D61]">
                                    Dashboard data from the HungerBridge system.
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="flex items-center gap-2 rounded-md border border-[#E7E1D6] bg-white/70 px-3 py-2">
                                    <span className="font-app-body text-[9px] text-[#6D625A]">
                                        Period
                                    </span>

                                    <select
                                        value={period}
                                        onChange={(event) =>
                                            setPeriod(event.target.value)
                                        }
                                        className="max-w-[110px] bg-transparent font-app-body text-[10px] font-semibold text-[#433A34] outline-none"
                                    >
                                        <option value="today">Today</option>
                                        <option value="week">This week</option>
                                        <option value="month">This month</option>
                                        <option value="year">This year</option>
                                        <option value="all">All time</option>
                                    </select>

                                    <ChevronDown size={12} />
                                </label>

                                <button
                                    type="button"
                                    onClick={() => fetchDashboard({ silent: true })}
                                    disabled={refreshing}
                                    title="Refresh dashboard"
                                    className="grid h-9 w-9 place-items-center rounded-md border border-[#E7E1D6] bg-white/70 text-[#A9430B] transition hover:bg-white disabled:opacity-50"
                                >
                                    <RefreshCw
                                        size={14}
                                        className={refreshing ? "animate-spin" : ""}
                                    />
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
                            >
                                <div className="flex items-start gap-3">
                                    <TriangleAlert
                                        size={18}
                                        className="mt-0.5 shrink-0 text-red-700"
                                    />

                                    <div>
                                        <p className="font-app-heading text-sm font-bold text-red-800">
                                            Dashboard data unavailable
                                        </p>

                                        <p className="mt-1 font-body text-xs leading-5 text-red-700">
                                            {error}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => fetchDashboard()}
                                    className="rounded-md bg-red-700 px-3 py-2 font-app-body text-xs font-bold text-white hover:bg-red-800"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        <section
                            aria-label="Key metrics"
                            className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
                        >
                            {Object.entries(STAT_CONFIG).map(
                                ([key, config]) => {
                                    const Icon = config.icon;
                                    const stat = stats[key];

                                    return (
                                        <StatCard
                                            key={key}
                                            label={config.label}
                                            value={
                                                loading
                                                    ? "…"
                                                    : stat === null || stat === undefined
                                                        ? "—"
                                                        : typeof stat === "object"
                                                            ? stat.value ?? "—"
                                                            : stat
                                            }
                                            badge={stat?.badge}
                                            icon={Icon}
                                            alert={config.alert}
                                        />
                                    );
                                }
                            )}
                        </section>

                        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.9fr)]">
                            <section className="dashboard-panel min-w-0 overflow-hidden rounded-xl border border-[#E9E5DA] bg-[#FBF9F1] shadow-sm">
                                <PanelHeader
                                    title="Distribution Network"
                                    description="Map and alerts supplied by your dashboard API."
                                    action={
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAttentionOnly((value) => !value);
                                                onFilter?.();
                                            }}
                                            className={`flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-2 font-app-body text-[9px] transition ${attentionOnly
                                                ? "border-[#A9430B] bg-[#FCE7DF] text-[#A9430B]"
                                                : "border-[#E9E5DA] text-[#6D625A] hover:bg-[#F0EEE5]"
                                                }`}
                                        >
                                            <Filter size={12} />
                                            {attentionOnly ? "Urgent only" : "Filter tasks"}
                                        </button>
                                    }
                                />

                                <div className="h-[300px] border-t border-[#E9E5DA] sm:h-[340px] xl:h-[390px]">
                                    {loading && !dashboard ? (
                                        <div className="grid h-full place-items-center">
                                            <p className="font-body text-sm text-[#806D61]">
                                                Loading distribution data…
                                            </p>
                                        </div>
                                    ) : (
                                        <DistributionMap
                                            mapUrl={dashboard?.mapUrl}
                                            alerts={alerts}
                                        />
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#E9E5DA] px-4 py-3 font-app-body text-[9px] text-[#76695F]">
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-[#1BAA78]" />
                                        Active
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-[#FF6D29]" />
                                        Network
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-[#D94736]" />
                                        Attention needed
                                    </span>

                                    <button
                                        type="button"
                                        onClick={onFilter}
                                        className="ml-auto flex items-center gap-1 text-[#A9430B]"
                                    >
                                        View network <ArrowUpRight size={11} />
                                    </button>
                                </div>
                            </section>

                            <aside className="dashboard-panel min-w-0 overflow-hidden rounded-xl border border-[#E9E5DA] bg-[#F0EEE5] shadow-sm">
                                <div className="bg-[#FBF9F1] px-4 py-4 md:px-5">
                                    <div className="flex items-center justify-between gap-2">
                                        <h2 className="font-app-heading text-base font-bold text-[#171717]">
                                            Pending Tasks
                                        </h2>

                                        <span className="rounded-full bg-[#FCE7DF] px-2 py-1 font-app-body text-[8px] font-bold text-[#A9430B]">
                                            {loading ? "…" : visibleTasks.length}{" "}
                                            pending
                                        </span>
                                    </div>

                                    <p className="mt-1 font-body text-[10px] text-[#806D61]">
                                        Tasks retrieved from the backend.
                                    </p>

                                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#E9E5DA] bg-white px-3 py-2">
                                        <Search
                                            size={13}
                                            className="shrink-0 text-[#8A7A6E]"
                                        />

                                        <input
                                            type="search"
                                            value={searchTerm}
                                            onChange={(event) =>
                                                handleSearch(event.target.value)
                                            }
                                            placeholder="Search tasks…"
                                            aria-label="Search tasks"
                                            className="w-full bg-transparent font-app-body text-xs text-[#433A34] outline-none placeholder:text-[#A99C90]"
                                        />
                                    </div>
                                </div>

                                <div className="max-h-[430px] space-y-3 overflow-y-auto p-3 md:p-4">
                                    {loading && !dashboard ? (
                                        <p className="py-8 text-center font-body text-xs text-[#806D61]">
                                            Loading tasks…
                                        </p>
                                    ) : visibleTasks.length > 0 ? (
                                        visibleTasks.map((task, index) => (
                                            <TaskCard
                                                key={
                                                    task.id ??
                                                    task._id ??
                                                    `${task.title}-${index}`
                                                }
                                                task={task}
                                                onReview={handleReview}
                                            />
                                        ))
                                    ) : (
                                        <EmptyState
                                            message={
                                                searchTerm
                                                    ? "Try another search term."
                                                    : attentionOnly
                                                        ? "There are no urgent tasks."
                                                        : "There are no pending tasks."
                                            }
                                        />
                                    )}
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
                            <span>HungerBridge Admin Console</span>

                            <span>
                                {lastSynced
                                    ? `Last fetched at ${lastSynced}`
                                    : "Waiting for dashboard data"}
                            </span>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
};
