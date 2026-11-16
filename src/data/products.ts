export interface Product {
  id: string;
  name: string;
  category: string;
  desc: string;
  image: string;
  /** Preço em reais; null = "Consulte o valor". */
  price: number | null;
  /** Preço promocional (menor que price). */
  promoPrice: number | null;
  inStock: boolean;
  /** Visível no site. */
  active: boolean;
  featured: boolean;
}

export const CATEGORY_SUGGESTIONS = ["Bebidas funcionais", "Shakes", "Suplementos", "Snacks"];

const P = (
  id: string, name: string, category: string, desc: string, image: string,
  price: number | null, extra: Partial<Product> = {},
): Product => ({ id, name, category, desc, image, price, promoPrice: null, inStock: true, active: true, featured: false, ...extra });

/**
 * PRODUTOS INICIAIS. Os PREÇOS, PROMOÇÕES e ESTOQUE abaixo são EXEMPLOS FICTÍCIOS só para a demonstração;
 * o lojista troca pelos valores reais no painel (#/painel > Produtos).
 */
export const SEED_PRODUCTS: Product[] = [
  P("hype-drink", "Hype Drink", "Bebidas funcionais", "Mais energia e foco, sem açúcares", "/img/hype-drink.webp", 14.9, { featured: true }),
  P("metabolic", "Metabolic+ Detox", "Bebidas funcionais", "500ml · metabolismo e digestão", "/img/metabolic.webp", 12.9, { promoPrice: 9.9, featured: true }),
  P("hype-combo", "Combo Hype Drink", "Bebidas funcionais", "Herbal + N-R-G + Liftoff + CR7", "/img/hype-combo.webp", 39.9, { promoPrice: 34.9 }),
  P("shake-limao", "Shake Torta de Limão", "Shakes", "Refrescante e cremoso", "/img/shake-limao.webp", 12.9),
  P("shake-coco", "Shake Coco", "Shakes", "Leve, cremoso e delicioso", "/img/shake-coco.webp", 12.9),
  P("shake-morango", "Shake Morango", "Shakes", "Doce na medida certa", "/img/shake-morango.webp", 12.9),
  P("shake-pistache", "Shake Pistache", "Shakes", "Sabor especial para variar", "/img/shake-pistache.webp", 12.9, { inStock: false }),
  P("shake-doce-leite", "Shake Doce de Leite", "Shakes", "Nutrição de verdade no dia a dia", "/img/shake-doce-leite.webp", 12.9),
  P("shake-cookies", "Shake Cookies & Cream", "Shakes", "Leve e gostoso", "/img/shake-cookies.webp", 12.9),
  P("fiber", "Fiber Concentrate Uva", "Suplementos", "450ml · ajuda o intestino", "/img/fiber.webp", null),
  P("barra", "Barra de Proteína", "Snacks", "Baunilha com amêndoas · 10g proteína", "/img/barra.webp", 9.9, { active: false }),
];
