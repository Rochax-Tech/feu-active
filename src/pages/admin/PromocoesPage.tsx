import { useEffect, useState } from "react";
import { Megaphone, Percent } from "lucide-react";
import type { Product } from "@/data/products";
import { hasPromo, money, saveSettings, upsertProduct, useProducts, useSettings } from "@/data/store";
import { btn, Chip, field, Panel, Switch, useToast } from "./ui";

export default function PromocoesPage() {
  const products = useProducts();
  const settings = useSettings();
  const { toast, node } = useToast();
  const [text, setText] = useState(settings.bannerText);
  const emPromo = products.filter(hasPromo);

  return (
    <>
      <div className="grid gap-4 @5xl/main:grid-cols-[minmax(0,1fr)_340px]">
        <Panel title="Preço promocional por produto" hint="Digite o valor promocional e salve. Deixe vazio para tirar da promoção. O desconto é calculado sozinho.">
          <ul className="grid gap-2.5">
            {products.map((p) => <PromoRow key={p.id} p={p} onSaved={(m) => toast(m)} />)}
          </ul>
        </Panel>

        <div className="grid content-start gap-4">
          <Panel title="Faixa de aviso no topo do site" hint="Aparece acima do menu, em destaque.">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 text-[12.5px]"><Megaphone className="size-4 text-[color:var(--blk-accent-ink)]" /> Mostrar faixa</span>
              <Switch label="Mostrar faixa" checked={settings.bannerEnabled} onChange={(v) => { saveSettings({ bannerEnabled: v }); toast(v ? "Faixa ligada" : "Faixa desligada"); }} />
            </div>
            <input className={field} value={text} maxLength={90} onChange={(e) => setText(e.target.value)} aria-label="Texto da faixa" placeholder="Ex.: Combo Hype Drink com preço especial até domingo" />
            <button type="button" className={btn.primary + " mt-3 w-full"} onClick={() => { saveSettings({ bannerText: text.trim() }); toast("Faixa salva ✓"); }}>Salvar faixa</button>
            <p className="mb-1.5 mt-4 text-[11.5px] uppercase tracking-wider text-[color:var(--bjork-text-soft)]">Prévia</p>
            <div className={"rounded-[8px] bg-[#a6ff3d] px-3 py-2 text-center text-[12px] font-bold text-[#06130a] " + (settings.bannerEnabled ? "" : "opacity-40")}>⚡ {text || "Texto da faixa"}</div>
          </Panel>

          <Panel title="Em promoção agora">
            {emPromo.length === 0 ? (
              <p className="text-[12.5px] text-[color:var(--bjork-text-muted)]">Nenhum produto em promoção.</p>
            ) : (
              <ul className="grid gap-2">
                {emPromo.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2 text-[12.5px]">
                    <span className="truncate">{p.name}</span>
                    <Chip tone="accent">-{Math.round((1 - p.promoPrice! / p.price!) * 100)}%</Chip>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
      {node}
    </>
  );
}

function PromoRow({ p, onSaved }: { p: Product; onSaved: (m: string) => void }) {
  const [v, setV] = useState(p.promoPrice?.toString() ?? "");
  useEffect(() => setV(p.promoPrice?.toString() ?? ""), [p.promoPrice]);
  const noPrice = p.price == null;
  const save = () => {
    const n = v.trim() === "" ? null : Number(v);
    if (n != null && (isNaN(n) || n <= 0 || n >= p.price!)) return onSaved("A promoção precisa ser menor que o preço.");
    upsertProduct({ ...p, promoPrice: n });
    onSaved(n ? "Promoção ativada 🔥" : "Promoção removida");
  };
  return (
    <li className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-[12px] border border-[color:var(--bjork-border)] bg-[var(--bjork-panel)] p-2.5 @3xl:grid-cols-[44px_minmax(0,1fr)_auto]">
      <img src={p.image} alt="" className="h-[56px] w-[44px] rounded-[8px] object-cover" />
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold">{p.name}</p>
        <p className="text-[12px] text-[color:var(--bjork-text-muted)]">
          {noPrice ? "Defina o preço do produto primeiro" : <>Preço: <span className="font-mono tabular-nums">{money(p.price!)}</span>{hasPromo(p) && <> · <span className="text-[color:var(--blk-accent-ink)]">-{Math.round((1 - p.promoPrice! / p.price!) * 100)}%</span></>}</>}
        </p>
      </div>
      <div className="col-span-2 flex items-center gap-2 @3xl:col-span-1">
        <div className="relative">
          <Percent aria-hidden className="pointer-events-none absolute left-2.5 top-2.5 size-[14px] text-[color:var(--bjork-text-soft)]" />
          <input className={field + " w-[130px] pl-8"} type="number" min="0" step="0.01" placeholder="Promo R$" value={v} disabled={noPrice} onChange={(e) => setV(e.target.value)} aria-label={`Preço promocional de ${p.name}`} />
        </div>
        <button type="button" className={btn.primary} disabled={noPrice} onClick={save}>Salvar</button>
      </div>
    </li>
  );
}
