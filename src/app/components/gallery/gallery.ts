import { Component, ViewChild, signal, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmblaCarouselDirective, EmblaCarouselType } from 'embla-carousel-angular';
import { Button } from '../ui/button/button';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, EmblaCarouselDirective, Button],
  templateUrl: './gallery.html',
})
export class Gallery implements AfterViewInit {
  @ViewChild(EmblaCarouselDirective) emblaRef!: EmblaCarouselDirective;
  private emblaApi?: EmblaCarouselType;

  images = [
    'assets/gallery-1.jpg',
    'assets/about-salon.jpg',
    'assets/hero-salon.jpg',
    'assets/gallery-1.jpg',
    'assets/about-salon.jpg',
    'assets/hero-salon.jpg'
  ];

  openIndex = signal<number | null>(null);

  options = { loop: true, align: 'start' as const, slidesToScroll: 1, breakpoints: { '(min-width: 768px)': { slidesToScroll: 1 } } };

  ngAfterViewInit() {
    this.emblaApi = this.emblaRef.emblaApi;
  }

  scrollPrev() {
    if (this.emblaRef && this.emblaRef.emblaApi) {
      this.emblaRef.emblaApi.scrollPrev();
    } else if (this.emblaApi) {
      this.emblaApi.scrollPrev();
    }
  }

  scrollNext() {
    if (this.emblaRef && this.emblaRef.emblaApi) {
      this.emblaRef.emblaApi.scrollNext();
    } else if (this.emblaApi) {
      this.emblaApi.scrollNext();
    }
  }

  openLightbox(i: number) {
    this.openIndex.set(i);
  }

  closeLightbox() {
    this.openIndex.set(null);
  }

  showPrev() {
    const current = this.openIndex();
    if (current === null) return;
    this.openIndex.set((current - 1 + this.images.length) % this.images.length);
  }

  showNext() {
    const current = this.openIndex();
    if (current === null) return;
    this.openIndex.set((current + 1) % this.images.length);
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (this.openIndex() === null) return;
    if (e.key === "Escape") this.closeLightbox();
    if (e.key === "ArrowLeft") this.showPrev();
    if (e.key === "ArrowRight") this.showNext();
  }
}
