import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../ui/button/button';

// Helper to properly reference assets
const productsHero = 'assets/products-hero.jpg';

const baseProducts = [
  {
    id: "champu-hidratante",
    name: "Champú Hidratante",
    description: "Restauración profunda",
    size: "250 ml",
    price: "18€",
    image: productsHero
  },
  {
    id: "acondicionador-reparador",
    name: "Acondicionador Reparador",
    description: "Desenredo y suavidad",
    size: "200 ml",
    price: "20€",
    image: productsHero
  },
  {
    id: "mascarilla-nutritiva",
    name: "Mascarilla Nutritiva",
    description: "Nutrición intensa",
    size: "250 ml",
    price: "28€",
    image: productsHero
  },
  {
    id: "serum-brillo",
    name: "Sérum Brillo Diamante",
    description: "Acabado luminoso",
    size: "50 ml",
    price: "22€",
    image: productsHero
  },
  {
    id: "aceite-argan",
    name: "Aceite de Argán Puro",
    description: "Hidratación natural",
    size: "100 ml",
    price: "24€",
    image: productsHero
  },
  {
    id: "protector-termico",
    name: "Protector Térmico",
    description: "Escudo contra el calor",
    size: "150 ml",
    price: "16€",
    image: productsHero
  },
];

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './products.html',
})
export class Products {
  // Generate 16 products (8 + 8)
  products = [
    ...baseProducts,
    ...baseProducts,
    ...baseProducts.slice(0, 4) // 6 + 6 + 4 = 16
  ].map((p, i) => ({ ...p, id: `${p.id}-${i}` }));

  showAll = signal(false);

  // Show 8 initially (2 rows of 4), or all 16 if toggled
  visibleProducts = computed(() => this.showAll() ? this.products : this.products.slice(0, 8));

  toggleShowAll() {
    this.showAll.update(v => !v);
  }
}
