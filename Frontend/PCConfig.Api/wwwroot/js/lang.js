// ─── Translations ─────────────────────────────────────────────────────────────
const LANG = {
  ru: {
    step_cpu_label:         'Процессор',
    step_cpu_desc:          'Выберите центральный процессор',
    step_motherboard_label: 'Материнская плата',
    step_motherboard_desc:  'Выберите материнскую плату',
    step_ram_label:         'Оперативная память',
    step_ram_desc:          'Выберите оперативную память',
    step_gpu_label:         'Видеокарта',
    step_gpu_desc:          'Выберите графическую карту',
    step_storage_label:     'Накопитель',
    step_storage_desc:      'Выберите накопитель для системы',
    step_psu_label:         'Блок питания',
    step_psu_desc:          'Выберите блок питания',
    step_cooler_label:      'Охлаждение CPU',
    step_cooler_desc:       'Выберите систему охлаждения процессора',
    step_case_label:        'Корпус',
    step_case_desc:         'Выберите корпус для вашей сборки',

    sidebar_heading:   'Шаги конфигурации',
    total_price:       'Итоговая стоимость',
    view_build:        'Просмотр сборки',
    reset_build:       'Сбросить сборку',

    search_placeholder: 'Поиск...',
    sort_default:       'По умолчанию',
    sort_price_asc:     'Цена: дешевле',
    sort_price_desc:    'Цена: дороже',
    sort_name_asc:      'Название: А–Я',

    btn_prev:   'Предыдущий',
    btn_next:   'Следующий',
    step_label: 'Шаг',
    step_of:    '/',

    not_selected:        'Не выбрано',
    loading:             'Загрузка...',
    nothing_found:       'Ничего не найдено',
    try_search:          'Попробуйте изменить параметры поиска',
    slots_full:          'Слоты заняты',
    add_kit:             'Добавить комплект',
    add_2nd_kit:         'Добавить 2-й комплект',
    selected:            'Выбрано',
    select_component:    'Выбрать компонент',
    add_to_compare:      'Добавить в сравнение',
    remove_from_compare: 'Убрать из сравнения',

    your_build:   'Ваша сборка',
    total_label:  'Итого:',
    place_order:  'Оформить заказ',
    close:        'Закрыть',
    total_gb:     'итого',

    compare_title: 'Сравнение компонентов',
    compare_btn:   'Сравнить',
    price_label:   'Цена',

    reset_confirm: 'Сбросить всю сборку? Все выбранные компоненты будут удалены.',
    build_empty:   'Сборка пустая. Выберите хотя бы один компонент.',
    build_name:    'Моя сборка',
    build_saved:   'Сборка #{id} сохранена в базе данных!',
    build_error:   'Ошибка сохранения. Убедитесь что бэкенд запущен (dotnet run).',

    f_brand:       'Бренд',
    f_all:         'Все',
    f_socket:      'Сокет',
    f_series:      'Серия',
    f_cores:       'Ядра',
    f_cores_n:     '{n} ядер',
    f_capacity:    'Ёмкость',
    f_format:      'Формат',
    f_type:        'Тип',
    f_read_speed:  'Скорость чтения',
    f_memory_type: 'Тип памяти',
    f_ram_slots:   'Слоты RAM',
    f_ram_slots_n: '{n} слота',
    f_chipset:     'Чипсет',
    f_chip:        'Чип',
    f_mfr:         'Производитель',
    f_memory:      'Память',
    f_fans:        'Вентиляторы',
    f_wattage:     'Мощность',
    f_standard:    'Стандарт',
    f_modular:     'Модульность',
    f_fan_size:    'Размер вент.',
    f_lighting:    'Подсветка',
    f_form_factor: 'Форм-фактор',
    f_style:       'Стиль',
    f_fan_count:   'Вентиляторов',
    f_ram_volume:  'Объём',
    f_pieces_n:    '{n} шт.',

    fv_tower:        'Башенное',
    fv_aio:          'AIO Водяное',
    fv_liquid:       'Жидкостное',
    fv_fully_modular:'Полностью модульный',
    fv_semi_modular: 'Частично модульный',
    fv_non_modular:  'Немодульный',

    speed_unit: 'МБ/с',

    compat_mb:        'Сокет <b>{socket}</b> — только платы совместимые с <b>{name}</b>',
    compat_cpu:       'Сокет <b>{socket}</b> — только процессоры совместимые с <b>{name}</b>',
    compat_ram_locked:'Только <b>{type}</b> — <b>{name}</b> · Слоты: <b>{used}/{max}</b>',
    compat_ram_slots: 'Слоты: <b>{used}/{max}</b> комплект{suffix} RAM',
    compat_case:      'Только корпуса поддерживающие <b>{ff}</b> — совместимость с <b>{name}</b>',

    warn_socket: 'Несовместимый сокет: CPU <b>{cpu}</b> ≠ плата <b>{mb}</b>',
    warn_ram:    'Несовместимая память: ОЗУ <b>{ram}</b> ≠ плата <b>{mb}</b>',
    warn_cooler: 'Охладитель рассчитан на <b>{coolerTdp}W</b>, TDP процессора <b>{cpuTdp}W</b>',
    warn_case:   'Корпус не поддерживает форм-фактор материнской платы <b>{ff}</b>',
    warn_psu:    'Мощность БП <b>{psu}W</b> может быть недостаточной (нужно ~<b>{need}W</b>)',

    spec_cpu:         ['Ядра / Потоки', 'Сокет', 'Частота', 'TDP', 'L3 Cache'],
    spec_motherboard: ['Сокет', 'Форм-фактор', 'Тип RAM', 'Слоты RAM', 'Чипсет', 'PCIe', 'M.2', 'Задняя панель USB', 'Прочее'],
    spec_ram:         ['Объём', 'Тип / Частота', 'Тайминги', 'XMP профиль', 'Особенности'],
    spec_gpu:         ['VRAM', 'TDP', 'Интерфейс', 'DLSS / FSR', 'Вентиляторы', 'Буст частота'],
    spec_storage:     ['Объём', 'Интерфейс', 'Чтение', 'Запись'],
    spec_psu:         ['Мощность', 'Сертификат', 'Модульность', 'Стандарт', 'Гарантия'],
    spec_cooler:      ['Тип', 'Вентиляторы', 'Тепловые трубки', 'Подсветка', 'Max TDP', 'Шум'],
    spec_case:        ['Форм-фактор', 'Поддержка плат', 'Вентиляторов', 'Боковая панель', 'USB порты', 'Накопители'],
  },

  en: {
    step_cpu_label:         'CPU',
    step_cpu_desc:          'Select a central processor',
    step_motherboard_label: 'Motherboard',
    step_motherboard_desc:  'Select a motherboard',
    step_ram_label:         'RAM',
    step_ram_desc:          'Select memory',
    step_gpu_label:         'GPU',
    step_gpu_desc:          'Select a graphics card',
    step_storage_label:     'Storage',
    step_storage_desc:      'Select a storage drive',
    step_psu_label:         'Power Supply',
    step_psu_desc:          'Select a power supply unit',
    step_cooler_label:      'CPU Cooler',
    step_cooler_desc:       'Select a CPU cooling system',
    step_case_label:        'Case',
    step_case_desc:         'Select a case for your build',

    sidebar_heading:   'Configuration Steps',
    total_price:       'Total Price',
    view_build:        'View Build',
    reset_build:       'Reset Build',

    search_placeholder: 'Search...',
    sort_default:       'Default',
    sort_price_asc:     'Price: Low to High',
    sort_price_desc:    'Price: High to Low',
    sort_name_asc:      'Name: A–Z',

    btn_prev:   'Previous',
    btn_next:   'Next',
    step_label: 'Step',
    step_of:    '/',

    not_selected:        'Not selected',
    loading:             'Loading...',
    nothing_found:       'Nothing found',
    try_search:          'Try changing search parameters',
    slots_full:          'Slots full',
    add_kit:             'Add kit',
    add_2nd_kit:         'Add 2nd kit',
    selected:            'Selected',
    select_component:    'Select',
    add_to_compare:      'Add to compare',
    remove_from_compare: 'Remove from compare',

    your_build:   'Your Build',
    total_label:  'Total:',
    place_order:  'Place Order',
    close:        'Close',
    total_gb:     'total',

    compare_title: 'Component Comparison',
    compare_btn:   'Compare',
    price_label:   'Price',

    reset_confirm: 'Reset the entire build? All selected components will be removed.',
    build_empty:   'Build is empty. Select at least one component.',
    build_name:    'My Build',
    build_saved:   'Build #{id} saved to database!',
    build_error:   'Save error. Make sure the backend is running (dotnet run).',

    f_brand:       'Brand',
    f_all:         'All',
    f_socket:      'Socket',
    f_series:      'Series',
    f_cores:       'Cores',
    f_cores_n:     '{n} cores',
    f_capacity:    'Capacity',
    f_format:      'Format',
    f_type:        'Type',
    f_read_speed:  'Read Speed',
    f_memory_type: 'Memory Type',
    f_ram_slots:   'RAM Slots',
    f_ram_slots_n: '{n} slots',
    f_chipset:     'Chipset',
    f_chip:        'Chip',
    f_mfr:         'Manufacturer',
    f_memory:      'Memory',
    f_fans:        'Fans',
    f_wattage:     'Wattage',
    f_standard:    'Standard',
    f_modular:     'Modularity',
    f_fan_size:    'Fan Size',
    f_lighting:    'Lighting',
    f_form_factor: 'Form Factor',
    f_style:       'Style',
    f_fan_count:   'Fans',
    f_ram_volume:  'Capacity',
    f_pieces_n:    '{n} pcs.',

    fv_tower:        'Tower',
    fv_aio:          'AIO Liquid',
    fv_liquid:       'Liquid',
    fv_fully_modular:'Fully Modular',
    fv_semi_modular: 'Semi-Modular',
    fv_non_modular:  'Non-Modular',

    speed_unit: 'MB/s',

    compat_mb:        'Socket <b>{socket}</b> — only boards compatible with <b>{name}</b>',
    compat_cpu:       'Socket <b>{socket}</b> — only CPUs compatible with <b>{name}</b>',
    compat_ram_locked:'Only <b>{type}</b> — <b>{name}</b> · Slots: <b>{used}/{max}</b>',
    compat_ram_slots: 'Slots: <b>{used}/{max}</b> RAM kit{suffix}',
    compat_case:      'Only cases supporting <b>{ff}</b> — compatible with <b>{name}</b>',

    warn_socket: 'Incompatible socket: CPU <b>{cpu}</b> ≠ board <b>{mb}</b>',
    warn_ram:    'Incompatible memory: RAM <b>{ram}</b> ≠ board <b>{mb}</b>',
    warn_cooler: 'Cooler rated for <b>{coolerTdp}W</b>, CPU TDP is <b>{cpuTdp}W</b>',
    warn_case:   'Case does not support motherboard form factor <b>{ff}</b>',
    warn_psu:    'PSU <b>{psu}W</b> may not be sufficient (need ~<b>{need}W</b>)',

    spec_cpu:         ['Cores / Threads', 'Socket', 'Frequency', 'TDP', 'L3 Cache'],
    spec_motherboard: ['Socket', 'Form Factor', 'RAM Type', 'RAM Slots', 'Chipset', 'PCIe', 'M.2', 'Rear USB', 'Other'],
    spec_ram:         ['Capacity', 'Type / Speed', 'Timings', 'XMP Profile', 'Features'],
    spec_gpu:         ['VRAM', 'TDP', 'Interface', 'DLSS / FSR', 'Fans', 'Boost Frequency'],
    spec_storage:     ['Capacity', 'Interface', 'Read', 'Write'],
    spec_psu:         ['Wattage', 'Rating', 'Modularity', 'Standard', 'Warranty'],
    spec_cooler:      ['Type', 'Fans', 'Heat Pipes', 'Lighting', 'Max TDP', 'Noise'],
    spec_case:        ['Form Factor', 'Board Support', 'Fans', 'Side Panel', 'USB Ports', 'Drives'],
  },
};

// ─── State ────────────────────────────────────────────────────────────────────
let currentLang = localStorage.getItem('cyberrig-lang') || 'ru';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function t(key, vars) {
  let s = LANG[currentLang]?.[key] ?? LANG.ru[key] ?? key;
  if (vars) Object.entries(vars).forEach(([k, v]) => { s = s.replaceAll(`{${k}}`, v); });
  return s;
}

function tArr(key) {
  return LANG[currentLang]?.[key] ?? LANG.ru[key] ?? [];
}

// ─── Apply static labels (data-i18n elements) ─────────────────────────────────
function applyStaticLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (el.tagName === 'INPUT') el.placeholder = t(key);
    else el.textContent = t(key);
  });

  const langBtn = document.getElementById('langBtn');
  if (langBtn) langBtn.textContent = currentLang === 'ru' ? 'EN' : 'RU';

  // Keep sort label in sync when it shows the default option
  const sortLabel = document.getElementById('sortLabel');
  if (sortLabel && (typeof state === 'undefined' || state.sortBy === 'default')) {
    sortLabel.textContent = t('sort_default');
  }
}

// ─── Switch language ──────────────────────────────────────────────────────────
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('cyberrig-lang', lang);
  applyStaticLang();
  if (typeof renderSidebar    === 'function') renderSidebar();
  if (typeof renderCurrentStep === 'function') renderCurrentStep();
}

function toggleLang() {
  setLang(currentLang === 'ru' ? 'en' : 'ru');
}
