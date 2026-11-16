import { useState } from "react";
import { Check, ExternalLink, MessageCircle, RotateCcw, Send } from "lucide-react";
import { DEFAULT_SETTINGS, resetDemo, saveSettings, useSettings } from "@/data/store";
import { btn, Chip, field, Label, Panel, useToast } from "./ui";

/* ----------------------------- Pedidos (exemplos) ----------------------------- */

type Status = "novo" | "preparo" | "entrega" | "entregue" | "cancelado";
const STATUS: Record<Status, { label: string; tone: "accent" | "warn" | "ok" | "muted" | "bad" }> = {
  novo: { label: "Novo", tone: "accent" },
  preparo: { label: "Em preparo", tone: "warn" },
  entrega: { label: "Saiu p/ entrega", tone: "warn" },
  entregue: { label: "Entregue", tone: "ok" },
  cancelado: { label: "Cancelado", tone: "bad" },
};

interface Pedido { id: string; cliente: string; bairro: string; itens: string[]; total: number; hora: string; status: Status }

// Pedidos de EXEMPLO (fictícios), só para mostrar como o painel funciona.
const EXEMPLOS: Pedido[] = [
  { id: "#1006", cliente: "Cliente Exemplo A", bairro: "Praia da Costa", itens: ["2x Hype Drink", "1x Metabolic+ Detox"], total: 42.7, hora: "Hoje, 10:42", status: "novo" },
  { id: "#1005", cliente: "Cliente Exemplo B", bairro: "Itapuã", itens: ["1x Combo Hype Drink"], total: 34.9, hora: "Hoje, 09:15", status: "preparo" },
  { id: "#1004", cliente: "Cliente Exemplo C", bairro: "Centro de Vila Velha", itens: ["3x Shake Coco", "1x Shake Morango"], total: 51.6, hora: "Ontem, 18:30", status: "entrega" },
  { id: "#1003", cliente: "Cliente Exemplo D", bairro: "Glória", itens: ["1x Fiber Concentrate Uva"], total: 39.9, hora: "Ontem, 14:05", status: "entregue" },
  { id: "#1002", cliente: "Cliente Exemplo E", bairro: "Jardim Camburi", itens: ["2x Shake Cookies & Cream"], total: 25.8, hora: "12/11, 19:20", status: "entregue" },
  { id: "#1001", cliente: "Cliente Exemplo F", bairro: "Itaparica", itens: ["1x Hype Drink"], total: 14.9, hora: "12/11, 11:02", status: "cancelado" },
];
const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function PedidosPage() {
  const [list, setList] = useState(EXEMPLOS);
  const [filter, setFilter] = useState<Status | "todos">("todos");
  const { toast, node } = useToast();
  const counts = (s: Status) => list.filter((p) => p.status === s).length;
  const shown = list.filter((p) => filter === "todos" || p.status === filter);
  const abertos = list.filter((p) => p.status !== "cancelado" && p.status !== "entregue");

  return (
    <>
      <div className="grid grid-cols-2 gap-2.5 @5xl/main:grid-cols-4">
        {[["Em aberto", abertos.length], ["Novos", counts("novo")], ["Entregues", counts("entregue")], ["Total em aberto", brl(abertos.reduce((s, p) => s + p.total, 0))]].map(([k, v]) => (
          <div key={String(k)} className="rounded-[16px] border border-[color:var(--bjork-border)] bg-[var(--bjork-surface)] p-4 shadow-[var(--bjork-shadow-surface)]">
            <p className="text-[12.5px] font-medium text-[color:var(--bjork-text-muted)]">{k}</p>
            <p className="mt-2.5 text-[22px] font-semibold leading-none tracking-[-0.03em] tabular-nums">{v}</p>
          </div>
        ))}
      </div>

      <Panel title="Pedidos recebidos" hint="Exemplos fictícios. Os pedidos reais chegam pelo WhatsApp; aqui você acompanha o andamento de cada um.">
        <div className="hide-scrollbar mb-4 flex gap-1.5 overflow-x-auto" role="group" aria-label="Filtrar por status">
          {(["todos", ...Object.keys(STATUS)] as const).map((s) => (
            <button key={s} type="button" aria-pressed={filter === s} onClick={() => setFilter(s as Status | "todos")}
              className={"h-7 shrink-0 cursor-pointer rounded-full border px-3 text-[12px] transition-colors " + (filter === s ? "border-[color:var(--bjork-border-strong)] bg-[var(--bjork-surface-active)] text-[color:var(--bjork-text)]" : "border-transparent text-[color:var(--bjork-text-muted)] hover:bg-[var(--bjork-surface-hover)]")}>
              {s === "todos" ? "Todos" : STATUS[s as Status].label}
            </button>
          ))}
        </div>
        <ul className="grid gap-2.5">
          {shown.map((p) => (
            <li key={p.id} className="grid gap-3 rounded-[12px] border border-[color:var(--bjork-border)] bg-[var(--bjork-panel)] p-3 @3xl:grid-cols-[minmax(0,1fr)_auto] @3xl:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[12px] text-[color:var(--bjork-text-muted)]">{p.id}</span>
                  <p className="truncate text-[13.5px] font-semibold">{p.cliente}</p>
                  <Chip tone={STATUS[p.status].tone}>{STATUS[p.status].label}</Chip>
                </div>
                <p className="mt-1 text-[12.5px] text-[color:var(--bjork-text-medium)]">{p.itens.join(" · ")}</p>
                <p className="mt-0.5 text-[11.5px] text-[color:var(--bjork-text-muted)]">{p.bairro} · {p.hora}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[14px] font-semibold tabular-nums">{brl(p.total)}</span>
                <select className={field + " h-8 w-auto"} value={p.status} aria-label={`Status do pedido ${p.id}`}
                  onChange={(e) => { setList((l) => l.map((x) => x.id === p.id ? { ...x, status: e.target.value as Status } : x)); toast("Status atualizado"); }}>
                  {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <a className={btn.ghost + " h-8"} target="_blank" rel="noopener noreferrer"
                  href={`https://wa.me/?text=${encodeURIComponent(`Olá! Sobre o seu pedido ${p.id} na FEU Active: `)}`}>
                  <Send className="size-3.5" /> Responder
                </a>
              </div>
            </li>
          ))}
          {shown.length === 0 && <li className="py-10 text-center text-[13px] text-[color:var(--bjork-text-muted)]">Nenhum pedido neste status.</li>}
        </ul>
      </Panel>
      {node}
    </>
  );
}

/* ----------------------------- WhatsApp ----------------------------- */

export function WhatsAppPage() {
  const s = useSettings();
  const [num, setNum] = useState(s.whatsapp);
  const [msg, setMsg] = useState(s.greeting);
  const { toast, node } = useToast();
  const digits = num.replace(/\D/g, "");
  const fmt = digits.length >= 12 ? `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, digits.length - 4)}-${digits.slice(-4)}` : "—";

  const save = () => {
    if (digits.length < 12) return toast("Informe com DDI e DDD (ex.: 5527988025216).");
    saveSettings({ whatsapp: digits, greeting: msg.trim() || DEFAULT_SETTINGS.greeting });
    toast("WhatsApp salvo ✓");
  };

  return (
    <>
      <div className="grid gap-4 @5xl/main:grid-cols-2">
        <Panel title="Número de atendimento" hint="Todos os botões do site abrem a conversa com este número.">
          <div className="grid gap-3.5">
            <Label text="WhatsApp (DDI + DDD + número, só dígitos)">
              <input className={field + " font-mono"} inputMode="numeric" value={num} onChange={(e) => setNum(e.target.value)} placeholder="5527988025216" />
            </Label>
            <p className="text-[12.5px] text-[color:var(--bjork-text-muted)]">Formato: <span className="font-mono text-[color:var(--bjork-text)]">{fmt}</span></p>
            <Label text="Mensagem inicial (botão principal do site)">
              <textarea className={field + " h-[96px] resize-none py-2"} value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={160} />
            </Label>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={btn.primary} onClick={save}><Check className="size-4" /> Salvar</button>
              <a className={btn.ghost} target="_blank" rel="noopener noreferrer" href={`https://wa.me/${digits}?text=${encodeURIComponent(msg)}`}><ExternalLink className="size-4" /> Testar conversa</a>
            </div>
          </div>
        </Panel>

        <Panel title="Como o cliente vai ver" hint="Prévia da primeira mensagem que chega para você.">
          <div className="rounded-[14px] bg-[#0b141a] p-4">
            <div className="mb-3 flex items-center gap-2 text-[12px] text-white/70"><MessageCircle className="size-4 text-[#25d366]" /> Conversa com {fmt}</div>
            <div className="ml-auto max-w-[85%] whitespace-pre-wrap rounded-[12px] rounded-tr-[3px] bg-[#005c4b] px-3 py-2 text-[13px] text-white">{msg || "…"}<div className="mt-1 text-right text-[10.5px] text-white/60">10:42 ✓✓</div></div>
          </div>
          <p className="mt-3 text-[12px] text-[color:var(--bjork-text-muted)]">Pedidos do carrinho chegam com a lista de produtos, quantidades, nome e bairro já preenchidos.</p>
        </Panel>
      </div>
      {node}
    </>
  );
}

/* ----------------------------- Configurações ----------------------------- */

export function ConfigPage() {
  const s = useSettings();
  const [ig, setIg] = useState(s.instagram);
  const [city, setCity] = useState(s.city);
  const { toast, node } = useToast();

  return (
    <>
      <div className="grid gap-4 @5xl/main:grid-cols-2">
        <Panel title="Dados da loja" hint="Aparecem no topo do site, nos links do Instagram e na região de entrega.">
          <div className="grid gap-3.5">
            <Label text="Instagram (sem @)"><input className={field} value={ig} onChange={(e) => setIg(e.target.value)} placeholder="feu.active" /></Label>
            <Label text="Cidade / região de entrega"><input className={field} value={city} onChange={(e) => setCity(e.target.value)} placeholder="Vila Velha - ES" /></Label>
            <div><button type="button" className={btn.primary} onClick={() => { saveSettings({ instagram: ig.replace("@", "").trim(), city: city.trim() }); toast("Configurações salvas ✓"); }}><Check className="size-4" /> Salvar</button></div>
          </div>
        </Panel>

        <Panel title="Modo demonstração" hint="Como os dados estão sendo guardados agora.">
          <p className="text-[12.5px] leading-relaxed text-[color:var(--bjork-text-medium)]">
            Os produtos, promoções e configurações ficam salvos <b>neste navegador</b>: o site aberto aqui já reflete tudo que você muda no painel, mas outros visitantes continuam vendo a versão original.
            Para valer para todo mundo, o próximo passo é ligar um banco de dados online.
          </p>
          <button type="button" className={btn.ghost + " mt-4"} onClick={() => { if (confirm("Voltar produtos e configurações ao estado inicial de demonstração?")) { resetDemo(); setIg(DEFAULT_SETTINGS.instagram); setCity(DEFAULT_SETTINGS.city); toast("Demonstração restaurada"); } }}>
            <RotateCcw className="size-4" /> Restaurar dados de demonstração
          </button>
        </Panel>
      </div>
      {node}
    </>
  );
}
