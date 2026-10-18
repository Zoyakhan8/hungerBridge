import { ArrowLeft, ArrowRight, RefreshCw, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";

import filter from "../assets/Filter.png";
import monthAvg from "../assets/monthlyAvg.png";
import impact from "../assets/impact.png";

const API_URL = "http://localhost:3000/api";

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatStatus = (donation) => {
  if (donation.delivery?.status === "delivered") return "Delivered";
  if (donation.delivery?.status === "in_transit") return "In Transit";
  if (donation.delivery?.status === "assigned") return "Assigned";
  if (donation.requestStatus === "accepted") return "Accepted";

  return donation.donationStatus || "Pending";
};

const statusClass = (status) => {
  if (status === "Delivered") {
    return "bg-green-500/10 text-green-700";
  }

  if (status === "In Transit" || status === "Assigned") {
    return "bg-blue-500/10 text-blue-700";
  }

  if (status === "Accepted") {
    return "bg-secondary/15 text-secondary";
  }

  return "bg-tertiary text-inactive";
};

export const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 5;

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/donor/donations`, {
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message || "Failed to load donation history."
        );
      }

      setDonations(result.donations || []);
    } catch (err) {
      setError(err.message || "Unable to load donations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const filteredDonations = useMemo(() => {
    if (status === "All") return donations;

    return donations.filter(
      (donation) => formatStatus(donation) === status
    );
  }, [donations, status]);

  useEffect(() => {
    setPage(1);
  }, [status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDonations.length / pageSize)
  );

  const visibleDonations = filteredDonations.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalDonations = donations.length;

  const deliveredCount = donations.filter(
    (donation) => formatStatus(donation) === "Delivered"
  ).length;

  return (
    <main className="min-w-0 w-full bg-brown p-4 sm:p-6 md:p-8 xl:p-12">
      <div className="mx-auto flex w-full min-w-0 max-w-[1600px] flex-col gap-6 sm:gap-8">
        {/* PAGE HEADER */}
        <header className="flex min-w-0 flex-col gap-2">
          <h1 className="break-words font-app-heading text-2xl font-extrabold text-heading sm:text-3xl md:text-4xl">
            Donation History
          </h1>

          <p className="max-w-2xl text-sm font-medium leading-6 text-inactive/90 sm:text-base">
            Review your contributions, track food donations, and see their
            delivery progress.
          </p>
        </header>

        {/* ERROR MESSAGE */}
        {error && (
          <div
            role="alert"
            className="flex min-w-0 flex-col items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 sm:text-base"
          >
            <p className="break-words">{error}</p>

            <button
              type="button"
              onClick={fetchDonations}
              disabled={loading}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-current px-4 py-2 font-bold transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <section
          aria-label="Donation summary"
          className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2"
        >
          {/* Total Donations */}
          <article className="flex min-w-0 flex-col justify-between gap-4 rounded-xl border-2 border-secondary/15 p-4 sm:p-6 md:p-7">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={impact}
                alt=""
                aria-hidden="true"
                className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
              />

              <h2 className="min-w-0 break-words font-body text-base font-medium text-heading sm:text-lg">
                Total Donations
              </h2>
            </div>

            <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="font-app-heading text-4xl font-extrabold text-heading sm:text-5xl">
                {loading ? "—" : totalDonations}
              </p>

              <span className="text-sm font-medium text-secondary/80 sm:text-base">
                food donations
              </span>
            </div>
          </article>

          {/* Delivered Donations */}
          <article className="flex min-w-0 flex-col justify-between gap-4 rounded-xl border-2 border-secondary/15 p-4 sm:p-6 md:p-7">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={monthAvg}
                alt=""
                aria-hidden="true"
                className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
              />

              <h2 className="min-w-0 break-words font-body text-base font-medium text-heading sm:text-lg">
                Successfully Delivered
              </h2>
            </div>

            <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="font-app-heading text-4xl font-extrabold text-heading sm:text-5xl">
                {loading ? "—" : deliveredCount}
              </p>

              <span className="text-sm font-medium text-secondary/80 sm:text-base">
                donations
              </span>
            </div>
          </article>
        </section>

        {/* FILTERS AND REFRESH */}
        <section
          aria-label="Donation filters"
          className="flex min-w-0 flex-col gap-3 rounded-xl border-2 border-secondary/15 p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:p-4"
        >
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={filter}
              alt=""
              aria-hidden="true"
              className="h-6 w-6 shrink-0 object-contain"
            />

            <label className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-full border-2 border-secondary/15 bg-tertiary/80 px-3 py-2 text-sm font-medium sm:flex-none sm:justify-start sm:px-4">
              <span>Status</span>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="min-w-0 max-w-[65%] cursor-pointer bg-transparent text-inactive outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 sm:max-w-none"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Assigned">Assigned</option>
                <option value="In Transit">In transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={fetchDonations}
            disabled={loading}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-secondary/20 px-4 py-2 text-sm font-bold text-secondary/90 transition hover:bg-tertiary disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto sm:w-auto sm:text-base"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </section>

        {/* DONATION LIST */}
        <section
          aria-label="Donation history list"
          className="min-w-0 overflow-hidden rounded-xl border-2 border-tertiary"
        >
          {/* DESKTOP TABLE HEADER */}
          <div className="hidden grid-cols-[1fr_1.5fr_0.7fr_1fr_1fr] items-center gap-3 border-b-2 border-secondary/25 px-4 py-4 text-center text-sm font-semibold lg:grid xl:px-5">
            <div>Date</div>
            <div>Donation Details</div>
            <div>Quantity</div>
            <div>Status</div>
            <div>Pickup QR</div>
          </div>

          {loading ? (
            <div
              className="flex min-h-40 items-center justify-center gap-3 p-6 text-center text-sm text-inactive sm:text-base"
              role="status"
            >
              <RefreshCw size={18} className="animate-spin" />
              Loading your donations...
            </div>
          ) : visibleDonations.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center p-5 text-center sm:p-10">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                <QrCode size={24} className="text-secondary/80" />
              </div>

              <h3 className="font-app-heading text-lg font-bold sm:text-xl">
                No donations found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-inactive sm:text-base">
                {status === "All"
                  ? "Your donation history will appear here when you have submitted donations."
                  : `No donations with the status "${status}" were found. Try selecting another status.`}
              </p>

              {status !== "All" && (
                <button
                  type="button"
                  onClick={() => setStatus("All")}
                  className="mt-4 rounded-lg border border-secondary/20 px-4 py-2 text-sm font-bold text-secondary transition hover:bg-tertiary"
                >
                  Show all donations
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-secondary/20">
              {visibleDonations.map((donation) => {
                const currentStatus = formatStatus(donation);
                const pickupToken = donation.delivery?.pickupQrToken;

                return (
                  <article
                    key={`${donation.donationId}-${donation.delivery?.id || "none"}`}
                    className="grid min-w-0 grid-cols-1 gap-5 p-4 sm:p-5 lg:grid-cols-[1fr_1.5fr_0.7fr_1fr_1fr] lg:items-center lg:gap-3 lg:px-4 xl:px-5"
                  >
                    {/* DATE */}
                    <div className="flex min-w-0 flex-col gap-1 lg:items-center lg:text-center">
                      <span className="text-xs font-semibold uppercase tracking-wide text-inactive lg:hidden">
                        Date
                      </span>

                      <span className="break-words text-sm font-medium sm:text-base">
                        {formatDate(donation.dateTime)}
                      </span>

                      {donation.expectedExpiryTime && (
                        <span className="break-words text-xs leading-5 text-inactive">
                          Expires: {formatDate(donation.expectedExpiryTime)}
                        </span>
                      )}
                    </div>

                    {/* DONATION DETAILS */}
                    <div className="flex min-w-0 flex-col gap-1 lg:items-center lg:text-center">
                      <span className="text-xs font-semibold uppercase tracking-wide text-inactive lg:hidden">
                        Donation details
                      </span>

                      <h3 className="break-words font-app-heading text-base font-bold capitalize sm:text-lg">
                        {donation.foodName || "Food donation"}
                      </h3>

                      <span className="break-words text-sm text-inactive">
                        {donation.foodType || "Food type not specified"}
                      </span>
                    </div>

                    {/* QUANTITY */}
                    <div className="flex min-w-0 items-center justify-between gap-3 lg:flex-col lg:items-center lg:justify-center">
                      <span className="text-xs font-semibold uppercase tracking-wide text-inactive lg:hidden">
                        Quantity
                      </span>

                      <p className="break-words text-lg font-bold sm:text-xl">
                        {donation.quantity ?? "—"}
                      </p>
                    </div>

                    {/* STATUS */}
                    <div className="flex min-w-0 flex-col items-start gap-2 lg:items-center lg:text-center">
                      <span className="text-xs font-semibold uppercase tracking-wide text-inactive lg:hidden">
                        Status
                      </span>

                      <span
                        className={`inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold sm:text-sm ${statusClass(currentStatus)}`}
                      >
                        <span className="h-2 w-2 shrink-0 rounded-full bg-current" />
                        <span className="break-words">{currentStatus}</span>
                      </span>

                      {donation.delivery?.pickupScannedAt && (
                        <p className="break-words text-xs leading-5 text-inactive">
                          Picked up{" "}
                          {formatDate(donation.delivery.pickupScannedAt)}
                        </p>
                      )}

                      {donation.delivery?.deliveredAt && (
                        <p className="break-words text-xs leading-5 text-inactive">
                          Delivered{" "}
                          {formatDate(donation.delivery.deliveredAt)}
                        </p>
                      )}
                    </div>

                    {/* PICKUP QR */}
                    <div className="flex min-w-0 flex-col items-start gap-2 lg:items-center">
                      <span className="text-xs font-semibold uppercase tracking-wide text-inactive lg:hidden">
                        Pickup QR
                      </span>

                      {pickupToken &&
                      ["assigned", "in_transit"].includes(
                        donation.delivery?.status
                      ) ? (
                        <details className="w-full min-w-0 lg:text-center">
                          <summary className="inline-flex min-h-10 w-full cursor-pointer list-none items-center justify-center gap-2 rounded-lg border border-secondary/20 px-3 py-2 text-sm font-bold text-secondary transition hover:bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary sm:w-auto">
                            <QrCode size={18} className="shrink-0" />
                            View QR
                          </summary>

                          <div className="mt-3 flex min-w-0 flex-col items-center gap-3 rounded-xl border border-secondary/20 bg-white p-3">
                            <QRCodeSVG
                              value={pickupToken}
                              size={160}
                              level="M"
                              className="h-auto max-w-full"
                            />

                            <p className="max-w-xs text-center text-xs leading-5 text-gray-700">
                              Show this QR code to the assigned delivery
                              partner at pickup.
                            </p>
                          </div>
                        </details>
                      ) : (
                        <span className="break-words text-sm leading-5 text-inactive">
                          {currentStatus === "Delivered"
                            ? "Pickup completed"
                            : "QR not available yet"}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* PAGINATION */}
        <nav
          aria-label="Donation history pagination"
          className="flex min-w-0 flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
        >
          <button
            type="button"
            onClick={() =>
              setPage((previous) => Math.max(1, previous - 1))
            }
            disabled={page === 1 || loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-2 border-secondary/20 px-4 py-2 text-sm font-bold text-secondary/80 transition hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-40 sm:text-base"
          >
            <ArrowLeft size={20} strokeWidth={3} />
            Previous
          </button>

          <p className="order-first text-center text-sm font-medium sm:order-none sm:text-base">
            Page{" "}
            <span className="mx-1 inline-flex min-w-8 items-center justify-center rounded-full bg-secondary/80 px-3 py-1 font-bold text-brown">
              {page}
            </span>{" "}
            of {totalPages}
          </p>

          <button
            type="button"
            onClick={() =>
              setPage((previous) => Math.min(totalPages, previous + 1))
            }
            disabled={page >= totalPages || loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-2 border-secondary/20 px-4 py-2 text-sm font-bold text-secondary/80 transition hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-40 sm:text-base"
          >
            Next
            <ArrowRight size={20} strokeWidth={3} />
          </button>
        </nav>
      </div>
    </main>
  );
};