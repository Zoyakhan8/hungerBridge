
import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getTokenFromScan = (decodedText) => {
  const value = decodedText.trim();

  // Support a QR code containing a URL such as ?qrToken=...
  try {
    const url = new URL(value);
    const token = url.searchParams.get("qrToken");
    if (token) return token;
  } catch {
    // The QR content may simply be the token itself.
  }

  // Also support a QR code containing {"qrToken":"..."}.
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

  const authHeaders = useCallback(() => {
    const headers = {};

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return headers;
  }, [accessToken]);

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
      if (mountedRef.current) setLoading(false);
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

    if (mountedRef.current) setScanning(false);
  }, []);

  const handleDecodedQR = useCallback(
    async (decodedText) => {
      if (processingRef.current) return;

      processingRef.current = true;
      setSubmittingScan(true);
      setScanMessage("");
      setScanError("");

      // Stop the camera to prevent repeated submissions.
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
        if (mountedRef.current) setSubmittingScan(false);
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
        scanner.stop()
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

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl bg-emerald-900 p-6 text-white sm:p-8">
          <p className="text-sm font-semibold tracking-widest text-emerald-200">
            HUNGERBRIDGE
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Delivery Partner Dashboard
          </h1>

          <p className="mt-2 text-sm text-emerald-100">
            Scan the assigned delivery QR code at pickup and again
            at the NGO handover.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ["Assigned", assignedCount, "text-blue-700"],
            ["In transit", inTransitCount, "text-amber-700"],
            ["Delivered", deliveredCount, "text-emerald-700"],
          ].map(([label, count, color]) => (
            <div
              key={label}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500">{label}</p>
              <p className={`mt-2 text-3xl font-bold ${color}`}>
                {count}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">QR Scanner</h2>
              <p className="mt-1 text-sm text-gray-500">
                Scan only the QR code for your assigned delivery.
              </p>
            </div>

            {!scanning ? (
              <button
                type="button"
                onClick={startScanner}
                disabled={submittingScan}
                className="rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900 disabled:opacity-60"
              >
                Open camera
              </button>
            ) : (
              <button
                type="button"
                onClick={stopScanner}
                className="rounded-lg border px-5 py-3 font-semibold hover:bg-gray-50"
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
            <p className="mt-4 text-sm text-gray-600">
              Processing scan...
            </p>
          )}

          {scanMessage && (
            <div
              role="status"
              className="mt-4 rounded-lg bg-emerald-50 p-4 text-emerald-800"
            >
              {scanMessage}
            </div>
          )}

          {scanError && (
            <div
              role="alert"
              className="mt-4 rounded-lg bg-red-50 p-4 text-red-700"
            >
              {scanError}
            </div>
          )}

          <p className="mt-4 text-xs leading-5 text-gray-500">
            The backend controls delivery status. A successful first
            scan records pickup; the next scan records handover.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">My deliveries</h2>

            <button
              type="button"
              onClick={loadDeliveries}
              disabled={loading}
              className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-100 disabled:opacity-60"
            >
              Refresh
            </button>
          </div>

          {pageError && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 p-4 text-red-700"
            >
              {pageError}
            </div>
          )}

          {loading ? (
            <p className="rounded-xl border bg-white p-6 text-gray-500">
              Loading your deliveries...
            </p>
          ) : deliveries.length === 0 ? (
            <div className="rounded-xl border bg-white p-8 text-center">
              <h3 className="font-semibold">No assigned deliveries yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                New deliveries will appear here when an eligible
                partner is assigned.
              </p>
            </div>
          ) : (
            deliveries.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">
                      {item.donation?.foodName || "Food donation"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Delivery #{item.id}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyle[item.status] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.status?.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-gray-500">Food type</p>
                    <p className="font-medium">
                      {item.donation?.foodType || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Quantity</p>
                    <p className="font-medium">
                      {item.donation?.quantity ?? "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">NGO</p>
                    <p className="font-medium">
                      {item.ngo?.name || "NGO"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Assigned at</p>
                    <p className="font-medium">
                      {formatDate(item.assignedAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Pickup scan</p>
                    <p className="font-medium">
                      {formatDate(item.pickupScannedAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Handover scan</p>
                    <p className="font-medium">
                      {formatDate(item.handoverScannedAt)}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
