import test from 'node:test';
import assert from 'node:assert/strict';
import { CHARLOTTE, cltMagneticField, haversineDistanceKm } from '../src/geo.js';

test('cltMagneticField returns 1000 within 10km', () => {
  assert.equal(cltMagneticField(5), 1000);
});

test('cltMagneticField returns 0 at and above 1000km', () => {
  assert.equal(cltMagneticField(1000), 0);
  assert.equal(cltMagneticField(2000), 0);
});

test('cltMagneticField interpolates in gradient zones', () => {
  assert.ok(Math.abs(cltMagneticField(55) - 600) < 1e-8);
  assert.ok(Math.abs(cltMagneticField(700) - 5) < 1e-8);
});

test('distance is zero for same location', () => {
  assert.ok(haversineDistanceKm(CHARLOTTE, CHARLOTTE) < 1e-8);
});
