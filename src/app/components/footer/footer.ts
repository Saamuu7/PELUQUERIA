import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from '../ui/button/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, Button],
  templateUrl: './footer.html',
})
export class Footer {
  currentYear = new Date().getFullYear();
}
