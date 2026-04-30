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

  document.getElementById('sortSelect').addEventListener('change', e => {
    state.sortBy = e.target.value;
    renderComponentGrid();
  });

  ['btnPrev', 'btnPrevBottom'].forEach(id =>
    document.getElementById(id).addEventListener('click', navigatePrev));
  ['btnNext', 'btnNextBottom'].forEach(id =>
    document.getElementById(id).addEventListener('click', navigateNext));

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
  state.brandFilter = '';
  document.getElementById('searchInput').value = '';
  document.getElementById('sortSelect').value = 'default';
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
  document.getElementById('btnPrev').disabled       = isFirst;
  document.getElementById('btnPrevBottom').disabled = isFirst;
  document.getElementById('btnNext').disabled       = isLast;
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

  if (state.brandFilter) {
    list = list.filter(c => c.brand === state.brandFilter);
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

// ─── Brand chips ──────────────────────────────────────────────────────────────
async function renderBrandChips() {
  const all    = await loadStep(state.currentStep);
  const brands = [...new Set(all.map(c => c.brand))].sort();
  const bar    = document.getElementById('brandsBar');

  bar.innerHTML = [
    `<button class="brand-chip${!state.brandFilter ? ' active' : ''}" onclick="setBrand('')">Все</button>`,
    ...brands.map(b =>
      `<button class="brand-chip${state.brandFilter === b ? ' active' : ''}" onclick="setBrand('${b.replace(/'/g, "\\'")}')">${b}</button>`)
  ].join('');
}

function setBrand(brand) {
  state.brandFilter = brand;
  renderBrandChips();
  renderComponentGrid();
}

// ─── Component grid ───────────────────────────────────────────────────────────
async function renderComponentGrid() {
  const grid = document.getElementById('componentsGrid');
  grid.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border" style="color:var(--accent)" role="status">
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
               style="font-size:4rem;color:#444;"></i>
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
  const fmt = `$${total.toFixed(2)}`;
  document.getElementById('totalPriceNav').textContent     = fmt;
  document.getElementById('totalPriceSidebar').textContent = fmt;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pluralRu(n, one, few, many) {
  const t = n % 100, m = n % 10;
  if (t >= 11 && t <= 19) return many;
  if (m === 1) return one;
  if (m >= 2 && m <= 4) return few;
  return many;
}
