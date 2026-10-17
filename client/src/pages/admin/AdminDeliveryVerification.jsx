
import { ArrowLeft, ArrowRight, Truck, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminHeader } from "./AdminHeader";
import {
  AdminSidebar,
  DEFAULT_ADMIN_NAVIGATION,
} from "./AdminSidebar";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const AdminDeliveryVerification = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleNavigate = () => setMobileOpen(false);

  const getPendingPartners = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${API_URL}/admin/delivery-partners/pending`,
        { credentials: "include" }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Unable to load delivery partners.");
      }

      const list = result.partners || [];
      setPartners(list);

      setSelectedPartner((current) => {
        if (current) {
          const stillPending = list.find((p) => p.id === current.id);
          if (stillPending) return stillPending;
        }
        return list[0] || null;
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPendingPartners();
  }, []);

  const handleVerification = async (partnerId) => {
    try {
      setVerifying(true);
      setError("");
      setMessage("");

      const res = await fetch(
        `${API_URL}/admin/delivery-partners/${partnerId}/verify`,
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
        throw new Error(result.message || "Verification failed.");
      }

      setMessage("Delivery partner verified successfully.");
      const remaining = partners.filter((p) => p.id !== partnerId);

      setPartners(remaining);
      setSelectedPartner(remaining[0] || null);
    } catch (err) {
      setError(err.message || "Unable to verify partner.");
    } finally {
      setVerifying(false);
    }
  };

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

        <div className="flex flex-col gap-6 bg-brown p-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-heading text-4xl font-app-heading font-extrabold md:text-5xl">
              Delivery Partner Verification
            </h1>
            <p className="text-inactive/90 font-body font-medium">
              Review delivery partner registrations and approve eligible partners.
            </p>
          </div>

          {message && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            {/* LEFT: PARTNER ROSTER */}
            <section className="min-w-0 overflow-hidden rounded-lg border border-secondary/30">
              <div className="flex items-center justify-between gap-3 bg-tertiary px-5 py-4">
                <h2 className="font-app-heading text-lg font-extrabold">
                  Pending Partners
                </h2>

                <span className="rounded-full bg-brown px-3 py-1 text-sm font-bold">
                  {partners.length} Pending
                </span>
              </div>

              {loading ? (
                <p className="p-6 text-inactive">Loading delivery partners...</p>
              ) : partners.length === 0 ? (
                <div className="p-8 text-center">
                  <ShieldCheck
                    size={42}
                    className="mx-auto mb-3 text-primary"
                  />
                  <h3 className="font-app-heading text-lg font-bold">
                    All caught up!
                  </h3>
                  <p className="mt-1 text-sm text-inactive">
                    There are no pending delivery partner registrations.
                  </p>
                  <button
                    onClick={getPendingPartners}
                    className="mt-4 rounded-md border border-secondary/30 px-4 py-2 font-bold hover:bg-tertiary"
                  >
                    Refresh
                  </button>
                </div>
              ) : (
                <div className="space-y-3 p-3">
                  {partners.map((partner) => (
                    <button
                      key={partner.id}
                      type="button"
                      onClick={() => setSelectedPartner(partner)}
                      className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition ${
                        selectedPartner?.id === partner.id
                          ? "border-primary bg-tertiary"
                          : "border-secondary/20 hover:bg-tertiary/60"
                      }`}
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-tertiary ring-1 ring-secondary/20">
                        <Truck size={26} className="text-primary" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-app-heading text-lg font-bold capitalize">
                          {partner.fullName}
                        </h3>
                        <p className="truncate text-sm text-inactive">
                          {partner.email}
                        </p>
                        <p className="mt-1 text-xs text-inactive">
                          {partner.vehicleType || "Vehicle not specified"}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700">
                        Pending
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-secondary/20 px-4 py-3">
                <span className="text-sm text-inactive">
                  {partners.length} records
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled
                    className="rounded-md border border-secondary/20 p-2 opacity-40"
                    aria-label="Previous page"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    type="button"
                    disabled
                    className="rounded-md border border-secondary/20 p-2 opacity-40"
                    aria-label="Next page"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </section>

            {/* RIGHT: SELECTED PARTNER DETAILS */}
            <section className="min-w-0 overflow-hidden rounded-lg border border-secondary/20 bg-tertiary shadow-lg">
              {!selectedPartner ? (
                <div className="p-10 text-center text-inactive">
                  Select a delivery partner to view their details.
                </div>
              ) : (
                <>
                  <div className="bg-brown p-5">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-tertiary ring-2 ring-primary">
                        <Truck size={30} className="text-primary" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="break-words font-app-heading text-2xl font-extrabold capitalize">
                          {selectedPartner.fullName}
                        </h2>
                        <p className="break-all text-sm text-inactive">
                          {selectedPartner.email}
                        </p>
                        <span className="mt-2 inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700">
                          Awaiting verification
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="button"
                        disabled={verifying}
                        onClick={() => handleVerification(selectedPartner.id)}
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-secondary px-4 py-3 text-lg font-bold text-brown transition hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ShieldCheck size={20} />
                        {verifying ? "Verifying..." : "Verify Partner"}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 sm:grid-cols-2">
                    <div className="rounded-lg border border-inactive/20 bg-brown p-4">
                      <h3 className="mb-3 border-b border-inactive/20 pb-2 font-app-heading font-extrabold uppercase">
                        Contact Details
                      </h3>

                      <p className="mb-2 text-sm text-inactive/80">
                        Email
                      </p>
                      <p className="mb-4 break-all font-medium">
                        {selectedPartner.email || "Not provided"}
                      </p>

                      <p className="mb-2 text-sm text-inactive/80">
                        Phone Number
                      </p>
                      <p className="break-words font-medium">
                        {selectedPartner.phoneNumber || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-lg border border-inactive/20 bg-brown p-4">
                      <h3 className="mb-3 border-b border-inactive/20 pb-2 font-app-heading font-extrabold uppercase">
                        Vehicle Details
                      </h3>

                      <p className="mb-2 text-sm text-inactive/80">
                        Vehicle Type
                      </p>
                      <p className="mb-4 break-words font-medium">
                        {selectedPartner.vehicleType || "Not provided"}
                      </p>

                      <p className="mb-2 text-sm text-inactive/80">
                        Vehicle Number
                      </p>
                      <p className="break-words font-medium">
                        {selectedPartner.vehicleNumber || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-lg border border-inactive/20 bg-brown p-4 sm:col-span-2">
                      <h3 className="mb-2 font-app-heading font-extrabold uppercase">
                        Registration Details
                      </h3>
                      <p className="text-sm text-inactive/80">
                        Registered on
                      </p>
                      <p className="mt-1 font-medium">
                        {selectedPartner.createdAt
                          ? new Date(
                              selectedPartner.createdAt
                            ).toLocaleString("en-IN")
                          : "Date unavailable"}
                      </p>
                    </div>
                  </div>

                  <p className="px-5 pb-5 text-xs text-inactive">
                    Approval activates the partner's verified status. Confirm
                    the submitted details before approving.
                  </p>
                </>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};