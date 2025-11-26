import { allArticles } from './pages/blog/blog.component'; 

function getArticleSlug(title: string): string {
    return title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
}

// 1. Get the list of dynamic routes
const dynamicRoutes = allArticles.map(article => `/articles/${getArticleSlug(article.title)}`);

// 2. Define all static routes
const staticRoutes = [
    '/',
    '/services',
    '/dataservices',
    '/blog',
    '/about',
    '/contact',
    '/not-found' // or /not-found
];

// 3. Combine them and export
export default async function getRoutes(): Promise<string[]> {
    return [...staticRoutes, ...dynamicRoutes];
}