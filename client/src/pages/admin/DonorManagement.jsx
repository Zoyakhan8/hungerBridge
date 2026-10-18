
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, FileText, MapPin, Phone, ShieldCheck, XCircle } from "lucide-react";
import filter from "../../assets/Filter.png";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { AdminHeader } from "./AdminHeader";
import {
  AdminSidebar,
  DEFAULT_ADMIN_NAVIGATION,
} from "./AdminSidebar";

export const DonorManagement = () => {
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const handleNavigate = () => setMobileOpen(false);

  useEffect(() => {
    const getDashboard = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `/api/admin/donor-management?page=${page}`,
          { credentials: "include" }
        );

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || "Failed to load donors.");
        }

        setData(result);

        setSelectedDonor((current) => {
          const donors = result.donors || [];

          if (!donors.length) return null;

          return donors.find(
            (donor) => donor.publicId === current?.publicId
          ) || donors[0];
        });
      } catch (error) {
        setMessage(error.message || "Unable to load donors.");
      } finally {
        setLoading(false);
      }
    };

    getDashboard();
  }, [page]);

  const handleVerification = async (id, status) => {
    setUpdating(true);
    setMessage("");

    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/donors/${id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Unable to update donor status.");
      }

      setSelectedDonor((current) =>
        current?.publicId === id
          ? { ...current, verifyStatus: status }
          : current
      );

      setData((current) => ({
        ...current,
        donors: current.donors.map((donor) =>
          donor.publicId === id
            ? { ...donor, verifyStatus: status }
            : donor
        ),
      }));

      setMessage(
        `Donor ${status === "approved" ? "approved" : "rejected"} successfully.`
      );
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setUpdating(false);
    }
  };

  const isVerified = selectedDonor?.verifyStatus === "approved";

  const panelClass =
    "rounded-xl border border-secondary/15 bg-brown shadow-sm";

  const sectionTitleClass =
    "text-sm font-bold uppercase tracking-wider text-inactive/80";

  const detailLabelClass = "text-xs font-semibold text-inactive/70";
  const detailValueClass = "mt-1 break-words text-sm font-medium text-heading";

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
          searchPlaceholder="Search donors..."
        />

        <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Page heading */}
          <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                Administration
              </p>

              <h1 className="text-2xl font-extrabold tracking-tight text-heading sm:text-3xl">
                Donor Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-inactive">
                Review donor registrations, verify documents, and manage
                food donor accounts.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-secondary/20 bg-tertiary px-4 py-2.5">
              <ShieldCheck size={18} className="text-secondary" />
              <span className="text-sm font-semibold text-heading">
                {data?.total ?? 0} registered donors
              </span>
            </div>
          </header>

          {message && (
            <div
              role="status"
              className="flex items-start justify-between gap-3 rounded-lg border border-secondary/20 bg-tertiary px-4 py-3 text-sm text-heading"
            >
              <p>{message}</p>
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

          {/* Main dashboard */}
          <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(340px,0.9fr)_minmax(0,1.35fr)]">
            {/* Left: Donor roster */}
            <section className={`${panelClass} min-w-0 overflow-hidden`}>
              <div className="border-b border-secondary/15 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-heading">
                      Donor roster
                    </h2>
                    <p className="mt-1 text-xs text-inactive">
                      Select a donor to review their profile.
                    </p>
                  </div>

                  <span className="rounded-full bg-tertiary px-3 py-1 text-xs font-bold text-secondary">
                    {data?.total ?? 0} total
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 rounded-lg border border-secondary/15 bg-tertiary px-3 py-2">
                    <img
                      src={filter}
                      alt=""
                      className="h-4 w-4 object-contain"
                    />
                    <span className="text-xs font-semibold text-heading">
                      Filters
                    </span>
                  </div>

                  <select
                    defaultValue="All"
                    aria-label="Filter by registration period"
                    className="min-w-0 flex-1 rounded-lg border border-secondary/15 bg-brown px-3 py-2 text-xs text-heading outline-none focus:border-secondary"
                  >
                    <option value="All">All time</option>
                    <option value="ThisYear">This year</option>
                    <option value="6Months">Last 6 months</option>
                    <option value="Custom">Custom</option>
                  </select>

                  <select
                    defaultValue="All"
                    aria-label="Filter by donor type"
                    className="min-w-0 flex-1 rounded-lg border border-secondary/15 bg-brown px-3 py-2 text-xs text-heading outline-none focus:border-secondary"
                  >
                    <option value="All">All types</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Caterer">Caterer</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Individual">Individual</option>
                  </select>

                  <select
                    defaultValue="All"
                    aria-label="Filter by verification status"
                    className="min-w-0 flex-1 rounded-lg border border-secondary/15 bg-brown px-3 py-2 text-xs text-heading outline-none focus:border-secondary"
                  >
                    <option value="All">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="divide-y divide-secondary/10">
                {loading ? (
                  <div className="p-10 text-center text-sm text-inactive">
                    Loading donors...
                  </div>
                ) : !data?.donors?.length ? (
                  <div className="p-10 text-center">
                    <ShieldCheck
                      size={30}
                      className="mx-auto mb-3 text-inactive/60"
                    />
                    <p className="font-semibold text-heading">
                      No donors found
                    </p>
                    <p className="mt-1 text-sm text-inactive">
                      Registered donors will appear here.
                    </p>
                  </div>
                ) : (
                  data.donors.map((donor) => {
                    const active =
                      selectedDonor?.publicId === donor.publicId;
                    const approved = donor.verifyStatus === "approved";

                    return (
                      <button
                        key={donor.publicId}
                        type="button"
                        onClick={() => setSelectedDonor(donor)}
                        className={`flex w-full items-center gap-3 p-4 text-left transition-colors sm:gap-4 sm:p-5 ${
                          active
                            ? "bg-tertiary"
                            : "hover:bg-tertiary/50"
                        }`}
                      >
                        {donor.photoUrl ? (
                          <img
                            src={donor.photoUrl}
                            alt=""
                            className="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-secondary/20"
                          />
                        ) : (
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                              active
                                ? "bg-secondary text-brown"
                                : "bg-tertiary text-heading"
                            }`}
                          >
                            {(donor.name || "D")
                              .trim()
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-heading sm:text-base">
                            {donor.name || "Unnamed donor"}
                          </p>
                          <p className="mt-1 truncate text-xs text-inactive">
                            {donor.shopName || "Individual donor"}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                              approved
                                ? "bg-emerald-500/10 text-emerald-700"
                                : donor.verifyStatus === "rejected"
                                  ? "bg-red-500/10 text-red-700"
                                  : "bg-amber-500/10 text-amber-700"
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {approved
                              ? "Verified"
                              : donor.verifyStatus === "rejected"
                                ? "Rejected"
                                : "Pending"}
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

              {/* Pagination */}
              <div className="flex items-center justify-between gap-2 border-t border-secondary/15 p-4">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1 || loading}
                  className="inline-flex items-center gap-2 rounded-lg border border-secondary/20 px-3 py-2 text-xs font-bold text-heading transition hover:bg-tertiary disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
                >
                  <ArrowLeft size={16} />
                  Previous
                </button>

                <span className="text-xs text-inactive sm:text-sm">
                  Page{" "}
                  <strong className="text-heading">
                    {data?.page ?? page}
                  </strong>{" "}
                  of {data?.totalPages ?? 1}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={
                    loading ||
                    page >= (data?.totalPages ?? 1)
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs font-bold text-brown transition hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              </div>
            </section>

            {/* Right: Selected donor details */}
            <section className={`${panelClass} min-w-0 overflow-hidden`}>
              {!selectedDonor ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
                  <ShieldCheck
                    size={40}
                    className="mb-4 text-inactive/50"
                  />
                  <h2 className="text-lg font-bold text-heading">
                    Select a donor
                  </h2>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-inactive">
                    Choose a donor from the roster to review their
                    information and verification documents.
                  </p>
                </div>
              ) : (
                <>
                  {/* Donor profile header */}
                  <div className="border-b border-secondary/15 p-5 sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 items-center gap-4">
                        {selectedDonor.photoUrl ? (
                          <img
                            src={selectedDonor.photoUrl}
                            alt=""
                            className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-secondary/20"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-tertiary text-xl font-extrabold text-heading ring-1 ring-secondary/20">
                            {(selectedDonor.name || "D")
                              .trim()
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <h2 className="break-words text-xl font-extrabold text-heading sm:text-2xl">
                            {selectedDonor.name || "Unnamed donor"}
                          </h2>

                          <p className="mt-1 break-words text-sm text-inactive">
                            {selectedDonor.shopName || "Individual donor"}
                          </p>

                          <span
                            className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                              isVerified
                                ? "bg-emerald-500/10 text-emerald-700"
                                : selectedDonor.verifyStatus === "rejected"
                                  ? "bg-red-500/10 text-red-700"
                                  : "bg-amber-500/10 text-amber-700"
                            }`}
                          >
                            {isVerified ? (
                              <CheckCircle2 size={14} />
                            ) : (
                              <Clock3 size={14} />
                            )}

                            {isVerified
                              ? "Verified donor"
                              : selectedDonor.verifyStatus === "rejected"
                                ? "Verification rejected"
                                : "Awaiting verification"}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleVerification(
                              selectedDonor.publicId,
                              "approved"
                            )
                          }
                          disabled={updating || isVerified}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-bold text-brown transition hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                        >
                          <CheckCircle2 size={16} />
                          Approve
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleVerification(
                              selectedDonor.publicId,
                              "rejected"
                            )
                          }
                          disabled={
                            updating ||
                            selectedDonor.verifyStatus === "rejected"
                          }
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 p-4 sm:p-6">
                    {/* Profile details */}
                    <div>
                      <h3 className={sectionTitleClass}>
                        Donor details
                      </h3>

                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border-secondary/10 bg-tertiary/50 p-4">
                          <div className="flex items-center gap-2 text-inactive">
                            <Phone size={15} />
                            <span className={detailLabelClass}>
                              Contact number
                            </span>
                          </div>

                          <p className={detailValueClass}>
                            {selectedDonor.phoneNumber || "Not provided"}
                          </p>
                        </div>

                        <div className="rounded-lg border border-secondary/10 bg-tertiary/50 p-4">
                          <div className="flex items-center gap-2 text-inactive">
                            <MapPin size={15} />
                            <span className={detailLabelClass}>
                              Shop address
                            </span>
                          </div>

                          <p className={detailValueClass}>
                            {selectedDonor.shopAddress || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    <div>
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className={sectionTitleClass}>
                          Verification documents
                        </h3>

                        <span className="text-xs text-inactive">
                          Review before approval
                        </span>
                      </div>

                      <div className="mt-3 divide-y divide-secondary/10 rounded-lg border border-secondary/15">
                        {[
                          {
                            label: "Aadhaar card",
                            url: selectedDonor.aadharUrl,
                          },
                          {
                            label: "Shop license",
                            url: selectedDonor.shopLicenseUrl,
                          },
                        ].map((document) => (
                          <div
                            key={document.label}
                            className="flex items-center justify-between gap-4 p-3.5 sm:p-4"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tertiary text-secondary">
                                <FileText size={18} />
                              </div>

                              <span className="text-sm font-semibold text-heading">
                                {document.label}
                              </span>
                            </div>

                            {document.url ? (
                              <a
                                href={document.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 rounded-lg border border-secondary/20 px-3 py-2 text-xs font-bold text-secondary transition hover:bg-tertiary"
                              >
                                View document
                              </a>
                            ) : (
                              <span className="shrink-0 text-xs text-inactive">
                                Not uploaded
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Donation activity */}
                    <div>
                      <div className="flex flex-col gap-3 border-b border-secondary/15 pb-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-base font-bold text-heading">
                            Donation activity
                          </h3>

                          <p className="mt-1 text-xs text-inactive">
                            Donation statistics for this donor.
                          </p>
                        </div>

                        {isVerified && (
                          <NavLink
                            to="/admin/donations"
                            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-secondary transition hover:opacity-75"
                          >
                            View all
                            <ArrowRight size={16} />
                          </NavLink>
                        )}
                      </div>

                      {isVerified ? (
                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                          {[
                            { label: "Total donated", value: "—" },
                            { label: "Total quantity", value: "—" },
                            { label: "Total impact", value: "—" },
                          ].map((stat) => (
                            <div
                              key={stat.label}
                              className="rounded-lg border border-secondary/15 bg-tertiary/50 p-4"
                            >
                              <p className="text-xs font-semibold text-inactive">
                                {stat.label}
                              </p>

                              <p className="mt-2 text-2xl font-extrabold text-heading">
                                {stat.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-4 rounded-lg border border-dashed border-secondary/20 bg-tertiary/40 p-5">
                          <p className="text-sm font-semibold text-heading">
                            Donation history is not available yet
                          </p>

                          <p className="mt-1 text-sm leading-6 text-inactive">
                            Approve the donor before reviewing their
                            donation activity.
                          </p>
                        </div>
                      )}
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
