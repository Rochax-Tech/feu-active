import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { AnimatedMarqueeHero } from "@/components/ui/hero-3";
import { InteractiveProductCard } from "@/components/ui/card-7";
import { Marquee } from "@/components/ui/marquee";
import FeaturesSection from "@/components/ui/bento-grid-01";
import { ParallaxComponent } from "@/components/ui/parallax-scrolling";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { INSTAGRAM, PRODUCTS, waLink, type Product } from "@/data/products";

const HERO_IMAGES = PRODUCTS.map((p) => p.image);
const CATEGORIES = ["Todos", ...new Set(PRODUCTS.map((p) => p.category))];

const priceLabel = (p: Product) =>
  p.price == null ? "Consulte o valor" : p.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ---------------------------------- Carrinho (Drawer) ---------------------------------- */

function CartDrawer({
  cart,
  setQty,
}: {
  cart: Record<string, number>;
  setQty: (id: string, qty: number) => void;
}) {
  const [nome, setNome] = useState("");
  const [bairro, setBairro] = useState("");
  const items = useMemo(
    () => PRODUCTS.filter((p) => cart[p.id]).map((p) => ({ ...p, qty: cart[p.id] })),
    [cart],
  );
  const total = items.reduce((s, i) => s + i.qty, 0);

  const send = () => {
    const linhas = items.map((i) => `• ${i.qty}x ${i.name}`).join("\n");
    window.open(
      waLink(
        `Olá FEU Active! Quero fazer um pedido 💚\n\n${linhas}${nome ? `\n\nNome: ${nome}` : ""}${bairro ? `\nBairro: ${bairro}` : ""}`,
      ),
      "_blank",
      "noopener",
    );
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="relative border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Meu pedido
          {total > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {total}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Meu pedido ({total} {total === 1 ? "item" : "itens"})
          </DrawerTitle>
          <DrawerDescription>Revise e envie tudo de uma vez pelo WhatsApp.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="max-h-[60vh] overflow-y-auto">
          {items.length === 0 ? (
            <div className="py-8 text-center">
              <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" />
              <p className="mb-4 text-muted-foreground">Seu pedido está vazio.</p>
              <DrawerClose asChild>
                <Button variant="outline">Ver produtos</Button>
              </DrawerClose>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-lg border p-3">
                  <img src={item.image} alt="" className="h-16 w-12 rounded-md object-cover" />
                  <div className="flex-1">
                    <h3 className="font-sans text-sm font-semibold">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{priceLabel(item)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setQty(item.id, item.qty - 1)} aria-label="Diminuir">
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setQty(item.id, item.qty + 1)} aria-label="Aumentar">
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 text-destructive" onClick={() => setQty(item.id, 0)} aria-label="Remover">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="grid gap-2 border-t pt-4">
                <Input placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                <Input placeholder="Bairro / região da entrega" value={bairro} onChange={(e) => setBairro(e.target.value)} />
              </div>
            </div>
          )}
        </DrawerBody>
        <DrawerFooter className="grid-cols-2">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Continuar vendo</Button>
          </DrawerClose>
          <Button className="w-full" disabled={items.length === 0} onClick={send}>
            Enviar no WhatsApp
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

/* ---------------------------------- Página ---------------------------------- */

export default function App() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cat, setCat] = useState("Todos");

  const setQty = (id: string, qty: number) =>
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  const addOne = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const list = PRODUCTS.filter((p) => cat === "Todos" || p.category === cat);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <a href="#/" className="flex items-center gap-3 font-heading text-sm font-bold tracking-wide">
            <img src="/img/logo.png" alt="FEU Active" className="h-10 w-10 rounded-full" />
            <span>FEU <b className="neon-text">ACTIVE</b></span>
          </a>
          <nav className="hidden gap-7 text-sm font-semibold text-muted-foreground md:flex">
            <a className="hover:text-foreground" href="#produtos">Produtos</a>
            <a className="hover:text-foreground" href="#beneficios">Benefícios</a>
            <a className="hover:text-foreground" href="#instagram">Instagram</a>
            <a className="hover:text-foreground" href="#/painel">Painel</a>
          </nav>
          <CartDrawer cart={cart} setQty={setQty} />
        </div>
      </header>

      <AnimatedMarqueeHero
        tagline="Bebidas funcionais • Herbalife • Vila Velha - ES"
        title={
          <>
            Seu <span className="neon-text">melhor</span> hoje
            <br />
            começa aqui.
          </>
        }
        description="Energia, foco e bem-estar para a sua rotina. Peça pelo WhatsApp e receba em casa."
        ctaText="Pedir no WhatsApp"
        ctaHref={waLink("Olá FEU Active! Vim pelo site e quero fazer um pedido 💚")}
        images={HERO_IMAGES}
      />

      <div className="border-y border-primary/40 bg-primary py-3 text-primary-foreground shadow-[0_0_40px_rgba(166,255,61,0.35)]">
        <Marquee duration={28} fade={false}>
          {["Energia", "Foco", "Disposição", "Resultados", "Bem-estar", "Hype Drink", "Herbalife"].map((t) => (
            <span key={t} className="mx-6 font-heading text-lg font-bold uppercase">
              {t} <span className="mx-3">⚡</span>
            </span>
          ))}
        </Marquee>
      </div>

      <section id="produtos" className="mx-auto max-w-6xl px-4 py-24">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">Catálogo</p>
        <h2 className="mb-3 text-3xl font-extrabold md:text-5xl">
          Escolha o seu <span className="neon-text">combustível</span>
        </h2>
        <p className="mb-8 max-w-xl text-muted-foreground">
          Passe o mouse nos cards. Toque em "Pedir" para abrir o WhatsApp com o produto ou em "+" para montar um pedido com vários itens.
        </p>
        <div className="mb-10 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={cat === c ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setCat(c)}
            >
              {c}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 justify-items-center gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <div key={p.id} className="flex w-full max-w-[340px] flex-col gap-4">
              <InteractiveProductCard
                imageUrl={p.image}
                logoUrl="/img/logo.png"
                title={p.name}
                description={p.desc}
                price={priceLabel(p)}
              />
              <div className="flex gap-2">
                <Button asChild className="flex-1 rounded-full font-bold">
                  <a
                    href={waLink(`Olá FEU Active! Quero pedir: ${p.name} 💚`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pedir
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => addOne(p.id)}
                  aria-label={`Adicionar ${p.name} ao pedido`}
                >
                  {cart[p.id] ? `+ (${cart[p.id]})` : "+"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ParallaxComponent />

      <FeaturesSection />

      <section id="instagram" className="overflow-hidden py-24">
        <div className="mx-auto mb-10 max-w-6xl px-4">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">Siga a gente</p>
          <h2 className="text-3xl font-extrabold md:text-5xl">
            Novidades no <span className="neon-text">Instagram</span>
          </h2>
        </div>
        <Marquee duration={50} pauseOnHover fadeAmount={8}>
          {PRODUCTS.map((p) => (
            <a
              key={p.id}
              href={`https://www.instagram.com/${INSTAGRAM}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2 block h-72 w-52 overflow-hidden rounded-2xl border border-border transition-transform hover:-translate-y-2 hover:border-primary"
            >
              <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
            </a>
          ))}
        </Marquee>
      </section>

      <section className="relative overflow-hidden bg-[radial-gradient(60%_90%_at_50%_100%,rgba(166,255,61,0.22),transparent_70%)] px-4 py-28 text-center">
        <h2 className="text-4xl font-extrabold uppercase md:text-7xl">
          Bora sentir <span className="neon-text">a diferença?</span>
        </h2>
        <p className="mx-auto mb-10 mt-4 max-w-md text-lg text-muted-foreground">Chame agora e peça o seu melhor hoje.</p>
        <RainbowButton
          className="h-14 px-10 text-lg"
          onClick={() =>
            window.open(waLink("Olá FEU Active! Vim pelo site e quero fazer um pedido 💚"), "_blank", "noopener")
          }
        >
          Falar no WhatsApp
        </RainbowButton>
      </section>

      <footer className="border-t border-border px-4 py-12 text-center text-sm text-muted-foreground">
        <img src="/img/logo.png" alt="" className="mx-auto mb-3 h-14 w-14 rounded-full" />
        <p>Bebidas funcionais • Herbalife • Seu melhor hoje</p>
        <p className="mt-3 text-xs opacity-60">
          © {new Date().getFullYear()} FEU Active. Produtos Herbalife Nutrition. Os resultados variam de pessoa para pessoa.
        </p>
      </footer>
    </div>
  );
}
