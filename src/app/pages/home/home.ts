import { Component, OnInit, OnDestroy, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Hero } from '../../components/hero/hero';
import { About } from '../../components/about/about';
import { Services } from '../../components/services/services';
import { Products } from '../../components/products/products';
import { Gallery } from '../../components/gallery/gallery';
import { Contact } from '../../components/contact/contact';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, About, Services, Products, Gallery, Contact],
  templateUrl: './home.html',
})
export class Home implements OnInit, OnDestroy {
  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {
    this.renderer.addClass(this.document.body, 'home-gradient');
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'home-gradient');
  }
}
