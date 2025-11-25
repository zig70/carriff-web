// src/app/blog/blog.component.ts

import { Component, OnInit } from '@angular/core';

interface Article {
  title: string;
  category: 'All Articles' | 'Data Governance' | 'Digital Transformation' | 'Case Studies' | 'AI & Automation';
  summary: string;
  link: string;
  imageUrl: string;
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  activeFilter: Article['category'] = 'All Articles';

  // FIX A: Add the full list of articles data (allArticles)
  allArticles: Article[] = [
    { 
      title: 'Transforming Customer Onboarding: 40% Efficiency Gain', 
      category: 'Case Studies', 
      summary: 'See how our automated quote-and-buy solution streamlined operations for a leading insurance provider.', 
      link: '#',
      imageUrl: 'assets/blog-thumbnails/quotenbuy.png'
    },
    { 
      title: 'The 5 Pillars of a Modern Data Governance Framework', 
      category: 'Data Governance', 
      summary: 'An essential guide to establishing trust and compliance across your enterprise data landscape.', 
      link: '#',
      imageUrl: 'assets/blog-thumbnails/datagovblogimage.png'
    },
    { 
      title: 'Beyond Chatbots: Using AI for Hyper-Personalized Marketing', 
      category: 'AI & Automation', 
      summary: 'Exploring advanced AI models for automating customer interactions and boosting conversion rates.', 
      link: '#',
      imageUrl: 'assets/blog-thumbnails/blogreporting.png'
    },
    { 
      title: 'Roadmap to Digital Success in 2026', 
      category: 'Digital Transformation', 
      summary: 'Key strategic steps every business must take to accelerate digital maturity.', 
      link: '#',
      imageUrl: 'assets/blog-thumbnails/neuralnetwork.png'
    },
    { 
      title: 'Case Study: Data Quality Implementation in Finance', 
      category: 'Case Studies', 
      summary: 'How improving data quality unlocked new regulatory reporting capabilities.', 
      link: '#',
      imageUrl: 'assets/blog-thumbnails/blog_payments.png'
    },
    // Add more articles here...
  ];

  // FIX B: Add the array that the template will display (filteredArticles)
  filteredArticles: Article[] = []; 

  constructor() { }

  ngOnInit(): void {
    // This calls the filter logic on load to display all initial articles
    this.filterArticles(this.activeFilter);
  }

  // FIX C: Implement the complete filtering logic
  filterArticles(category: Article['category']): void {
    this.activeFilter = category;

    if (category === 'All Articles') {
      // If 'All' is selected, show every article
      this.filteredArticles = [...this.allArticles];
    } else {
      // Otherwise, filter the full list based on the category
      this.filteredArticles = this.allArticles.filter(article => article.category === category);
    }
  }

  getArticleSlug(title: string): string {
    return title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
  }
}