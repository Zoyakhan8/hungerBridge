
import { useCallback, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Package,
  CalendarDays,
  Truck,
  CheckCircle2,
  Clock3,
  QrCode,
  RefreshCw,
  Inbox,
} from "lucide-react";

import { NgoSideBar,DEFAULT_NGO_NAVIGATION } from "./ngo/NgoSideBar";
import { NgoHeader } from "./ngo/NgoHeader";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const filters = ["All", "Pending", "Assigned", "In transit", "Delivered"];

const statusLabels = {
  pending: "Pending",
  assigned: "Assigned",
  in_transit: "In transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  assigned: "bg-blue-50 text-blue-700",
  in_transit: "bg-orange-50 text-orange-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleString();
};

export const NGODeliveries = ({
  navigation = DEFAULT_NGO_NAVIGATION,
  onNavigate,
  onSearch,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchDeliveries = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError("");

      const response = await fetch(`${API_URL}/ngo/donation`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not load deliveries.");
      }

      setDeliveries(data.deliveries ?? []);
    } catch (err) {
      console.error("Fetching NGO deliveries failed:", err);
      setError(err.message || "Could not load deliveries.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const handleNavigate = (label) => {
    setMobileOpen(false);
    onNavigate?.(label);
  };

  const counts = {
    total: deliveries.length,
    pending: deliveries.filter((d) => d.status === "pending").length,
    active: deliveries.filter(
      (d) => ["assigned", "in_transit"].includes(d.status)
    ).length,
    delivered: deliveries.filter((d) => d.status === "delivered").length,
  };

  const filteredDeliveries = deliveries.filter((delivery) => {
    if (filter === "All") return true;
    if (filter === "In transit") return delivery.status === "in_transit";

    return (
      statusLabels[delivery.status]?.toLowerCase() === filter.toLowerCase()
    );
  });

  return (
    <div className="min-h-screen bg-[#FBF9F1] text-[#2D3436]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] overflow-hidden bg-[#FBF9F1] shadow-[0_12px_35px_rgba(48,40,20,0.08)]">
        <NgoSideBar
          items={navigation}
          mobileOpen={mobileOpen}
          onNavigate={handleNavigate}
        />

        <div className="min-w-0 flex-1">
          <NgoHeader
            onMenuClick={() => setMobileOpen((open) => !open)}
            onSearch={onSearch}
          />

          <main className="min-h-screen bg-brown p-5 font-body text-heading md:p-10">
            <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-2 font-app-body text-xs uppercase tracking-[0.18em] text-primary">
                  NGO Dashboard
                </p>
                <h1 className="font-app-heading text-2xl font-bold md:text-3xl">
                  Food Deliveries
                </h1>
                <p className="mt-2 text-sm text-[#78695E]">
                  Track incoming food and confirm handovers securely.
                </p>
              </div>

              <button
                type="button"
                onClick={() => fetchDeliveries(true)}
                disabled={refreshing || loading}
                className="flex w-fit items-center gap-2 rounded-lg border border-[#E8E2D8] bg-white px-4 py-3 text-sm font-semibold hover:bg-[#F0EEE5] disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </header>

            <section
              aria-label="Delivery summary"
              className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
              {[
                {
                  label: "Total deliveries",
                  value: counts.total,
                  icon: Package,
                  color: "bg-orange-50 text-primary",
                },
                {
                  label: "Awaiting assignment",
                  value: counts.pending,
                  icon: Clock3,
                  color: "bg-amber-50 text-amber-700",
                },
                {
                  label: "Active deliveries",
                  value: counts.active,
                  icon: Truck,
                  color: "bg-blue-50 text-blue-700",
                },
                {
                  label: "Delivered",
                  value: counts.delivered,
                  icon: CheckCircle2,
                  color: "bg-green-50 text-green-700",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.label}
                    className="rounded-2xl border border-[#EEEAE0] bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-[#78695E]">
                          {item.label}
                        </p>
                        <p className="mt-2 text-2xl font-bold">
                          {item.value}
                        </p>
                      </div>
                      <div
                        className={`grid h-12 w-12 place-items-center rounded-xl ${item.color}`}
                      >
                        <Icon size={22} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
                <button
                  type="button"
                  onClick={() => fetchDeliveries()}
                  className="ml-2 font-semibold underline"
                >
                  Try again
                </button>
              </div>
            )}

            <div className="mb-6 flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filter === item
                    ? "bg-primary text-white"
                    : "border border-[#E8E2D8] bg-white text-[#65564C] hover:bg-[#F0EEE5]"
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="py-12 text-center text-sm text-[#78695E]">
                Loading deliveries...
              </p>
            ) : (
              <section
                aria-label="Food deliveries"
                className="grid grid-cols-1 gap-5 xl:grid-cols-2"
              >
                {filteredDeliveries.map((delivery) => {
                  const food = delivery.food ?? {};
                  const partner = delivery.partner;
                  const label =
                    statusLabels[delivery.status] ?? delivery.status;

                  return (
                    <article
                      key={delivery.deliveryId}
                      className="rounded-2xl border border-[#EEEAE0] bg-white p-5 shadow-sm md:p-6"
                    >
                      <div className="mb-5 flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#FFF0E7] text-primary">
                            <Package size={23} />
                          </div>
                          <div className="min-w-0">
                            <h2 className="font-app-heading text-base font-bold">
                              {food.name || "Food donation"}
                            </h2>
                            <p className="mt-1 text-sm text-[#78695E]">
                              Delivery #{delivery.deliveryId}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[delivery.status] ||
                            "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {label}
                        </span>
                      </div>

                      <div className="mb-5 grid grid-cols-1 gap-3 rounded-xl bg-[#FBF9F1] p-4 sm:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Package size={16} className="shrink-0 text-primary" />
                          <span>
                            <span className="text-[#78695E]">Quantity: </span>
                            <strong>{food.quantity ?? "Not specified"}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays
                            size={16}
                            className="shrink-0 text-primary"
                          />
                          <span>
                            Expires: {formatDate(food.expectedExpiryTime)}
                          </span>
                        </div>

                        <div className="text-sm sm:col-span-2">
                          <span className="text-[#78695E]">Ingredients: </span>
                          {food.ingredients || "Not specified"}
                        </div>
                      </div>

                      <div className="mb-5 border-b border-[#EEEAE0] pb-5">
                        <h3 className="mb-2 text-sm font-semibold">
                          Delivery partner
                        </h3>
                        {partner ? (
                          <div className="text-sm leading-6 text-[#65564C]">
                            <p>{partner.name}</p>
                            <p>
                              {partner.vehicleType || "Vehicle not specified"}
                              {partner.vehicleNumber
                                ? ` · ${partner.vehicleNumber}`
                                : ""}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-[#78695E]">
                            Waiting for an available delivery partner.
                          </p>
                        )}
                      </div>

                      {delivery.status === "in_transit" &&
                        delivery.handoverQrToken ? (
                        <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
                          <QrCode
                            size={25}
                            className="mx-auto mb-2 text-green-700"
                          />
                          <h3 className="font-semibold text-green-800">
                            Ready for handover
                          </h3>
                          <p className="mb-4 mt-1 text-sm text-green-700">
                            Ask the assigned delivery partner to scan this QR
                            code to confirm food handover.
                          </p>

                          <div className="mx-auto inline-block rounded-xl bg-white p-3">
                            <QRCodeSVG
                              value={delivery.handoverQrToken}
                              size={190}
                              level="M"
                              marginSize={2}
                            />
                          </div>

                          <p className="mt-3 text-xs text-green-800">
                            Keep this QR visible only during the handover.
                          </p>
                        </div>
                      ) : delivery.status === "delivered" ? (
                        <div className="rounded-xl bg-green-50 p-4 text-sm text-green-800">
                          <CheckCircle2
                            size={19}
                            className="mb-2 inline"
                          />{" "}
                          Delivery completed
                          <p className="mt-1 text-xs">
                            {formatDate(delivery.deliveredAt)}
                          </p>
                        </div>
                      ) : delivery.status === "assigned" ? (
                        <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                          <Truck size={18} className="mb-2 inline" />{" "}
                          A delivery partner has been assigned. The handover
                          QR will appear after pickup is scanned.
                        </div>
                      ) : delivery.status === "pending" ? (
                        <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                          <Clock3 size={18} className="mb-2 inline" />{" "}
                          Waiting for delivery partner assignment.
                        </div>
                      ) : delivery.status === "in_transit" ? (
                        <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                          Handover QR is not available. Refresh the page or
                          contact support.
                        </div>
                      ) : (
                        <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                          No handover action is available for this delivery.
                        </div>
                      )}
                    </article>
                  );
                })}
              </section>
            )}

            {!loading && filteredDeliveries.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#DDD5C9] bg-white/70 px-6 py-16 text-center">
                <Inbox size={34} className="mx-auto mb-3 text-[#A99A8B]" />
                <h2 className="font-app-heading text-lg font-semibold">
                  No {filter.toLowerCase()} deliveries
                </h2>
                <p className="mt-2 text-sm text-[#78695E]">
                  Deliveries matching this status will appear here.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default NGODeliveries;
