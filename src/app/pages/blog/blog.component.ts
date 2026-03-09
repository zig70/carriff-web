// src/app/blog/blog.component.ts

import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { SeoService } from '../../seo.service';
import { ArticleMeta } from '../../services/article.service';

type CategoryFilter = 'All Articles' | 'Data Governance' | 'Digital Transformation' | 'Case Studies' | 'AI & Automation';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  standalone: true,
  imports: [NgClass, RouterLink, NgOptimizedImage],
})
export class BlogComponent implements OnInit {
  activeFilter: CategoryFilter = 'All Articles';

  allArticles: ArticleMeta[] = [];
  filteredArticles: ArticleMeta[] = [];

  constructor(
    private seoService: SeoService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.seoService.setStaticTags({
      title: 'Blog',
      description: 'Sharing our thoughts at Carriff Digital.',
      url: 'blog',
    });
    // Articles are pre-fetched by blogResolver before this component activates —
    // synchronous read, works for both SSR and client-side navigation.
    this.allArticles = this.route.snapshot.data['articles'] ?? [];
    this.filterArticles(this.activeFilter);
  }

  filterArticles(category: CategoryFilter): void {
    this.activeFilter = category;

    if (category === 'All Articles') {
      this.filteredArticles = [...this.allArticles];
    } else {
      this.filteredArticles = this.allArticles.filter(article => article.category === category);
    }
  }
}
