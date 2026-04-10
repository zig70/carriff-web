import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-intelligent-automation',
  templateUrl: './intelligent-automation.component.html',
  styleUrls: ['./intelligent-automation.component.scss'],
  standalone: true,
  imports: [RouterLink],
})
export class IntelligentAutomationComponent {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.setStaticTags({
      title: 'AI Digital Transformation, Automation & Website Builds | Carriff Digital',
      description:
        'Automate reports, eliminate repetitive tasks, and modernise your website or business systems with AI. Carriff Digital delivers end-to-end digital transformation — from website builds to intelligent automation and real-time business intelligence.',
      url: 'intelligent-automation',
      image: 'assets/MachineLearning.webp',
    });
  }
}
