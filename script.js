const KEY = 'mari-rawat-bersama-v1';
const KATEGORI = ['Kamar tidur', 'Kamar mandi', 'Cuci & jemur', 'Listrik & air', 'Ruang umum', 'Lainnya'];

const DATA_AWAL = [
  ['Mesin cuci', 'Cuci & jemur', 'Asrama Putri, area laundry'],
  ['Bed / kasur', 'Kamar tidur', 'Asrama Putri, Kamar 1'],
  ['Dipan', 'Kamar tidur', 'Asrama Putra, Kamar 3'],
  ['Kamar mandi', 'Kamar mandi', 'Asrama Putra, lantai 1'],
  ['Keran air', 'Listrik & air', 'Kamar mandi Asrama Putri'],
  ['Lemari pakaian', 'Kamar tidur', 'Asrama Putra, Kamar 2'],
  ['Kipas angin', 'Kamar tidur', 'Asrama Putri, Kamar 4'],
  ['Colokan listrik', 'Listrik & air', 'Ruang belajar asrama'],
  ['Jemuran', 'Cuci & jemur', 'Atap asrama'],
  ['Dispenser', 'Ruang umum', 'Ruang makan'],
].map((d, i) => ({
  id: 'a' + i, nama: d[0], kategori: d[1], lokasi: d[2],
  status: 'baik', catatan: '', diperbarui: Date.now()
}));

let items = muat();
let filter = 'semua', kategori = 'semua', cari = '';

const $ = s => document.querySelector(s);
const list = $('#list');

function muat() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* storage tidak tersedia */ }
  return structuredClone(DATA_AWAL);
}
function simpan() {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
}
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tgl = t => new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

function render() {
  const bad = items.filter(i => i.status === 'bermasalah').length;
  $('#stTotal').textContent = items.length;
  $('#stBad').textContent = bad;
  $('#stGood').textContent = items.length - bad;
  $('#barFill').style.width = items.length ? ((items.length - bad) / items.length * 100) + '%' : '0';

  const q = cari.toLowerCase();
  const tampil = items.filter(i =>
    (filter === 'semua' || i.status === filter) &&
    (kategori === 'semua' || i.kategori === kategori) &&
    (i.nama + ' ' + i.lokasi).toLowerCase().includes(q));

  list.innerHTML = tampil.map(i => {
    const rusak = i.status === 'bermasalah';
    return `<li class="item ${i.status}" data-id="${i.id}">
      <button class="del" data-act="hapus" aria-label="Hapus ${esc(i.nama)}">Hapus</button>
      <h2>${esc(i.nama)}</h2>
      <p class="meta">${esc(i.kategori)} · ${esc(i.lokasi)}</p>
      <span class="badge">${rusak ? 'Bermasalah' : 'Baik'}</span>
      ${rusak ? `<textarea class="note" data-act="catatan" placeholder="Ceritakan masalahnya (opsional)" aria-label="Catatan masalah ${esc(i.nama)}">${esc(i.catatan)}</textarea>` : ''}
      <p class="meta">Diperbarui ${tgl(i.diperbarui)}</p>
      <button class="toggle" data-act="toggle">${rusak ? 'Tandai sudah baik' : 'Tandai bermasalah'}</button>
    </li>`;
  }).join('');
  $('#empty').hidden = tampil.length > 0;
}

list.addEventListener('click', e => {
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const li = btn.closest('.item');
  const it = items.find(x => x.id === li.dataset.id);
  if (btn.dataset.act === 'toggle') {
    it.status = it.status === 'baik' ? 'bermasalah' : 'baik';
    if (it.status === 'baik') it.catatan = '';
    it.diperbarui = Date.now();
  } else if (btn.dataset.act === 'hapus') {
    if (!confirm(`Hapus "${it.nama}" dari daftar?`)) return;
    items = items.filter(x => x !== it);
  } else return;
  simpan(); render();
});

list.addEventListener('change', e => {
  if (e.target.dataset.act !== 'catatan') return;
  const it = items.find(x => x.id === e.target.closest('.item').dataset.id);
  it.catatan = e.target.value.trim();
  it.diperbarui = Date.now();
  simpan();
});

// Filter
$('#q').addEventListener('input', e => { cari = e.target.value; render(); });
$('#kat').addEventListener('change', e => { kategori = e.target.value; render(); });
document.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => {
  document.querySelectorAll('.chip').forEach(x => x.classList.remove('on'));
  c.classList.add('on'); filter = c.dataset.f; render();
}));

// Tambah fasilitas
$('#addForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  items.unshift({
    id: 'u' + Date.now(), nama: f.get('nama').trim(), kategori: f.get('kategori'),
    lokasi: f.get('lokasi').trim(), status: 'baik', catatan: '', diperbarui: Date.now()
  });
  simpan(); e.target.reset(); render();
});

// Unduh laporan untuk pihak sekolah
$('#exportBtn').addEventListener('click', () => {
  const baris = [['Fasilitas', 'Kategori', 'Lokasi', 'Status', 'Catatan', 'Diperbarui']]
    .concat(items.map(i => [i.nama, i.kategori, i.lokasi, i.status, i.catatan, tgl(i.diperbarui)]));
  const csv = baris.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv' }));
  a.download = 'laporan-fasilitas.csv';
  a.click();
  URL.revokeObjectURL(a.href);
});

$('#resetBtn').addEventListener('click', () => {
  if (!confirm('Semua perubahan akan diganti dengan data awal. Lanjutkan?')) return;
  items = structuredClone(DATA_AWAL); simpan(); render();
});

// Isi pilihan kategori
const opsi = KATEGORI.map(k => `<option>${k}</option>`).join('');
$('#kat').innerHTML = '<option value="semua">Semua kategori</option>' + opsi;
$('#addKat').innerHTML = opsi;
render();
