import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getTokenFromScan = (decodedText) => {
  const value = decodedText.trim();

  try {
    const url = new URL(value);
    const token = url.searchParams.get("qrToken");
    if (token) return token;
  } catch {
    // The QR content may simply be the token itself.
  }

  try {
    const parsed = JSON.parse(value);
    if (typeof parsed.qrToken === "string") {
      return parsed.qrToken;
    }
  } catch {
    // Plain-text token.
  }

  return value;
};

const formatDate = (value) => {
  if (!value) return "Not recorded";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not recorded"
    : date.toLocaleString();
};

const statusStyle = {
  pending: "bg-gray-100 text-gray-700",
  assigned: "bg-blue-100 text-blue-800",
  in_transit: "bg-amber-100 text-amber-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

export default function DeliveryPartnerDashboard({
  accessToken = "",
}) {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const [scanError, setScanError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [submittingScan, setSubmittingScan] = useState(false);

  const scannerRef = useRef(null);
  const scannerRunningRef = useRef(false);
  const processingRef = useRef(false);
  const mountedRef = useRef(true);

  const [isAvailable, setIsAvailable] = useState(false);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState("");

  const authHeaders = useCallback(() => {
    const headers = {};

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return headers;
  }, [accessToken]);

  const handleAvailabilityChange = async () => {
    setPageError("");
    setAvailabilityMessage("");
    setUpdatingAvailability(true);

    try {
      let location = {};

      if (!isAvailable) {
        if (!navigator.geolocation) {
          throw new Error("Geolocation is not supported.");
        }

        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0,
            }
          );
        });

        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      }

      const response = await fetch(
        `${API_URL}/delivery/availability`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
          },
          body: JSON.stringify({
            isAvailable: !isAvailable,
            ...location,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update availability.");
      }

      setIsAvailable(data.partner.isAvailable);
      setAvailabilityMessage(data.message);
    } catch (error) {
      if (error.code === 1) {
        setPageError("Please allow location permission to go online.");
      } else if (error.code === 2) {
        setPageError("Your current location is unavailable. Try again.");
      } else if (error.code === 3) {
        setPageError("Location request timed out. Please try again.");
      } else {
        setPageError(error.message || "Unable to update availability.");
      }
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const loadDeliveries = useCallback(async () => {
    setPageError("");

    try {
      const response = await fetch(
        `${API_URL}/delivery/my-deliveries`,
        {
          method: "GET",
          credentials: "include",
          headers: authHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Please log in again. Your session may have expired."
            : data.message || "Could not load deliveries."
        );
      }

      if (mountedRef.current) {
        setDeliveries(data.deliveries || []);
      }
    } catch (error) {
      if (mountedRef.current) {
        setPageError(
          error.message || "Unable to connect to the server."
        );
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [authHeaders]);

  useEffect(() => {
    mountedRef.current = true;
    loadDeliveries();

    return () => {
      mountedRef.current = false;
    };
  }, [loadDeliveries]);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;

    if (scanner && scannerRunningRef.current) {
      try {
        await scanner.stop();
      } catch (error) {
        console.warn("Could not stop QR scanner:", error);
      }

      scannerRunningRef.current = false;
    }

    if (mountedRef.current) {
      setScanning(false);
    }
  }, []);

  const handleDecodedQR = useCallback(
    async (decodedText) => {
      if (processingRef.current) return;

      processingRef.current = true;
      setSubmittingScan(true);
      setScanMessage("");
      setScanError("");

      await stopScanner();

      try {
        const qrToken = getTokenFromScan(decodedText);

        if (!qrToken) {
          throw new Error("The QR code does not contain a token.");
        }

        const response = await fetch(
          `${API_URL}/delivery/scan`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...authHeaders(),
            },
            body: JSON.stringify({ qrToken }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "QR scan failed.");
        }

        setScanMessage(data.message || "Scan successful.");

        await loadDeliveries();
      } catch (error) {
        setScanError(
          error.message || "Unable to process this QR code."
        );
      } finally {
        processingRef.current = false;

        if (mountedRef.current) {
          setSubmittingScan(false);
        }
      }
    },
    [authHeaders, loadDeliveries, stopScanner]
  );

  const startScanner = async () => {
    setScanError("");
    setScanMessage("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setScanError(
        "Camera access requires HTTPS or localhost in a supported browser."
      );
      return;
    }

    try {
      const scanner = new Html5Qrcode("delivery-qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1,
        },
        (decodedText) => {
          handleDecodedQR(decodedText);
        },
        () => {
          // Ignore frames without a QR code.
        }
      );

      scannerRunningRef.current = true;
      setScanning(true);
    } catch (error) {
      scannerRef.current = null;
      setScanning(false);
      setScanError(
        error.message ||
          "Unable to start camera. Allow camera permission and try again."
      );
    }
  };

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;

      if (scanner && scannerRunningRef.current) {
        scanner
          .stop()
          .catch(() => {})
          .finally(() => {
            scanner.clear().catch(() => {});
          });
      } else if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
  }, []);

  const assignedCount = deliveries.filter(
    (item) => item.status === "assigned"
  ).length;

  const inTransitCount = deliveries.filter(
    (item) => item.status === "in_transit"
  ).length;

  const deliveredCount = deliveries.filter(
    (item) => item.status === "delivered"
  ).length;

  const stats = [
    {
      label: "Assigned",
      count: assignedCount,
      color: "text-blue-700",
      accent: "border-l-blue-500",
    },
    {
      label: "In transit",
      count: inTransitCount,
      color: "text-amber-700",
      accent: "border-l-amber-500",
    },
    {
      label: "Delivered",
      count: deliveredCount,
      color: "text-emerald-700",
      accent: "border-l-emerald-500",
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-gray-50 px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-5xl space-y-4 sm:space-y-6">
        {/* Header */}
        <header className="overflow-hidden rounded-xl bg-emerald-900 p-5 text-white sm:rounded-2xl sm:p-7 lg:p-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-emerald-200 sm:text-sm sm:tracking-widest">
            HUNGERBRIDGE
          </p>

          <h1 className="mt-3 break-words text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
            Delivery Partner Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-100 sm:text-base">
            Scan the assigned delivery QR code at pickup and again
            at the NGO handover.
          </p>
        </header>

        {/* Availability */}
        <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5 lg:p-6">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Delivery availability
              </h2>

              <p className="mt-1 text-sm leading-5 text-gray-500 sm:max-w-xl">
                Share your current location when you are ready to accept
                deliveries.
              </p>

              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-gray-700">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    isAvailable ? "bg-emerald-500" : "bg-gray-400"
                  }`}
                />
                Status: {isAvailable ? "Available" : "Unavailable"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAvailabilityChange}
              disabled={updatingAvailability}
              className={`w-full shrink-0 rounded-lg px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-40 sm:px-5 sm:text-base ${
                isAvailable
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-emerald-800 hover:bg-emerald-900"
              }`}
            >
              {updatingAvailability
                ? "Updating..."
                : isAvailable
                  ? "I'm Unavailable"
                  : "I'm Available"}
            </button>
          </div>

          {availabilityMessage && (
            <p
              role="status"
              className="mt-3 break-words rounded-lg bg-emerald-50 p-3 text-sm leading-5 text-emerald-800"
            >
              {availabilityMessage}
            </p>
          )}
        </section>

        {/* Delivery statistics */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {stats.map(({ label, count, color, accent }) => (
            <div
              key={label}
              className={`min-w-0 rounded-xl border border-gray-200 border-l-4 ${accent} bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5`}
            >
              <p className="text-sm text-gray-500">{label}</p>
              <p className={`mt-2 text-3xl font-bold ${color}`}>
                {count}
              </p>
            </div>
          ))}
        </section>

        {/* QR Scanner */}
        <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5 lg:p-6">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                QR Scanner
              </h2>
              <p className="mt-1 text-sm leading-5 text-gray-500">
                Scan only the QR code for your assigned delivery.
              </p>
            </div>

            {!scanning ? (
              <button
                type="button"
                onClick={startScanner}
                disabled={submittingScan}
                className="w-full shrink-0 rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-base"
              >
                Open camera
              </button>
            ) : (
              <button
                type="button"
                onClick={stopScanner}
                className="w-full shrink-0 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto sm:text-base"
              >
                Stop camera
              </button>
            )}
          </div>

          <div
            id="delivery-qr-reader"
            className="mx-auto mt-5 w-full max-w-md overflow-hidden rounded-xl"
          />

          {submittingScan && (
            <p
              role="status"
              className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600"
            >
              Processing scan...
            </p>
          )}

          {scanMessage && (
            <div
              role="status"
              className="mt-4 break-words rounded-lg bg-emerald-50 p-3 text-sm leading-5 text-emerald-800 sm:p-4"
            >
              {scanMessage}
            </div>
          )}

          {scanError && (
            <div
              role="alert"
              className="mt-4 break-words rounded-lg bg-red-50 p-3 text-sm leading-5 text-red-700 sm:p-4"
            >
              {scanError}
            </div>
          )}

          <p className="mt-4 text-xs leading-5 text-gray-500 sm:text-sm">
            The backend controls delivery status. A successful first
            scan records pickup; the next scan records handover.
          </p>
        </section>

        {/* My deliveries */}
        <section className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                My deliveries
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                View your assigned deliveries and scan history.
              </p>
            </div>

            <button
              type="button"
              onClick={loadDeliveries}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Loading..." : "Refresh deliveries"}
            </button>
          </div>

          {pageError && (
            <div
              role="alert"
              className="break-words rounded-lg border border-red-100 bg-red-50 p-3 text-sm leading-5 text-red-700 sm:p-4"
            >
              {pageError}
            </div>
          )}

          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500 sm:rounded-2xl sm:p-8">
              Loading your deliveries...
            </div>
          ) : deliveries.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center sm:rounded-2xl sm:p-10">
              <h3 className="font-semibold text-gray-900">
                No assigned deliveries yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                New deliveries will appear here when an eligible
                partner is assigned.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {deliveries.map((item) => (
                <article
                  key={item.id}
                  className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5 lg:p-6"
                >
                  <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="break-words text-lg font-bold text-gray-900 sm:text-xl">
                        {item.donation?.foodName || "Food donation"}
                      </h3>
                      <p className="mt-1 break-words text-sm text-gray-500">
                        Delivery #{item.id}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit max-w-full shrink-0 break-words rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusStyle[item.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.status?.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Food type
                      </p>
                      <p className="mt-1 break-words text-sm font-medium text-gray-900">
                        {item.donation?.foodType || "Not provided"}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Quantity
                      </p>
                      <p className="mt-1 break-words text-sm font-medium text-gray-900">
                        {item.donation?.quantity ?? "Not provided"}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        NGO
                      </p>
                      <p className="mt-1 break-words text-sm font-medium text-gray-900">
                        {item.ngo?.name || "NGO"}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Assigned at
                      </p>
                      <p className="mt-1 break-words text-sm font-medium text-gray-900">
                        {formatDate(item.assignedAt)}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Pickup scan
                      </p>
                      <p className="mt-1 break-words text-sm font-medium text-gray-900">
                        {formatDate(item.pickupScannedAt)}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Handover scan
                      </p>
                      <p className="mt-1 break-words text-sm font-medium text-gray-900">
                        {formatDate(item.handoverScannedAt)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}