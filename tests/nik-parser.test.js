'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parseNik } = require('../app/nik-parser');

const referenceDate = new Date('2026-10-15T00:00:00.000Z');

test('accepts a 16-digit pattern with a real male birth date', () => {
  const result = parseNik('3201010101900001', referenceDate);
  assert.equal(result.valid, true);
  assert.equal(result.gender, 'Laki-laki');
  assert.equal(result.birthDate, '01-01-1990');
  assert.equal(result.areaCode, '320101');
  assert.equal(result.serialNumber, '0001');
  assert.equal(result.age, 36);
});

test('decodes the +40 day pattern for female NIKs', () => {
  const result = parseNik('3201014101900001', referenceDate);
  assert.equal(result.valid, true);
  assert.equal(result.gender, 'Perempuan');
  assert.equal(result.birthDate, '01-01-1990');
});

test('rejects a NIK that is not exactly 16 digits', () => {
  assert.equal(parseNik('123456789012345', referenceDate).valid, false);
  assert.equal(parseNik('12345678901234567', referenceDate).valid, false);
  assert.equal(parseNik('1234A67890123456', referenceDate).valid, false);
});

test('rejects invalid encoded days and calendar dates', () => {
  assert.equal(parseNik('3201014001900001', referenceDate).valid, false);
  assert.equal(parseNik('3201013102990001', referenceDate).valid, false);
  assert.equal(parseNik('3201010113900001', referenceDate).valid, false);
});

test('rejects an empty administrative area prefix', () => {
  assert.equal(parseNik('0000000101900001', referenceDate).valid, false);
});

test('handles leap-day dates in a leap year', () => {
  const result = parseNik('3201012902000001', referenceDate);
  assert.equal(result.valid, true);
  assert.equal(result.birthDate, '29-02-2000');
});
