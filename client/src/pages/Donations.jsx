import { ArrowLeft, ArrowRight, RefreshCw, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";
import filter from "../assets/Filter.png";
import monthAvg from "../assets/monthlyAvg.png";
import impact from "../assets/impact.png";

const API_URL ="http://localhost:3000/api";

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
    <div className="flex flex-col gap-6 bg-brown p-6 md:p-10 xl:p-14">
      <div className="flex flex-col justify-center gap-3">
        <h1 className="font-app-heading text-4xl font-extrabold text-heading md:text-5xl">
          Donation History
        </h1>

        <p className="max-w-2xl font-body text-md font-medium text-inactive/90">
          Review your contributions, track food donations, and see their
          delivery progress.
        </p>
      </div>

      {error && (
        <div className="flex flex-col gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-700">
          <p>{error}</p>
          <button
            onClick={fetchDonations}
            className="w-fit rounded-md border border-current px-4 py-2 font-bold"
          >
            Try again
          </button>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-lg border-2 border-secondary/15 p-6 md:p-8">
          <div className="flex items-center gap-2">
            <img src={impact} alt="" />
            <h2 className="font-body text-md font-medium text-heading">
              Total Donations
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-app-heading text-4xl font-extrabold text-heading md:text-5xl">
              {loading ? "—" : totalDonations}
            </h3>
            <span className="text-lg font-medium text-secondary/80">
              food donations
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border-2 border-secondary/15 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <img src={monthAvg} alt="" />
            <h2 className="font-body text-md font-medium text-heading">
              Successfully Delivered
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <h3 className="font-app-heading text-4xl font-extrabold text-heading">
              {loading ? "—" : deliveredCount}
            </h3>
            <span className="text-lg font-medium text-secondary/80">
              donations
            </span>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border-2 border-secondary/15 px-4 py-4">
        <img src={filter} alt="" className="h-6 w-6" />

        <label className="flex items-center gap-2 rounded-full border-2 border-secondary/15 bg-tertiary/80 px-4 py-2 text-sm font-medium">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="max-w-36 bg-transparent outline-none"
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Assigned">Assigned</option>
            <option value="In Transit">In transit</option>
            <option value="Delivered">Delivered</option>
          </select>
        </label>

        <button
          onClick={fetchDonations}
          disabled={loading}
          className="ml-auto inline-flex items-center gap-2 rounded-full border border-secondary/20 px-4 py-2 font-bold text-secondary/90 hover:bg-tertiary disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* DONATION LIST */}
      <div className="overflow-hidden rounded-lg border-2 border-tertiary">
        <div className="hidden grid-cols-[1fr_1.5fr_0.7fr_1fr_1fr] items-center border-b-2 border-secondary/25 px-5 py-4 text-center font-semibold md:grid">
          <div>Date</div>
          <div>Donation Details</div>
          <div>Quantity</div>
          <div>Status</div>
          <div>Pickup QR</div>
        </div>

        {loading ? (
          <p className="p-8 text-center text-inactive">
            Loading your donations...
          </p>
        ) : visibleDonations.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="font-app-heading text-xl font-bold">
              No donations found
            </h3>
            <p className="mt-2 text-inactive">
              Your donation history will appear here when you have submitted
              donations.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-secondary/20">
            {visibleDonations.map((donation) => {
              const currentStatus = formatStatus(donation);
              const pickupToken = donation.delivery?.pickupQrToken;

              return (
                <div
                  key={`${donation.donationId}-${donation.delivery?.id || "none"}`}
                  className="grid grid-cols-1 items-center gap-4 p-5 md:grid-cols-[1fr_1.5fr_0.7fr_1fr_1fr] md:text-center"
                >
                  <div className="flex flex-col gap-1 md:items-center">
                    <span className="text-xs text-inactive md:hidden">
                      Date
                    </span>
                    <span className="font-medium">
                      {formatDate(donation.dateTime)}
                    </span>
                    {donation.expectedExpiryTime && (
                      <span className="text-xs text-inactive">
                        Expires: {formatDate(donation.expectedExpiryTime)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 md:items-center">
                    <span className="text-xs text-inactive md:hidden">
                      Donation
                    </span>
                    <span className="font-app-heading text-lg font-bold capitalize">
                      {donation.foodName || "Food donation"}
                    </span>
                    <span className="text-xs text-inactive">
                      {donation.foodType || "Food type not specified"}
                    </span>
                  </div>

                  <div className="md:text-center">
                    <span className="text-xs text-inactive md:hidden">
                      Quantity
                    </span>
                    <p className="text-xl font-bold">
                      {donation.quantity ?? "—"}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-inactive md:hidden">
                      Status
                    </span>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${statusClass(currentStatus)}`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {currentStatus}
                    </span>

                    {donation.delivery?.pickupScannedAt && (
                      <p className="mt-2 text-xs text-inactive">
                        Picked up{" "}
                        {formatDate(donation.delivery.pickupScannedAt)}
                      </p>
                    )}

                    {donation.delivery?.deliveredAt && (
                      <p className="mt-1 text-xs text-inactive">
                        Delivered{" "}
                        {formatDate(donation.delivery.deliveredAt)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-2 md:items-center">
                    {pickupToken &&
                    ["assigned", "in_transit"].includes(
                      donation.delivery?.status
                    ) ? (
                      <details className="w-full text-center">
                        <summary className="inline-flex cursor-pointer list-none items-center justify-center gap-2 rounded-md border border-secondary/20 px-3 py-2 font-bold text-secondary hover:bg-tertiary">
                          <QrCode size={18} />
                          View QR
                        </summary>

                        <div className="mt-3 flex flex-col items-center gap-2 rounded-lg border border-secondary/20 bg-white p-3">
                          <QRCodeSVG
                            value={pickupToken}
                            size={160}
                            level="M"
                          />
                          <p className="text-xs text-gray-700">
                            Show to the assigned delivery partner at pickup.
                          </p>
                        </div>
                      </details>
                    ) : (
                      <span className="text-sm text-inactive">
                        {currentStatus === "Delivered"
                          ? "Pickup completed"
                          : "QR not available yet"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex flex-wrap items-center justify-between gap-4 font-app-body">
        <button
          onClick={() => setPage((previous) => Math.max(1, previous - 1))}
          disabled={page === 1 || loading}
          className="flex items-center gap-2 rounded-md border-2 border-secondary/20 px-4 py-2 font-bold text-secondary/80 hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft size={20} strokeWidth={3.5} />
          Previous
        </button>

        <span className="text-sm font-medium">
          Page{" "}
          <span className="rounded-full bg-secondary/80 px-3 py-1 font-bold text-brown">
            {page}
          </span>{" "}
          of {totalPages}
        </span>

        <button
          onClick={() =>
            setPage((previous) => Math.min(totalPages, previous + 1))
          }
          disabled={page >= totalPages || loading}
          className="flex items-center gap-2 rounded-md border-2 border-secondary/20 px-4 py-2 font-bold text-secondary/80 hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ArrowRight size={20} strokeWidth={3.5} />
        </button>
      </div>
    </div>
  );
};