import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from 'express';
@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone:true
})
export class HomeComponent {
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const footer = document.querySelector('.footer') as HTMLElement;
    const scrollPosition = window.scrollY + window.innerHeight;
    const footerPosition = footer.offsetTop;

    if (scrollPosition >= footerPosition) {
      footer.classList.add('visible');
    }
  }
}
