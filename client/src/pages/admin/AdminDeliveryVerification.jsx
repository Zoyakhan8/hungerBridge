
import {
  ArrowLeft,
  ArrowRight,
  Truck,
  ShieldCheck,
  Clock3,
  Mail,
  Phone,
  CalendarDays,
  CarFront,
  CheckCircle2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AdminHeader } from "./AdminHeader";
import {
  AdminSidebar,
  DEFAULT_ADMIN_NAVIGATION,
} from "./AdminSidebar";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const panelClass =
  "rounded-xl border border-secondary/15 bg-brown shadow-sm";

const sectionTitleClass =
  "text-sm font-bold uppercase tracking-wider text-inactive/80";

const detailLabelClass =
  "text-xs font-semibold text-inactive/70";

const detailValueClass =
  "mt-1 break-words text-sm font-medium text-heading";

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="min-w-0 rounded-lg border border-secondary/10 bg-tertiary/50 p-4">
    <div className="flex items-center gap-2 text-inactive">
      <Icon size={15} aria-hidden="true" />
      <span className={detailLabelClass}>{label}</span>
    </div>

    <p className={detailValueClass}>{value || "Not provided"}</p>
  </div>
);

export const AdminDeliveryVerification = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getPendingPartners = useCallback(async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const res = await fetch(
        `${API_URL}/admin/delivery-partners/pending`,
        { credentials: "include" }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message || "Unable to load delivery partners."
        );
      }

      const list = Array.isArray(result.partners)
        ? result.partners
        : [];

      setPartners(list);

      setSelectedPartner((current) => {
        if (current) {
          const updatedPartner = list.find(
            (partner) => partner.id === current.id
          );

          if (updatedPartner) return updatedPartner;
        }

        return list[0] || null;
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    getPendingPartners();
  }, [getPendingPartners]);

  const handleVerification = async (partnerId) => {
    if (verifying || !partnerId) return;

    const confirmed = window.confirm(
      "Are you sure you want to verify this delivery partner?"
    );

    if (!confirmed) return;

    try {
      setVerifying(true);
      setError("");
      setMessage("");

      const res = await fetch(
        `${API_URL}/admin/delivery-partners/${encodeURIComponent(
          partnerId
        )}/verify`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message || "Verification failed."
        );
      }

      setMessage("Delivery partner verified successfully.");

      // Refresh the queue using the server's latest data.
      await getPendingPartners(true);
    } catch (err) {
      setError(err.message || "Unable to verify partner.");
    } finally {
      setVerifying(false);
    }
  };

  const handleSelectPartner = (partner) => {
    if (verifying) return;

    setSelectedPartner(partner);
    setMessage("");
    setError("");
  };

  const handleNavigate = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-brown md:flex">
      <AdminSidebar
        items={DEFAULT_ADMIN_NAVIGATION}
        mobileOpen={mobileOpen}
        onNavigate={handleNavigate}
      />

      <main className="min-w-0 flex-1">
        <AdminHeader
          onMenuClick={() => setMobileOpen((open) => !open)}
          searchPlaceholder="Search delivery partners..."
        />

        <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Page heading */}
          <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                Administration
              </p>

              <h1 className="text-2xl font-extrabold tracking-tight text-heading sm:text-3xl">
                Delivery Partner Verification
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-inactive">
                Review delivery partner registrations and approve
                eligible partners for HungerBridge deliveries.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-secondary/20 bg-tertiary px-4 py-2.5">
              <ShieldCheck size={18} className="text-secondary" />

              <span className="text-sm font-semibold text-heading">
                {partners.length} pending partners
              </span>
            </div>
          </header>

          {/* Success message */}
          {message && (
            <div
              role="status"
              className="flex items-start justify-between gap-3 rounded-lg border border-secondary/20 bg-tertiary px-4 py-3 text-sm text-heading"
            >
              <div className="flex items-start gap-2">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-secondary"
                />
                <p>{message}</p>
              </div>

              <button
                type="button"
                onClick={() => setMessage("")}
                aria-label="Dismiss message"
                className="shrink-0 text-inactive transition hover:text-heading"
              >
                <XCircle size={18} />
              </button>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-red-700">{error}</p>

              <button
                type="button"
                onClick={() => getPendingPartners(true)}
                disabled={refreshing || verifying}
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-secondary/20 px-3 py-2 font-semibold text-heading transition hover:bg-tertiary disabled:opacity-50"
              >
                <RefreshCw size={15} />
                Try again
              </button>
            </div>
          )}

          {/* Main dashboard */}
          <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(340px,0.9fr)_minmax(0,1.35fr)]">
            {/* Left: Pending partner roster */}
            <section className={`${panelClass} min-w-0 overflow-hidden`}>
              <div className="border-b border-secondary/15 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-heading">
                      Pending Partners
                    </h2>

                    <p className="mt-1 text-xs text-inactive">
                      Select a partner to review their profile.
                    </p>
                  </div>

                  <span className="rounded-full bg-tertiary px-3 py-1 text-xs font-bold text-secondary">
                    {partners.length} total
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => getPendingPartners(true)}
                  disabled={loading || refreshing || verifying}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-secondary/15 bg-tertiary px-3 py-2 text-xs font-semibold text-heading transition hover:border-secondary/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    size={14}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  {refreshing ? "Refreshing..." : "Refresh list"}
                </button>
              </div>

              <div className="divide-y divide-secondary/10">
                {loading ? (
                  <div className="space-y-3 p-4">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex animate-pulse items-center gap-3 p-3"
                      >
                        <div className="h-11 w-11 shrink-0 rounded-xl bg-tertiary" />

                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-2/3 rounded bg-tertiary" />
                          <div className="h-3 w-1/2 rounded bg-tertiary" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : partners.length === 0 ? (
                  <div className="p-10 text-center">
                    <ShieldCheck
                      size={30}
                      className="mx-auto mb-3 text-inactive/60"
                    />

                    <p className="font-semibold text-heading">
                      No pending partners
                    </p>

                    <p className="mt-1 text-sm text-inactive">
                      New delivery partner registrations will appear here.
                    </p>
                  </div>
                ) : (
                  partners.map((partner) => {
                    const active =
                      selectedPartner?.id === partner.id;

                    return (
                      <button
                        key={partner.id}
                        type="button"
                        disabled={verifying}
                        onClick={() => handleSelectPartner(partner)}
                        aria-pressed={active}
                        className={`flex w-full min-w-0 items-center gap-3 p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary sm:gap-4 sm:p-5 ${
                          active
                            ? "bg-tertiary"
                            : "hover:bg-tertiary/50"
                        } disabled:cursor-not-allowed disabled:opacity-70`}
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-secondary/20 ${
                            active
                              ? "bg-secondary text-brown"
                              : "bg-tertiary text-heading"
                          }`}
                        >
                          <Truck size={22} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-heading sm:text-base">
                            {partner.fullName || "Unnamed partner"}
                          </p>

                          <p className="mt-1 truncate text-xs text-inactive">
                            {partner.email || "No email provided"}
                          </p>

                          <p className="mt-1 truncate text-xs text-inactive">
                            {partner.vehicleType || "Vehicle not specified"}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            Pending
                          </span>

                          <span className="text-[10px] text-inactive">
                            {active ? "Selected" : "View details"}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-2 border-t border-secondary/15 p-4">
                <span className="text-xs text-inactive sm:text-sm">
                  {partners.length} pending records
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled
                    aria-label="Previous page"
                    className="rounded-lg border border-secondary/20 p-2 text-heading opacity-40"
                  >
                    <ArrowLeft size={16} />
                  </button>

                  <button
                    type="button"
                    disabled
                    aria-label="Next page"
                    className="rounded-lg border border-secondary/20 p-2 text-heading opacity-40"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </section>

            {/* Right: Selected partner details */}
            <section className={`${panelClass} min-w-0 overflow-hidden`}>
              {!selectedPartner ? (
                <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
                  <Truck
                    size={38}
                    className="mb-4 text-inactive/50"
                  />

                  <h2 className="text-lg font-bold text-heading">
                    Select a delivery partner
                  </h2>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-inactive">
                    Choose a partner from the roster to review their
                    contact and vehicle details.
                  </p>
                </div>
              ) : (
                <>
                  {/* Profile header */}
                  <div className="border-b border-secondary/15 p-5 sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-tertiary text-secondary ring-1 ring-secondary/20">
                          <Truck size={28} />
                        </div>

                        <div className="min-w-0">
                          <h2 className="break-words text-xl font-extrabold text-heading sm:text-2xl">
                            {selectedPartner.fullName || "Unnamed partner"}
                          </h2>

                          <p className="mt-1 break-all text-sm text-inactive">
                            {selectedPartner.email || "No email provided"}
                          </p>

                          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700">
                            <Clock3 size={14} />
                            Awaiting verification
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={verifying || loading}
                        onClick={() =>
                          handleVerification(selectedPartner.id)
                        }
                        className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-bold text-brown transition hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                      >
                        {verifying ? (
                          <RefreshCw
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <ShieldCheck size={16} />
                        )}

                        {verifying ? "Verifying..." : "Verify partner"}
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-5 p-4 sm:p-6">
                    <div>
                      <h3 className={sectionTitleClass}>
                        Contact details
                      </h3>

                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <DetailItem
                          icon={Mail}
                          label="Email address"
                          value={selectedPartner.email}
                        />

                        <DetailItem
                          icon={Phone}
                          label="Phone number"
                          value={selectedPartner.phoneNumber}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className={sectionTitleClass}>
                        Vehicle details
                      </h3>

                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <DetailItem
                          icon={Truck}
                          label="Vehicle type"
                          value={selectedPartner.vehicleType}
                        />

                        <DetailItem
                          icon={CarFront}
                          label="Vehicle number"
                          value={selectedPartner.vehicleNumber}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className={sectionTitleClass}>
                        Registration details
                      </h3>

                      <div className="mt-3 rounded-lg border border-secondary/10 bg-tertiary/50 p-4">
                        <div className="flex items-center gap-2 text-inactive">
                          <CalendarDays size={15} />
                          <span className={detailLabelClass}>
                            Registered on
                          </span>
                        </div>

                        <p className={detailValueClass}>
                          {formatDate(selectedPartner.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-secondary/15 bg-tertiary/50 p-4">
                      <div className="flex items-start gap-3">
                        <ShieldCheck
                          size={19}
                          className="mt-0.5 shrink-0 text-secondary"
                        />

                        <div>
                          <h3 className="text-sm font-bold text-heading">
                            Verification guidelines
                          </h3>

                          <p className="mt-1 text-sm leading-6 text-inactive">
                            Review the submitted contact and vehicle
                            information before approving this delivery
                            partner.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};
