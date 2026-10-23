
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Activity,
    AlertTriangle,
    Box,
    CheckCircle2,
    Clock3,
    Droplets,
    Plus,
    RefreshCw,
    Search,
    Thermometer,
    Wifi,
    WifiOff,
    X,
    Copy,
    ArrowUpRight,
    Cpu,
    PackageCheck,
} from "lucide-react";

import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

const API_URL = "/api/admin/monitoring";

const formatDate = (value) => {
    if (!value) return "Never";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatReading = (value, unit = "") =>
    value === null || value === undefined || value === ""
        ? "—"
        : `${value}${unit}`;

const statusStyles = {
    online: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    offline: "bg-red-50 text-red-700 ring-red-200",
    inactive: "bg-slate-100 text-slate-600 ring-slate-200",
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    assigned: "bg-blue-50 text-blue-700 ring-blue-200",
    in_transit: "bg-violet-50 text-violet-700 ring-violet-200",
    delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    critical: "bg-red-50 text-red-700 ring-red-200",
    warning: "bg-amber-50 text-amber-700 ring-amber-200",
    resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    unknown: "bg-slate-100 text-slate-600 ring-slate-200",
};

function StatusBadge({ status }) {
    const normalized = String(status || "unknown").toLowerCase();
    const style = statusStyles[normalized] || statusStyles.unknown;

    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ring-1 ring-inset ${style}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {normalized.replaceAll("_", " ")}
        </span>
    );
}

function MetricCard({ title, value, subtitle, icon: Icon, color, loading }) {
    return (
        <article className="group rounded-2xl border border-[#EAE4D9] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#85766A]">
                        {title}
                    </p>
                    <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#38281F]">
                        {loading ? "—" : value ?? 0}
                    </p>
                    <p className="mt-2 text-[11px] leading-4 text-[#9A8D81]">
                        {subtitle}
                    </p>
                </div>

                <div className={`rounded-xl p-3 transition group-hover:scale-105 ${color}`}>
                    <Icon size={21} />
                </div>
            </div>
        </article>
    );
}

function RegisterBoxModal({
    onClose,
    onRegister,
    registering,
    error,
    message,
    deviceSecret,
    boxCode,
    setBoxCode,
}) {
    const [copied, setCopied] = useState(false);

    const copySecret = async () => {
        if (!deviceSecret) return;

        try {
            await navigator.clipboard.writeText(deviceSecret);
            setCopied(true);
        } catch {
            // The secret remains visible for manual copying.
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#24170F]/55 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="register-box-title"
                className="my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-[#EEE5D8] bg-[#FFFEFA] shadow-2xl"
            >
                <div className="relative overflow-hidden bg-[#38281F] p-6 text-white sm:p-7">
                    <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-[#FF6D29]/20 blur-2xl" />

                    <div className="relative flex items-start justify-between gap-4">
                        <div>
                            <div className="mb-4 inline-flex rounded-xl bg-white/10 p-3 text-[#FF985E]">
                                <Cpu size={24} />
                            </div>
                            <h2
                                id="register-box-title"
                                className="text-xl font-extrabold"
                            >
                                Register a new box
                            </h2>
                            <p className="mt-2 max-w-sm text-xs leading-5 text-white/65">
                                Add your ZeroWaste Box to the monitoring
                                system and prepare it for device integration.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close registration"
                            className="rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <form onSubmit={onRegister} className="space-y-5 p-6 sm:p-7">
                    <div className="rounded-xl border border-[#EEE5D8] bg-[#F8F4EC] p-4">
                        <div className="flex items-start gap-3">
                            <Box
                                size={19}
                                className="mt-0.5 shrink-0 text-[#B64B0C]"
                            />
                            <div>
                                <p className="text-xs font-bold text-[#49352A]">
                                    Before you begin
                                </p>
                                <p className="mt-1 text-[11px] leading-5 text-[#85766A]">
                                    Choose a unique code for each physical box,
                                    such as BOX-001 or ESP32-001.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="register-box-code"
                            className="mb-2 block text-xs font-bold text-[#49352A]"
                        >
                            Box ID <span className="text-red-500">*</span>
                        </label>

                        <input
                            id="register-box-code"
                            type="text"
                            value={boxCode}
                            onChange={(event) => setBoxCode(event.target.value)}
                            placeholder="e.g. BOX-001"
                            autoComplete="off"
                            maxLength={50}
                            required
                            autoFocus
                            className="w-full rounded-xl border border-[#E5DCCF] bg-white px-4 py-3.5 text-sm font-semibold text-[#38281F] outline-none transition placeholder:font-normal placeholder:text-[#B0A396] focus:border-[#FF6D29] focus:ring-4 focus:ring-[#FF6D29]/10"
                        />
                        <p className="mt-2 text-[10px] text-[#9A8D81]">
                            Letters, numbers, hyphens and underscores are allowed.
                        </p>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700"
                        >
                            <AlertTriangle size={17} className="mt-0.5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {message && (
                        <div
                            role="status"
                            className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
                        >
                            <div className="flex items-start gap-2 text-sm font-bold text-emerald-800">
                                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                                <span>{message}</span>
                            </div>

                            {deviceSecret && (
                                <div className="mt-3">
                                    <p className="mb-2 text-[11px] leading-5 text-emerald-800">
                                        Save this device secret securely. It may
                                        only be displayed once.
                                    </p>

                                    <input
                                        readOnly
                                        value={deviceSecret}
                                        aria-label="Device secret"
                                        className="w-full rounded-lg border border-emerald-200 bg-white p-2 font-mono text-[10px] text-slate-700"
                                    />

                                    <button
                                        type="button"
                                        onClick={copySecret}
                                        className="mt-2 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                                    >
                                        <Copy size={14} />
                                        {copied ? "Copied" : "Copy device secret"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col-reverse gap-3 border-t border-[#EEE5D8] pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-[#E5DCCF] px-5 py-3 text-xs font-bold text-[#6D5C50] transition hover:bg-[#F8F4EC]"
                        >
                            Close
                        </button>

                        <button
                            type="submit"
                            disabled={registering}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6D29] px-5 py-3 text-xs font-extrabold text-[#3A1B0D] shadow-sm transition hover:bg-[#F45B18] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {registering ? (
                                <>
                                    <RefreshCw size={15} className="animate-spin" />
                                    Registering...
                                </>
                            ) : (
                                <>
                                    <Plus size={16} />
                                    Register box
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export const IoTMonitoring = () => {
    const [overview, setOverview] = useState({
        totalBoxes: 0,
        onlineBoxes: 0,
        offlineBoxes: 0,
        activeAlerts: 0,
    });

    const [boxes, setBoxes] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);

    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [boxCode, setBoxCode] = useState("");
    const [registering, setRegistering] = useState(false);
    const [registrationError, setRegistrationError] = useState("");
    const [registrationMessage, setRegistrationMessage] = useState("");
    const [deviceSecret, setDeviceSecret] = useState("");

    const fetchMonitoringData = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        setError("");

        try {
            const responses = await Promise.all([
                fetch(`${API_URL}/overview`, { credentials: "include" }),
                fetch(`${API_URL}/boxes`, { credentials: "include" }),
                fetch(`${API_URL}/alerts`, { credentials: "include" }),
            ]);

            const names = ["overview", "boxes", "alerts"];

            for (let index = 0; index < responses.length; index++) {
                const response = responses[index];

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        throw new Error(
                            "You are not authorized to view IoT monitoring. Please sign in as an admin."
                        );
                    }

                    const body = await response.text();
                    console.error(`${names[index]} API error:`, body);

                    throw new Error(
                        `${names[index]} request failed (${response.status}).`
                    );
                }
            }

            const [overviewResult, boxesResult, alertsResult] =
                await Promise.all(responses.map((response) => response.json()));

            if (
                !overviewResult.success ||
                !boxesResult.success ||
                !alertsResult.success
            ) {
                throw new Error("The server returned an unsuccessful response.");
            }

            setOverview(overviewResult.data ?? {});
            setBoxes(Array.isArray(boxesResult.data) ? boxesResult.data : []);
            setAlerts(Array.isArray(alertsResult.data) ? alertsResult.data : []);
        } catch (err) {
            console.error("IoT monitoring:", err);
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchMonitoringData();
    }, [fetchMonitoringData]);

    const handleRegister = async (event) => {
        event.preventDefault();

        const normalizedCode = boxCode.trim().toUpperCase();

        if (!/^[A-Z0-9_-]{3,50}$/.test(normalizedCode)) {
            setRegistrationError(
                "Enter a valid box ID using 3–50 letters, numbers, hyphens or underscores."
            );
            setRegistrationMessage("");
            return;
        }

        setRegistering(true);
        setRegistrationError("");
        setRegistrationMessage("");
        setDeviceSecret("");

        try {
            const response = await fetch(`${API_URL}/boxes/register`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ boxCode: normalizedCode }),
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok || result.success === false) {
                throw new Error(
                    result.message ||
                    result.error ||
                    `Registration failed (${response.status}).`
                );
            }

            const secret =
                result.deviceSecret ??
                result.data?.deviceSecret ??
                result.box?.deviceSecret ??
                result.data?.box?.deviceSecret ??
                "";

            setRegistrationMessage(
                result.message || `Box ${normalizedCode} registered successfully.`
            );
            setDeviceSecret(secret);
            setBoxCode("");

            await fetchMonitoringData(true);
        } catch (err) {
            console.error("Box registration error:", err);
            setRegistrationError(
                err.message || "Could not register the box."
            );
        } finally {
            setRegistering(false);
        }
    };

    const filteredBoxes = useMemo(() => {
        const query = search.trim().toLowerCase();

        return boxes.filter((box) => {
            const status = String(box.status || "unknown").toLowerCase();

            const matchesStatus =
                statusFilter === "all" || status === statusFilter;

            const searchableText = [
                box.boxCode,
                box.foodName,
                box.donorName,
                box.donorCompany,
                box.donorShop,
                box.ngoName,
                box.deliveryPartnerName,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return matchesStatus && searchableText.includes(query);
        });
    }, [boxes, search, statusFilter]);

    const onlineCount = overview.onlineBoxes ??
        boxes.filter((box) => String(box.status).toLowerCase() === "online").length;

    return (
        <div className="min-h-screen bg-[#F8F7F2] text-[#3A2B22] md:flex">
            <AdminSidebar
                mobileOpen={mobileOpen}
                onNavigate={() => setMobileOpen(false)}
            />

            <main className="min-w-0 flex-1">
                <AdminHeader
                    onMenuClick={() => setMobileOpen(true)}
                    showSearch={false}
                />

                <div className="mx-auto max-w-[1600px] space-y-7 p-4 sm:p-6 lg:p-8">
                    {/* PAGE HEADER */}
                    <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[#EAE4D9] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#B64B0C]">
                                <span className="h-2 w-2 rounded-full bg-[#FF6D29]" />
                                ZeroWaste Box · Device Control
                            </div>

                            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                                IoT Monitoring
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#76695F]">
                                Manage your smart food-storage boxes, monitor
                                sensor readings and track connected donations.
                            </p>

                            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-[#85766A]">
                                <span className="inline-flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                    {loading ? "Checking devices..." : `${onlineCount} online`}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-[#C8BBAA]" />
                                <span>{boxes.length} registered devices</span>
                            </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => fetchMonitoringData(true)}
                                disabled={loading || refreshing}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5DCCF] bg-white px-4 py-3 text-xs font-bold text-[#5D4A3C] transition hover:bg-[#F8F4EC] disabled:opacity-50"
                            >
                                <RefreshCw
                                    size={15}
                                    className={refreshing ? "animate-spin" : ""}
                                />
                                Refresh
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setRegistrationError("");
                                    setRegistrationMessage("");
                                    setDeviceSecret("");
                                    setBoxCode("");
                                    setShowRegisterForm(true);
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6D29] px-5 py-3 text-xs font-extrabold text-[#3A1B0D] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#F45B18] hover:shadow-md"
                            >
                                <Plus size={17} strokeWidth={2.5} />
                                Register Box
                            </button>
                        </div>
                    </section>

                    {error && (
                        <div
                            role="alert"
                            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="flex items-start gap-2">
                                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                                <p>{error}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => fetchMonitoringData(true)}
                                className="self-start font-bold underline"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {/* METRICS */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricCard
                            title="Registered Boxes"
                            value={overview.totalBoxes ?? boxes.length}
                            subtitle="All registered devices"
                            icon={Box}
                            color="bg-orange-50 text-[#B64B0C]"
                            loading={loading}
                        />
                        <MetricCard
                            title="Online"
                            value={onlineCount}
                            subtitle="Devices reporting recently"
                            icon={Wifi}
                            color="bg-emerald-50 text-emerald-700"
                            loading={loading}
                        />
                        <MetricCard
                            title="Offline"
                            value={overview.offlineBoxes ??
                                boxes.filter((box) => box.status === "offline").length}
                            subtitle="Devices not reporting"
                            icon={WifiOff}
                            color="bg-red-50 text-red-700"
                            loading={loading}
                        />
                        <MetricCard
                            title="Active Alerts"
                            value={overview.activeAlerts ?? alerts.length}
                            subtitle="Events requiring attention"
                            icon={AlertTriangle}
                            color="bg-amber-50 text-amber-700"
                            loading={loading}
                        />
                    </section>

                    {/* REGISTERED BOXES */}
                    <section className="overflow-hidden rounded-2xl border border-[#EAE4D9] bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-[#EEE9DF] p-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="font-extrabold">
                                        Registered ZeroWaste Boxes
                                    </h2>
                                    <span className="rounded-full bg-[#F8F4EC] px-2.5 py-1 text-[10px] font-bold text-[#8B5B3E]">
                                        {boxes.length}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-[#8A7D72]">
                                    Sensor readings, connectivity and linked donations
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <div className="relative">
                                    <Search
                                        size={15}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A7D72]"
                                    />
                                    <input
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Search box, donor, food..."
                                        className="w-full rounded-xl border border-[#E5DED2] bg-[#FFFEFA] py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-[#FF6D29] focus:ring-2 focus:ring-[#FF6D29]/10 sm:w-64"
                                    />
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(event) => setStatusFilter(event.target.value)}
                                    aria-label="Filter by device status"
                                    className="rounded-xl border border-[#E5DED2] bg-[#FFFEFA] px-3 py-2.5 text-xs outline-none focus:border-[#FF6D29]"
                                >
                                    <option value="all">All statuses</option>
                                    <option value="online">Online</option>
                                    <option value="offline">Offline</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center">
                                <RefreshCw
                                    size={23}
                                    className="mx-auto animate-spin text-[#B64B0C]"
                                />
                                <p className="mt-3 text-sm text-[#8A7D72]">
                                    Loading monitoring data...
                                </p>
                            </div>
                        ) : filteredBoxes.length === 0 ? (
                            <div className="flex flex-col items-center px-5 py-14 text-center">
                                <div className="rounded-2xl bg-[#F8F4EC] p-4 text-[#B64B0C]">
                                    <Box size={30} />
                                </div>

                                <h3 className="mt-4 font-extrabold">
                                    {boxes.length === 0
                                        ? "No boxes registered yet"
                                        : "No matching boxes"}
                                </h3>

                                <p className="mt-2 max-w-md text-xs leading-5 text-[#8A7D72]">
                                    {boxes.length === 0
                                        ? "Register your first ZeroWaste Box to start managing its device record and monitoring its readings."
                                        : "Try another search term or choose a different status."}
                                </p>

                                {boxes.length === 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRegistrationError("");
                                            setRegistrationMessage("");
                                            setDeviceSecret("");
                                            setBoxCode("");
                                            setShowRegisterForm(true);
                                        }}
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#FF6D29] px-5 py-3 text-xs font-extrabold text-[#3A1B0D] transition hover:bg-[#F45B18]"
                                    >
                                        <Plus size={16} />
                                        Register your first box
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1050px] text-left">
                                    <thead className="bg-[#FAF8F1] text-[10px] uppercase tracking-wider text-[#76695F]">
                                        <tr>
                                            <th className="px-5 py-4">Box / Status</th>
                                            <th className="px-5 py-4">Sensors</th>
                                            <th className="px-5 py-4">Last heartbeat</th>
                                            <th className="px-5 py-4">Donation / Donor</th>
                                            <th className="px-5 py-4">NGO</th>
                                            <th className="px-5 py-4">Delivery partner</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-[#F0EBE2]">
                                        {filteredBoxes.map((box, index) => {
                                            const reading = box.latestReading;

                                            return (
                                                <tr
                                                    key={box.id ?? box.boxCode ?? index}
                                                    className="transition hover:bg-[#FFFEFA]"
                                                >
                                                    <td className="px-5 py-4">
                                                        <p className="text-xs font-extrabold">
                                                            {box.boxCode || "Unnamed box"}
                                                        </p>
                                                        <p className="mb-2 mt-1 text-[10px] text-[#8A7D72]">
                                                            Box #{box.id ?? "—"}
                                                        </p>
                                                        <StatusBadge status={box.status} />
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <Thermometer
                                                                size={15}
                                                                className="text-[#B64B0C]"
                                                            />
                                                            <span>
                                                                {formatReading(reading?.temperature, "°C")}
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 flex items-center gap-2 text-xs">
                                                            <Droplets
                                                                size={15}
                                                                className="text-blue-600"
                                                            />
                                                            <span>
                                                                {formatReading(reading?.humidity, "%")}
                                                            </span>
                                                        </div>
                                                        <p className="mt-2 text-[10px] text-[#8A7D72]">
                                                            Door:{" "}
                                                            {reading?.doorOpen === true
                                                                ? "Open"
                                                                : reading?.doorOpen === false
                                                                    ? "Closed"
                                                                    : "—"}
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <Clock3
                                                                size={14}
                                                                className="text-[#8A7D72]"
                                                            />
                                                            {formatDate(box.lastSeenAt)}
                                                        </div>
                                                        <p className="mt-2 text-[10px] text-[#8A7D72]">
                                                            Reading: {formatDate(reading?.recordedAt)}
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <p className="text-xs font-bold">
                                                            {box.foodName || "Unassigned"}
                                                        </p>
                                                        <p className="mt-1 text-[11px] text-[#76695F]">
                                                            {box.donorName ||
                                                                box.donorCompany ||
                                                                box.donorShop ||
                                                                "No donor linked"}
                                                        </p>
                                                        {box.donationStatus && (
                                                            <p className="mt-2 text-[10px] capitalize text-[#8A7D72]">
                                                                {String(box.donationStatus).replaceAll("_", " ")}
                                                            </p>
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 text-xs">
                                                        {box.ngoName || "Not assigned"}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <p className="text-xs">
                                                            {box.deliveryPartnerName || "Not assigned"}
                                                        </p>
                                                        {box.deliveryStatus && (
                                                            <div className="mt-2">
                                                                <StatusBadge status={box.deliveryStatus} />
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {!loading && boxes.length > 0 && (
                            <div className="flex flex-col gap-2 border-t border-[#EEE9DF] px-5 py-3 text-[10px] text-[#8A7D72] sm:flex-row sm:items-center sm:justify-between">
                                <span>
                                    Showing {filteredBoxes.length} of {boxes.length} boxes
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <ArrowUpRight size={12} />
                                    Live readings depend on device submissions
                                </span>
                            </div>
                        )}
                    </section>

                    {/* DEVICE ALERTS */}
                    <section className="overflow-hidden rounded-2xl border border-[#EAE4D9] bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-[#EEE9DF] p-5">
                            <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h2 className="font-extrabold">Device Alerts</h2>
                                <p className="mt-1 text-xs text-[#8A7D72]">
                                    Sensor and connectivity events received by the backend
                                </p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-sm text-[#8A7D72]">
                                Loading alerts...
                            </div>
                        ) : alerts.length === 0 ? (
                            <div className="flex flex-col items-center px-5 py-10 text-center">
                                <CheckCircle2
                                    size={29}
                                    className="text-emerald-600"
                                />
                                <p className="mt-3 text-sm font-bold">
                                    All clear for now
                                </p>
                                <p className="mt-1 text-xs text-[#8A7D72]">
                                    Device alerts will appear here when recorded by your backend.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#F0EBE2]">
                                {alerts.map((alert, index) => (
                                    <div
                                        key={alert.id ?? index}
                                        className="flex flex-col gap-3 p-5 transition hover:bg-[#FFFEFA] sm:flex-row sm:items-start sm:justify-between"
                                    >
                                        <div className="flex min-w-0 gap-3">
                                            <div className="mt-0.5 rounded-lg bg-[#FFF3E9] p-2.5 text-[#B64B0C]">
                                                <Activity size={17} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold">
                                                    {alert.boxCode || "Device"}{" "}
                                                    · {alert.alertType || "Alert"}
                                                </p>
                                                <p className="mt-1 text-xs leading-5 text-[#76695F]">
                                                    {alert.message || "No additional details"}
                                                </p>
                                                <p className="mt-2 text-[10px] text-[#8A7D72]">
                                                    {formatDate(alert.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                                            <StatusBadge status={alert.severity} />
                                            <StatusBadge status={alert.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <footer className="flex flex-col items-center justify-between gap-2 pb-2 text-center text-[10px] text-[#9A8D81] sm:flex-row">
                        <span>ZeroWaste Box · IoT Device Management</span>
                        <span className="inline-flex items-center gap-1.5">
                            <PackageCheck size={13} />
                            Food safety monitoring dashboard
                        </span>
                    </footer>
                </div>
            </main>

            {showRegisterForm && (
                <RegisterBoxModal
                    onClose={() => setShowRegisterForm(false)}
                    onRegister={handleRegister}
                    registering={registering}
                    error={registrationError}
                    message={registrationMessage}
                    deviceSecret={deviceSecret}
                    boxCode={boxCode}
                    setBoxCode={setBoxCode}
                />
            )}
        </div>
    );
};

