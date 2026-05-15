// ─── Steps config ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 'cpu',         icon: 'bi-cpu',              get label() { return t('step_cpu_label'); },         get desc() { return t('step_cpu_desc'); } },
  { id: 'motherboard', icon: 'bi-motherboard',      get label() { return t('step_motherboard_label'); }, get desc() { return t('step_motherboard_desc'); } },
  { id: 'ram',         icon: 'bi-memory',           get label() { return t('step_ram_label'); },         get desc() { return t('step_ram_desc'); } },
  { id: 'gpu',         icon: 'bi-gpu-card',         get label() { return t('step_gpu_label'); },         get desc() { return t('step_gpu_desc'); } },
  { id: 'storage',     icon: 'bi-device-ssd',       get label() { return t('step_storage_label'); },     get desc() { return t('step_storage_desc'); } },
  { id: 'psu',         icon: 'bi-lightning-charge', get label() { return t('step_psu_label'); },         get desc() { return t('step_psu_desc'); } },
  { id: 'cooler',      icon: 'bi-wind',             get label() { return t('step_cooler_label'); },      get desc() { return t('step_cooler_desc'); } },
  { id: 'case',        icon: 'bi-pc-display',       get label() { return t('step_case_label'); },        get desc() { return t('step_case_desc'); } },
];

const CATEGORY_ICONS = {
  case: 'bi-pc-display', cpu: 'bi-cpu', cooler: 'bi-wind',
  motherboard: 'bi-motherboard', ram: 'bi-memory',
  gpu: 'bi-gpu-card', storage: 'bi-device-ssd', psu: 'bi-lightning-charge',
};

const SPEC_LABELS = {
  get cpu()         { return tArr('spec_cpu'); },
  get motherboard() { return tArr('spec_motherboard'); },
  get ram()         { return tArr('spec_ram'); },
  get gpu()         { return tArr('spec_gpu'); },
  get storage()     { return tArr('spec_storage'); },
  get psu()         { return tArr('spec_psu'); },
  get cooler()      { return tArr('spec_cooler'); },
  get case()        { return tArr('spec_case'); },
};

// ─── Build state ──────────────────────────────────────────────────────────────
const state = {
  selected:     {},
  currentStep:  'cpu',
  searchQuery:  '',
  sortBy:       'default',
  brandFilter:  '',
  chipFilter:   '',
  cpuFilters:   { socket: '', series: '', cores: '' },
  mbFilters:    { socket: '', formFactor: '', ramType: '', ramSlots: '', chipset: '' },
  ramFilters:   { ramType: '', capacity: '' },
  gpuFilters:     { vram: '', fans: '' },
  storageFilters: { capacity: '', formFactor: '', interface: '', readSpeed: '' },
  psuFilters:     { wattage: '', rating: '', modular: '' },
  coolerFilters:  { type: '', fanCount: '', fanSize: '', lighting: '' },
  caseFilters:    { formFactor: '', style: '', fanCount: '' },
  compareList:  [],
  _cache:       {},
};

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  loadPersistedBuild();
  applyStaticLang();
  renderSidebar();
  await renderCurrentStep();
  bindEvents();
});

// ─── Events ───────────────────────────────────────────────────────────────────
function bindEvents() {
  document.getElementById('searchInput').addEventListener('input', e => {
    state.searchQuery = e.target.value.toLowerCase();
    renderComponentGrid();
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#sortDropdown'))    closeSortDropdown();
    if (!e.target.closest('.filter-dropdown')) closeAllFilterDds();
  });

  document.getElementById('btnPrevBottom').addEventListener('click', navigatePrev);
  document.getElementById('btnNextBottom').addEventListener('click', navigateNext);

  document.getElementById('summaryModal')
    .addEventListener('show.bs.modal', renderSummary);
  document.getElementById('btnSaveConfig')
    .addEventListener('click', () => new bootstrap.Modal(document.getElementById('summaryModal')).show());
  document.getElementById('btnOrder')
    .addEventListener('click', handleOrder);
}

// ─── Navigation ───────────────────────────────────────────────────────────────
async function navigateTo(stepId) {
  state.currentStep = stepId;
  state.searchQuery = '';
  state.sortBy = 'default';
  state.brandFilter  = '';
  state.chipFilter   = '';
  state.cpuFilters   = { socket: '', series: '', cores: '' };
  state.mbFilters    = { socket: '', formFactor: '', ramType: '', ramSlots: '', chipset: '' };
  state.ramFilters   = { ramType: '', capacity: '' };
  state.gpuFilters     = { vram: '', fans: '' };
  state.storageFilters = { capacity: '', formFactor: '', interface: '', readSpeed: '' };
  state.psuFilters     = { wattage: '', rating: '', modular: '' };
  state.coolerFilters  = { type: '', fanCount: '', fanSize: '', lighting: '' };
  state.caseFilters    = { formFactor: '', style: '', fanCount: '' };
  state.compareList    = [];
  document.getElementById('searchInput').value = '';
  resetSortDropdown();
  closeAllFilterDds();
  renderSidebar();
  await renderCurrentStep();
  renderCompareBar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeSidebar();
}

async function navigatePrev() {
  const idx = STEPS.findIndex(s => s.id === state.currentStep);
  if (idx > 0) await navigateTo(STEPS[idx - 1].id);
}

async function navigateNext() {
  const idx = STEPS.findIndex(s => s.id === state.currentStep);
  if (idx < STEPS.length - 1) await navigateTo(STEPS[idx + 1].id);
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function renderSidebar() {
  document.getElementById('sidebarSteps').innerHTML = STEPS.map(step => {
    const raw     = state.selected[step.id];
    const isRam   = step.id === 'ram';
    const ramKits = isRam && Array.isArray(raw) ? raw : null;
    const sel     = isRam ? null : raw;
    const hasSel  = isRam ? (ramKits && ramKits.length > 0) : !!sel;
    const isActive = step.id === state.currentStep;
    const cls = ['step-item', isActive && 'active', hasSel && 'selected'].filter(Boolean).join(' ');

    let displayName = '', displayPrice = 0;
    if (isRam && ramKits && ramKits.length > 0) {
      displayName  = ramKits.length === 1
        ? `${ramKits[0].brand} ${ramKits[0].name}`
        : `${ramKits[0].name} ×${ramKits.length}`;
      displayPrice = ramKits.reduce((s, r) => s + Number(r.price), 0);
    } else if (sel) {
      displayName  = `${sel.brand} ${sel.name}`;
      displayPrice = Number(sel.price);
    }

    return `
      <div class="${cls}" onclick="navigateTo('${step.id}')">
        <div class="step-icon"><i class="bi ${hasSel ? 'bi-check-lg' : step.icon}"></i></div>
        <div class="step-info">
          <div class="step-name">${step.label}</div>
          ${hasSel
            ? `<div class="step-selected-name">${displayName}</div>`
            : `<div class="step-not-selected">${t('not_selected')}</div>`}
        </div>
        ${hasSel ? `<div class="step-price">$${displayPrice.toFixed(2)}</div>` : ''}
      </div>`;
  }).join('');
}

// ─── Current step ─────────────────────────────────────────────────────────────
async function renderCurrentStep() {
  const step = STEPS.find(s => s.id === state.currentStep);
  const idx  = STEPS.findIndex(s => s.id === state.currentStep);

  document.getElementById('stepTitle').textContent = step.label;
  document.getElementById('stepDesc').textContent  = step.desc;

  const isFirst = idx === 0;
  const isLast  = idx === STEPS.length - 1;
  document.getElementById('btnPrevBottom').disabled = isFirst;
  document.getElementById('btnNextBottom').disabled = isLast;

  document.getElementById('stepProgress').style.width =
    `${((idx + 1) / STEPS.length) * 100}%`;
  document.getElementById('stepProgressLabel').textContent =
    `${t('step_label')} ${idx + 1} ${t('step_of')} ${STEPS.length}`;

  await Promise.all([renderBrandChips(), renderComponentGrid()]);
  checkCompatibility();
  updateTotalPrice();
}

// ─── Component data ───────────────────────────────────────────────────────────
async function loadStep(stepId, serverFilters = {}) {
  const hasFilters = Object.values(serverFilters).some(Boolean);
  if (hasFilters) return await Api.getComponents(stepId, serverFilters);
  if (!state._cache[stepId]) state._cache[stepId] = await Api.getComponents(stepId);
  return state._cache[stepId];
}

async function getFiltered() {
  const step = state.currentStep;
  const sel  = state.selected;

  // ─── Build server-side filters (DB columns only) ─────────────────────────────
  const sf = {};
  if (state.searchQuery)            sf.search  = state.searchQuery;
  if (state.sortBy !== 'default')   sf.sortBy  = state.sortBy;

  if (step === 'cpu') {
    const socket = state.cpuFilters.socket || sel.motherboard?.socket;
    if (socket) sf.socket = socket;
  }
  if (step === 'motherboard') {
    const socket = state.mbFilters.socket || sel.cpu?.socket;
    if (socket) sf.socket = socket;
    if (state.mbFilters.formFactor) sf.formFactor = state.mbFilters.formFactor;
    if (state.mbFilters.ramType)    sf.ramType    = state.mbFilters.ramType;
  }
  if (step === 'ram') {
    const ramType = state.ramFilters.ramType || sel.motherboard?.ramType;
    if (ramType) sf.ramType = ramType;
  }
  if (step === 'gpu' && state.chipFilter) sf.chipBrand = state.chipFilter;

  let list = await loadStep(step, sf);

  // ─── Client-side filters (spec-based, not in DB) ─────────────────────────────
  if (state.brandFilter) list = list.filter(c => c.brand === state.brandFilter);

  if (step === 'cpu') {
    if (state.cpuFilters.series) list = list.filter(c => cpuSeries(c.name) === state.cpuFilters.series);
    if (state.cpuFilters.cores)  list = list.filter(c => cpuCores(c.specs) === parseInt(state.cpuFilters.cores));
  }
  if (step === 'gpu') {
    if (state.gpuFilters.vram) list = list.filter(c => gpuVram(c.specs) === state.gpuFilters.vram);
    if (state.gpuFilters.fans) list = list.filter(c => gpuFans(c.specs) === state.gpuFilters.fans);
  }
  if (step === 'storage') {
    const stf = state.storageFilters;
    if (stf.capacity)   list = list.filter(c => storageCapacity(c.specs)   === stf.capacity);
    if (stf.formFactor) list = list.filter(c => storageFormFactor(c.specs) === stf.formFactor);
    if (stf.interface)  list = list.filter(c => storageInterface(c.specs)  === stf.interface);
    if (stf.readSpeed)  list = list.filter(c => storageReadSpeed(c.specs)  === parseInt(stf.readSpeed));
  }
  if (step === 'ram') {
    if (state.ramFilters.capacity) list = list.filter(c => ramCapacity(c.specs) === state.ramFilters.capacity);
  }
  if (step === 'motherboard') {
    if (state.mbFilters.ramSlots) list = list.filter(c => getMbRamSlots(c) === parseInt(state.mbFilters.ramSlots));
    if (state.mbFilters.chipset)  list = list.filter(c => (c.chipset ?? c.chipset) === state.mbFilters.chipset);
  }
  if (step === 'psu') {
    const pf = state.psuFilters;
    if (pf.wattage) list = list.filter(c => psuWattage(c.specs) === pf.wattage);
    if (pf.rating)  list = list.filter(c => psuRating(c.specs)  === pf.rating);
    if (pf.modular) list = list.filter(c => psuModular(c.specs) === pf.modular);
  }
  if (step === 'cooler') {
    const cf = state.coolerFilters;
    if (cf.type)     list = list.filter(c => coolerType(c.specs)     === cf.type);
    if (cf.fanCount) list = list.filter(c => coolerFanCount(c.specs) === parseInt(cf.fanCount));
    if (cf.fanSize)  list = list.filter(c => coolerFanSize(c.specs)  === cf.fanSize);
    if (cf.lighting) list = list.filter(c => c.specs[3]              === cf.lighting);
  }
  if (step === 'case') {
    const cf = state.caseFilters;
    if (cf.formFactor)      list = list.filter(c => c.caseFormFactor === cf.formFactor);
    if (cf.style)           list = list.filter(c => c.style          === cf.style);
    if (cf.fanCount !== '') list = list.filter(c => caseFanCount(c.specs) === parseInt(cf.fanCount));
  }

  // ─── Compat filters ───────────────────────────────────────────────────────────
  if (step === 'case' && sel.motherboard?.formFactor)
    list = list.filter(c => c.supportedFormFactors?.includes(sel.motherboard.formFactor));

  // ─── Fallback client-side search/sort (when backend offline) ─────────────────
  if (state.searchQuery)
    list = list.filter(c =>
      `${c.brand} ${c.name}`.toLowerCase().includes(state.searchQuery) ||
      c.specs.some(s => s.toLowerCase().includes(state.searchQuery)));

  switch (state.sortBy) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'name-asc':   list.sort((a, b) =>
      `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`)); break;
  }
  return list;
}

// ─── CPU spec helpers ──────────────────────────────────────────────────────────
function cpuSeries(name) {
  const m = name.match(/Ryzen\s+[3579]|Core\s+Ultra\s+[579]|Core\s+i[3579]/);
  return m ? m[0] : '';
}

function cpuCores(specs) {
  const s = specs.find(x => /ядер|Cores/i.test(x));
  if (!s) return 0;
  const m = s.match(/^(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function ramCapacity(specs) {
  const m = specs[0] && specs[0].match(/^(\d+GB)/);
  return m ? m[1] : '';
}

function gpuVram(specs) {
  const m = specs[0] && specs[0].match(/^(\d+GB)/);
  return m ? m[1] : '';
}

function gpuFans(specs) {
  const s = specs.find(x => /Triple|Dual|AIO|Liquid/i.test(x));
  if (!s) return '';
  if (/Triple/i.test(s)) return '3';
  if (/Dual/i.test(s))   return '2';
  if (/AIO|Liquid/i.test(s)) return 'AIO';
  return '';
}

function storageCapacity(specs) {
  return (specs[0] && /^\d+TB$/.test(specs[0])) ? specs[0] : '';
}

function storageFormFactor(specs) {
  const s = specs.find(x => /M\.2|2\.5/i.test(x));
  if (!s) return '';
  return /M\.2/i.test(s) ? 'M.2' : '2.5"';
}

function storageInterface(specs) {
  const s = specs.find(x => /PCIe|SATA/i.test(x));
  if (!s) return '';
  if (/PCIe 3\.0/i.test(s)) return 'PCIe 3.0';
  if (/PCIe 4\.0/i.test(s)) return 'PCIe 4.0';
  if (/SATA/i.test(s))      return 'SATA';
  return '';
}

function storageReadSpeed(specs) {
  const s = specs[2];
  if (!s) return 0;
  const m = s.replace(/\s/g, '').match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function fmtSpeed(n) {
  const unit = t('speed_unit');
  return n >= 1000
    ? `${Math.floor(n / 1000)} ${String(n % 1000).padStart(3, '0')} ${unit}`
    : `${n} ${unit}`;
}

// ─── PSU spec helpers ──────────────────────────────────────────────────────────
function psuWattage(specs) {
  const m = specs[0] && specs[0].match(/^(\d+W)$/);
  return m ? m[1] : '';
}

function psuRating(specs) {
  const s = specs.find(x => /80\+/i.test(x));
  return s || '';
}

function psuModular(specs) {
  if (specs.some(x => /Полностью модульный/i.test(x))) return 'Полностью модульный';
  if (specs.some(x => /Частично модульный/i.test(x)))  return 'Частично модульный';
  if (specs.some(x => /Немодульный/i.test(x)))         return 'Немодульный';
  return '';
}

// ─── Cooler spec helpers ───────────────────────────────────────────────────────
function coolerType(specs) {
  if (/Башенное/i.test(specs[0]))    return 'air';
  if (/AIO|Водяное/i.test(specs[0])) return 'aio';
  return '';
}

function coolerFanCount(specs) {
  const s = specs.find(x => /^\d+×/.test(x));
  if (!s) return 0;
  const m = s.match(/^(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function coolerFanSize(specs) {
  const s = specs.find(x => /^\d+×\s*\d+mm/.test(x));
  if (!s) return '';
  const m = s.match(/(\d+)mm/);
  return m ? `${m[1]}mm` : '';
}

// ─── Case spec helpers ─────────────────────────────────────────────────────────
function mbRamSlots(specs) {
  const s = specs.find(x => /× DDR\d слот/i.test(x));
  if (!s) return 0;
  const m = s.match(/^(\d+)/);
  return m ? parseInt(m[1]) : 0;
}
function getMbRamSlots(c) {
  return c.ramSlots ?? mbRamSlots(c.specs ?? []);
}

function getMaxRamKits() {
  const mb = state.selected.motherboard;
  if (!mb) return 2;
  const slots = getMbRamSlots(mb);
  return Math.max(1, Math.floor(slots / 2));
}

function caseFanCount(specs) {
  const m = specs[2] && specs[2].match(/^(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function caseFanSize(specs) {
  const m = specs[2] && specs[2].match(/(\d+)mm/);
  return m ? `${m[1]}mm` : '';
}

// ─── Filter dropdown builder ───────────────────────────────────────────────────
function buildFilterDd(ddId, label, currentVal, options) {
  const hasVal  = currentVal !== '';
  const selOpt  = options.find(o => String(o.val) === String(currentVal));
  const btnText = hasVal ? `${label}: ${selOpt ? selOpt.label : currentVal}` : label;
  const items   = options.map(o =>
    `<div class="filter-option${String(o.val) === String(currentVal) ? ' active' : ''}" onclick="${o.fn}">${o.label}</div>`
  ).join('');
  return `<div class="filter-dropdown${hasVal ? ' has-value' : ''}" id="fdd-${ddId}">
    <button class="filter-trigger" onclick="toggleFilterDd('${ddId}')">${btnText}<i class="bi bi-chevron-down filter-arrow"></i></button>
    <div class="filter-menu">${items}</div>
  </div>`;
}

function toggleFilterDd(ddId) {
  const dd = document.getElementById(`fdd-${ddId}`);
  const wasOpen = dd.classList.contains('open');
  closeAllFilterDds();
  if (!wasOpen) dd.classList.add('open');
}

function closeAllFilterDds() {
  document.querySelectorAll('.filter-dropdown.open').forEach(el => el.classList.remove('open'));
}

// ─── Filters ──────────────────────────────────────────────────────────────────
async function renderBrandChips() {
  const all = await loadStep(state.currentStep);
  const bar = document.getElementById('brandsBar');

  if (state.currentStep === 'cpu') {
    const mbLock      = state.selected.motherboard;
    const brands      = [...new Set(all.map(c => c.brand))].sort();
    const afterBrand  = state.brandFilter ? all.filter(c => c.brand === state.brandFilter) : all;
    const sockets     = [...new Set(afterBrand.map(c => c.socket).filter(Boolean))].sort();
    const afterSocket = state.cpuFilters.socket ? afterBrand.filter(c => c.socket === state.cpuFilters.socket) : afterBrand;
    const seriesList  = [...new Set(afterSocket.map(c => cpuSeries(c.name)).filter(Boolean))].sort();
    const afterSeries = state.cpuFilters.series ? afterSocket.filter(c => cpuSeries(c.name) === state.cpuFilters.series) : afterSocket;
    const coresList   = [...new Set(afterSeries.map(c => cpuCores(c.specs)).filter(Boolean))].sort((a, b) => a - b);

    bar.innerHTML = [
      buildFilterDd('brand', t('f_brand'), state.brandFilter, [
        { val: '', label: t('f_all'), fn: "setBrand('')" },
        ...brands.map(b => ({ val: b, label: b, fn: `setBrand('${b}')` })),
      ]),
      !mbLock && buildFilterDd('socket', t('f_socket'), state.cpuFilters.socket, [
        { val: '', label: t('f_all'), fn: "setCpuFilter('socket','')" },
        ...sockets.map(s => ({ val: s, label: s, fn: `setCpuFilter('socket','${s}')` })),
      ]),
      buildFilterDd('series', t('f_series'), state.cpuFilters.series, [
        { val: '', label: t('f_all'), fn: "setCpuFilter('series','')" },
        ...seriesList.map(s => ({ val: s, label: s, fn: `setCpuFilter('series','${s.replace(/'/g, "\\'")}')` })),
      ]),
      buildFilterDd('cores', t('f_cores'), state.cpuFilters.cores, [
        { val: '', label: t('f_all'), fn: "setCpuFilter('cores','')" },
        ...coresList.map(n => ({ val: String(n), label: t('f_cores_n', {n}), fn: `setCpuFilter('cores','${n}')` })),
      ]),
    ].filter(Boolean).join('');

  } else if (state.currentStep === 'storage') {
    const sf      = state.storageFilters;
    const brands  = [...new Set(all.map(c => c.brand))].sort();
    const caps    = [...new Set(all.map(c => storageCapacity(c.specs)).filter(Boolean))]
                     .sort((a, b) => parseInt(a) - parseInt(b));
    const forms   = [...new Set(all.map(c => storageFormFactor(c.specs)).filter(Boolean))].sort();
    const ifaces  = [...new Set(all.map(c => storageInterface(c.specs)).filter(Boolean))].sort();
    const speeds  = [...new Set(all.map(c => storageReadSpeed(c.specs)).filter(Boolean))]
                     .sort((a, b) => a - b);

    bar.innerHTML = [
      buildFilterDd('brand', t('f_brand'), state.brandFilter, [
        { val: '', label: t('f_all'), fn: "setBrand('')" },
        ...brands.map(b => ({ val: b, label: b, fn: `setBrand('${b}')` })),
      ]),
      buildFilterDd('st-cap', t('f_capacity'), sf.capacity, [
        { val: '', label: t('f_all'), fn: "setStorageFilter('capacity','')" },
        ...caps.map(c => ({ val: c, label: c, fn: `setStorageFilter('capacity','${c}')` })),
      ]),
      buildFilterDd('st-form', t('f_format'), sf.formFactor, [
        { val: '', label: t('f_all'), fn: "setStorageFilter('formFactor','')" },
        ...forms.map(f => ({ val: f, label: f, fn: `setStorageFilter('formFactor','${f}')` })),
      ]),
      buildFilterDd('st-iface', t('f_type'), sf.interface, [
        { val: '', label: t('f_all'), fn: "setStorageFilter('interface','')" },
        ...ifaces.map(i => ({ val: i, label: i, fn: `setStorageFilter('interface','${i}')` })),
      ]),
      buildFilterDd('st-speed', t('f_read_speed'), sf.readSpeed, [
        { val: '', label: t('f_all'), fn: "setStorageFilter('readSpeed','')" },
        ...speeds.map(n => ({ val: String(n), label: fmtSpeed(n), fn: `setStorageFilter('readSpeed','${n}')` })),
      ]),
    ].join('');

  } else if (state.currentStep === 'ram') {
    const mbLock       = state.selected.motherboard;
    const brands       = [...new Set(all.map(c => c.brand))].sort();
    const afterBrand   = state.brandFilter ? all.filter(c => c.brand === state.brandFilter) : all;
    const ramTypes     = [...new Set(afterBrand.map(c => c.ramType).filter(Boolean))].sort();
    const afterType    = state.ramFilters.ramType ? afterBrand.filter(c => c.ramType === state.ramFilters.ramType) : afterBrand;
    const capacities   = [...new Set(afterType.map(c => ramCapacity(c.specs)).filter(Boolean))]
                          .sort((a, b) => parseInt(a) - parseInt(b));

    bar.innerHTML = [
      buildFilterDd('brand', t('f_brand'), state.brandFilter, [
        { val: '', label: t('f_all'), fn: "setBrand('')" },
        ...brands.map(b => ({ val: b, label: b, fn: `setBrand('${b}')` })),
      ]),
      !mbLock && buildFilterDd('ram-type', t('f_type'), state.ramFilters.ramType, [
        { val: '', label: t('f_all'), fn: "setRamFilter('ramType','')" },
        ...ramTypes.map(rt => ({ val: rt, label: rt, fn: `setRamFilter('ramType','${rt}')` })),
      ]),
      buildFilterDd('ram-cap', t('f_ram_volume'), state.ramFilters.capacity, [
        { val: '', label: t('f_all'), fn: "setRamFilter('capacity','')" },
        ...capacities.map(c => ({ val: c, label: c, fn: `setRamFilter('capacity','${c}')` })),
      ]),
    ].filter(Boolean).join('');

  } else if (state.currentStep === 'motherboard') {
    const cpuLock    = state.selected.cpu;
    const brands     = [...new Set(all.map(c => c.brand))].sort();
    const afterBrand = state.brandFilter ? all.filter(c => c.brand === state.brandFilter) : all;
    const sockets    = [...new Set(afterBrand.map(c => c.socket).filter(Boolean))].sort();
    const afterSock  = state.mbFilters.socket ? afterBrand.filter(c => c.socket === state.mbFilters.socket) : afterBrand;
    const factors    = [...new Set(afterSock.map(c => c.formFactor).filter(Boolean))].sort();
    const afterFact  = state.mbFilters.formFactor ? afterSock.filter(c => c.formFactor === state.mbFilters.formFactor) : afterSock;
    const ramTypes   = [...new Set(afterFact.map(c => c.ramType).filter(Boolean))].sort();
    const afterType  = state.mbFilters.ramType ? afterFact.filter(c => c.ramType === state.mbFilters.ramType) : afterFact;
    const slotCounts = [...new Set(afterType.map(c => getMbRamSlots(c)).filter(Boolean))].sort((a, b) => a - b);
    const afterSlots  = state.mbFilters.ramSlots ? afterType.filter(c => getMbRamSlots(c) === parseInt(state.mbFilters.ramSlots)) : afterType;
    const chipsets    = [...new Set(afterSlots.map(c => c.chipset).filter(Boolean))].sort();

    bar.innerHTML = [
      buildFilterDd('brand', t('f_brand'), state.brandFilter, [
        { val: '', label: t('f_all'), fn: "setBrand('')" },
        ...brands.map(b => ({ val: b, label: b, fn: `setBrand('${b}')` })),
      ]),
      !cpuLock && buildFilterDd('mb-socket', t('f_socket'), state.mbFilters.socket, [
        { val: '', label: t('f_all'), fn: "setMbFilter('socket','')" },
        ...sockets.map(s => ({ val: s, label: s, fn: `setMbFilter('socket','${s}')` })),
      ]),
      buildFilterDd('mb-form', t('f_form_factor'), state.mbFilters.formFactor, [
        { val: '', label: t('f_all'), fn: "setMbFilter('formFactor','')" },
        ...factors.map(f => ({ val: f, label: f, fn: `setMbFilter('formFactor','${f}')` })),
      ]),
      buildFilterDd('mb-ram', t('f_memory_type'), state.mbFilters.ramType, [
        { val: '', label: t('f_all'), fn: "setMbFilter('ramType','')" },
        ...ramTypes.map(r => ({ val: r, label: r, fn: `setMbFilter('ramType','${r}')` })),
      ]),
      buildFilterDd('mb-slots', t('f_ram_slots'), state.mbFilters.ramSlots, [
        { val: '', label: t('f_all'), fn: "setMbFilter('ramSlots','')" },
        ...slotCounts.map(n => ({ val: String(n), label: t('f_ram_slots_n', {n}), fn: `setMbFilter('ramSlots','${n}')` })),
      ]),
      buildFilterDd('mb-chipset', t('f_chipset'), state.mbFilters.chipset, [
        { val: '', label: t('f_all'), fn: "setMbFilter('chipset','')" },
        ...chipsets.map(c => ({ val: c, label: c, fn: `setMbFilter('chipset','${c}')` })),
      ]),
    ].filter(Boolean).join('');

  } else if (state.currentStep === 'gpu') {
    const chips      = [...new Set(all.map(c => c.chipBrand).filter(Boolean))].sort();
    const afterChip  = state.chipFilter ? all.filter(c => c.chipBrand === state.chipFilter) : all;
    const partners   = [...new Set(afterChip.map(c => c.brand))].sort();
    const afterPart  = state.brandFilter ? afterChip.filter(c => c.brand === state.brandFilter) : afterChip;
    const vramList   = [...new Set(afterPart.map(c => gpuVram(c.specs)).filter(Boolean))]
                        .sort((a, b) => parseInt(a) - parseInt(b));
    const afterVram  = state.gpuFilters.vram ? afterPart.filter(c => gpuVram(c.specs) === state.gpuFilters.vram) : afterPart;
    const fansList   = [...new Set(afterVram.map(c => gpuFans(c.specs)).filter(Boolean))].sort();

    const fansLabel  = v => v === 'AIO' ? t('fv_liquid') : `${v} ${t('f_fans').toLowerCase()}`;

    bar.innerHTML = [
      buildFilterDd('chip', t('f_chip'), state.chipFilter, [
        { val: '', label: t('f_all'), fn: "setChip('')" },
        ...chips.map(b => ({ val: b, label: b, fn: `setChip('${b}')` })),
      ]),
      buildFilterDd('partner', t('f_mfr'), state.brandFilter, [
        { val: '', label: t('f_all'), fn: "setBrand('')" },
        ...partners.map(b => ({ val: b, label: b, fn: `setBrand('${b.replace(/'/g, "\\'")}')` })),
      ]),
      buildFilterDd('gpu-vram', t('f_memory'), state.gpuFilters.vram, [
        { val: '', label: t('f_all'), fn: "setGpuFilter('vram','')" },
        ...vramList.map(v => ({ val: v, label: v, fn: `setGpuFilter('vram','${v}')` })),
      ]),
      buildFilterDd('gpu-fans', t('f_fans'), state.gpuFilters.fans, [
        { val: '', label: t('f_all'), fn: "setGpuFilter('fans','')" },
        ...fansList.map(v => ({ val: v, label: fansLabel(v), fn: `setGpuFilter('fans','${v}')` })),
      ]),
    ].join('');

  } else if (state.currentStep === 'cooler') {
    const cf        = state.coolerFilters;
    const brands    = [...new Set(all.map(c => c.brand))].sort();
    const types     = ['air', 'aio'];
    const fanCounts = [...new Set(all.map(c => coolerFanCount(c.specs)).filter(Boolean))].sort((a, b) => a - b);
    const fanSizes  = [...new Set(all.map(c => coolerFanSize(c.specs)).filter(Boolean))].sort();
    const lightings = [...new Set(all.map(c => c.specs[3]).filter(Boolean))].sort();

    const typeLabel = v => v === 'air' ? t('fv_tower') : t('fv_aio');

    bar.innerHTML = [
      buildFilterDd('brand', t('f_brand'), state.brandFilter, [
        { val: '', label: t('f_all'), fn: "setBrand('')" },
        ...brands.map(b => ({ val: b, label: b, fn: `setBrand('${b.replace(/'/g, "\\'")}')` })),
      ]),
      buildFilterDd('cool-type', t('f_type'), cf.type, [
        { val: '', label: t('f_all'), fn: "setCoolerFilter('type','')" },
        ...types.map(tp => ({ val: tp, label: typeLabel(tp), fn: `setCoolerFilter('type','${tp}')` })),
      ]),
      buildFilterDd('cool-fans', t('f_fans'), cf.fanCount, [
        { val: '', label: t('f_all'), fn: "setCoolerFilter('fanCount','')" },
        ...fanCounts.map(n => ({ val: String(n), label: t('f_pieces_n', {n}), fn: `setCoolerFilter('fanCount','${n}')` })),
      ]),
      buildFilterDd('cool-size', t('f_fan_size'), cf.fanSize, [
        { val: '', label: t('f_all'), fn: "setCoolerFilter('fanSize','')" },
        ...fanSizes.map(s => ({ val: s, label: s, fn: `setCoolerFilter('fanSize','${s}')` })),
      ]),
      buildFilterDd('cool-light', t('f_lighting'), cf.lighting, [
        { val: '', label: t('f_all'), fn: "setCoolerFilter('lighting','')" },
        ...lightings.map(l => ({ val: l, label: l, fn: `setCoolerFilter('lighting','${l.replace(/'/g, "\\'")}')` })),
      ]),
    ].join('');

  } else if (state.currentStep === 'psu') {
    const pf       = state.psuFilters;
    const brands   = [...new Set(all.map(c => c.brand))].sort();
    const wattages = [...new Set(all.map(c => psuWattage(c.specs)).filter(Boolean))]
                      .sort((a, b) => parseInt(a) - parseInt(b));
    const ratings  = [...new Set(all.map(c => psuRating(c.specs)).filter(Boolean))].sort();
    const modulars = [...new Set(all.map(c => psuModular(c.specs)).filter(Boolean))].sort();
    const modularLabel = v =>
      v === 'Полностью модульный' ? t('fv_fully_modular') :
      v === 'Частично модульный'  ? t('fv_semi_modular')  : t('fv_non_modular');

    bar.innerHTML = [
      buildFilterDd('brand', t('f_brand'), state.brandFilter, [
        { val: '', label: t('f_all'), fn: "setBrand('')" },
        ...brands.map(b => ({ val: b, label: b, fn: `setBrand('${b.replace(/'/g, "\\'")}')` })),
      ]),
      buildFilterDd('psu-watt', t('f_wattage'), pf.wattage, [
        { val: '', label: t('f_all'), fn: "setPsuFilter('wattage','')" },
        ...wattages.map(w => ({ val: w, label: w, fn: `setPsuFilter('wattage','${w}')` })),
      ]),
      buildFilterDd('psu-rating', t('f_standard'), pf.rating, [
        { val: '', label: t('f_all'), fn: "setPsuFilter('rating','')" },
        ...ratings.map(r => ({ val: r, label: r, fn: `setPsuFilter('rating','${r}')` })),
      ]),
      buildFilterDd('psu-modular', t('f_modular'), pf.modular, [
        { val: '', label: t('f_all'), fn: "setPsuFilter('modular','')" },
        ...modulars.map(m => ({ val: m, label: modularLabel(m), fn: `setPsuFilter('modular','${m}')` })),
      ]),
    ].join('');

  } else if (state.currentStep === 'case') {
    const cf          = state.caseFilters;
    const brands      = [...new Set(all.map(c => c.brand))].sort();
    const formFactors = ['Mini-ITX', 'mATX', 'ATX', 'EATX'];
    const styles      = [...new Set(all.map(c => c.style).filter(Boolean))].sort();
    const fanCounts   = [...new Set(all.map(c => caseFanCount(c.specs)))].sort((a, b) => a - b);

    bar.innerHTML = [
      buildFilterDd('brand', t('f_brand'), state.brandFilter, [
        { val: '', label: t('f_all'), fn: "setBrand('')" },
        ...brands.map(b => ({ val: b, label: b, fn: `setBrand('${b.replace(/'/g, "\\'")}')` })),
      ]),
      buildFilterDd('case-ff', t('f_form_factor'), cf.formFactor, [
        { val: '', label: t('f_all'), fn: "setCaseFilter('formFactor','')" },
        ...formFactors.map(f => ({ val: f, label: f, fn: `setCaseFilter('formFactor','${f}')` })),
      ]),
      buildFilterDd('case-style', t('f_style'), cf.style, [
        { val: '', label: t('f_all'), fn: "setCaseFilter('style','')" },
        ...styles.map(s => ({ val: s, label: s, fn: `setCaseFilter('style','${s}')` })),
      ]),
      buildFilterDd('case-fans', t('f_fan_count'), cf.fanCount, [
        { val: '', label: t('f_all'), fn: "setCaseFilter('fanCount','')" },
        ...fanCounts.map(n => ({ val: String(n), label: t('f_pieces_n', {n}), fn: `setCaseFilter('fanCount','${n}')` })),
      ]),
    ].join('');

  } else {
    const brands = [...new Set(all.map(c => c.brand))].sort();
    bar.innerHTML = buildFilterDd('brand', t('f_brand'), state.brandFilter, [
      { val: '', label: t('f_all'), fn: "setBrand('')" },
      ...brands.map(b => ({ val: b, label: b, fn: `setBrand('${b.replace(/'/g, "\\'")}')` })),
    ]);
  }

  updateCompatHint();
}

function updateCompatHint() {
  const el  = document.getElementById('compatHint');
  if (!el) return;
  const sel = state.selected;
  let text  = '';

  if (state.currentStep === 'motherboard' && sel.cpu?.socket) {
    text = `<i class="bi bi-link-45deg me-1"></i>${t('compat_mb', { socket: sel.cpu.socket, name: `${sel.cpu.brand} ${sel.cpu.name}` })}`;
  } else if (state.currentStep === 'cpu' && sel.motherboard?.socket) {
    text = `<i class="bi bi-link-45deg me-1"></i>${t('compat_cpu', { socket: sel.motherboard.socket, name: `${sel.motherboard.brand} ${sel.motherboard.name}` })}`;
  } else if (state.currentStep === 'ram') {
    const kits = state.selected.ram || [];
    const max  = getMaxRamKits();
    if (sel.motherboard?.ramType) {
      text = `<i class="bi bi-link-45deg me-1"></i>${t('compat_ram_locked', { type: sel.motherboard.ramType, name: `${sel.motherboard.brand} ${sel.motherboard.name}`, used: kits.length, max })}`;
    } else {
      const suffix = currentLang === 'ru' ? pluralRu(max, 'а', 'а', 'ов') : (max !== 1 ? 's' : '');
      text = `<i class="bi bi-memory me-1"></i>${t('compat_ram_slots', { used: kits.length, max, suffix })}`;
    }
  } else if (state.currentStep === 'case' && sel.motherboard?.formFactor) {
    text = `<i class="bi bi-link-45deg me-1"></i>${t('compat_case', { ff: sel.motherboard.formFactor, name: `${sel.motherboard.brand} ${sel.motherboard.name}` })}`;
  }

  if (text) {
    el.innerHTML = text;
    el.classList.remove('d-none');
  } else {
    el.classList.add('d-none');
  }
}

function setCpuFilter(key, value) {
  state.cpuFilters[key] = value;
  if (key === 'socket') { state.cpuFilters.series = ''; state.cpuFilters.cores = ''; }
  if (key === 'series') { state.cpuFilters.cores  = ''; }
  closeAllFilterDds();
  renderBrandChips();
  renderComponentGrid();
}

function setGpuFilter(key, value) {
  state.gpuFilters[key] = value;
  if (key === 'vram') state.gpuFilters.fans = '';
  closeAllFilterDds();
  renderBrandChips();
  renderComponentGrid();
}

function setStorageFilter(key, value) {
  state.storageFilters[key] = value;
  closeAllFilterDds();
  renderBrandChips();
  renderComponentGrid();
}

function setRamFilter(key, value) {
  state.ramFilters[key] = value;
  if (key === 'ramType') state.ramFilters.capacity = '';
  closeAllFilterDds();
  renderBrandChips();
  renderComponentGrid();
}

function setMbFilter(key, value) {
  state.mbFilters[key] = value;
  if (key === 'socket')     { state.mbFilters.formFactor = ''; state.mbFilters.ramType = ''; state.mbFilters.chipset = ''; }
  if (key === 'formFactor') { state.mbFilters.ramType = ''; state.mbFilters.chipset = ''; }
  closeAllFilterDds();
  renderBrandChips();
  renderComponentGrid();
}

function setPsuFilter(key, value) {
  state.psuFilters[key] = value;
  closeAllFilterDds();
  renderBrandChips();
  renderComponentGrid();
}

function setCoolerFilter(key, value) {
  state.coolerFilters[key] = value;
  closeAllFilterDds();
  renderBrandChips();
  renderComponentGrid();
}

function setCaseFilter(key, value) {
  state.caseFilters[key] = value;
  closeAllFilterDds();
  renderBrandChips();
  renderComponentGrid();
}

function setChip(val) {
  state.chipFilter  = val;
  state.brandFilter = '';
  state.gpuFilters  = { vram: '', fans: '' };
  closeAllFilterDds();
  renderBrandChips();
  renderComponentGrid();
}

function setBrand(brand) {
  state.brandFilter = brand;
  if (state.currentStep === 'cpu') state.cpuFilters = { socket: '', series: '', cores: '' };
  if (state.currentStep === 'gpu') state.gpuFilters = { vram: '', fans: '' };
  closeAllFilterDds();
  renderBrandChips();
  renderComponentGrid();
}

// ─── Component grid ───────────────────────────────────────────────────────────
async function renderComponentGrid() {
  const grid = document.getElementById('componentsGrid');
  grid.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border" style="color:var(--cyan)" role="status">
        <span class="visually-hidden">${t('loading')}</span>
      </div>
    </div>`;

  const list    = await getFiltered();
  const isRam   = state.currentStep === 'ram';
  const ramKits = isRam ? (state.selected.ram || []) : null;
  const maxKits = isRam ? getMaxRamKits() : 1;
  const isFull  = isRam && ramKits.length >= maxKits;

  document.getElementById('resultsCount').textContent = currentLang === 'ru'
    ? `${list.length} позиц${pluralRu(list.length, 'ия', 'ии', 'ий')}`
    : `${list.length} item${list.length !== 1 ? 's' : ''}`;

  if (!list.length) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <i class="bi bi-search"></i>
          <h5>${t('nothing_found')}</h5>
          <p class="text-muted">${t('try_search')}</p>
        </div>
      </div>`;
    return;
  }

  grid.innerHTML = list.map((comp, i) => {
    let isSel, kitCount, btnText;
    if (isRam) {
      kitCount = ramKits.filter(r => String(r.id) === String(comp.id)).length;
      isSel    = kitCount > 0;
      if (kitCount === 0) {
        btnText = isFull
          ? `<i class="bi bi-x-circle me-1"></i>${t('slots_full')}`
          : t('add_kit');
      } else if (!isFull) {
        btnText = `<i class="bi bi-plus-lg me-1"></i>${t('add_2nd_kit')}`;
      } else {
        btnText = `<i class="bi bi-check-lg me-1"></i>${t('selected')} ×${kitCount}`;
      }
    } else {
      kitCount = 0;
      isSel    = String(comp.id) === String(state.selected[state.currentStep]?.id);
      btnText  = isSel ? `<i class="bi bi-check-lg me-1"></i>${t('selected')}` : t('select_component');
    }
    const badge = (isRam && kitCount > 1)
      ? `<div class="selected-badge">${kitCount}</div>`
      : `<div class="selected-badge"><i class="bi bi-check-lg"></i></div>`;
    const inCompare = state.compareList.some(c => String(c.id) === String(comp.id));

    return `
      <div class="col component-col" style="animation-delay:${i * 40}ms">
        <div class="component-card${isSel ? ' selected' : ''}" onclick="toggleComponent('${comp.id}')">
          ${badge}
          <button class="btn-compare${inCompare ? ' in-compare' : ''}"
                  onclick="event.stopPropagation();toggleCompare('${comp.id}')"
                  title="${inCompare ? t('remove_from_compare') : t('add_to_compare')}">
            <i class="bi bi-bar-chart-line"></i>
          </button>
          <div class="card-img-area">
            ${comp.image
              ? `<img src="${comp.image}" alt="${comp.name}" style="width:100%;height:100%;object-fit:contain;padding:0.75rem;">`
              : `<i class="bi ${CATEGORY_ICONS[state.currentStep] ?? 'bi-box'}" style="font-size:2.75rem;color:rgba(155,48,255,0.35);"></i>`}
          </div>
          <div class="card-body d-flex flex-column">
            <div class="comp-brand">${comp.brand}</div>
            <div class="comp-name">${comp.name}</div>
            <div class="comp-specs flex-grow-1">
              ${comp.specs.map(s => `<span class="spec-tag">${translateSpec(s)}</span>`).join('')}
            </div>
            <div class="comp-price">$${Number(comp.price).toFixed(2)}</div>
            <button class="btn-select${isSel ? ' selected' : ''}"
                    onclick="event.stopPropagation();toggleComponent('${comp.id}')">
              ${btnText}
            </button>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ─── Select / deselect ────────────────────────────────────────────────────────
async function toggleComponent(compId) {
  const stepId = state.currentStep;
  const all    = await loadStep(stepId);
  const comp   = all.find(c => String(c.id) === String(compId));

  if (stepId === 'ram') {
    const kits     = state.selected.ram || [];
    const max      = getMaxRamKits();
    const kitCount = kits.filter(r => String(r.id) === String(compId)).length;
    if (kits.length < max) {
      state.selected.ram = [...kits, comp];
    } else if (kitCount > 0) {
      const idx  = kits.findIndex(r => String(r.id) === String(compId));
      const next = kits.filter((_, i) => i !== idx);
      if (next.length) state.selected.ram = next;
      else             delete state.selected.ram;
    }
  } else {
    if (String(state.selected[stepId]?.id) === String(compId)) {
      delete state.selected[stepId];
    } else {
      state.selected[stepId] = comp;
    }
  }

  persistBuild();
  renderSidebar();
  renderComponentGrid();
  checkCompatibility();
  updateTotalPrice();
}

// ─── Reset build ──────────────────────────────────────────────────────────────
function resetBuild() {
  if (!Object.keys(state.selected).length) return;
  if (!confirm(t('reset_confirm'))) return;
  state.selected = {};
  persistBuild();
  renderSidebar();
  renderComponentGrid();
  checkCompatibility();
  updateTotalPrice();
}

// ─── Persistence ──────────────────────────────────────────────────────────────
function persistBuild() {
  localStorage.setItem('cyberrig-build', JSON.stringify(state.selected));
}

function loadPersistedBuild() {
  try {
    const raw = localStorage.getItem('cyberrig-build');
    if (raw) {
      state.selected = JSON.parse(raw);
      if (state.selected.ram && !Array.isArray(state.selected.ram))
        state.selected.ram = [state.selected.ram];
    }
  } catch {}
}

// ─── Price ────────────────────────────────────────────────────────────────────
function updateTotalPrice() {
  const total = Object.entries(state.selected).reduce((sum, [, val]) => {
    if (Array.isArray(val)) return sum + val.reduce((s, c) => s + Number(c.price), 0);
    return sum + Number(val.price);
  }, 0);
  document.getElementById('totalPriceSidebar').textContent = `$${total.toFixed(2)}`;
}

// ─── Compatibility ────────────────────────────────────────────────────────────
function checkCompatibility() {
  const s = state.selected;
  const warnings = [];

  if (s.cpu && s.motherboard && s.cpu.socket !== s.motherboard.socket)
    warnings.push(`<i class="bi bi-x-circle-fill me-1"></i>${t('warn_socket', { cpu: s.cpu.socket, mb: s.motherboard.socket })}`);

  if (s.ram && s.motherboard && s.motherboard.ramType) {
    (Array.isArray(s.ram) ? s.ram : [s.ram]).forEach(kit => {
      if (kit.ramType && kit.ramType !== s.motherboard.ramType)
        warnings.push(`<i class="bi bi-x-circle-fill me-1"></i>${t('warn_ram', { ram: kit.ramType, mb: s.motherboard.ramType })}`);
    });
  }

  if (s.cpu && s.cooler && s.cooler.maxTdp < s.cpu.tdp)
    warnings.push(`<i class="bi bi-exclamation-triangle-fill me-1"></i>${t('warn_cooler', { coolerTdp: s.cooler.maxTdp, cpuTdp: s.cpu.tdp })}`);

  if (s.motherboard && s.case) {
    if (!s.case.supportedFormFactors.includes(s.motherboard.formFactor))
      warnings.push(`<i class="bi bi-x-circle-fill me-1"></i>${t('warn_case', { ff: s.motherboard.formFactor })}`);
  }

  if (s.cpu && s.gpu && s.psu) {
    const need = s.cpu.tdp + s.gpu.tdp + 150;
    if (need > s.psu.wattage)
      warnings.push(`<i class="bi bi-lightning-fill me-1"></i>${t('warn_psu', { psu: s.psu.wattage, need })}`);
  }

  const el = document.getElementById('compatWarning');
  if (warnings.length) {
    document.getElementById('compatWarningText').innerHTML = warnings.join('<br>');
    el.classList.remove('d-none');
  } else {
    el.classList.add('d-none');
  }
}

// ─── Summary modal ────────────────────────────────────────────────────────────
function renderSummary() {
  const total = Object.entries(state.selected).reduce((sum, [, val]) => {
    if (Array.isArray(val)) return sum + val.reduce((s, c) => s + Number(c.price), 0);
    return sum + Number(val.price);
  }, 0);

  document.getElementById('summaryBody').innerHTML = STEPS.map(step => {
    if (step.id === 'ram') {
      const kits = state.selected.ram;
      if (!kits || !kits.length) return `
        <div class="summary-row">
          <div class="summary-cat">${step.label}</div>
          <div class="summary-comp-name"><span class="text-muted fst-italic">${t('not_selected')}</span></div>
          <div class="summary-comp-price">—</div>
        </div>`;
      const groups = [];
      for (const kit of kits) {
        const key = String(kit.id);
        const g = groups.find(g => g.key === key);
        if (g) { g.count++; g.total += Number(kit.price); }
        else groups.push({ key, label: `${kit.brand} ${kit.name}`, vol: kit.specs?.[0] ?? '', count: 1, total: Number(kit.price) });
      }
      const parseGB = v => {
        const m = v.match(/(\d+)[×x×](\d+)\s*GB/i);
        if (m) return parseInt(m[1]) * parseInt(m[2]);
        const m2 = v.match(/(\d+)\s*GB/i);
        return m2 ? parseInt(m2[1]) : 0;
      };
      const nameStr = groups.map(g => {
        if (g.count === 1) return g.label;
        const totalGB = parseGB(g.vol) * g.count;
        return `${g.label} ×${g.count}${totalGB ? ` (${t('total_gb')} ${totalGB}GB)` : ''}`;
      }).join(' + ');
      const totalPrice = groups.reduce((s, g) => s + g.total, 0);
      return `
        <div class="summary-row">
          <div class="summary-cat">${step.label}</div>
          <div class="summary-comp-name">${nameStr}</div>
          <div class="summary-comp-price">$${totalPrice.toFixed(2)}</div>
        </div>`;
    }
    const comp = state.selected[step.id];
    return `
      <div class="summary-row">
        <div class="summary-cat">${step.label}</div>
        <div class="summary-comp-name">
          ${comp
            ? `${comp.brand} ${comp.name}`
            : `<span class="text-muted fst-italic">${t('not_selected')}</span>`}
        </div>
        <div class="summary-comp-price">${comp ? `$${Number(comp.price).toFixed(2)}` : '—'}</div>
      </div>`;
  }).join('');

  document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
}

// ─── Order ────────────────────────────────────────────────────────────────────
async function handleOrder() {
  const items = [];
  const offlineNames = [];

  for (const [categorySlug, val] of Object.entries(state.selected)) {
    const comps = Array.isArray(val) ? val : [val];
    for (const c of comps) {
      const id = Number(c.id);
      if (Number.isInteger(id) && id > 0) {
        items.push({ categorySlug, componentId: id });
      } else {
        offlineNames.push(c.name);
      }
    }
  }

  if (!items.length && !offlineNames.length) {
    alert(t('build_empty'));
    return;
  }

  if (offlineNames.length) {
    alert(t('build_offline_error', { names: offlineNames.join(', ') }));
    return;
  }

  try {
    const saved = await Api.createBuild({ name: t('build_name'), items });
    alert(t('build_saved', { id: saved.id }));
  } catch {
    alert(t('build_error'));
  }
}

// ─── My Builds ───────────────────────────────────────────────────────────────
async function openMyBuildsModal() {
  const modal = new bootstrap.Modal(document.getElementById('myBuildsModal'));
  modal.show();
  await renderMyBuilds();
}

async function renderMyBuilds() {
  const body = document.getElementById('myBuildsBody');
  body.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-info"></div></div>';

  let builds;
  try {
    builds = await Api.getBuilds();
  } catch {
    body.innerHTML = `<p class="text-danger text-center py-3">${t('my_builds_error')}</p>`;
    return;
  }

  if (!builds.length) {
    body.innerHTML = `<p class="text-muted text-center py-4">${t('my_builds_empty')}</p>`;
    return;
  }

  body.innerHTML = builds.map(b => {
    const date = new Date(b.createdAt).toLocaleDateString(
      currentLang === 'ru' ? 'ru-RU' : 'en-US',
      { day: '2-digit', month: 'short', year: 'numeric' }
    );
    const items = b.items.map(i =>
      `<li class="text-muted small">${i.componentName} <span class="text-info">$${i.price.toFixed(2)}</span></li>`
    ).join('');

    return `
      <div class="build-card mb-3 p-3" data-build-id="${b.id}">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <div class="build-card-name">${b.name}</div>
            <div class="text-muted small">${t('build_date')}: ${date}</div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <span class="build-card-total">$${b.totalPrice.toFixed(2)}</span>
            <button class="btn btn-outline-danger btn-sm" onclick="deleteBuild(${b.id}, '${b.name.replace(/'/g, "\\'")}')">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        <ul class="mb-0 ps-3">${items}</ul>
      </div>`;
  }).join('');
}

async function deleteBuild(id, name) {
  if (!confirm(t('build_delete_confirm', { name }))) return;
  await Api.deleteBuild(id);
  await renderMyBuilds();
}

// ─── Compare ──────────────────────────────────────────────────────────────────
async function toggleCompare(compId) {
  const all  = await loadStep(state.currentStep);
  const comp = all.find(c => String(c.id) === String(compId));
  const idx  = state.compareList.findIndex(c => String(c.id) === String(compId));

  if (idx >= 0) {
    state.compareList.splice(idx, 1);
  } else if (state.compareList.length < 4) {
    state.compareList.push(comp);
  }

  renderCompareBar();
  renderComponentGrid();
}

function removeFromCompare(compId) {
  state.compareList = state.compareList.filter(c => String(c.id) !== String(compId));
  renderCompareBar();
  renderComponentGrid();
}

function clearCompare() {
  state.compareList = [];
  renderCompareBar();
  renderComponentGrid();
}

function renderCompareBar() {
  const bar  = document.getElementById('compareBar');
  const list = state.compareList;

  if (!list.length) {
    bar.classList.add('d-none');
    return;
  }
  bar.classList.remove('d-none');

  document.getElementById('compareBarSlots').innerHTML = Array.from({ length: 4 }, (_, i) => {
    const comp = list[i];
    return comp
      ? `<div class="compare-slot filled">
           <span>${comp.brand} ${comp.name}</span>
           <button class="compare-slot-remove" onclick="removeFromCompare('${comp.id}')">
             <i class="bi bi-x"></i>
           </button>
         </div>`
      : `<div class="compare-slot"><i class="bi bi-plus" style="opacity:.35"></i></div>`;
  }).join('');

  document.getElementById('compareBarCount').textContent = `${list.length} / 4`;
  document.getElementById('btnOpenCompare').disabled = list.length < 2;
}

function openCompareModal() {
  const list = state.compareList;
  if (list.length < 2) return;

  const labels   = SPEC_LABELS[state.currentStep] || [];
  const maxSpecs = Math.max(...list.map(c => c.specs.length));

  const headerRow = `
    <div class="compare-row compare-row-alt">
      <div class="compare-label"></div>
      ${list.map(c => `
        <div class="compare-cell" style="flex-direction:column;align-items:flex-start">
          <span class="compare-cell-brand">${c.brand}</span>
          <span class="compare-cell-name">${c.name}</span>
        </div>`).join('')}
    </div>`;

  const priceRow = `
    <div class="compare-row">
      <div class="compare-label">${t('price_label')}</div>
      ${list.map(c => `<div class="compare-cell compare-cell-price">$${Number(c.price).toFixed(2)}</div>`).join('')}
    </div>`;

  const specRows = Array.from({ length: maxSpecs }, (_, i) => {
    const label  = labels[i] || `·`;
    const values = list.map(c => translateSpec(c.specs[i] || '—'));
    return `
      <div class="compare-row${i % 2 === 1 ? ' compare-row-alt' : ''}">
        <div class="compare-label">${label}</div>
        ${values.map(v => `<div class="compare-cell">${v}</div>`).join('')}
      </div>`;
  }).join('');

  document.getElementById('compareBody').innerHTML =
    `<div class="compare-table">${headerRow}${priceRow}${specRows}</div>`;

  new bootstrap.Modal(document.getElementById('compareModal')).show();
}

// ─── Mobile sidebar ───────────────────────────────────────────────────────────
function toggleSidebar() {
  document.querySelector('.configurator-sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('visible');
}

function closeSidebar() {
  document.querySelector('.configurator-sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('visible');
}

// ─── Sort dropdown ────────────────────────────────────────────────────────────
function toggleSortDropdown() {
  document.getElementById('sortDropdown').classList.toggle('open');
}

function closeSortDropdown() {
  document.getElementById('sortDropdown').classList.remove('open');
}

function resetSortDropdown() {
  closeSortDropdown();
  document.getElementById('sortLabel').textContent = t('sort_default');
  document.querySelectorAll('.sort-option').forEach(el => {
    el.classList.toggle('active', el.dataset.value === 'default');
  });
}

function setSortOption(value) {
  const labels = { default: t('sort_default'), 'price-asc': t('sort_price_asc'), 'price-desc': t('sort_price_desc'), 'name-asc': t('sort_name_asc') };
  state.sortBy = value;
  document.getElementById('sortLabel').textContent = labels[value] ?? value;
  document.querySelectorAll('.sort-option').forEach(el => {
    el.classList.toggle('active', el.dataset.value === value);
  });
  closeSortDropdown();
  renderComponentGrid();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pluralRu(n, one, few, many) {
  const t = n % 100, m = n % 10;
  if (t >= 11 && t <= 19) return many;
  if (m === 1) return one;
  if (m >= 2 && m <= 4) return few;
  return many;
}
