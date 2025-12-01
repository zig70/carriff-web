import { Component } from '@angular/core';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: true,
})
export class AboutComponent {
  constructor(private seoService: SeoService) { }

  ngOnInit(): void {
    this.seoService.setStaticTags({
      title: 'About',
      description: 'A little bit about Carriff Digital, engage to find out more.',
      url: 'about', // Just the path segment
      //image: 'assets/social-share-about.jpg' // Optional social sharing image
    });
  }
}
