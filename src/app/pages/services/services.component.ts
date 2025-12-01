import { Component } from '@angular/core';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  standalone: true,
})
export class ServicesComponent {
  constructor(private seoService: SeoService) { }

  ngOnInit(): void {
    this.seoService.setStaticTags({
      title: 'Services',
      description: 'Carriff Digital provides bespoke services to accelerate your digital roadmap.',
      url: 'services', // Just the path segment
      //image: 'assets/social-share-about.jpg' // Optional social sharing image
    });
  }
}
