/**
 * API client — wraps fetch calls to /api/*.
 * Falls back to mock data (data.js) when the backend is not running.
 */
const Api = (() => {
  const BASE = '/api';

  async function json(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  return {
    async getComponents(categorySlug, filters = {}) {
      try {
        const params = new URLSearchParams({ category: categorySlug });
        Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
        const data = await json(`${BASE}/components?${params}`);
        return data.map(c => ({ ...c, id: String(c.id) }));
      } catch {
        return COMPONENTS[categorySlug] ?? [];
      }
    },

    async getCategories() {
      try {
        return await json(`${BASE}/categories`);
      } catch {
        return null;
      }
    },

    async createBuild(payload) {
      return json(`${BASE}/builds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    },

    async getBuilds() {
      try {
        return await json(`${BASE}/builds`);
      } catch {
        return [];
      }
    },

    async deleteBuild(id) {
      await fetch(`${BASE}/builds/${id}`, { method: 'DELETE' });
    },

    async renameBuild(id, name) {
      return await json(`${BASE}/builds/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
    },
  };
})();
