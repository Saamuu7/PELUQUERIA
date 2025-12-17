import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../ui/button/button';
import { Card, CardContent } from '../ui/card/card';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, Button, Card, CardContent],
  templateUrl: './contact.html',
})
export class Contact { }
