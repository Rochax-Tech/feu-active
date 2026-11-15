import {
  Blocks,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Tag,
} from "lucide-react";
import AppDashboardShell, {
  sampleDashboardSeries,
  type DashboardNavGroup,
  type DashboardOrder,
} from "@/components/ui/app-dashboard-shell";

const NAV: DashboardNavGroup[] = [
  {
    items: [
      { id: "resumo", label: "Resumo", icon: LayoutDashboard },
      { id: "pedidos", label: "Pedidos", icon: ShoppingBag, badge: "6" },
      { id: "produtos", label: "Produtos", icon: Package },
      { id: "promocoes", label: "Promoções", icon: Tag },
    ],
  },
  {
    label: "Loja",
    items: [
      { id: "integracoes", label: "WhatsApp", icon: Blocks, badge: "New" },
      { id: "config", label: "Configurações", icon: Settings },
    ],
  },
];

// Pedidos de EXEMPLO (fictícios) só para mostrar o painel. Valores em centavos.
const ORDERS: DashboardOrder[] = [
  { id: "FEU-1006", customer: "Cliente Exemplo A", email: "exemplo.a@email.com", status: "paid", channel: "WhatsApp", date: "2026-11-14", amount: 4_990 },
  { id: "FEU-1005", customer: "Cliente Exemplo B", email: "exemplo.b@email.com", status: "pending", channel: "Instagram", date: "2026-11-14", amount: 8_970 },
  { id: "FEU-1004", customer: "Cliente Exemplo C", email: "exemplo.c@email.com", status: "paid", channel: "WhatsApp", date: "2026-11-13", amount: 2_490 },
  { id: "FEU-1003", customer: "Cliente Exemplo D", email: "exemplo.d@email.com", status: "paid", channel: "Indicação", date: "2026-11-13", amount: 12_450 },
  { id: "FEU-1002", customer: "Cliente Exemplo E", email: "exemplo.e@email.com", status: "refunded", channel: "WhatsApp", date: "2026-11-12", amount: 3_990 },
  { id: "FEU-1001", customer: "Cliente Exemplo F", email: "exemplo.f@email.com", status: "paid", channel: "Instagram", date: "2026-11-12", amount: 6_580 },
];

export default function Painel() {
  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex items-center justify-between gap-3 bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground">
        <span>Painel de demonstração — todos os números e pedidos são EXEMPLOS fictícios.</span>
        <a href="#/" className="underline">← Voltar ao site</a>
      </div>
      <div className="min-h-0 flex-1">
        <AppDashboardShell
          workspace={{ name: "FEU Active", plan: "Painel do lojista" }}
          user={{ name: "Lojista FEU", email: "contato@feuactive.com" }}
          nav={NAV}
          defaultActive="resumo"
          orders={ORDERS}
          getSeries={sampleDashboardSeries}
          currency="BRL"
          locale="pt-BR"
        />
      </div>
    </div>
  );
}
