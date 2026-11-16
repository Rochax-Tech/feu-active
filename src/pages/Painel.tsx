import {
  LayoutDashboard,
  MessageCircle,
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
import ProdutosPage from "@/pages/admin/ProdutosPage";
import PromocoesPage from "@/pages/admin/PromocoesPage";
import { ConfigPage, PedidosPage, WhatsAppPage } from "@/pages/admin/OutrasPages";

const NAV: DashboardNavGroup[] = [
  {
    items: [
      { id: "resumo", label: "Resumo", icon: LayoutDashboard },
      { id: "pedidos", label: "Pedidos", icon: ShoppingBag, badge: "2" },
      { id: "produtos", label: "Produtos", icon: Package },
      { id: "promocoes", label: "Promoções", icon: Tag },
    ],
  },
  {
    label: "Loja",
    items: [
      { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
      { id: "config", label: "Configurações", icon: Settings },
    ],
  },
];

const SUBTITLES: Record<string, string> = {
  pedidos: "Acompanhe o andamento de cada pedido",
  produtos: "Cadastre, edite, controle o estoque e a visibilidade",
  promocoes: "Preços promocionais e faixa de aviso do site",
  whatsapp: "Número e mensagem de atendimento",
  config: "Dados da loja e modo de armazenamento",
};

// Dados do "Resumo" (gráficos/tabela): EXEMPLOS fictícios. Valores em centavos.
const ORDERS: DashboardOrder[] = [
  { id: "FEU-1006", customer: "Cliente Exemplo A", email: "exemplo.a@email.com", status: "paid", channel: "WhatsApp", date: "2026-11-14", amount: 4_270 },
  { id: "FEU-1005", customer: "Cliente Exemplo B", email: "exemplo.b@email.com", status: "pending", channel: "Instagram", date: "2026-11-14", amount: 3_490 },
  { id: "FEU-1004", customer: "Cliente Exemplo C", email: "exemplo.c@email.com", status: "paid", channel: "WhatsApp", date: "2026-11-13", amount: 5_160 },
  { id: "FEU-1003", customer: "Cliente Exemplo D", email: "exemplo.d@email.com", status: "paid", channel: "Indicação", date: "2026-11-13", amount: 3_990 },
  { id: "FEU-1002", customer: "Cliente Exemplo E", email: "exemplo.e@email.com", status: "refunded", channel: "WhatsApp", date: "2026-11-12", amount: 2_580 },
  { id: "FEU-1001", customer: "Cliente Exemplo F", email: "exemplo.f@email.com", status: "paid", channel: "Instagram", date: "2026-11-12", amount: 1_490 },
];

const PAGES: Record<string, () => React.ReactNode> = {
  pedidos: () => <PedidosPage />,
  produtos: () => <ProdutosPage />,
  promocoes: () => <PromocoesPage />,
  whatsapp: () => <WhatsAppPage />,
  config: () => <ConfigPage />,
};

export default function Painel() {
  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex items-center justify-between gap-3 bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground">
        <span>Painel de demonstração — Resumo e Pedidos usam dados de EXEMPLO. Produtos, Promoções e Configurações são reais e mudam o site.</span>
        <a href="#/" className="shrink-0 underline">← Voltar ao site</a>
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
          renderPage={(id) => PAGES[id]?.() ?? null}
          pageSubtitle={(id) => SUBTITLES[id] ?? ""}
        />
      </div>
    </div>
  );
}
