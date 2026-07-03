import { fetchFeaturedProducts, fetchBestSellers, fetchNewProducts } from '@/lib/supabase-data';
import { FeaturedProductsClient } from '@/components/home/featured-products-client';

export async function FeaturedProducts() {
  const [featured, bestSellers, newProducts] = await Promise.all([
    fetchFeaturedProducts(8),
    fetchBestSellers(8),
    fetchNewProducts(8),
  ]);

  return (
    <FeaturedProductsClient
      featured={featured}
      bestSellers={bestSellers}
      newProducts={newProducts}
    />
  );
}
