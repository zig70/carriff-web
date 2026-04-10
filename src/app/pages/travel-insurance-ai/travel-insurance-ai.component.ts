import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-travel-insurance-ai',
  templateUrl: './travel-insurance-ai.component.html',
  styleUrls: ['./travel-insurance-ai.component.scss'],
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
})
export class TravelInsuranceAiComponent {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.setStaticTags({
      title: 'Travel Insurance AI Chat | Insurtech AI Demo',
      description:
        'See how AI is transforming travel insurance. Our insurtech AI chat assistant scans itineraries, answers policy questions in plain English, and delivers instant personalised quotes — no forms, no call centres.',
      url: 'travel-insurance-ai',
      image: 'assets/blog-thumbnails/carriffAITravelChat.webp',
    });
  }
}
