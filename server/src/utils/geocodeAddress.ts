
export const geocodeAddress = async (
    address: string
): Promise<{ latitude: number; longitude: number } | null> => {
    const userAgent = process.env.GEOCODING_USER_AGENT;

    if (!userAgent) {
        throw new Error("GEOCODING_USER_AGENT is missing from .env");
    }

    if (typeof address !== "string" || !address.trim()) {
        return null;
    }

    const url = new URL(
        "https://nominatim.openstreetmap.org/search"
    );

    url.searchParams.set("q", address.trim());
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "in");

    const response = await fetch(url, {
        headers: {
            "User-Agent": userAgent,
            "Accept": "application/json",
        },
        signal: AbortSignal.timeout(10000),
    });

    console.log("Address being geocoded:", address);

    console.log("Geocoding HTTP status:", response.status);
    if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
    }

    const results = await response.json();

    console.log("Geocoding results:", results);
    if (!Array.isArray(results) || results.length === 0) {
        return null;
    }

    const latitude = Number(results[0].lat);
    const longitude = Number(results[0].lon);

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        Math.abs(latitude) > 90 ||
        Math.abs(longitude) > 180
    ) {
        return null;
    }

    return { latitude, longitude };
};
