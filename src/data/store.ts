import { useSyncExternalStore } from "react";
import { SEED_PRODUCTS, type Product } from "@/data/products";

/**
 * Armazenamento do site e do painel. MODO DEMONSTRAÇÃO: os dados ficam no navegador (localStorage), então o
 * que o lojista muda no painel aparece no site deste mesmo navegador. Para valer para todos os visitantes,
 * troque estas funções por chamadas a um banco (ex.: Firestore) mantendo a mesma interface.
 */

export interface Settings {
  whatsapp: string;
  instagram: string;
  city: string;
  bannerEnabled: boolean;
  bannerText: string;
  greeting: string;
}

export const DEFAULT_SETTINGS: Settings = {
  whatsapp: "5527988025216",
  instagram: "feu.active",
  city: "Vila Velha - ES",
  bannerEnabled: true,
  bannerText: "Peça hoje pelo WhatsApp e receba em casa",
  greeting: "Olá FEU Active! Vim pelo site e quero fazer um pedido 💚",
};

const KEY_P = "feu_react_products_v1";
const KEY_S = "feu_react_settings_v1";

function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function persist(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* sem espaço ou bloqueado: continua só em memória */
  }
}

let products: Product[] = load<Product[]>(KEY_P) ?? SEED_PRODUCTS;
let settings: Settings = { ...DEFAULT_SETTINGS, ...(load<Partial<Settings>>(KEY_S) ?? {}) };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

// Sincroniza entre abas (site aberto + painel aberto)
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY_P) products = load<Product[]>(KEY_P) ?? SEED_PRODUCTS;
    if (e.key === KEY_S) settings = { ...DEFAULT_SETTINGS, ...(load<Partial<Settings>>(KEY_S) ?? {}) };
    emit();
  });
}

export const useProducts = () => useSyncExternalStore(subscribe, () => products);
export const useSettings = () => useSyncExternalStore(subscribe, () => settings);
export const getSettings = () => settings;

export function saveProducts(next: Product[]) {
  products = next;
  persist(KEY_P, products);
  emit();
}
export function upsertProduct(p: Product) {
  const i = products.findIndex((x) => x.id === p.id);
  saveProducts(i >= 0 ? products.map((x) => (x.id === p.id ? p : x)) : [...products, p]);
}
export function removeProduct(id: string) {
  saveProducts(products.filter((p) => p.id !== id));
}
export function moveProduct(id: string, dir: -1 | 1) {
  const i = products.findIndex((p) => p.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= products.length) return;
  const next = [...products];
  [next[i], next[j]] = [next[j], next[i]];
  saveProducts(next);
}
export function saveSettings(patch: Partial<Settings>) {
  settings = { ...settings, ...patch };
  persist(KEY_S, settings);
  emit();
}
export function resetDemo() {
  try {
    localStorage.removeItem(KEY_P);
    localStorage.removeItem(KEY_S);
  } catch {
    /* ignore */
  }
  products = SEED_PRODUCTS;
  settings = { ...DEFAULT_SETTINGS };
  emit();
}

/* ---------- helpers ---------- */
export const waLink = (msg: string) => `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`;
export const money = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const slug = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "produto";
export const hasPromo = (p: Product) => p.promoPrice != null && p.price != null && p.promoPrice > 0 && p.promoPrice < p.price;
export const currentPrice = (p: Product) => (hasPromo(p) ? p.promoPrice! : p.price);

/** Reduz e comprime a foto enviada (vira data URL, guardado no navegador no modo demonstração). */
export function compressImage(file: File, max = 760, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("Imagem inválida."));
    img.src = url;
  });
}
