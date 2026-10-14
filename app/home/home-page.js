'use strict';

const {
  ApplicationSettings,
  Dialogs,
  Observable,
  ObservableArray,
  Utils,
} = require('@nativescript/core');
const { parseNik } = require('../nik-parser');

const HISTORY_KEY = 'ktp-checker-history-v2';
const MAX_HISTORY = 30;
let context;

function readHistory() {
  try {
    const data = ApplicationSettings.getString(HISTORY_KEY, '[]');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeHistory(records) {
  ApplicationSettings.setString(HISTORY_KEY, JSON.stringify(records.slice(0, MAX_HISTORY)));
}

function updateHistoryView(records) {
  const items = new ObservableArray(records);
  context.set('history', items);
  context.set('hasHistory', items.length > 0);
  context.set('historyCount', `${items.length} item`);
}

function setMessage(message) {
  context.set('message', message);
  context.set('hasMessage', Boolean(message));
}

function displayRecord(record) {
  context.set('resultNik', record.nik || '—');
  context.set('resultName', record.fullname || 'Tidak diisi');
  context.set('resultStatus', record.statusText || 'STRUKTUR NIK SESUAI POLA');
  context.set('resultGender', record.gender || '—');
  context.set('resultBirthDate', record.birthDate || '—');
  context.set('resultAge', typeof record.age === 'number' ? `${record.age} tahun` : '—');
  context.set('resultWeekday', record.weekday || '—');
  context.set('resultZodiac', record.zodiac || '—');
  context.set('resultAreaCode', record.areaCode || '—');
  context.set('resultProvinceCode', record.provinceCode || '—');
  context.set('resultRegencyCode', record.regencyCode || '—');
  context.set('resultDistrictCode', record.districtCode || '—');
  context.set('resultAreaSegments', `${record.provinceCode || '—'} / ${record.regencyCode || '—'} / ${record.districtCode || '—'}`);
  context.set('resultSerialNumber', record.serialNumber || '—');
  context.set('resultCheckedAt', record.checkedAt || 'Tidak diketahui');
  context.set('hasResult', true);
}

exports.onNavigatingTo = function onNavigatingTo(args) {
  const page = args.object;
  context = new Observable();
  context.set('fullname', '');
  context.set('nik', '');
  context.set('message', '');
  context.set('hasMessage', false);
  context.set('hasResult', false);
  context.set('history', new ObservableArray(readHistory()));
  context.set('hasHistory', readHistory().length > 0);
  context.set('historyCount', `${readHistory().length} item`);
  context.set('versionLine', 'Versi 2.0.0');
  context.set('releaseLine', 'Tanggal rilis sumber: 15 Oktober 2026');
  context.set('authorLine', 'Pengembang versi ini: Fariz Azhari');
  page.bindingContext = context;
};

exports.onCheckTap = function onCheckTap() {
  const nik = String(context.get('nik') || '').trim();
  const fullname = String(context.get('fullname') || '').trim();
  const result = parseNik(nik);

  if (!result.valid) {
    context.set('hasResult', false);
    setMessage(result.error);
    return;
  }

  const checkedAt = new Date().toLocaleString('id-ID');
  const record = {
    ...result,
    fullname: fullname || 'Tidak diisi',
    checkedAt,
    statusText: 'STRUKTUR NIK SESUAI POLA',
  };

  const records = readHistory().filter((item) => item.nik !== record.nik);
  records.unshift(record);
  writeHistory(records);
  updateHistoryView(records.slice(0, MAX_HISTORY));
  displayRecord(record);
  setMessage('Pemeriksaan selesai di perangkat. Hasil ini hanya memeriksa pola dan bukan verifikasi resmi Dukcapil.');
};

exports.onHistoryItemTap = function onHistoryItemTap(args) {
  const record = args.view && args.view.bindingContext;
  if (record && record.nik) {
    displayRecord(record);
    setMessage('Menampilkan item riwayat yang tersimpan lokal di perangkat ini.');
  }
};

exports.onClearHistoryTap = function onClearHistoryTap() {
  Dialogs.confirm({
    title: 'Hapus riwayat?',
    message: 'Semua riwayat NIK yang tersimpan di aplikasi pada perangkat ini akan dihapus.',
    okButtonText: 'Hapus',
    cancelButtonText: 'Batal',
  }).then((confirmed) => {
    if (confirmed) {
      ApplicationSettings.remove(HISTORY_KEY);
      updateHistoryView([]);
      setMessage('Riwayat lokal telah dihapus.');
    }
  });
};

exports.onOpenGithubTap = function onOpenGithubTap() {
  Utils.openUrl('https://github.com/spyschools');
};
