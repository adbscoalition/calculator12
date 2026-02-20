export const CHARLOTTE = { lat: 35.2271, lon: -80.8431 };

const EARTH_RADIUS_KM = 6371;
const toRadians = (deg) => (deg * Math.PI) / 180;
const toDegrees = (rad) => (rad * 180) / Math.PI;

export const haversineDistanceKm = (from, to) => {
  const dLat = toRadians(to.lat - from.lat);
  const dLon = toRadians(to.lon - from.lon);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
};

export const bearingToTarget = (from, to) => {
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const dLon = toRadians(to.lon - from.lon);
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
};

export const cltMagneticField = (distanceKm) => {
  if (distanceKm <= 10) return 1000;
  if (distanceKm <= 100) return 1000 - ((distanceKm - 10) / 90) * 800;
  if (distanceKm <= 200) return 200 - ((distanceKm - 100) / 100) * 150;
  if (distanceKm <= 400) return 50 - ((distanceKm - 200) / 200) * 40;
  if (distanceKm <= 1000) return 10 - ((distanceKm - 400) / 600) * 10;
  return 0;
};
