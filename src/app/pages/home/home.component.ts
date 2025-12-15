import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [RouterLink, NgOptimizedImage]
})
export class HomeComponent {
  constructor(private seoService: SeoService) { }

  ngOnInit(): void {
    this.seoService.setStaticTags({
      title: 'Home',
      description: 'Carriff Digital is your cheat code for innovation.',
      url: '', // Just the path segment
      //image: 'assets/social-share-about.jpg' // Optional social sharing image
    });
  }
}
