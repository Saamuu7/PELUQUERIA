import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Button } from '../ui/button/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, Button],
  templateUrl: './header.html',
})
export class Header {
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);

  navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Servicios", href: "#servicios" },
    { name: "Productos", href: "#productos" },
    { name: "Contacto", href: "#contacto" },
  ];

  constructor(private router: Router) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  scrollToSection(href: string) {
    if (href === '/') {
      this.router.navigate(['/']);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.isMobileMenuOpen.set(false);
      return;
    }

    if (href.startsWith('#')) {
      const id = href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        this.router.navigate(['/']).then(() => {
          setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        });
      }
      this.isMobileMenuOpen.set(false);
    }
  }
}
