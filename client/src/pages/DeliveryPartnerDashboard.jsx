
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
  } catch { }

  try {
    const parsed = JSON.parse(value);
    if (typeof parsed.qrToken === "string") return parsed.qrToken;
  } catch { }

  return value;
};

const formatDate = (value) => {
  if (!value) return "Not recorded";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not recorded"
    : date.toLocaleString();
};

const formatReading = (value, unit = "") => {
  if (value === null || value === undefined || value === "") {
    return "Waiting for data";
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? `${number.toFixed(1)}${unit}`
    : "Waiting for data";
};

const statusStyle = {
  pending: "bg-gray-100 text-gray-700",
  assigned: "bg-blue-100 text-blue-800",
  in_transit: "bg-amber-100 text-amber-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

function SensorCard({ label, value, unit, description }) {
  return (
    <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-2 break-words text-2xl font-bold text-gray-900">
        {formatReading(value, unit)}
      </p>

      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );
}


function IoTBoxCard({ box, latestReading }) {
  const reading = latestReading ?? box?.latestReading ?? null;

  if (!box) {
    return (
      <section className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 sm:p-5">
        <h4 className="font-semibold text-gray-900">
          ZeroWaste Box
        </h4>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          No IoT box has been linked to this donation yet.
        </p>
      </section>
    );
  }

  return (
    <section className="min-w-0 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">
            ZeroWaste Box · IoT Monitoring
          </p>

          <h4 className="mt-2 break-words text-lg font-bold text-gray-900">
            {box.boxCode || box.box_code || "Registered IoT box"}
          </h4>

          <p className="mt-1 break-words text-sm text-gray-600">
            Box ID: {box.id ?? box.boxId ?? "Not available"}
          </p>
        </div>

        <span
          className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${box.isActive ?? box.is_active
              ? "bg-emerald-100 text-emerald-800"
              : "bg-gray-200 text-gray-700"
            }`}
        >
          {(box.isActive ?? box.is_active)
            ? "Registered · Active"
            : "Inactive"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SensorCard
          label="Air temperature"
          value={reading?.temperature}
          unit=" °C"
          description="Temperature inside the box"
        />

        <SensorCard
          label="Food temperature"
          value={reading?.foodTemperature ?? reading?.food_temperature}
          unit=" °C"
          description="Measured by the food probe"
        />

        <SensorCard
          label="Humidity"
          value={reading?.humidity}
          unit="%"
          description="Relative air humidity"
        />
      </div>

      <div className="mt-4 flex flex-col gap-1 border-t border-emerald-100 pt-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-600">
          Last sensor reading:{" "}
          <span className="font-medium text-gray-900">
            {formatDate(reading?.recordedAt ?? reading?.recorded_at)}
          </span>
        </p>

        <p className="text-gray-500">
          Box last seen:{" "}
          {formatDate(box.lastSeenAt ?? box.last_seen_at)}
        </p>
      </div>

      {!reading && (
        <p className="mt-3 rounded-lg bg-white p-3 text-sm leading-5 text-amber-800">
          The box is registered, but no sensor readings are available yet.
          Refresh after the ESP32 successfully sends its next reading.
        </p>
      )}
    </section>
  );
}


export default function DeliveryPartnerDashboard({
  accessToken = "",
}) {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const loadDeliveries = useCallback(async (showRefresh = false) => {
    setPageError("");

    if (showRefresh) {
      setRefreshing(true);
    }

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

        if (typeof data.isAvailable === "boolean") {
          setIsAvailable(data.isAvailable);
        }
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
        setRefreshing(false);
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

        const response = await fetch(`${API_URL}/delivery/scan`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
          },
          body: JSON.stringify({ qrToken }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "QR scan failed.");
        }

        setScanMessage(data.message || "Scan successful.");
        await loadDeliveries(true);
      } catch (error) {
        setScanError(error.message || "Unable to process this QR code.");
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
        () => { }
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
          .catch(() => { })
          .finally(() => {
            scanner.clear().catch(() => { });
          });
      } else if (scanner) {
        scanner.clear().catch(() => { });
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
        <header className="overflow-hidden rounded-xl bg-emerald-900 p-5 text-white sm:rounded-2xl sm:p-7 lg:p-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-emerald-200 sm:text-sm">
            HUNGERBRIDGE
          </p>

          <h1 className="mt-3 break-words text-2xl font-bold sm:text-3xl lg:text-4xl">
            Delivery Partner Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-100 sm:text-base">
            Manage deliveries, scan pickup and handover QR codes,
            and monitor food conditions using ZeroWaste Box.
          </p>
        </header>

        {/* Availability */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Delivery availability
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Share your location when you are ready for deliveries.
              </p>

              <p className="mt-3 text-sm font-medium text-gray-700">
                <span
                  className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-gray-400"
                    }`}
                />
                Status: {isAvailable ? "Available" : "Unavailable"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAvailabilityChange}
              disabled={updatingAvailability}
              className={`w-full rounded-lg px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto ${isAvailable
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
            <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
              {availabilityMessage}
            </p>
          )}
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {stats.map(({ label, count, color, accent }) => (
            <div
              key={label}
              className={`rounded-xl border border-gray-200 border-l-4 ${accent} bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5`}
            >
              <p className="text-sm text-gray-500">{label}</p>
              <p className={`mt-2 text-3xl font-bold ${color}`}>
                {count}
              </p>
            </div>
          ))}
        </section>

        {/* QR Scanner */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                QR Scanner
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Scan the assigned delivery QR at pickup and NGO handover.
              </p>
            </div>

            {!scanning ? (
              <button
                type="button"
                onClick={startScanner}
                disabled={submittingScan}
                className="w-full rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-60 sm:w-auto"
              >
                Open camera
              </button>
            ) : (
              <button
                type="button"
                onClick={stopScanner}
                className="w-full rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto"
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
            <p className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
              Processing scan...
            </p>
          )}

          {scanMessage && (
            <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
              {scanMessage}
            </p>
          )}

          {scanError && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {scanError}
            </p>
          )}
        </section>

        {/* My deliveries and IoT boxes */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                My deliveries
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                View delivery progress and associated IoT sensor readings.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadDeliveries(true)}
              disabled={loading || refreshing}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-100 disabled:opacity-60 sm:w-auto"
            >
              {refreshing ? "Refreshing..." : "Refresh dashboard"}
            </button>
          </div>

          {pageError && (
            <div role="alert" className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
              {pageError}
            </div>
          )}

          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
              Loading your deliveries...
            </div>
          ) : deliveries.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center sm:p-10">
              <h3 className="font-semibold text-gray-900">
                No assigned deliveries yet
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Deliveries will appear here after a delivery partner is assigned.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {deliveries.map((item) => (
                <article
                  key={item.id}
                  className="min-w-0 space-y-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="break-words text-lg font-bold text-gray-900 sm:text-xl">
                        {item.donation?.foodName || "Food donation"}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Delivery #{item.id}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[item.status] || "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {item.status?.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Food type
                      </p>
                      <p className="mt-1 break-words text-sm font-medium text-gray-900">
                        {item.donation?.foodType || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Quantity
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {item.donation?.quantity ?? "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        NGO
                      </p>
                      <p className="mt-1 break-words text-sm font-medium text-gray-900">
                        {item.ngo?.name || "NGO"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Assigned at
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {formatDate(item.assignedAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Pickup scan
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {formatDate(item.pickupScannedAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Handover scan
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {formatDate(item.handoverScannedAt)}
                      </p>
                    </div>
                  </div>


                  <IoTBoxCard
                    box={item.iotBox ?? item.iot?.box ?? null}
                    latestReading={
                      item.iot?.latestReading ??
                      item.iotBox?.latestReading ??
                      item.iot?.box?.latestReading ??
                      null
                    }
                  />

                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
