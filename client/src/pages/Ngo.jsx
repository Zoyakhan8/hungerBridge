
import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import gsap from "gsap";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  HandHeart,
  LayoutDashboard,
  LoaderCircle,
  MapPin,
  Menu,
  Package,
  RefreshCw,
  Truck,
  Utensils,
  AlertCircle,
  XCircle,
} from "lucide-react";

import {
  NgoSideBar,
  DEFAULT_NGO_NAVIGATION,
} from "./ngo/NgoSideBar";

import {NgoHeader} from "./ngo/NgoHeader";

const API_URL = "/api/ngo/dashboard";

const EMPTY_STATS = {
  totalRequests: 0,
  pendingRequests: 0,
  activeDeliveries: 0,
  completedDeliveries: 0,
};

const EMPTY_DASHBOARD = {
  stats: EMPTY_STATS,
  recentRequests: [],
  deliveries: [],
};

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "Time unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusStyle = (status) => {
  const normalizedStatus = String(status || "").toLowerCase();

  const styles = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    accepted: "bg-blue-50 text-blue-700 ring-blue-200",
    assigned: "bg-blue-50 text-blue-700 ring-blue-200",
    in_transit: "bg-violet-50 text-violet-700 ring-violet-200",
    delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    declined: "bg-red-50 text-red-700 ring-red-200",
  };

  return (
    styles[normalizedStatus] ||
    "bg-stone-100 text-stone-600 ring-stone-200"
  );
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return String(status)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(
        status
      )}`}
    >
      {formatStatus(status)}
    </span>
  );
}

function SectionHeading({ title, description, action }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-base font-bold text-[#34251D] sm:text-lg">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs text-[#81736A] sm:text-sm">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function StatCard({ title, value, description, icon: Icon, color }) {
  return (
    <article className="min-w-0 rounded-2xl border border-[#EAE5DA] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium leading-5 text-[#82756A] sm:text-sm">
            {title}
          </p>

          <p className="mt-2 break-words text-2xl font-extrabold tracking-tight text-[#34251D] sm:text-3xl">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}
        >
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-[#81736A]">
        {description}
      </p>
    </article>
  );
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7F1E7] text-[#B64B0C]">
        <Icon size={23} />
      </div>

      <h3 className="mt-3 text-sm font-bold text-[#34251D]">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-[#81736A]">
        {description}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-52 items-center justify-center gap-3 text-sm text-[#76695F]">
      <LoaderCircle size={20} className="animate-spin text-[#D85C1B]" />
      Loading your dashboard...
    </div>
  );
}

function RequestRow({ request }) {
  const donation = request.donation || {};

  return (
    <div className="flex flex-col gap-3 border-b border-[#F0ECE4] py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E7] text-[#B64B0C]">
          <Utensils size={19} />
        </div>

        <div className="min-w-0">
          <p className="break-words text-sm font-semibold text-[#34251D]">
            {donation.foodName || "Food donation"}
          </p>

          <p className="mt-1 text-xs text-[#81736A]">
            {donation.foodType || "Food type unavailable"}
            {donation.quantity ? ` · ${donation.quantity}` : ""}
          </p>

          <p className="mt-1 text-xs text-[#9A8B7F]">
            Requested: {formatDateTime(request.requestedAt)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
        <StatusBadge status={request.status} />

        {donation.expectedExpiryTime && (
          <p className="text-xs text-[#81736A]">
            Expires: {formatDate(donation.expectedExpiryTime)}
          </p>
        )}
      </div>
    </div>
  );
}

function DeliveryRow({ delivery }) {
  const food = delivery.food || {};

  return (
    <div className="flex flex-col gap-3 border-b border-[#F0ECE4] py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF3EC] text-[#426C4B]">
          <Truck size={19} />
        </div>

        <div className="min-w-0">
          <p className="break-words text-sm font-semibold text-[#34251D]">
            {food.name || "Food delivery"}
          </p>

          <p className="mt-1 text-xs text-[#81736A]">
            {food.type || "Food type unavailable"}
            {food.quantity ? ` · ${food.quantity}` : ""}
          </p>

          <p className="mt-1 text-xs text-[#9A8B7F]">
            {delivery.partner?.name
              ? `Delivery partner: ${delivery.partner.name}`
              : "Delivery partner not assigned"}
          </p>

          {delivery.partner?.vehicleNumber && (
            <p className="mt-1 text-xs text-[#9A8B7F]">
              Vehicle: {delivery.partner.vehicleNumber}
            </p>
          )}
        </div>
      </div>

      <div className="sm:text-right">
        <StatusBadge status={delivery.status} />

        <p className="mt-2 text-xs text-[#81736A]">
          {formatDateTime(delivery.createdAt || delivery.assignedAt)}
        </p>
      </div>
    </div>
  );
}

export const Ngo=({
  onNavigate,
  onSearch,
  mapUrl,
}) =>{
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const contentRef = useRef(null);
  const animationRef = useRef(null);

  const fetchDashboard = useCallback(async (signal, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
        signal,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load the NGO dashboard."
        );
      }

      if (data.success === false) {
        throw new Error(
          data.message || "Unable to load the NGO dashboard."
        );
      }

      setDashboard({
        stats: {
          ...EMPTY_STATS,
          ...(data.stats || {}),
        },
        recentRequests: Array.isArray(data.recentRequests)
          ? data.recentRequests
          : [],
        deliveries: Array.isArray(data.deliveries)
          ? data.deliveries
          : [],
      });
    } catch (err) {
      if (err.name === "AbortError") return;

      setError(
        err.message ||
          "Something went wrong while loading your dashboard."
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchDashboard(controller.signal);

    return () => controller.abort();
  }, [fetchDashboard]);

  useEffect(() => {
    if (loading || error || !contentRef.current) return;

    const ctx = gsap.context(() => {
      animationRef.current = gsap.fromTo(
        ".ngo-dashboard-item",
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: "power2.out",
          clearProps: "all",
        }
      );
    }, contentRef);

    return () => {
      ctx.revert();
    };
  }, [loading, error, dashboard]);

  const handleNavigate = useCallback(
    (label) => {
      setMobileOpen(false);

      if (label) {
        onNavigate?.(label);
      }
    },
    [onNavigate]
  );

  const handleRefresh = () => {
    fetchDashboard(undefined, true);
  };

  const stats = dashboard.stats;
  const requests = dashboard.recentRequests;
  const deliveries = dashboard.deliveries;

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#34251D]">
      <div className="flex min-h-screen">
        <NgoSideBar
          items={DEFAULT_NGO_NAVIGATION}
          mobileOpen={mobileOpen}
          onNavigate={handleNavigate}
          brand="HungerBridge"
        />

        <div className="min-w-0 flex-1">
          <div className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-[#EAE5DA] bg-[#FBFAF6] px-4 md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#EAE5DA] bg-white text-[#55483F] transition hover:bg-[#F4F2E9]"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0">
              <p className="truncate text-lg font-extrabold text-[#B64B0C]">
                HungerBridge
              </p>
              <p className="text-[9px] tracking-[0.16em] text-[#81736A]">
                NGO CONSOLE
              </p>
            </div>
          </div>

          <div className="hidden md:block">
            <NgoHeader onMenuClick={() => setMobileOpen(true)} onSearch={onSearch} />
          </div>

          <main
            ref={contentRef}
            className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8"
          >
            <div className="ngo-dashboard-item mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#81736A]">
                  <LayoutDashboard size={15} />
                  <span>NGO / Dashboard</span>
                </div>

                <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#34251D] sm:text-3xl">
                  NGO Dashboard
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#81736A]">
                  Manage your donation requests and track food deliveries
                  in one place.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-xl border border-[#E4DED1] bg-white px-4 py-2 text-sm font-semibold text-[#55483F] transition hover:bg-[#F8F4EC] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="ngo-dashboard-item mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={20}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <div>
                    <p className="text-sm font-bold text-red-800">
                      Dashboard could not be loaded
                    </p>
                    <p className="mt-1 break-words text-sm text-red-700">
                      {error}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60 sm:self-center"
                >
                  <RefreshCw size={15} />
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <LoadingState />
            ) : (
              <>
                <section
                  aria-label="Donation statistics"
                  className="mb-8 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-4"
                >
                  <div className="ngo-dashboard-item">
                    <StatCard
                      title="Total Requests"
                      value={stats.totalRequests}
                      description="All your donation requests"
                      icon={Package}
                      color="bg-[#FFF0E7] text-[#B64B0C]"
                    />
                  </div>

                  <div className="ngo-dashboard-item">
                    <StatCard
                      title="Pending Requests"
                      value={stats.pendingRequests}
                      description="Waiting for a decision"
                      icon={Clock3}
                      color="bg-[#FFF4D8] text-[#A16C0A]"
                    />
                  </div>

                  <div className="ngo-dashboard-item">
                    <StatCard
                      title="Active Deliveries"
                      value={stats.activeDeliveries}
                      description="Deliveries still in progress"
                      icon={Truck}
                      color="bg-[#EDE8FF] text-[#6750A4]"
                    />
                  </div>

                  <div className="ngo-dashboard-item">
                    <StatCard
                      title="Completed Deliveries"
                      value={stats.completedDeliveries}
                      description="Successfully delivered"
                      icon={CheckCircle2}
                      color="bg-[#E5F4E8] text-[#347345]"
                    />
                  </div>
                </section>

                <section className="ngo-dashboard-item mb-8 grid grid-cols-1 gap-5 xl:grid-cols-5">
                  <div className="min-w-0 rounded-2xl border border-[#EAE5DA] bg-white p-4 shadow-sm sm:p-5 xl:col-span-3">
                    <SectionHeading
                      title="Recent Donation Requests"
                      description="The latest requests associated with your NGO"
                      action={
                        <NavLink
                          to="/ngo/request"
                          onClick={() => handleNavigate("Donation Request")}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#B64B0C] hover:underline sm:text-sm"
                        >
                          View all <ArrowRight size={15} />
                        </NavLink>
                      }
                    />

                    {requests.length > 0 ? (
                      <div>
                        {requests.map((request, index) => (
                          <RequestRow
                            key={request.requestId || index}
                            request={request}
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={HandHeart}
                        title="No donation requests yet"
                        description="Your recent donation requests will appear here when available."
                      />
                    )}
                  </div>

                  <div className="min-w-0 rounded-2xl border border-[#EAE5DA] bg-white p-4 shadow-sm sm:p-5 xl:col-span-2">
                    <SectionHeading
                      title="Quick Actions"
                      description="Navigate to your NGO services"
                    />

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      <NavLink
                        to="/ngo/request"
                        onClick={() => handleNavigate("Donation Request")}
                        className="group flex items-center gap-3 rounded-xl border border-[#F0E6DB] bg-[#FFFAF4] p-4 transition hover:border-[#F1B18E] hover:bg-[#FFF0E7]"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFE4D4] text-[#B64B0C]">
                          <Package size={19} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold text-[#34251D]">
                            Donation Requests
                          </span>
                          <span className="mt-1 block text-xs text-[#81736A]">
                            View and manage requests
                          </span>
                        </span>

                        <ArrowRight
                          size={17}
                          className="shrink-0 text-[#B64B0C] transition group-hover:translate-x-1"
                        />
                      </NavLink>

                      <NavLink
                        to="/ngo/donation"
                        onClick={() => handleNavigate("Donation Delivery")}
                        className="group flex items-center gap-3 rounded-xl border border-[#E4EBE3] bg-[#F7FBF6] p-4 transition hover:border-[#B8D5BA] hover:bg-[#EAF3EC]"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DFEEDF] text-[#426C4B]">
                          <Truck size={19} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold text-[#34251D]">
                            Donation Deliveries
                          </span>
                          <span className="mt-1 block text-xs text-[#81736A]">
                            Track delivery progress
                          </span>
                        </span>

                        <ArrowRight
                          size={17}
                          className="shrink-0 text-[#426C4B] transition group-hover:translate-x-1"
                        />
                      </NavLink>

                      <NavLink
                        to="/ngo/donation-history"
                        onClick={() => handleNavigate("Donation History")}
                        className="group flex items-center gap-3 rounded-xl border border-[#E6E1F1] bg-[#FAF8FF] p-4 transition hover:border-[#C9BDE9] hover:bg-[#F0EBFC]"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAE3FA] text-[#6750A4]">
                          <Activity size={19} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold text-[#34251D]">
                            Donation History
                          </span>
                          <span className="mt-1 block text-xs text-[#81736A]">
                            Review past donations
                          </span>
                        </span>

                        <ArrowRight
                          size={17}
                          className="shrink-0 text-[#6750A4] transition group-hover:translate-x-1"
                        />
                      </NavLink>
                    </div>
                  </div>
                </section>

                <section className="ngo-dashboard-item mb-8 rounded-2xl border border-[#EAE5DA] bg-white p-4 shadow-sm sm:p-5">
                  <SectionHeading
                    title="Recent Deliveries"
                    description="Track food donations assigned to your NGO"
                    action={
                      <NavLink
                        to="/ngo/donation"
                        onClick={() => handleNavigate("Donation Delivery")}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#B64B0C] hover:underline sm:text-sm"
                      >
                        View all <ArrowRight size={15} />
                      </NavLink>
                    }
                  />

                  {deliveries.length > 0 ? (
                    <div>
                      {deliveries.map((delivery, index) => (
                        <DeliveryRow
                          key={delivery.deliveryId || index}
                          delivery={delivery}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={Truck}
                      title="No deliveries to display"
                      description="When your donation requests have deliveries, their latest status will appear here."
                    />
                  )}
                </section>

                <section className="ngo-dashboard-item rounded-2xl border border-[#EAE5DA] bg-white p-4 shadow-sm sm:p-5">
                  <SectionHeading
                    title="Delivery Location"
                    description="Open your delivery map to view locations"
                  />

                  {mapUrl ? (
                    <div className="overflow-hidden rounded-xl border border-[#EAE5DA]">
                      <iframe
                        title="NGO delivery map"
                        src={mapUrl}
                        className="h-64 w-full sm:h-80"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E4DED1] bg-[#FBFAF6] px-4 py-8 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0E7] text-[#B64B0C]">
                        <MapPin size={23} />
                      </div>

                      <h3 className="mt-3 text-sm font-bold text-[#34251D]">
                        Delivery map
                      </h3>

                      <p className="mt-1 max-w-sm text-xs leading-5 text-[#81736A]">
                        Connect your map URL or map integration here to display
                        delivery locations.
                      </p>
                    </div>
                  )}
                </section>
              </>
            )}

            <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-[#EAE5DA] py-5 text-center text-xs text-[#9A8B7F] sm:flex-row sm:text-left">
              <p>HungerBridge · NGO Console</p>
              <p className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Dashboard connected to API
              </p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
