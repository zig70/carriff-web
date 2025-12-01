import { Component } from '@angular/core';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-dataservices',
  templateUrl: './dataservices.component.html',
  styleUrls: ['./dataservices.component.scss'],
  standalone: true,
})
export class DataservicesComponent {
  constructor(private seoService: SeoService) { }

  ngOnInit(): void {
    this.seoService.setStaticTags({
      title: 'Data Services',
      description: 'Find out how Carriff Digital can support your data services.',
      url: 'dataservices', // Just the path segment
      //image: 'assets/social-share-about.jpg' // Optional social sharing image
    });
  }
}
