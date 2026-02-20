import { CHARLOTTE, bearingToTarget, cltMagneticField, haversineDistanceKm } from './geo.js';

const compass = document.querySelector('#compass');
const coordsEl = document.querySelector('#coords');
const distanceEl = document.querySelector('#distance');
const bearingEl = document.querySelector('#bearing');
const fieldEl = document.querySelector('#field');
const spoofPanel = document.querySelector('#spoof-panel');
const spoofLat = document.querySelector('#spoof-lat');
const spoofLon = document.querySelector('#spoof-lon');
const teleportButton = document.querySelector('#teleport-btn');

const context = compass?.getContext('2d');
if (!compass || !coordsEl || !distanceEl || !bearingEl || !fieldEl || !spoofPanel || !spoofLat || !spoofLon || !teleportButton || !context) {
  throw new Error('Required DOM elements are missing.');
}

const drawCompass = (bearing) => {
  const size = compass.width;
  const center = size / 2;
  const radius = center - 16;

  context.clearRect(0, 0, size, size);
  context.beginPath();
  context.arc(center, center, radius, 0, Math.PI * 2);
  context.fillStyle = '#0f172a';
  context.fill();
  context.strokeStyle = '#334155';
  context.lineWidth = 2;
  context.stroke();
  context.fillStyle = '#f8fafc';
  context.font = '16px system-ui';
  context.textAlign = 'center';
  context.fillText('N', center, center - radius + 24);

  context.save();
  context.translate(center, center);
  context.rotate((bearing * Math.PI) / 180);
  context.beginPath();
  context.moveTo(0, -radius + 26);
  context.lineTo(14, 14);
  context.lineTo(-14, 14);
  context.closePath();
  context.fillStyle = '#22c55e';
  context.fill();
  context.restore();

  context.fillStyle = '#e2e8f0';
  context.font = '14px system-ui';
  context.fillText('Arrow points to Charlotte, NC', center, size - 14);
};

const updateDisplay = (position) => {
  const distance = haversineDistanceKm(position, CHARLOTTE);
  const bearing = bearingToTarget(position, CHARLOTTE);
  const field = cltMagneticField(distance);

  coordsEl.textContent = `${position.lat.toFixed(6)}, ${position.lon.toFixed(6)}`;
  distanceEl.textContent = `${distance.toFixed(2)} km`;
  bearingEl.textContent = `${bearing.toFixed(1)}°`;
  fieldEl.textContent = `${field.toFixed(2)}`;
  drawCompass(bearing);
};

let unlockBuffer = '';
window.addEventListener('keydown', (event) => {
  if (event.key.length !== 1) return;
  unlockBuffer = (unlockBuffer + event.key.toLowerCase()).slice(-8);
  if (unlockBuffer === 'cltspoof') {
    spoofPanel.classList.remove('hidden');
    spoofPanel.setAttribute('aria-hidden', 'false');
  }
});

teleportButton.addEventListener('click', () => {
  const lat = Number(spoofLat.value);
  const lon = Number(spoofLon.value);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    alert('Enter valid latitude and longitude values.');
    return;
  }
  updateDisplay({ lat, lon });
});

const showGeolocationError = (message) => {
  coordsEl.textContent = message;
  updateDisplay(CHARLOTTE);
};

if (!navigator.geolocation) {
  showGeolocationError('Geolocation unsupported. Defaulted to Charlotte.');
} else {
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => updateDisplay({ lat: coords.latitude, lon: coords.longitude }),
    () => showGeolocationError('Location denied. Defaulted to Charlotte.'),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
  );
}
