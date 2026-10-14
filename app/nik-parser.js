'use strict';

const ZODIAC_SIGNS = [
  { name: 'Capricorn', startMonth: 1, startDay: 1 },
  { name: 'Aquarius', startMonth: 1, startDay: 20 },
  { name: 'Pisces', startMonth: 2, startDay: 19 },
  { name: 'Aries', startMonth: 3, startDay: 21 },
  { name: 'Taurus', startMonth: 4, startDay: 20 },
  { name: 'Gemini', startMonth: 5, startDay: 21 },
  { name: 'Cancer', startMonth: 6, startDay: 21 },
  { name: 'Leo', startMonth: 7, startDay: 23 },
  { name: 'Virgo', startMonth: 8, startDay: 23 },
  { name: 'Libra', startMonth: 9, startDay: 23 },
  { name: 'Scorpio', startMonth: 10, startDay: 23 },
  { name: 'Sagittarius', startMonth: 11, startDay: 22 },
  { name: 'Capricorn', startMonth: 12, startDay: 22 },
];

function isRealDate(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function calculateAge(year, month, day, today) {
  let age = today.getUTCFullYear() - year;
  const birthdayHasPassed = today.getUTCMonth() + 1 > month
    || (today.getUTCMonth() + 1 === month && today.getUTCDate() >= day);

  if (!birthdayHasPassed) {
    age -= 1;
  }

  return age;
}

function getZodiac(month, day) {
  let result = 'Capricorn';

  for (let index = 0; index < ZODIAC_SIGNS.length; index += 1) {
    const sign = ZODIAC_SIGNS[index];
    if (month > sign.startMonth || (month === sign.startMonth && day >= sign.startDay)) {
      result = sign.name;
    }
  }

  if (month === 1 && day < 20) {
    return 'Capricorn';
  }

  return result;
}

function formatDate(day, month, year) {
  return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
}

/**
 * Checks the structural pattern of a 16-digit Indonesian NIK locally.
 * This function does not query Dukcapil or authenticate a person's identity.
 * @param {string} value NIK entered by the user.
 * @param {Date} referenceDate Optional date for repeatable tests.
 */
function parseNik(value, referenceDate) {
  const nik = String(value === undefined || value === null ? '' : value).trim();

  if (!/^\d{16}$/.test(nik)) {
    return {
      valid: false,
      error: 'NIK harus terdiri dari tepat 16 digit angka tanpa spasi atau tanda baca.',
    };
  }

  const areaCode = nik.slice(0, 6);
  if (areaCode === '000000' || nik.slice(0, 2) === '00') {
    return {
      valid: false,
      error: 'Enam digit awal tidak terlihat seperti kode wilayah yang dapat digunakan.',
    };
  }

  const encodedDay = Number(nik.slice(6, 8));
  const gender = encodedDay > 40 ? 'Perempuan' : 'Laki-laki';
  const day = encodedDay > 40 ? encodedDay - 40 : encodedDay;
  const month = Number(nik.slice(8, 10));
  const shortYear = Number(nik.slice(10, 12));

  if (day < 1 || day > 31 || (encodedDay > 31 && encodedDay < 41) || encodedDay > 71) {
    return {
      valid: false,
      error: 'Bagian tanggal pada NIK tidak sesuai pola tanggal yang dikenali.',
    };
  }

  if (month < 1 || month > 12) {
    return {
      valid: false,
      error: 'Bagian bulan pada NIK harus berada antara 01 dan 12.',
    };
  }

  const sourceDate = referenceDate instanceof Date && !Number.isNaN(referenceDate.getTime())
    ? referenceDate
    : new Date();
  const today = new Date(Date.UTC(
    sourceDate.getFullYear(),
    sourceDate.getMonth(),
    sourceDate.getDate(),
  ));
  const currentYear = today.getUTCFullYear();
  let year = shortYear <= currentYear % 100 ? 2000 + shortYear : 1900 + shortYear;

  if (!isRealDate(year, month, day)) {
    return {
      valid: false,
      error: 'Kombinasi tanggal, bulan, dan tahun pada NIK bukan tanggal kalender yang sah.',
    };
  }

  let birthDate = new Date(Date.UTC(year, month - 1, day));
  if (birthDate > today && year >= 2000) {
    year -= 100;
    if (!isRealDate(year, month, day)) {
      return {
        valid: false,
        error: 'Tanggal lahir pada NIK tidak dapat ditafsirkan sebagai tanggal yang sah.',
      };
    }
    birthDate = new Date(Date.UTC(year, month - 1, day));
  }

  if (birthDate > today) {
    return {
      valid: false,
      error: 'Tanggal lahir pada NIK berada di masa depan.',
    };
  }

  const weekday = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(birthDate);

  return {
    valid: true,
    nik,
    areaCode,
    provinceCode: nik.slice(0, 2),
    regencyCode: nik.slice(2, 4),
    districtCode: nik.slice(4, 6),
    gender,
    birthDate: formatDate(day, month, year),
    birthDay: day,
    birthMonth: month,
    birthYear: year,
    weekday,
    age: calculateAge(year, month, day, today),
    zodiac: getZodiac(month, day),
    serialNumber: nik.slice(12, 16),
    statusText: 'STRUKTUR NIK SESUAI POLA',
  };
}

module.exports = { parseNik };
