import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [NgOptimizedImage]
})
export class ContactComponent {
  constructor(private seoService: SeoService) { }

  ngOnInit(): void {
    this.seoService.setStaticTags({
      title: 'Contact',
      description: 'Engage with Carriff Digital.',
      url: 'contact', // Just the path segment
      //image: 'assets/social-share-about.jpg' // Optional social sharing image
    });
  }
}
