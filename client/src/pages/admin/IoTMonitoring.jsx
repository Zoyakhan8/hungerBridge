
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Activity,
    AlertTriangle,
    Box,
    CheckCircle2,
    Clock3,
    Droplets,
    RefreshCw,
    Search,
    Thermometer,
    Wifi,
    WifiOff,
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

const formatReading = (value, unit) =>
    value === null || value === undefined ? "—" : `${value}${unit}`;

const statusStyles = {
    online: "bg-emerald-100 text-emerald-800",
    offline: "bg-red-100 text-red-800",
    inactive: "bg-gray-200 text-gray-700",
    pending: "bg-amber-100 text-amber-800",
    assigned: "bg-blue-100 text-blue-800",
    in_transit: "bg-violet-100 text-violet-800",
    delivered: "bg-emerald-100 text-emerald-800",
};

function StatusBadge({ status }) {
    const normalized = String(status || "unknown").toLowerCase();

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[normalized] || "bg-gray-100 text-gray-700"
                }`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {normalized.replaceAll("_", " ")}
        </span>
    );
}

function MetricCard({ title, value, subtitle, icon: Icon, iconColor }) {
    return (
        <div className="rounded-2xl border border-[#E8E2D6] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-medium text-[#76695F]">{title}</p>
                    <p className="mt-3 text-3xl font-extrabold text-[#3A2B22]">
                        {value}
                    </p>
                    <p className="mt-2 text-[11px] text-[#8A7D72]">
                        {subtitle}
                    </p>
                </div>
                <div className={`rounded-xl bg-[#F8F4EC] p-3 ${iconColor}`}>
                    <Icon size={21} />
                </div>
            </div>
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

    const fetchMonitoringData = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        setError("");

        try {
            const [overviewResponse, boxesResponse, alertsResponse] =
                await Promise.all([
                    fetch(`${API_URL}/overview`, { credentials: "include" }),
                    fetch(`${API_URL}/boxes`, { credentials: "include" }),
                    fetch(`${API_URL}/alerts`, { credentials: "include" }),
                ]);

            if (
                overviewResponse.status === 401 ||
                overviewResponse.status === 403 ||
                boxesResponse.status === 401 ||
                boxesResponse.status === 403 ||
                alertsResponse.status === 401 ||
                alertsResponse.status === 403
            ) {
                throw new Error(
                    "You are not authorized to view IoT monitoring. Please sign in as an admin."
                );
            }


            const responses = [
                ["overview", overviewResponse],
                ["boxes", boxesResponse],
                ["alerts", alertsResponse],
            ];

            const failedResponse = responses.find(
                ([, response]) => !response.ok
            );

            if (failedResponse) {
                const [endpoint, response] = failedResponse;
                const responseBody = await response.text();

                console.error("IoT API request failed:", {
                    endpoint,
                    status: response.status,
                    body: responseBody,
                });

                throw new Error(
                    `${endpoint} request failed (${response.status}). Check the backend terminal and browser console.`
                );
            }


            const [overviewResult, boxesResult, alertsResult] =
                await Promise.all([
                    overviewResponse.json(),
                    boxesResponse.json(),
                    alertsResponse.json(),
                ]);

            if (
                !overviewResult.success ||
                !boxesResult.success ||
                !alertsResult.success
            ) {
                throw new Error("The server returned an unsuccessful response.");
            }

            setOverview(overviewResult.data);
            setBoxes(boxesResult.data);
            setAlerts(alertsResult.data);
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchMonitoringData();
    }, [fetchMonitoringData]);

    const filteredBoxes = useMemo(() => {
        const query = search.trim().toLowerCase();

        return boxes.filter((box) => {
            const matchesStatus =
                statusFilter === "all" || box.status === statusFilter;

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
                    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B64B0C]">
                                ZeroWaste Box · Device Control
                            </p>
                            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                                IoT Monitoring
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-[#76695F]">
                                Monitor box connectivity, food storage
                                conditions, donation assignments and device alerts.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => fetchMonitoringData(true)}
                            disabled={loading || refreshing}
                            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#FF6D29] px-4 py-3 text-xs font-bold text-[#3A1B0D] transition hover:bg-[#F45B18] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
                        >
                            <RefreshCw
                                size={15}
                                className={refreshing ? "animate-spin" : ""}
                            />
                            {refreshing ? "Refreshing..." : "Refresh data"}
                        </button>
                    </section>

                    {error && (
                        <div
                            role="alert"
                            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <p>{error}</p>
                            <button
                                type="button"
                                onClick={() => fetchMonitoringData(true)}
                                className="self-start font-bold underline"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricCard
                            title="Registered Boxes"
                            value={loading ? "—" : overview.totalBoxes}
                            subtitle="All registered devices"
                            icon={Box}
                            iconColor="text-[#B64B0C]"
                        />
                        <MetricCard
                            title="Online"
                            value={loading ? "—" : overview.onlineBoxes}
                            subtitle="Heartbeat received recently"
                            icon={Wifi}
                            iconColor="text-emerald-700"
                        />
                        <MetricCard
                            title="Offline"
                            value={loading ? "—" : overview.offlineBoxes}
                            subtitle="No recent heartbeat or inactive"
                            icon={WifiOff}
                            iconColor="text-red-700"
                        />
                        <MetricCard
                            title="Active Alerts"
                            value={loading ? "—" : overview.activeAlerts}
                            subtitle="Alerts needing attention"
                            icon={AlertTriangle}
                            iconColor="text-amber-700"
                        />
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-[#E8E2D6] bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-[#EEE9DF] p-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="font-bold">Registered ZeroWaste Boxes</h2>
                                <p className="mt-1 text-xs text-[#8A7D72]">
                                    Latest available readings and linked donations
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative">
                                    <Search
                                        size={15}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A7D72]"
                                    />
                                    <input
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Search box, donor, food..."
                                        className="w-full rounded-xl border border-[#E5DED2] bg-[#FFFEFA] py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#FF6D29] sm:w-64"
                                    />
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(event.target.value)
                                    }
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
                            <div className="p-12 text-center text-sm text-[#8A7D72]">
                                Loading IoT monitoring data...
                            </div>
                        ) : filteredBoxes.length === 0 ? (
                            <div className="flex flex-col items-center px-5 py-14 text-center">
                                <div className="rounded-2xl bg-[#F8F4EC] p-4 text-[#B64B0C]">
                                    <Box size={30} />
                                </div>
                                <h3 className="mt-4 font-bold">
                                    {boxes.length === 0
                                        ? "No boxes registered yet"
                                        : "No matching boxes"}
                                </h3>
                                <p className="mt-2 max-w-md text-xs leading-5 text-[#8A7D72]">
                                    {boxes.length === 0
                                        ? "Once a ZeroWaste Box is registered and linked to a donation, its connectivity and sensor readings will appear here."
                                        : "Try changing your search term or status filter."}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1100px] text-left">
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
                                        {filteredBoxes.map((box) => {
                                            const reading = box.latestReading;

                                            return (
                                                <tr
                                                    key={box.id}
                                                    className="transition hover:bg-[#FFFEFA]"
                                                >
                                                    <td className="px-5 py-4">
                                                        <p className="font-bold">
                                                            {box.boxCode}
                                                        </p>
                                                        <p className="mb-2 mt-1 text-[10px] text-[#8A7D72]">
                                                            Box #{box.id}
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
                                                                {formatReading(
                                                                    reading?.temperature,
                                                                    "°C"
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 flex items-center gap-2 text-xs">
                                                            <Droplets
                                                                size={15}
                                                                className="text-blue-600"
                                                            />
                                                            <span>
                                                                {formatReading(
                                                                    reading?.humidity,
                                                                    "%"
                                                                )}
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
                                                            Reading:{" "}
                                                            {formatDate(reading?.recordedAt)}
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <p className="text-xs font-semibold">
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
                                                                {box.donationStatus.replaceAll(
                                                                    "_",
                                                                    " "
                                                                )}
                                                            </p>
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 text-xs">
                                                        {box.ngoName || "Not assigned"}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <p className="text-xs">
                                                            {box.deliveryPartnerName ||
                                                                "Not assigned"}
                                                        </p>
                                                        {box.deliveryStatus && (
                                                            <div className="mt-2">
                                                                <StatusBadge
                                                                    status={box.deliveryStatus}
                                                                />
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
                            <div className="border-t border-[#EEE9DF] px-5 py-3 text-[10px] text-[#8A7D72]">
                                Showing {filteredBoxes.length} of {boxes.length} boxes
                            </div>
                        )}
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-[#E8E2D6] bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-[#EEE9DF] p-5">
                            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h2 className="font-bold">Device Alerts</h2>
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
                                    size={28}
                                    className="text-emerald-600"
                                />
                                <p className="mt-3 text-sm font-semibold">
                                    No alerts recorded
                                </p>
                                <p className="mt-1 text-xs text-[#8A7D72]">
                                    Alerts will appear here when the backend starts recording device events.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#F0EBE2]">
                                {alerts.map((alert) => (
                                    <div
                                        key={alert.id}
                                        className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between"
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-0.5 rounded-lg bg-[#FFF3E9] p-2 text-[#B64B0C]">
                                                <Activity size={17} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">
                                                    {alert.boxCode} · {alert.alertType}
                                                </p>
                                                <p className="mt-1 text-xs leading-5 text-[#76695F]">
                                                    {alert.message}
                                                </p>
                                                <p className="mt-2 text-[10px] text-[#8A7D72]">
                                                    {formatDate(alert.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2">
                                            <StatusBadge status={alert.severity} />
                                            <StatusBadge status={alert.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <p className="text-center text-[10px] text-[#8A7D72]">
                        ZeroWaste Box monitoring · Sensor values appear when devices submit readings.
                    </p>
                </div>
            </main>
        </div>
    );
}
