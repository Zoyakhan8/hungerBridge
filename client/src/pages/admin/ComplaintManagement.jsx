
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import {
    AlertCircle,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Eye,
    Filter,
    LoaderCircle,
    MessageSquareWarning,
    RefreshCw,
    Search,
    ShieldCheck,
    X,
} from "lucide-react";

import {
    AdminSidebar,
    DEFAULT_ADMIN_NAVIGATION,
} from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

const STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "rejected", label: "Rejected" },
];

const CATEGORY_OPTIONS = [
    "General Inquiry",
    "Complaint",
    "Technical Issue",
    "Donation Issue",
    "Delivery Issue",
    "NGO Issue",
    "Feedback",
];

const STATUS_STYLES = {
    pending: "bg-[#FCE7DF] text-[#A9430B]",
    in_progress: "bg-[#FEF3C7] text-[#92400E]",
    resolved: "bg-[#DDF4E5] text-[#166534]",
    rejected: "bg-[#FDDAD6] text-[#B42318]",
};

const formatDate = (value) => {
    if (!value) return "—";

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

const statusLabel = (status) =>
    STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;

const StatCard = ({ label, value, icon: Icon, tone = "default" }) => {
    const styles = tone === "alert"
        ? "border-red-200 bg-[#FDDAD6] text-[#9F1515]"
        : tone === "success"
            ? "border-[#D4E8D8] bg-[#E6F2E7] text-[#25623B]"
            : "border-[#E9E6DB] bg-[#F0EEE5] text-[#111827]";

    return (
        <article className={`stat-card min-w-0 rounded-xl border p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${styles}`}>
            <div className="mb-3 grid h-8 w-8 place-items-center rounded-lg bg-white/80 text-[#A9430B]">
                <Icon size={17} />
            </div>
            <p className="mb-1 font-app-body text-[10px] tracking-wide opacity-80">
                {label}
            </p>
            <p className="font-app-heading text-[29px] font-bold leading-none tracking-tight">
                {value}
            </p>
        </article>
    );
};

const StatusBadge = ({ status }) => (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 font-app-body text-[9px] font-bold ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700"}`}>
        {statusLabel(status)}
    </span>
);

const PanelHeader = ({ title, description, action }) => (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E9E5DA] px-4 py-4 md:px-5">
        <div>
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

const DetailRow = ({ label, children }) => (
    <div className="grid grid-cols-1 gap-1 border-b border-[#EEEAE0] py-3 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-3">
        <p className="font-app-body text-[10px] font-semibold uppercase tracking-wide text-[#8A7A6E]">
            {label}
        </p>
        <div className="min-w-0 break-words font-app-body text-sm text-[#352B25]">
            {children}
        </div>
    </div>
);

export const ComplaintManagement = ({
    navigation = DEFAULT_ADMIN_NAVIGATION,
}) => {
    const pageRef = useRef(null);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [editStatus, setEditStatus] = useState("pending");
    const [adminNotes, setAdminNotes] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [actionMessage, setActionMessage] = useState("");
    const [actionError, setActionError] = useState("");

    const loadComplaints = useCallback(async () => {
        setIsLoading(true);
        setLoadError("");

        try {
            const response = await fetch("/api/admin/complaints", {
                method: "GET",
                credentials: "include",
                headers: { Accept: "application/json" },
            });

            const text = await response.text();
            let data = {};

            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                throw new Error("The server returned an invalid response.");
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    (response.status === 401 || response.status === 403
                        ? "Please sign in with an administrator account."
                        : "Unable to load complaints.")
                );
            }

            if (!Array.isArray(data.complaints)) {
                throw new Error("The server response did not contain a complaints list.");
            }

            setComplaints(data.complaints);
        } catch (error) {
            console.error("Load complaints error:", error);
            setLoadError(error.message || "Unable to load complaints.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadComplaints();
    }, [loadComplaints]);

    useEffect(() => {
        const context = gsap.context(() => {
            gsap.from(".complaint-header", {
                y: -10,
                opacity: 0,
                duration: 0.4,
                ease: "power2.out",
            });

            gsap.from(".stat-card", {
                y: 12,
                opacity: 0,
                duration: 0.35,
                stagger: 0.01,
                ease: "power2.out",
            });

            gsap.from(".complaint-panel", {
                y: 14,
                opacity: 0,
                duration: 0.4,
                delay: 0.1,
                ease: "power2.out",
            });
        }, pageRef);

        return () => context.revert();
    }, []);

    const counts = useMemo(() => ({
        total: complaints.length,
        pending: complaints.filter((item) => item.status === "pending").length,
        inProgress: complaints.filter((item) => item.status === "in_progress").length,
        resolved: complaints.filter((item) => item.status === "resolved").length,
    }), [complaints]);

    const filteredComplaints = useMemo(() => {
        const term = search.trim().toLowerCase();

        return complaints.filter((item) => {
            const matchesStatus =
                statusFilter === "all" || item.status === statusFilter;

            const matchesCategory =
                categoryFilter === "all" || item.category === categoryFilter;

            const searchable = [
                item.name,
                item.email,
                item.phoneNumber,
                item.subject,
                item.message,
                item.category,
                item.publicId,
                item.id,
            ].filter(Boolean).join(" ").toLowerCase();

            return matchesStatus && matchesCategory && (!term || searchable.includes(term));
        });
    }, [complaints, search, statusFilter, categoryFilter]);

    const openDetails = (complaint) => {
        setSelectedComplaint(complaint);
        setEditStatus(complaint.status);
        setAdminNotes(complaint.adminNotes ?? "");
        setActionMessage("");
        setActionError("");
    };

    const saveComplaint = async (event) => {
        event.preventDefault();

        if (!selectedComplaint || isSaving) return;

        setIsSaving(true);
        setActionMessage("");
        setActionError("");

        try {
            const response = await fetch(
                `/api/admin/complaints/${selectedComplaint.id}/status`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        status: editStatus,
                        adminNotes,
                    }),
                }
            );

            const text = await response.text();
            let data = {};

            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                throw new Error("The server returned an invalid response.");
            }

            if (!response.ok) {
                throw new Error(data.message || "Unable to update this complaint.");
            }

            if (!data.complaint) {
                throw new Error("The server did not return the updated complaint.");
            }

            setComplaints((previous) =>
                previous.map((item) =>
                    item.id === data.complaint.id ? data.complaint : item
                )
            );

            setSelectedComplaint(data.complaint);
            setEditStatus(data.complaint.status);
            setAdminNotes(data.complaint.adminNotes ?? "");
            setActionMessage("Complaint updated successfully.");
        } catch (error) {
            console.error("Update complaint error:", error);
            setActionError(error.message || "Unable to update this complaint.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSearch = (value) => {
        setSearch(value ?? "");
    };

    return (
        <div ref={pageRef} className="min-h-screen bg-[#FBF9F1] text-[#2D3436]">
            <div className="mx-auto flex min-h-screen max-w-[1600px] overflow-hidden bg-[#FBF9F1] shadow-[0_12px_35px_rgba(48,40,20,0.08)]">
                <AdminSidebar
                    items={navigation}
                    mobileOpen={mobileOpen}
                    onNavigate={() => setMobileOpen(false)}
                />

                <main className="min-w-0 flex-1">
                    <AdminHeader
                        onMenuClick={() => setMobileOpen((open) => !open)}
                        onSearch={handleSearch}
                        searchPlaceholder="Search complaints..."
                    />

                    <div className="px-4 py-6 md:px-8 md:py-8">
                        <div className="complaint-header mb-7 flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <div className="mb-2 flex items-center gap-2 font-app-body text-[9px] font-bold tracking-[0.14em] text-[#A9430B]">
                                    <MessageSquareWarning size={13} />
                                    SUPPORT CENTER
                                </div>
                                <h1 className="font-app-heading text-[23px] font-bold tracking-tight text-[#111827] md:text-[26px]">
                                    Complaint Management
                                </h1>
                                <p className="mt-1 max-w-xl font-body text-[11px] leading-relaxed text-[#806D61]">
                                    Review contact requests, investigate reported issues, and keep resolution notes in one place.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={loadComplaints}
                                disabled={isLoading}
                                className="inline-flex items-center gap-2 rounded-md border border-[#E7E1D6] bg-white/70 px-3 py-2 font-app-body text-[10px] font-semibold text-[#6D625A] transition hover:bg-white disabled:opacity-60"
                            >
                                <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
                                Refresh
                            </button>
                        </div>

                        <section aria-label="Complaint statistics" className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <StatCard label="Total Submissions" value={counts.total} icon={MessageSquareWarning} />
                            <StatCard label="Pending Review" value={counts.pending} icon={Clock3} tone="alert" />
                            <StatCard label="In Progress" value={counts.inProgress} icon={AlertCircle} />
                            <StatCard label="Resolved" value={counts.resolved} icon={CheckCircle2} tone="success" />
                        </section>

                        <section className="complaint-panel min-w-0 overflow-hidden rounded-xl border border-[#E9E5DA] bg-[#FBF9F1] shadow-sm">
                            <PanelHeader
                                title="Submitted Requests"
                                description={`${filteredComplaints.length} result${filteredComplaints.length === 1 ? "" : "s"} · Newest first`}
                                action={
                                    <span className="inline-flex items-center gap-1 rounded-full border border-[#E9E5DA] bg-white/70 px-2.5 py-1.5 font-app-body text-[9px] text-[#76695F]">
                                        <ShieldCheck size={11} />
                                        Admin view
                                    </span>
                                }
                            />

                            <div className="flex flex-col gap-3 border-b border-[#E9E5DA] bg-[#F7F5ED] p-4 md:flex-row md:items-center">
                                <label className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-[#E9E5DA] bg-white px-3 py-2">
                                    <Search size={13} className="shrink-0 text-[#8A7A6E]" />
                                    <input
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Search name, email, subject..."
                                        className="w-full min-w-0 bg-transparent font-app-body text-[11px] text-[#443A33] outline-none placeholder:text-[#9A8E83]"
                                    />
                                </label>

                                <label className="flex items-center gap-2 rounded-md border border-[#E9E5DA] bg-white px-3 py-2">
                                    <Filter size={12} className="shrink-0 text-[#8A7A6E]" />
                                    <span className="font-app-body text-[10px] text-[#806D61]">Status</span>
                                    <select
                                        value={statusFilter}
                                        onChange={(event) => setStatusFilter(event.target.value)}
                                        className="max-w-[145px] bg-transparent font-app-body text-[10px] text-[#443A33] outline-none"
                                    >
                                        <option value="all">All statuses</option>
                                        {STATUS_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="flex items-center gap-2 rounded-md border border-[#E9E5DA] bg-white px-3 py-2">
                                    <span className="font-app-body text-[10px] text-[#806D61]">Category</span>
                                    <select
                                        value={categoryFilter}
                                        onChange={(event) => setCategoryFilter(event.target.value)}
                                        className="max-w-[160px] bg-transparent font-app-body text-[10px] text-[#443A33] outline-none"
                                    >
                                        <option value="all">All categories</option>
                                        {CATEGORY_OPTIONS.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            {loadError && (
                                <div role="alert" className="m-4 flex flex-col gap-3 rounded-lg border border-red-200 bg-[#FDDAD6] p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-2 text-[#9F1515]">
                                        <AlertCircle size={17} className="mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-app-body text-xs font-bold">Could not load complaints</p>
                                            <p className="mt-1 font-app-body text-[11px]">{loadError}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={loadComplaints}
                                        className="self-start rounded-md border border-red-300 bg-white/70 px-3 py-2 font-app-body text-[10px] font-bold text-[#9F1515]"
                                    >
                                        Try again
                                    </button>
                                </div>
                            )}

                            {isLoading ? (
                                <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 p-8 text-[#806D61]">
                                    <LoaderCircle size={25} className="animate-spin text-[#A9430B]" />
                                    <p className="font-app-body text-xs">Loading complaints...</p>
                                </div>
                            ) : !loadError && filteredComplaints.length === 0 ? (
                                <div className="flex min-h-[240px] flex-col items-center justify-center px-6 py-12 text-center">
                                    <span className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-[#F0EEE5] text-[#A9430B]">
                                        <MessageSquareWarning size={22} />
                                    </span>
                                    <h3 className="font-app-heading text-sm font-bold text-[#30251F]">
                                        {complaints.length === 0 ? "No submissions yet" : "No matching complaints"}
                                    </h3>
                                    <p className="mt-1 max-w-sm font-app-body text-[11px] leading-relaxed text-[#806D61]">
                                        {complaints.length === 0
                                            ? "Contact Us submissions will appear here when someone sends a message."
                                            : "Try changing your search terms or filters."}
                                    </p>
                                </div>
                            ) : !loadError && (
                                <>
                                    <div className="hidden overflow-x-auto md:block">
                                        <table className="w-full min-w-[760px] border-collapse text-left">
                                            <thead className="bg-[#F0EEE5]">
                                                <tr className="font-app-body text-[9px] uppercase tracking-wide text-[#806D61]">
                                                    <th className="px-5 py-3 font-semibold">Request</th>
                                                    <th className="px-4 py-3 font-semibold">Category</th>
                                                    <th className="px-4 py-3 font-semibold">Submitted</th>
                                                    <th className="px-4 py-3 font-semibold">Status</th>
                                                    <th className="px-4 py-3 text-right font-semibold">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredComplaints.map((item) => (
                                                    <tr key={item.id} className="border-t border-[#EEEAE0] transition hover:bg-white/70">
                                                        <td className="max-w-[260px] px-5 py-4">
                                                            <p className="truncate font-app-heading text-xs font-bold text-[#28201B]">
                                                                {item.subject}
                                                            </p>
                                                            <p className="mt-1 truncate font-app-body text-[10px] text-[#806D61]">
                                                                {item.name} · {item.email}
                                                            </p>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <span className="font-app-body text-[10px] text-[#55483F]">{item.category}</span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-4 font-app-body text-[10px] text-[#806D61]">
                                                            {formatDate(item.createdAt)}
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <StatusBadge status={item.status} />
                                                        </td>
                                                        <td className="px-4 py-4 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() => openDetails(item)}
                                                                className="inline-flex items-center gap-1.5 rounded-md border border-[#E9E5DA] bg-white px-3 py-2 font-app-body text-[10px] font-bold text-[#A9430B] transition hover:bg-[#FCE7DF]"
                                                            >
                                                                <Eye size={12} /> Review
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="space-y-3 p-3 md:hidden">
                                        {filteredComplaints.map((item) => (
                                            <article key={item.id} className="rounded-lg border border-[#E9E5DA] bg-white/70 p-4">
                                                <div className="mb-2 flex items-start justify-between gap-2">
                                                    <span className="font-app-body text-[9px] font-bold uppercase tracking-wide text-[#A9430B]">
                                                        {item.category}
                                                    </span>
                                                    <StatusBadge status={item.status} />
                                                </div>
                                                <h3 className="break-words font-app-heading text-sm font-bold text-[#28201B]">
                                                    {item.subject}
                                                </h3>
                                                <p className="mt-1 break-words font-app-body text-[10px] text-[#806D61]">
                                                    {item.name} · {item.email}
                                                </p>
                                                <div className="mt-3 flex items-center justify-between gap-2">
                                                    <span className="font-app-body text-[9px] text-[#8A7A6E]">
                                                        {formatDate(item.createdAt)}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => openDetails(item)}
                                                        className="inline-flex items-center gap-1 rounded-md bg-[#FF6D29] px-3 py-2 font-app-body text-[10px] font-bold text-[#3A1B0D]"
                                                    >
                                                        <Eye size={12} /> Review
                                                    </button>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </>
                            )}

                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E9E5DA] bg-[#F7F5ED] px-4 py-3 font-app-body text-[9px] text-[#8A7A6E]">
                                <span>HungerBridge Admin Console · Support center</span>
                                <span>{filteredComplaints.length} displayed</span>
                            </div>
                        </section>
                    </div>
                </main>
            </div>

            {selectedComplaint && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !isSaving) {
                            setSelectedComplaint(null);
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="complaint-detail-title"
                        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-[#E9E5DA] bg-[#FBF9F1] shadow-2xl sm:rounded-2xl"
                    >
                        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#E9E5DA] bg-[#FBF9F1]/95 px-5 py-4 backdrop-blur">
                            <div className="min-w-0">
                                <p className="mb-1 font-app-body text-[9px] font-bold tracking-[0.14em] text-[#A9430B]">
                                    COMPLAINT DETAILS
                                </p>
                                <h2 id="complaint-detail-title" className="break-words font-app-heading text-lg font-bold text-[#171717]">
                                    {selectedComplaint.subject}
                                </h2>
                                <p className="mt-1 font-app-body text-[10px] text-[#806D61]">
                                    Submitted {formatDate(selectedComplaint.createdAt)}
                                </p>
                            </div>
                            <button
                                type="button"
                                aria-label="Close complaint details"
                                disabled={isSaving}
                                onClick={() => setSelectedComplaint(null)}
                                className="rounded-md p-2 text-[#78695E] hover:bg-[#F0EEE5] disabled:opacity-50"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="min-w-0">
                                <DetailRow label="Reference">
                                    HB-{selectedComplaint.id}
                                </DetailRow>
                                <DetailRow label="Name">
                                    {selectedComplaint.name}
                                </DetailRow>
                                <DetailRow label="Email">
                                    <a className="text-[#A9430B] underline underline-offset-2" href={`mailto:${selectedComplaint.email}`}>
                                        {selectedComplaint.email}
                                    </a>
                                </DetailRow>
                                <DetailRow label="Phone">
                                    {selectedComplaint.phoneNumber || "Not provided"}
                                </DetailRow>
                                <DetailRow label="Category">
                                    {selectedComplaint.category}
                                </DetailRow>
                                <DetailRow label="Current status">
                                    <StatusBadge status={selectedComplaint.status} />
                                </DetailRow>

                                <div className="pt-4">
                                    <h3 className="mb-2 font-app-body text-[10px] font-bold uppercase tracking-wide text-[#8A7A6E]">
                                        Message
                                    </h3>
                                    <p className="whitespace-pre-wrap break-words rounded-lg border border-[#E9E5DA] bg-white/70 p-4 font-app-body text-sm leading-relaxed text-[#352B25]">
                                        {selectedComplaint.message}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={saveComplaint} className="min-w-0 rounded-xl border border-[#E9E5DA] bg-[#F0EEE5] p-4">
                                <h3 className="font-app-heading text-sm font-bold text-[#171717]">
                                    Update request
                                </h3>
                                <p className="mb-4 mt-1 font-app-body text-[10px] leading-relaxed text-[#806D61]">
                                    Update the status and record internal handling notes.
                                </p>

                                <label htmlFor="complaint-status" className="mb-2 block font-app-body text-[10px] font-semibold text-[#55483F]">
                                    Status
                                </label>
                                <div className="relative mb-4">
                                    <select
                                        id="complaint-status"
                                        value={editStatus}
                                        onChange={(event) => setEditStatus(event.target.value)}
                                        className="w-full appearance-none rounded-lg border border-[#E3DCCE] bg-[#FBF9F1] px-3 py-3 pr-9 font-app-body text-xs text-[#352B25] outline-none focus:border-[#A9430B]"
                                    >
                                        {STATUS_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#806D61]" />
                                </div>

                                <label htmlFor="complaint-notes" className="mb-2 block font-app-body text-[10px] font-semibold text-[#55483F]">
                                    Admin notes
                                </label>
                                <textarea
                                    id="complaint-notes"
                                    value={adminNotes}
                                    onChange={(event) => setAdminNotes(event.target.value)}
                                    maxLength={3000}
                                    rows={6}
                                    placeholder="Record investigation steps or resolution details..."
                                    className="w-full resize-y rounded-lg border border-[#E3DCCE] bg-[#FBF9F1] px-3 py-3 font-app-body text-xs leading-relaxed text-[#352B25] outline-none placeholder:text-[#A99B8D] focus:border-[#A9430B]"
                                />
                                <p className="mt-1 text-right font-app-body text-[9px] text-[#8A7A6E]">
                                    {adminNotes.length}/3000
                                </p>

                                {actionMessage && (
                                    <p role="status" className="mt-3 rounded-md border border-green-200 bg-[#E6F2E7] p-2 font-app-body text-[10px] text-[#25623B]">
                                        {actionMessage}
                                    </p>
                                )}
                                {actionError && (
                                    <p role="alert" className="mt-3 rounded-md border border-red-200 bg-[#FDDAD6] p-2 font-app-body text-[10px] text-[#9F1515]">
                                        {actionError}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF6D29] px-4 py-3 font-app-body text-xs font-bold text-[#3A1B0D] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSaving ? (
                                        <>
                                            <LoaderCircle size={14} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={14} />
                                            Save changes
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};
