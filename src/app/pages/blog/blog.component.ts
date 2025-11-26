// src/app/blog/blog.component.ts

import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

interface Article {
  title: string;
  category: 'All Articles' | 'Data Governance' | 'Digital Transformation' | 'Case Studies' | 'AI & Automation';
  summary: string;
  link: string;
  imageUrl: string;
}

export const allArticles: Article[] = [
    { 
      title: 'What we have been listening to in 2025', 
      category: 'Digital Transformation', 
      summary: 'A little bit of help to breakdown the AI bubble.', 
      link: '#',
      imageUrl: 'assets/blog-thumbnails/topofthepops.png'
    },
    { 
      title: 'The future of Price Comparision sites: Will AI take over?', 
      category: 'AI & Automation', 
      summary: 'How consumer purchasing habits in an AI-driven world are challenging comparison marketplaces.', 
      link: '#',
      imageUrl: 'assets/blog-thumbnails/pcw_aifuture.png'
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
      title: 'AI Driven Quality in Month End Reporting', 
      category: 'Case Studies', 
      summary: 'How improving data quality unlocked new regulatory reporting capabilities.', 
      link: '#',
      imageUrl: 'assets/blog-thumbnails/blog_payments.png'
    },
    { 
      title: 'The 5 Pillars of a Modern Data Governance Framework', 
      category: 'Data Governance', 
      summary: 'An essential guide to establishing trust and compliance across your enterprise data landscape.', 
      link: '#',
      imageUrl: 'assets/blog-thumbnails/datagovblogimage.png'
    },
    // Add more articles here...
  ];

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  standalone: true,
  imports: [NgClass, RouterLink]
})
export class BlogComponent implements OnInit {
  activeFilter: Article['category'] = 'All Articles';

  allArticles = allArticles;
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