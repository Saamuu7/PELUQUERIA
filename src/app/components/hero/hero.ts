import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from '../ui/button/button';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, Button],
  templateUrl: './hero.html',
})
export class Hero {
  // Utility for smooth scroll if needed, otherwise href="#servicios" relies on browser/router
  scrollToServices(e: Event) {
    e.preventDefault();
    document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' });
  }
}
