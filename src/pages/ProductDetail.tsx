import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, ArrowLeft, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: any;
  tags: string[];
  featured: boolean;
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [products] = useLocalStorage<Product[]>('products', []);
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const foundProduct = products.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        const similar = products.filter(p => p.tags.some(tag => foundProduct.tags.includes(tag)) && p.id !== foundProduct.id);
        setSimilarProducts(similar.slice(0, 4));
      }
      setLoading(false);
    }
  }, [id, products]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images
      });
      
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="shimmer w-16 h-16 rounded-full bg-muted"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-playfair font-bold">Product Not Found</h1>
          <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          <Link to="/">
            <Button variant="luxury">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const mainImage = product.images && product.images.length > 0 ? product.images[selectedImageIndex] : '/placeholder.svg';

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to all products
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.images && product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  className={`border-2 rounded-lg overflow-hidden ${selectedImageIndex === index ? 'border-primary' : 'border-transparent'}`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img src={image} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{product.name}</h1>
            
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">4.0 (12 reviews)</p>
            </div>
            
            <p className="text-3xl text-gray-900 dark:text-white">${product.price}</p>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Description</h3>
              <div className="mt-4 text-base text-gray-600 dark:text-gray-300 space-y-4">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Tags:</p>
              {product.tags && product.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to cart
            </Button>
          </div>
        </div>
        
        {similarProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">You might also like</h2>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {similarProducts.map((similarProduct) => (
                <div key={similarProduct.id} className="group relative">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
                    <img
                      src={similarProduct.images[0]}
                      alt={similarProduct.name}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700 dark:text-gray-200">
                        <Link to={`/product/${similarProduct.id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {similarProduct.name}
                        </Link>
                      </h3>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">${similarProduct.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}