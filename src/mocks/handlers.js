import { http, HttpResponse } from 'msw';
import productsData from './products.json';

export const handlers = [
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    
    let filteredProducts = [...productsData];
    
    if (category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === category
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }
    
    return HttpResponse.json(filteredProducts);
  }),

  http.get('/api/products/:id', ({ params }) => {
    const product = productsData.find((p) => p.id === params.id);
    
    if (!product) {
      return HttpResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(product);
  }),

  http.get('/api/products/slug/:slug', ({ params }) => {
    const product = productsData.find((p) => p.slug === params.slug);
    
    if (!product) {
      return HttpResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(product);
  }),

  http.post('/api/cart', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, item: body });
  }),

  http.get('/api/cart', () => {
    return HttpResponse.json({ items: [] });
  }),

  http.post('/api/wishlist', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, item: body });
  }),

  http.post('/api/checkout', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      orderId: `ORD-${Date.now()}`,
      ...body,
    });
  }),
];
