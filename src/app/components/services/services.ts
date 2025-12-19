import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SERVICES } from '../../lib/services';
import { Card, CardContent } from '../ui/card/card';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, Card, CardContent],
  templateUrl: './services.html',
})
export class Services {
  private sanitizer = inject(DomSanitizer);
  // Split services strictly by category based on order in lib/services.ts
  readonly barberServices = SERVICES.slice(0, 7);
  readonly ladiesServices = SERVICES.slice(7);

  getSafeSvg(svgString: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgString);
  }
}
