
export const distanceInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const coordinates = [lat1, lon1, lat2, lon2];

    if (
        !coordinates.every(Number.isFinite) ||
        Math.abs(lat1) > 90 ||
        Math.abs(lat2) > 90 ||
        Math.abs(lon1) > 180 ||
        Math.abs(lon2) > 180
    ) {
        throw new Error("Invalid geographic coordinates.");
    }

    const toRadians = (degrees: number) =>
        (degrees * Math.PI) / 180;

    const earthRadiusKm = 6371;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) ** 2;

    const safeA = Math.max(0, Math.min(1, a));

    return (
        2 *
        earthRadiusKm *
        Math.atan2(
            Math.sqrt(safeA),
            Math.sqrt(1 - safeA)
        )
    );
};
