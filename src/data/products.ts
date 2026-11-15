export const WHATSAPP = "5527988025216";
export const INSTAGRAM = "feu.active";

export interface Product {
  id: string;
  name: string;
  category: string;
  desc: string;
  image: string;
  /** Preço em reais; null = "Consulte o valor" (preencher quando o lojista informar). */
  price: number | null;
}

export const PRODUCTS: Product[] = [
  { id: "hype-drink", name: "Hype Drink", category: "Bebidas funcionais", desc: "Mais energia e foco, sem açúcares", image: "/img/hype-drink.webp", price: null },
  { id: "metabolic", name: "Metabolic+ Detox", category: "Bebidas funcionais", desc: "500ml · metabolismo e digestão", image: "/img/metabolic.webp", price: null },
  { id: "hype-combo", name: "Combo Hype Drink", category: "Bebidas funcionais", desc: "Herbal + N-R-G + Liftoff + CR7", image: "/img/hype-combo.webp", price: null },
  { id: "shake-limao", name: "Shake Torta de Limão", category: "Shakes", desc: "Refrescante e cremoso", image: "/img/shake-limao.webp", price: null },
  { id: "shake-coco", name: "Shake Coco", category: "Shakes", desc: "Leve, cremoso e delicioso", image: "/img/shake-coco.webp", price: null },
  { id: "shake-morango", name: "Shake Morango", category: "Shakes", desc: "Doce na medida certa", image: "/img/shake-morango.webp", price: null },
  { id: "shake-pistache", name: "Shake Pistache", category: "Shakes", desc: "Sabor especial para variar", image: "/img/shake-pistache.webp", price: null },
  { id: "shake-doce-leite", name: "Shake Doce de Leite", category: "Shakes", desc: "Nutrição de verdade no dia a dia", image: "/img/shake-doce-leite.webp", price: null },
  { id: "shake-cookies", name: "Shake Cookies & Cream", category: "Shakes", desc: "Leve e gostoso", image: "/img/shake-cookies.webp", price: null },
  { id: "fiber", name: "Fiber Concentrate Uva", category: "Suplementos", desc: "450ml · ajuda o intestino", image: "/img/fiber.webp", price: null },
  { id: "barra", name: "Barra de Proteína", category: "Snacks", desc: "Baunilha com amêndoas · 10g proteína", image: "/img/barra.webp", price: null },
];

export const waLink = (msg: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
