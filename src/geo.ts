export type Coordinates = {
  lat: number;
  lon: number;
};

export const CHARLOTTE: Coordinates = {
  lat: 35.2271,
  lon: -80.8431,
};

const EARTH_RADIUS_KM = 6371;

const toRadians = (deg: number): number => (deg * Math.PI) / 180;
const toDegrees = (rad: number): number => (rad * 180) / Math.PI;

export const haversineDistanceKm = (from: Coordinates, to: Coordinates): number => {
  const dLat = toRadians(to.lat - from.lat);
  const dLon = toRadians(to.lon - from.lon);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
};

export const bearingToTarget = (from: Coordinates, to: Coordinates): number => {
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const dLon = toRadians(to.lon - from.lon);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
};

export const cltMagneticField = (distanceKm: number): number => {
  if (distanceKm <= 10) return 1000;

  if (distanceKm <= 100) {
    const ratio = (distanceKm - 10) / 90;
    return 1000 - ratio * (1000 - 200);
  }

  if (distanceKm <= 200) {
    const ratio = (distanceKm - 100) / 100;
    return 200 - ratio * (200 - 50);
  }

  if (distanceKm <= 400) {
    const ratio = (distanceKm - 200) / 200;
    return 50 - ratio * (50 - 10);
  }

  if (distanceKm <= 1000) {
    const ratio = (distanceKm - 400) / 600;
    return 10 - ratio * 10;
  }

  return 0;
};
