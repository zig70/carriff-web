import { Routes } from '@angular/router';
import { blogResolver } from './resolvers/blog.resolver';
import { articleResolver } from './resolvers/article.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent),
  },
  {
    path: 'dataservices',
    loadComponent: () => import('./pages/dataservices/dataservices.component').then(m => m.DataservicesComponent),
  },
  {
    path: 'articles/:slug',
    loadComponent: () => import('./pages/article/article.component').then(m => m.ArticleComponent),
    resolve: { article: articleResolver },
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent),
    resolve: { articles: blogResolver },
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
  },
  {
    path: 'intelligent-automation',
    loadComponent: () =>
      import('./pages/intelligent-automation/intelligent-automation.component').then(
        (m) => m.IntelligentAutomationComponent
      ),
  },
  {
    path: 'travel-insurance-ai',
    loadComponent: () =>
      import('./pages/travel-insurance-ai/travel-insurance-ai.component').then(
        (m) => m.TravelInsuranceAiComponent
      ),
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
