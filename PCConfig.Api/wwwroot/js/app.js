// ─── Steps config ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 'cpu',         label: 'Процессор',           icon: 'bi-cpu',              desc: 'Выберите центральный процессор' },
  { id: 'motherboard', label: 'Материнская плата',   icon: 'bi-motherboard',      desc: 'Выберите материнскую плату' },
  { id: 'ram',         label: 'Оперативная память',  icon: 'bi-memory',           desc: 'Выберите оперативную память' },
  { id: 'gpu',         label: 'Видеокарта',          icon: 'bi-gpu-card',         desc: 'Выберите графическую карту' },
  { id: 'storage',     label: 'Накопитель',          icon: 'bi-device-ssd',       desc: 'Выберите накопитель для системы' },
  { id: 'psu',         label: 'Блок питания',        icon: 'bi-lightning-charge', desc: 'Выберите блок питания' },
  { id: 'cooler',      label: 'Охлаждение CPU',      icon: 'bi-wind',             desc: 'Выберите систему охлаждения процессора' },
  { id: 'case',        label: 'Корпус',              icon: 'bi-pc-display',       desc: 'Выберите корпус для вашей сборки' },
];

const CATEGORY_ICONS = {
  case: 'bi-pc-display', cpu: 'bi-cpu', cooler: 'bi-wind',
  motherboard: 'bi-motherboard', ram: 'bi-memory',
  gpu: 'bi-gpu-card', storage: 'bi-device-ssd', psu: 'bi-lightning-charge',
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
  mbFilters:    { socket: '', formFactor: '', ramType: '' },
  ramFilters:   { ramType: '', capacity: '' },
  gpuFilters:     { vram: '', fans: '' },
  storageFilters: { capacity: '', formFactor: '', interface: '', readSpeed: '' },
  _cache:       {},
};

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  loadPersistedBuild();
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
  state.mbFilters    = { socket: '', formFactor: '', ramType: '' };
  state.ramFilters   = { ramType: '', capacity: '' };
  state.gpuFilters     = { vram: '', fans: '' };
  state.storageFilters = { capacity: '', formFactor: '', interface: '', readSpeed: '' };
  document.getElementById('searchInput').value = '';
  resetSortDropdown();
  closeAllFilterDds();
  renderSidebar();
  await renderCurrentStep();
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
    const sel      = state.selected[step.id];
    const isActive = step.id === state.currentStep;
    const cls = ['step-item', isActive && 'active', sel && 'selected'].filter(Boolean).join(' ');

    return `
      <div class="${cls}" onclick="navigateTo('${step.id}')">
        <div class="step-icon"><i class="bi ${sel ? 'bi-check-lg' : step.icon}"></i></div>
        <div class="step-info">
          <div class="step-name">${step.label}</div>
          ${sel
            ? `<div class="step-selected-name">${sel.brand} ${sel.name}</div>`
            : `<div class="step-not-selected">Не выбрано</div>`}
        </div>
        ${sel ? `<div class="step-price">$${sel.price.toFixed(2)}</div>` : ''}
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
    `Шаг ${idx + 1} / ${STEPS.length}`;

  await Promise.all([renderBrandChips(), renderComponentGrid()]);
  checkCompatibility();
  updateTotalPrice();
}

// ─── Component data ───────────────────────────────────────────────────────────
async function loadStep(stepId) {
  if (!state._cache[stepId]) {
    state._cache[stepId] = await Api.getComponents(stepId);
  }
  return state._cache[stepId];
}

async function getFiltered() {
  let list = [...await loadStep(state.currentStep)];

  if (state.currentStep === 'gpu' && state.chipFilter) {
    list = list.filter(c => c.chipBrand === state.chipFilter);
  }
  if (state.brandFilter) {
    list = list.filter(c => c.brand === state.brandFilter);
  }
  if (state.currentStep === 'gpu') {
    if (state.gpuFilters.vram) list = list.filter(c => gpuVram(c.specs) === state.gpuFilters.vram);
    if (state.gpuFilters.fans) list = list.filter(c => gpuFans(c.specs) === state.gpuFilters.fans);
  }
  if (state.currentStep === 'cpu') {
    if (state.cpuFilters.socket) list = list.filter(c => c.socket === state.cpuFilters.socket);
    if (state.cpuFilters.series) list = list.filter(c => cpuSeries(c.name) === state.cpuFilters.series);
    if (state.cpuFilters.cores)  list = list.filter(c => cpuCores(c.specs) === parseInt(state.cpuFilters.cores));
  }
  if (state.currentStep === 'storage') {
    const sf = state.storageFilters;
    if (sf.capacity)   list = list.filter(c => storageCapacity(c.specs)   === sf.capacity);
    if (sf.formFactor) list = list.filter(c => storageFormFactor(c.specs) === sf.formFactor);
    if (sf.interface)  list = list.filter(c => storageInterface(c.specs)  === sf.interface);
    if (sf.readSpeed)  list = list.filter(c => storageReadSpeed(c.specs)  === parseInt(sf.readSpeed));
  }
  if (state.currentStep === 'ram') {
    if (state.ramFilters.ramType)  list = list.filter(c => c.ramType === state.ramFilters.ramType);
    if (state.ramFilters.capacity) list = list.filter(c => ramCapacity(c.specs) === state.ramFilters.capacity);
  }
  if (state.currentStep === 'motherboard') {
    if (state.mbFilters.socket)     list = list.filter(c => c.socket     === state.mbFilters.socket);
    if (state.mbFilters.formFactor) list = list.filter(c => c.formFactor === state.mbFilters.formFactor);
    if (state.mbFilters.ramType)    list = list.filter(c => c.ramType    === state.mbFilters.ramType);
  }

  if (state.searchQuery) {
    list = list.filter(c =>
      `${c.brand} ${c.name}`.toLowerCase().includes(state.searchQuery) ||
      c.specs.some(s => s.toLowerCase().includes(state.searchQuery))
    );
  }

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
  const m = name.match(/Ryzen\s+[3579]|Core\s+i[3579]/);
  return m ? m[0] : '';
}

function cpuCores(specs) {
  const s = specs.find(x => /Cores/i.test(x));
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
  const s = specs.find(x => /Read/i.test(x));
  if (!s) return 0;
  return parseInt(s.replace(/\s/g, ''));
}

function fmtSpeed(n) {
  return n >= 1000
    ? `${Math.floor(n / 1000)} ${String(n % 1000).padStart(3, '0')} МБ/с`
    : `${n} МБ/с`;
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
    const brands      = [...new Set(all.map(c => c.brand))].sort();
    const afterBrand  = state.brandFilter ? all.filter(c => c.brand === state.brandFilter) : all;
    const sockets     = [...new Set(afterBrand.map(c => c.socket).filter(Boolean))].sort();
    const afterSocket = state.cpuFilters.socket ? afterBrand.filter(c => c.socket === state.cpuFilters.socket) : afterBrand;
    const seriesList  = [...new Set(afterSocket.map(c => cpuSeries(c.name)).filter(Boolean))].sort();
    const afterSeries = state.cpuFilters.series ? afterSocket.filter(c => cpuSeries(c.name) === state.cpuFilters.series) : afterSocket;
    const coresList   = [...new Set(afterSeries.map(c => cpuCores(c.specs)).filter(Boolean))].sort((a, b) => a - b);

    bar.innerHTML = [
      buildFilterDd('brand', 'Бренд', state.brandFilter, [
        { val: '', label: 'Все', fn: "setBrand('')" },
        ...brands.map(b => ({ val: b, label: b, fn: `setBrand('${b}')` })),
      ]),
      buildFilterDd('socket', 'Сокет', state.cpuFilters.socket, [
        { val: '', label: 'Все', fn: "setCpuFilter('socket','')" },
        ...sockets.map(s => ({ val: s, label: s, fn: `setCpuFilter('socket','${s}')` })),
      ]),
      buildFilterDd('series', 'Серия', state.cpuFilters.series, [
        { val: '', label: 'Все', fn: "setCpuFilter('series','')" },
        ...seriesList.map(s => ({ val: s, label: s, fn: `setCpuFilter('series','${s.replace(/'/g, "\\'")}')` })),
      ]),
      buildFilterDd('cores', 'Ядра', state.cpuFilters.cores, [
        { val: '', label: 'Все', fn: "setCpuFilter('cores','')" },
        ...coresList.map(n => ({ val: String(n), label: `${n} ядер`, fn: `setCpuFilter('cores','${n}')` })),
      ]),
    ].join('');

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
      buildFilterDd('brand', 'Бренд', state.brandFilter, [
        { val: '', label: 'Все', fn: "setBrand('')" },
        ...brands.map(b => ({ val: b, label: b, fn: `setBrand('${b}')` })),
      ]),
      buildFilterDd('st-cap', 'Ёмкость', sf.capacity, [
        { val: '', label: 'Все', fn: "setStorageFilter('capacity','')" },
        ...caps.map(c => ({ val: c, label: c, fn: `setStorageFilter('capacity','${c}')` })),
      ]),
      buildFilterDd('st-form', 'Формат', sf.formFactor, [
        { val: '', label: 'Все', fn: "setStorageFilter('formFactor','')" },
        ...forms.map(f => ({ val: f, label: f, fn: `setStorageFilter('formFactor','${f}')` })),
      ]),
      buildFilterDd('st-iface', 'Тип', sf.interface, [
        { val: '', label: 'Все', fn: "setStorageFilter('interface','')" },
        ...ifaces.map(i => ({ val: i, label: i, fn: `setStorageFilter('interface','${i}')` })),
      ]),
      buildFilterDd('st-speed', 'Скорость чтения', sf.readSpeed, [
        { val: '', label: 'Все', fn: "setStorageFilter('readSpeed','')" },
        ...speeds.map(n => ({ val: String(n), label: fmtSpeed(n), fn: `setStorageFilter('readSpeed','${n}')` })),
      ]),
    ].join('');

  } else if (state.currentStep === 'ram') {
    const brands       = [...new Set(all.map(c => c.brand))].sort();
    const afterBrand   = state.brandFilter ? all.filter(c => c.brand === state.brandFilter) : all;
    const ramTypes     = [...new Set(afterBrand.map(c => c.ramType).filter(Boolean))].sort();
    const afterType    = state.ramFilters.ramType ? afterBrand.filter(c => c.ramType === state.ramFilters.ramType) : afterBrand;
    const capacities   = [...new Set(afterType.map(c => ramCapacity(c.specs)).filter(Boolean))]
                          .sort((a, b) => parseInt(a) - parseInt(b));

    bar.innerHTML = [
      buildFilterDd('brand', 'Бренд', state.brandFilter, [
        { val: '', label: 'Все', fn: "setBrand('')" },
        ...brands.map(b => ({ val: b, label: b, fn: `setBrand('${b}')` })),
      ]),
      buildFilterDd('ram-type', 'Тип', state.ramFilters.ramType, [
        { val: '', label: 'Все', fn: "setRamFilter('ramType','')" },
        ...ramTypes.map(t => ({ val: t, label: t, fn: `setRamFilter('ramType','${t}')` })),
      ]),
      buildFilterDd('ram-cap', 'Объём', state.ramFilters.capacity, [
        { val: '', label: 'Все', fn: "setRamFilter('capacity','')" },
        ...capacities.map(c => ({ val: c, label: c, fn: `setRamFilter('capacity','${c}')` })),
      ]),
    ].join('');

  } else if (state.currentStep === 'motherboard') {
    const brands     = [...new Set(all.map(c => c.brand))].sort();
    const afterBrand = state.brandFilter ? all.filter(c => c.brand === state.brandFilter) : all;
    const sockets    = [...new Set(afterBrand.map(c => c.socket).filter(Boolean))].sort();
    const afterSock  = state.mbFilters.socket ? afterBrand.filter(c => c.socket === state.mbFilters.socket) : afterBrand;
    const factors    = [...new Set(afterSock.map(c => c.formFactor).filter(Boolean))].sort();
    const afterFact  = state.mbFilters.formFactor ? afterSock.filter(c => c.formFactor === state.mbFilters.formFactor) : afterSock;
    const ramTypes   = [...new Set(afterFact.map(c => c.ramType).filter(Boolean))].sort();

    bar.innerHTML = [
      buildFilterDd('brand', 'Бренд', state.brandFilter, [
        { val: '', label: 'Все', fn: "setBrand('')" },
        ...brands.map(b => ({ val: b, label: b, fn: `setBrand('${b}')` })),
      ]),
      buildFilterDd('mb-socket', 'Сокет', state.mbFilters.socket, [
        { val: '', label: 'Все', fn: "setMbFilter('socket','')" },
        ...sockets.map(s => ({ val: s, label: s, fn: `setMbFilter('socket','${s}')` })),
      ]),
      buildFilterDd('mb-form', 'Форм-фактор', state.mbFilters.formFactor, [
        { val: '', label: 'Все', fn: "setMbFilter('formFactor','')" },
        ...factors.map(f => ({ val: f, label: f, fn: `setMbFilter('formFactor','${f}')` })),
      ]),
      buildFilterDd('mb-ram', 'Тип памяти', state.mbFilters.ramType, [
        { val: '', label: 'Все', fn: "setMbFilter('ramType','')" },
        ...ramTypes.map(r => ({ val: r, label: r, fn: `setMbFilter('ramType','${r}')` })),
      ]),
    ].join('');

  } else if (state.currentStep === 'gpu') {
    const chips      = [...new Set(all.map(c => c.chipBrand).filter(Boolean))].sort();
    const afterChip  = state.chipFilter ? all.filter(c => c.chipBrand === state.chipFilter) : all;
    const partners   = [...new Set(afterChip.map(c => c.brand))].sort();
    const afterPart  = state.brandFilter ? afterChip.filter(c => c.brand === state.brandFilter) : afterChip;
    const vramList   = [...new Set(afterPart.map(c => gpuVram(c.specs)).filter(Boolean))]
                        .sort((a, b) => parseInt(a) - parseInt(b));
    const afterVram  = state.gpuFilters.vram ? afterPart.filter(c => gpuVram(c.specs) === state.gpuFilters.vram) : afterPart;
    const fansList   = [...new Set(afterVram.map(c => gpuFans(c.specs)).filter(Boolean))].sort();

    const fansLabel  = v => v === 'AIO' ? 'Жидкостное' : `${v} вентилятора`;

    bar.innerHTML = [
      buildFilterDd('chip', 'Чип', state.chipFilter, [
        { val: '', label: 'Все', fn: "setChip('')" },
        ...chips.map(b => ({ val: b, label: b, fn: `setChip('${b}')` })),
      ]),
      buildFilterDd('partner', 'Производитель', state.brandFilter, [
        { val: '', label: 'Все', fn: "setBrand('')" },
        ...partners.map(b => ({ val: b, label: b, fn: `setBrand('${b.replace(/'/g, "\\'")}')` })),
      ]),
      buildFilterDd('gpu-vram', 'Память', state.gpuFilters.vram, [
        { val: '', label: 'Все', fn: "setGpuFilter('vram','')" },
        ...vramList.map(v => ({ val: v, label: v, fn: `setGpuFilter('vram','${v}')` })),
      ]),
      buildFilterDd('gpu-fans', 'Вентиляторы', state.gpuFilters.fans, [
        { val: '', label: 'Все', fn: "setGpuFilter('fans','')" },
        ...fansList.map(v => ({ val: v, label: fansLabel(v), fn: `setGpuFilter('fans','${v}')` })),
      ]),
    ].join('');

  } else {
    const brands = [...new Set(all.map(c => c.brand))].sort();
    bar.innerHTML = buildFilterDd('brand', 'Бренд', state.brandFilter, [
      { val: '', label: 'Все', fn: "setBrand('')" },
      ...brands.map(b => ({ val: b, label: b, fn: `setBrand('${b.replace(/'/g, "\\'")}')` })),
    ]);
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
  if (key === 'socket')     { state.mbFilters.formFactor = ''; state.mbFilters.ramType = ''; }
  if (key === 'formFactor') { state.mbFilters.ramType = ''; }
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
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>`;

  const list       = await getFiltered();
  const selectedId = state.selected[state.currentStep]?.id;

  document.getElementById('resultsCount').textContent =
    `${list.length} позиц${pluralRu(list.length, 'ия', 'ии', 'ий')}`;

  if (!list.length) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <i class="bi bi-search"></i>
          <h5>Ничего не найдено</h5>
          <p class="text-muted">Попробуйте изменить параметры поиска</p>
        </div>
      </div>`;
    return;
  }

  grid.innerHTML = list.map((comp, i) => {
    const isSel = String(comp.id) === String(selectedId);
    return `
      <div class="col component-col" style="animation-delay:${i * 40}ms">
        <div class="component-card${isSel ? ' selected' : ''}" onclick="toggleComponent('${comp.id}')">
          <div class="selected-badge"><i class="bi bi-check-lg"></i></div>
          <div class="card-img-area">
            <i class="bi ${CATEGORY_ICONS[state.currentStep] ?? 'bi-box'}"
               style="font-size:3.75rem;color:rgba(155,48,255,0.35);"></i>
          </div>
          <div class="card-body d-flex flex-column">
            <div class="comp-brand">${comp.brand}</div>
            <div class="comp-name">${comp.name}</div>
            <div class="comp-specs flex-grow-1">
              ${comp.specs.map(s => `<span class="spec-tag">${s}</span>`).join('')}
            </div>
            <div class="comp-price">$${Number(comp.price).toFixed(2)}</div>
            <button class="btn-select${isSel ? ' selected' : ''}"
                    onclick="event.stopPropagation();toggleComponent('${comp.id}')">
              ${isSel ? '<i class="bi bi-check-lg me-1"></i>Выбрано' : 'Выбрать компонент'}
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

  if (String(state.selected[stepId]?.id) === String(compId)) {
    delete state.selected[stepId];
  } else {
    state.selected[stepId] = comp;
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
  if (!confirm('Сбросить всю сборку? Все выбранные компоненты будут удалены.')) return;
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
    if (raw) state.selected = JSON.parse(raw);
  } catch {}
}

// ─── Price ────────────────────────────────────────────────────────────────────
function updateTotalPrice() {
  const total = Object.values(state.selected)
    .reduce((s, c) => s + Number(c.price), 0);
  document.getElementById('totalPriceSidebar').textContent = `$${total.toFixed(2)}`;
}

// ─── Compatibility ────────────────────────────────────────────────────────────
function checkCompatibility() {
  const s = state.selected;
  const warnings = [];

  if (s.cpu && s.motherboard && s.cpu.socket !== s.motherboard.socket)
    warnings.push(
      `<i class="bi bi-x-circle-fill me-1"></i>` +
      `Несовместимый сокет: CPU <b>${s.cpu.socket}</b> ≠ плата <b>${s.motherboard.socket}</b>`);

  if (s.ram && s.motherboard && s.ram.ramType && s.motherboard.ramType
      && s.ram.ramType !== s.motherboard.ramType)
    warnings.push(
      `<i class="bi bi-x-circle-fill me-1"></i>` +
      `Несовместимая память: ОЗУ <b>${s.ram.ramType}</b> ≠ плата <b>${s.motherboard.ramType}</b>`);

  if (s.cpu && s.cooler && s.cooler.maxTdp < s.cpu.tdp)
    warnings.push(
      `<i class="bi bi-exclamation-triangle-fill me-1"></i>` +
      `Охладитель рассчитан на <b>${s.cooler.maxTdp}W</b>, TDP процессора <b>${s.cpu.tdp}W</b>`);

  if (s.cpu && s.gpu && s.psu) {
    const need = s.cpu.tdp + s.gpu.tdp + 150;
    if (need > s.psu.wattage)
      warnings.push(
        `<i class="bi bi-lightning-fill me-1"></i>` +
        `Мощность БП <b>${s.psu.wattage}W</b> может быть недостаточной (нужно ~<b>${need}W</b>)`);
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
  const total = Object.values(state.selected)
    .reduce((s, c) => s + Number(c.price), 0);

  document.getElementById('summaryBody').innerHTML = STEPS.map(step => {
    const comp = state.selected[step.id];
    return `
      <div class="summary-row">
        <div class="summary-cat">${step.label}</div>
        <div class="summary-comp-name">
          ${comp
            ? `${comp.brand} ${comp.name}`
            : `<span class="text-muted fst-italic">Не выбрано</span>`}
        </div>
        <div class="summary-comp-price">${comp ? `$${Number(comp.price).toFixed(2)}` : '—'}</div>
      </div>`;
  }).join('');

  document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
}

// ─── Order ────────────────────────────────────────────────────────────────────
async function handleOrder() {
  const items = Object.entries(state.selected).map(([categorySlug, comp]) => ({
    categorySlug,
    componentId: Number(comp.id),
  }));

  if (!items.length) {
    alert('Сборка пустая. Выберите хотя бы один компонент.');
    return;
  }

  try {
    const saved = await Api.createBuild({ name: 'Моя сборка', items });
    alert(`Сборка #${saved.id} сохранена в базе данных!`);
  } catch {
    alert('Ошибка сохранения. Убедитесь что бэкенд запущен (dotnet run).');
  }
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
  document.getElementById('sortLabel').textContent = 'По умолчанию';
  document.querySelectorAll('.sort-option').forEach(el => {
    el.classList.toggle('active', el.dataset.value === 'default');
  });
}

function setSortOption(value, label) {
  state.sortBy = value;
  document.getElementById('sortLabel').textContent = label;
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
