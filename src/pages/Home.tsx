import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-jewelry.jpg';
import necklace1 from '@/assets/necklace-1.jpg';
import ring1 from '@/assets/ring-1.jpg';
import earrings1 from '@/assets/earrings-1.jpg';
import { ShoppingCart, Star, Truck, ShieldCheck, Gem } from 'lucide-react';
// import { CardStack } from '@/components/aceternity/CardStack';
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: any;
  tags: string[];
  featured: boolean;
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Elegant Gold Necklace',
    description: 'A beautiful handcrafted gold necklace, perfect for any occasion.',
    price: 299.99,
    images: ['/src/assets/necklace-1.jpg'],
    tags: ['necklace', 'gold', 'elegant'],
    featured: true,
  },
  {
    id: '2',
    name: 'Diamond Stud Earrings',
    description: 'Classic diamond stud earrings that add a touch of sparkle.',
    price: 499.99,
    images: ['/src/assets/earrings-1.jpg'],
    tags: ['earrings', 'diamond', 'classic'],
    featured: false,
  },
  {
    id: '3',
    name: 'Sapphire Engagement Ring',
    description: 'A stunning sapphire ring, symbolizing loyalty and wisdom.',
    price: 1299.99,
    images: ['/src/assets/ring-1.jpg'],
    tags: ['ring', 'sapphire', 'engagement'],
    featured: true,
  },
  {
    id: '4',
    name: 'Pearl Bracelet',
    description: 'An exquisite pearl bracelet, a timeless piece of jewelry.',
    price: 199.99,
    images: ['/src/assets/hero-jewelry.jpg'],
    tags: ['bracelet', 'pearl', 'timeless'],
    featured: false,
  },
  {
    id: '5',
    name: 'Emerald Pendant',
    description: 'A vibrant emerald pendant, a symbol of rebirth and love.',
    price: 799.99,
    images: ['/src/assets/necklace-1.jpg'],
    tags: ['pendant', 'emerald', 'vibrant'],
    featured: true,
  },
  {
    id: '6',
    name: 'Gold Cufflinks',
    description: 'Sophisticated gold cufflinks, the perfect accessory for any gentleman.',
    price: 399.99,
    images: ['/src/assets/ring-1.jpg'],
    tags: ['cufflinks', 'gold', 'sophisticated'],
    featured: false,
  },
  {
    id: '7',
    name: 'Ruby Drop Earrings',
    description: 'Dazzling ruby drop earrings, a statement of passion and courage.',
    price: 899.99,
    images: ['/src/assets/earrings-1.jpg'],
    tags: ['earrings', 'ruby', 'dazzling'],
    featured: true,
  },
  {
    id: '8',
    name: 'Silver Locket',
    description: 'A charming silver locket, a perfect keepsake for your loved ones.',
    price: 149.99,
    images: ['/src/assets/necklace-1.jpg'],
    tags: ['locket', 'silver', 'charming'],
    featured: false,
  },
  {
    id: '9',
    name: 'Opal Ring',
    description: 'A mesmerizing opal ring, reflecting a rainbow of colors.',
    price: 699.99,
    images: ['/src/assets/ring-1.jpg'],
    tags: ['ring', 'opal', 'mesmerizing'],
    featured: false,
  },
];

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

export default function Home() {
  const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [priceFilter, setPriceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const {
    addToCart
  } = useCart();
  const {
    toast
  } = useToast();

  useEffect(() => {
    // setProducts(mockProducts);
    setLoading(false);
  }, []);

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [products, priceFilter, categoryFilter, searchQuery]);

  const applyFilters = () => {
    let tempProducts = [...products];

    if (searchQuery) {
      tempProducts = tempProducts.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description?.toLowerCase().includes(searchQuery.toLowerCase()) || product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    }

    if (categoryFilter !== 'all') {
      tempProducts = tempProducts.filter(product => product.tags.some(tag => tag.toLowerCase().includes(categoryFilter.toLowerCase())));
    }

    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'under-500':
          tempProducts = tempProducts.filter(product => product.price < 50000);
          break;
        case '500-1000':
          tempProducts = tempProducts.filter(product => product.price >= 50000 && product.price < 100000);
          break;
        case '1000-2000':
          tempProducts = tempProducts.filter(product => product.price >= 100000 && product.price < 200000);
          break;
        case 'over-2000':
          tempProducts = tempProducts.filter(product => product.price >= 200000);
          break;
      }
    }
    setFilteredProducts(tempProducts);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`
    });
  };

  const featuredProducts = filteredProducts.filter(p => p.featured).slice(0, 4);
  const regularProducts = filteredProducts.filter(p => !p.featured);
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="shimmer w-16 h-16 rounded-full bg-muted"></div>
      </div>;
  }
  return <div className="min-h-screen">
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Luxury Jewelry Collection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center space-y-6 px-4">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold">
            <span className="hero-gradient">Timeless Elegance</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto md:text-3xl font-bold text-[#7e7e74]">
            Discover our exquisite collection of handcrafted luxury jewelry
          </p>
          <Button variant="luxury" size="hero" className="shimmer">
            Explore Collection
          </Button>
        </div>
      </section>

      <section className="py-8 bg-black/20 border-y border-border">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="text-sm md:text-base">Lifetime warranty on select pieces</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Truck className="h-5 w-5 text-primary" />
            <p className="text-sm md:text-base">Free insured shipping worldwide</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Gem className="h-5 w-5 text-primary" />
            <p className="text-sm md:text-base">Certified gemstones & ethical sourcing</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-playfair font-bold gold-text mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/?search=necklace" className="group relative overflow-hidden rounded-xl luxury-card">
            <img src={necklace1} alt="Necklaces" className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
            <div className="absolute bottom-3 left-3 text-lg font-semibold gold-text">Necklaces</div>
          </Link>
          <Link to="/?search=ring" className="group relative overflow-hidden rounded-xl luxury-card">
            <img src={ring1} alt="Rings" className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
            <div className="absolute bottom-3 left-3 text-lg font-semibold gold-text">Rings</div>
          </Link>
          <Link to="/?search=earrings" className="group relative overflow-hidden rounded-xl luxury-card">
            <img src={earrings1} alt="Earrings" className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
            <div className="absolute bottom-3 left-3 text-lg font-semibold gold-text">Earrings</div>
          </Link>
          <Link to="/?search=bracelet" className="group relative overflow-hidden rounded-xl luxury-card">
            <img src={heroImage} alt="Bracelets" className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
            <div className="absolute bottom-3 left-3 text-lg font-semibold gold-text">Bracelets</div>
          </Link>
        </div>
      </section>



      <div className="container mx-auto px-4 py-12">
                  <div className="mb-8"></div>

        {featuredProducts.length > 0 && <section className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <Star className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-playfair font-bold gold-text">Featured Collection</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} featured />)}
            </div>
          </section>}

        <section>
          <h2 className="text-2xl font-playfair font-bold gold-text mb-6">Our Collection</h2>
          
          {filteredProducts.length === 0 ? <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
              <Button variant="luxury" className="mt-4" onClick={() => {
            setPriceFilter('all');
            setCategoryFilter('all');
            setSearchQuery('');
          }}>
                View All Products
              </Button>
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {regularProducts.map(product => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />)}
            </div>}
        </section>

        <section className="mt-16 bg-black/20 border border-border rounded-xl p-8 text-center">
          <h2 className="text-2xl font-playfair font-bold gold-text mb-2">Join our inner circle</h2>
          <p className="text-muted-foreground mb-4">Get early access to new drops, limited editions, and exclusive offers.</p>
          <div className="mx-auto max-w-md flex gap-2">
            <Input placeholder="Enter your email" className="flex-1 luxury-input" />
            <Button variant="gold">Subscribe</Button>
          </div>
        </section>


      </div>
    </div>;
}
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  featured?: boolean;
}
function ProductCard({
  product,
  onAddToCart,
  featured = false
}: ProductCardProps) {
  const productImage = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/placeholder.svg';
  return <Card className={`luxury-card scale-hover ${featured ? 'ring-2 ring-primary/20' : ''}`}>
      <div className="relative overflow-hidden rounded-t-lg">
        {featured && <Badge className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground">
            Featured
          </Badge>}
        <img src={productImage} alt={product.name} className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105" />
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-playfair font-semibold text-lg">{product.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
        </div>
        
        {product.tags.length > 0 && <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map(tag => <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>)}
          </div>}
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold gold-text">
            PKR {product.price.toLocaleString()}
          </span>
          <div className="flex space-x-2">
            <Link to={`/product/${product.id}`}>
              <Button variant="luxuryOutline" size="sm">
                View
              </Button>
            </Link>
            <Button variant="luxury" size="sm" onClick={() => onAddToCart(product)}>
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
}