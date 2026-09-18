/**
 * Demo persistence layer — browser-local, no backend, no database.
 *
 * The upstream app talks to Neon Postgres directly from the browser. This demo
 * build swaps that data source for localStorage so the app runs as a static
 * site on Cloudflare (Pages / Workers) with zero infrastructure.
 *
 * The exported helpers return plain arrays, mirroring the row-array shape the
 * Neon calls returned, so the service classes above keep their contracts.
 */

import type {
  GearItem,
  GearItemInsert,
  GearItemUpdate,
  GearList,
  GearListInsert
} from '@/entities/gear/types.js';

const STORAGE_KEY = 'gear-plan-demo:v1';

/** Same demo user the store hardcodes (`src/app/providers/store.ts`). */
export const DEMO_USER_ID = 'f830cb37-887d-40ab-a822-15a88c7ec92e';

interface DemoDb {
  gear_lists: GearList[];
  gear_items: GearItem[];
}

function emptyDb(): DemoDb {
  return { gear_lists: [], gear_items: [] };
}

function uid(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function iso(daysAgo = 0): string {
  return new Date(Date.now() - daysAgo * 86_400_000).toISOString();
}

/** Seed data so the demo opens with something to look at. */
function seed(): DemoDb {
  const weekend = 'a1000000-0000-4000-8000-000000000001';
  const multi = 'a1000000-0000-4000-8000-000000000002';

  const item = (
    list_id: string,
    name: string,
    category: GearItem['category'],
    weight_grams: number,
    extra: Partial<GearItem> = {}
  ): GearItem => ({
    id: uid(),
    list_id,
    name,
    description: null,
    category,
    weight_grams,
    brand: null,
    model: null,
    price_cents: null,
    purchase_url: null,
    notes: null,
    is_packed: false,
    is_worn: false,
    quantity: 1,
    created_at: iso(3),
    updated_at: iso(1),
    ...extra
  });

  return {
    gear_lists: [
      {
        id: weekend,
        user_id: DEMO_USER_ID,
        name: '周末徒步 · 轻量清单',
        description: '单日往返，目标总重 4kg 以内',
        trip_type: 'day_hike',
        is_public: false,
        is_template: false,
        created_at: iso(9),
        updated_at: iso(1)
      },
      {
        id: multi,
        user_id: DEMO_USER_ID,
        name: '多日露营 · 备份清单',
        description: '3 天 2 夜，含完整睡眠系统',
        trip_type: 'multi_day_backpacking',
        is_public: false,
        is_template: true,
        created_at: iso(20),
        updated_at: iso(4)
      }
    ],
    gear_items: [
      // 周末徒步
      item(weekend, '冲锋衣 (3L 防水)', 'Clothing & Protection', 320, { is_packed: true }),
      item(weekend, '抓绒中层', 'Clothing & Protection', 420, { is_packed: true }),
      item(weekend, '速干帽', 'Clothing & Protection', 60, { is_worn: true }),
      item(weekend, '水袋 2L (满水)', 'Hydration & Essentials', 2100, { is_packed: true, notes: '按 2L 计入' }),
      item(weekend, '头灯 + 备用电池', 'Hydration & Essentials', 130, { is_packed: true }),
      item(weekend, '急救包', 'Hydration & Essentials', 180, { is_packed: true }),
      item(weekend, '折叠登山杖 (一对)', 'Hydration & Essentials', 480, { quantity: 1 }),
      item(weekend, '天幕 3×3m', 'Shelter', 520),
      item(weekend, '应急保温毯', 'Sleep System', 90, { is_packed: true }),
      item(weekend, '30L 背包', 'Pack System', 980, { is_worn: true }),
      item(weekend, '防水压缩袋', 'Pack System', 120, { is_packed: true }),
      // 多日露营
      item(multi, '双人帐篷 (含地布)', 'Shelter', 2600, { notes: '含 8 根地钉' }),
      item(multi, '羽绒睡袋 -5°C', 'Sleep System', 1150),
      item(multi, '充气睡垫 R3.5', 'Sleep System', 480),
      item(multi, '充气枕', 'Sleep System', 80),
      item(multi, '55L 背包', 'Pack System', 1450),
      item(multi, '净水器', 'Hydration & Essentials', 120, { notes: '可滤 1000L' }),
      item(multi, '便携气炉 + 锅具', 'Hydration & Essentials', 460),
      item(multi, '羽绒服', 'Clothing & Protection', 550)
    ]
  };
}

/** localStorage when available, otherwise an in-memory fallback (private mode / SSR). */
let memoryFallback: DemoDb | null = null;

function load(): DemoDb {
  if (memoryFallback) return memoryFallback;
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoDb;
      if (Array.isArray(parsed.gear_lists) && Array.isArray(parsed.gear_items)) return parsed;
    }
  } catch (error) {
    console.warn('[demo-db] localStorage unreadable, using in-memory store', error);
  }
  const fresh = seed();
  save(fresh);
  return fresh;
}

function save(db: DemoDb): void {
  memoryFallback = db;
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (error) {
    console.warn('[demo-db] localStorage unwritable, keeping data in memory only', error);
  }
}

/** Wipe the demo data and re-seed (exposed for tests / "reset" flows). */
export function resetDemoDb(): void {
  memoryFallback = null;
  try {
    globalThis.localStorage?.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  load();
}

// --- gear_lists -------------------------------------------------------------

export function getUserLists(userId: string): GearList[] {
  return load()
    .gear_lists.filter((l) => l.user_id === userId)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export function createList(list: GearListInsert): GearList[] {
  const db = load();
  const row: GearList = {
    id: list.id ?? uid(),
    user_id: list.user_id,
    name: list.name,
    description: list.description ?? null,
    trip_type: list.trip_type ?? 'day_hike',
    is_public: list.is_public ?? false,
    is_template: list.is_template ?? false,
    created_at: iso(),
    updated_at: iso()
  };
  db.gear_lists.push(row);
  save(db);
  return [row];
}

export function getListById(listId: string): GearList[] {
  const found = load().gear_lists.find((l) => l.id === listId);
  return found ? [found] : [];
}

export function updateList(listId: string, updates: Partial<GearListInsert>): GearList[] {
  const db = load();
  const row = db.gear_lists.find((l) => l.id === listId);
  if (!row) return [];
  // COALESCE semantics: null/undefined leaves the existing value alone.
  if (updates.name != null) row.name = updates.name;
  if (updates.description != null) row.description = updates.description;
  if (updates.trip_type != null) row.trip_type = updates.trip_type;
  if (updates.is_public != null) row.is_public = updates.is_public;
  if (updates.is_template != null) row.is_template = updates.is_template;
  row.updated_at = iso();
  save(db);
  return [row];
}

/** Returns the deleted row (as SQL `RETURNING id` did); `[]` when nothing matched. */
export function deleteList(listId: string): { id: string }[] {
  const db = load();
  const before = db.gear_lists.length;
  db.gear_lists = db.gear_lists.filter((l) => l.id !== listId);
  if (db.gear_lists.length === before) return [];
  db.gear_items = db.gear_items.filter((i) => i.list_id !== listId); // cascade, as the schema did
  save(db);
  return [{ id: listId }];
}

// --- gear_items -------------------------------------------------------------

export function createItem(item: GearItemInsert): GearItem[] {
  const db = load();
  const row: GearItem = {
    id: item.id ?? uid(),
    list_id: item.list_id,
    name: item.name,
    description: item.description ?? null,
    category: item.category,
    weight_grams: item.weight_grams ?? 0,
    brand: item.brand ?? null,
    model: item.model ?? null,
    price_cents: item.price_cents ?? null,
    purchase_url: item.purchase_url ?? null,
    notes: item.notes ?? null,
    is_packed: item.is_packed ?? false,
    is_worn: item.is_worn ?? false,
    quantity: item.quantity ?? 1,
    created_at: iso(),
    updated_at: iso()
  };
  db.gear_items.push(row);
  touchList(db, row.list_id);
  save(db);
  return [row];
}

export function getItemsByListId(listId: string): GearItem[] {
  return load()
    .gear_items.filter((i) => i.list_id === listId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function updateItem(itemId: string, updates: GearItemUpdate): GearItem[] {
  const db = load();
  const row = db.gear_items.find((i) => i.id === itemId);
  if (!row) return [];
  // COALESCE semantics: null/undefined leaves the existing value alone.
  if (updates.name != null) row.name = updates.name;
  if (updates.description != null) row.description = updates.description;
  if (updates.category != null) row.category = updates.category;
  if (updates.weight_grams != null) row.weight_grams = updates.weight_grams;
  if (updates.brand != null) row.brand = updates.brand;
  if (updates.model != null) row.model = updates.model;
  if (updates.price_cents != null) row.price_cents = updates.price_cents;
  if (updates.purchase_url != null) row.purchase_url = updates.purchase_url;
  if (updates.notes != null) row.notes = updates.notes;
  if (updates.is_packed != null) row.is_packed = updates.is_packed;
  if (updates.is_worn != null) row.is_worn = updates.is_worn;
  if (updates.quantity != null) row.quantity = updates.quantity;
  row.updated_at = iso();
  save(db);
  return [row];
}

export function deleteItem(itemId: string): { id: string }[] {
  const db = load();
  const row = db.gear_items.find((i) => i.id === itemId);
  if (!row) return [];
  db.gear_items = db.gear_items.filter((i) => i.id !== itemId);
  touchList(db, row.list_id);
  save(db);
  return [{ id: itemId }];
}

/** Keep a list's `updated_at` in step with its items (the SQL triggers did this). */
function touchList(db: DemoDb, listId: string): void {
  const list = db.gear_lists.find((l) => l.id === listId);
  if (list) list.updated_at = iso();
}
