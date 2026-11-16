import { useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { CATEGORY_SUGGESTIONS, type Product } from "@/data/products";
import {
  compressImage, currentPrice, hasPromo, money, moveProduct, removeProduct, slug,
  upsertProduct, useProducts,
} from "@/data/store";
import { btn, Chip, field, Label, Panel, Switch, useToast } from "./ui";

const num = (v: string) => (v.trim() === "" || isNaN(Number(v)) ? null : Number(v));

export default function ProdutosPage() {
  const products = useProducts();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const { toast, node } = useToast();

  const cats = useMemo(() => ["Todas", ...new Set(products.map((p) => p.category))], [products]);
  const list = products.filter(
    (p) => (cat === "Todas" || p.category === cat) && (!q.trim() || (p.name + p.category).toLowerCase().includes(q.trim().toLowerCase())),
  );
  const toggle = (p: Product, patch: Partial<Product>, msg: string) => {
    upsertProduct({ ...p, ...patch });
    toast(msg);
  };

  return (
    <>
      <Panel
        title={`${list.length} ${list.length === 1 ? "produto" : "produtos"}`}
        hint="Ligue ou desligue o estoque e a visibilidade direto na lista. As mudanças aparecem no site na hora."
        action={
          <button type="button" className={btn.primary} onClick={() => setEditing("new")}>
            <Plus className="size-4" /> Novo produto
          </button>
        }
      >
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search aria-hidden className="pointer-events-none absolute left-2.5 top-2.5 size-[15px] text-[color:var(--bjork-text-soft)]" />
            <input className={field + " pl-8"} placeholder="Buscar produto" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar produto" />
          </div>
          <select className={field + " w-auto min-w-[160px]"} value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filtrar por categoria">
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <ul className="grid gap-2.5">
          {list.map((p) => (
            <li
              key={p.id}
              className={
                "grid grid-cols-[52px_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-[12px] border border-[color:var(--bjork-border)] bg-[var(--bjork-panel)] p-2.5 @3xl:grid-cols-[52px_minmax(0,1fr)_auto] " +
                (p.active ? "" : "opacity-60")
              }
            >
              <img src={p.image} alt="" className="h-[66px] w-[52px] rounded-[8px] object-cover" />
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-semibold">{p.name}</p>
                <p className="truncate text-[12px] text-[color:var(--bjork-text-muted)]">{p.category}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {currentPrice(p) == null ? (
                    <Chip>Sem preço</Chip>
                  ) : (
                    <span className="font-mono text-[12.5px] tabular-nums">
                      {money(currentPrice(p)!)}
                      {hasPromo(p) && <s className="ml-1.5 text-[11px] text-[color:var(--bjork-text-soft)]">{money(p.price!)}</s>}
                    </span>
                  )}
                  {hasPromo(p) && <Chip tone="accent">Promoção</Chip>}
                  {!p.inStock && <Chip tone="bad">Esgotado</Chip>}
                  {!p.active && <Chip>Oculto</Chip>}
                  {p.featured && <Chip tone="warn">Destaque</Chip>}
                </div>
              </div>
              <div className="col-span-2 flex flex-wrap items-center gap-x-4 gap-y-2 @3xl:col-span-1">
                <label className="flex items-center gap-2 text-[12px] text-[color:var(--bjork-text-muted)]">
                  Estoque
                  <Switch label={`Estoque de ${p.name}`} checked={p.inStock} onChange={(v) => toggle(p, { inStock: v }, v ? "Marcado em estoque" : "Marcado como esgotado")} />
                </label>
                <label className="flex items-center gap-2 text-[12px] text-[color:var(--bjork-text-muted)]">
                  No site
                  <Switch label={`Mostrar ${p.name} no site`} checked={p.active} onChange={(v) => toggle(p, { active: v }, v ? "Visível no site" : "Oculto do site")} />
                </label>
                <div className="ml-auto flex items-center gap-1.5">
                  <button type="button" className={btn.icon} aria-label="Subir" disabled={products[0].id === p.id} onClick={() => moveProduct(p.id, -1)}><ArrowUp /></button>
                  <button type="button" className={btn.icon} aria-label="Descer" disabled={products[products.length - 1].id === p.id} onClick={() => moveProduct(p.id, 1)}><ArrowDown /></button>
                  <button type="button" className={btn.ghost + " h-8"} onClick={() => setEditing(p)}><Pencil className="size-3.5" /> Editar</button>
                  <button
                    type="button"
                    className={btn.icon + " hover:!border-[color:var(--blk-error)] hover:!text-[color:var(--blk-error)]"}
                    aria-label={`Excluir ${p.name}`}
                    onClick={() => { if (confirm(`Excluir "${p.name}"? Não dá para desfazer.`)) { removeProduct(p.id); toast("Produto excluído"); } }}
                  ><Trash2 /></button>
                </div>
              </div>
            </li>
          ))}
          {list.length === 0 && <li className="py-10 text-center text-[13px] text-[color:var(--bjork-text-muted)]">Nenhum produto encontrado.</li>}
        </ul>
      </Panel>

      {editing && <ProductDialog product={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); toast("Produto salvo ✓"); }} />}
      {node}
    </>
  );
}

function ProductDialog({ product, onClose, onSaved }: { product: Product | null; onClose: () => void; onSaved: () => void }) {
  const products = useProducts();
  const [f, setF] = useState({
    name: product?.name ?? "",
    category: product?.category ?? CATEGORY_SUGGESTIONS[0],
    desc: product?.desc ?? "",
    price: product?.price?.toString() ?? "",
    promo: product?.promoPrice?.toString() ?? "",
    image: product?.image ?? "/img/logo.png",
    inStock: product?.inStock ?? true,
    active: product?.active ?? true,
    featured: product?.featured ?? false,
  });
  const [err, setErr] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }));
  const cats = [...new Set([...CATEGORY_SUGGESTIONS, ...products.map((p) => p.category)])];

  const save = () => {
    const price = num(f.price), promo = num(f.promo);
    if (!f.name.trim()) return setErr("Informe o nome do produto.");
    if (promo != null && (price == null || promo >= price)) return setErr("O preço promocional precisa ser menor que o preço.");
    let id = product?.id ?? slug(f.name);
    if (!product) { const base = id; let n = 2; while (products.some((p) => p.id === id)) id = `${base}-${n++}`; }
    upsertProduct({
      id, name: f.name.trim(), category: f.category.trim() || "Outros", desc: f.desc.trim(), image: f.image,
      price, promoPrice: promo, inStock: f.inStock, active: f.active, featured: f.featured,
    });
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={product ? "Editar produto" : "Novo produto"} className="max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-[18px] border border-[color:var(--bjork-border-strong)] bg-[var(--bjork-surface)] p-5 text-[color:var(--bjork-text)] shadow-[0_0_80px_rgba(166,255,61,0.12)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[15px] font-bold">{product ? "Editar produto" : "Novo produto"}</h3>
          <button type="button" className={btn.icon} onClick={onClose} aria-label="Fechar"><X /></button>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Label text="Nome" className="sm:col-span-2"><input className={field} value={f.name} maxLength={80} onChange={(e) => set("name", e.target.value)} autoFocus /></Label>
          <Label text="Categoria">
            <input className={field} list="cat-list" value={f.category} onChange={(e) => set("category", e.target.value)} />
            <datalist id="cat-list">{cats.map((c) => <option key={c} value={c} />)}</datalist>
          </Label>
          <Label text="Preço (R$)"><input className={field} type="number" min="0" step="0.01" placeholder="0,00" value={f.price} onChange={(e) => set("price", e.target.value)} /></Label>
          <Label text="Preço promocional (R$)"><input className={field} type="number" min="0" step="0.01" placeholder="opcional" value={f.promo} onChange={(e) => set("promo", e.target.value)} /></Label>
          <Label text="Descrição curta" className="sm:col-span-2"><textarea className={field + " h-[72px] resize-none py-2"} maxLength={90} value={f.desc} onChange={(e) => set("desc", e.target.value)} /></Label>
          <div className="flex items-center gap-4 sm:col-span-2">
            <img src={f.image} alt="" className="h-[96px] w-[76px] rounded-[10px] border border-[color:var(--bjork-border)] bg-black object-cover" />
            <div>
              <input ref={file} type="file" accept="image/*" hidden onChange={async (e) => { const fl = e.target.files?.[0]; if (fl) { try { set("image", await compressImage(fl)); } catch { setErr("Não foi possível ler essa imagem."); } } }} />
              <button type="button" className={btn.ghost} onClick={() => file.current?.click()}><ImagePlus className="size-4" /> Trocar foto</button>
              <p className="mt-1.5 text-[11.5px] text-[color:var(--bjork-text-muted)]">Use a arte do produto (vertical fica melhor).</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 sm:col-span-2">
            {([["inStock", "Em estoque"], ["active", "Visível no site"], ["featured", "Destaque"]] as const).map(([k, t]) => (
              <label key={k} className="flex items-center gap-2 text-[12.5px]"><Switch label={t} checked={f[k]} onChange={(v) => set(k, v)} />{t}</label>
            ))}
          </div>
        </div>
        {err && <p role="alert" className="mt-3 text-[12.5px] font-medium text-[color:var(--blk-error)]">{err}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className={btn.ghost} onClick={onClose}>Cancelar</button>
          <button type="button" className={btn.primary} onClick={save}>Salvar produto</button>
        </div>
      </div>
    </div>
  );
}
