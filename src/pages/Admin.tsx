import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Package, ShoppingCart, ChevronDown } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: string[];
  tags: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

interface Order {
  id: string;
  user_id: string | null;
  full_name: string;
  phone_number: string;
  shipping_address: string;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  product_ids: string[];
  total_amount: number;
  status: string;
  created_at: string;
  products: Product[];
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

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useLocalStorage<Product[]>('products', []);
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    tags: '',
    featured: false,
    images: [] as string[]
  });
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast({
        title: "Unauthorized",
        description: "You do not have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      // The useLocalStorage hook will handle loading the data
    }
  }, [isAdmin]);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.name || !productForm.price || !productForm.quantity) {
      toast({
        title: "Validation Error",
        description: "Name, price, and quantity are required.",
        variant: "destructive",
      });
      return;
    }
    
    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      ...productForm,
      price: parseFloat(productForm.price),
      quantity: parseInt(productForm.quantity),
      tags: productForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      created_at: editingProduct ? editingProduct.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === newProduct.id ? newProduct : p));
    } else {
      setProducts([...products, newProduct]);
    }

    resetProductForm();
  };

  const deleteProduct = async (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      quantity: '',
      tags: '',
      featured: false,
      images: []
    });
    setShowProductForm(false);
  };

  const startEditingProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      quantity: product.quantity?.toString() || '0',
      tags: product.tags.join(', '),
      featured: product.featured,
      images: Array.isArray(product.images) ? product.images : []
    });
    setShowProductForm(true);
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    try {
      const fileArray = Array.from(files);
      const dataUrls = await Promise.all(
        fileArray.map(
          file =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        )
      );
      setProductForm(prev => ({
        ...prev,
        images: [...prev.images, ...dataUrls]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    setOrders(orders.filter(o => o.id !== orderId));
  };

  if (authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold gold-text mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage products and orders for DEMO</p>
        </div>

        <div className="flex space-x-4 mb-8">
          <Button
            variant={activeTab === 'products' ? 'luxury' : 'ghost'}
            onClick={() => setActiveTab('products')}
          >
            <Package className="mr-2 h-4 w-4" />
            Products
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'luxury' : 'ghost'}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Orders
          </Button>
        </div>

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Products</h2>
              <Button
                variant="luxury"
                onClick={() => setShowProductForm(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>

            {showProductForm && (
              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                          id="name"
                          value={productForm.name}
                          onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                          className="luxury-input"
                          placeholder="Enter product name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price">Price *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                          className="luxury-input"
                          placeholder="Enter price"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity *</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={productForm.quantity}
                          onChange={(e) => setProductForm(prev => ({ ...prev, quantity: e.target.value }))}
                          className="luxury-input"
                          placeholder="Enter quantity"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={productForm.description}
                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                        className="luxury-input"
                        placeholder="Enter product description"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={productForm.tags}
                        onChange={(e) => setProductForm(prev => ({ ...prev, tags: e.target.value }))}
                        className="luxury-input"
                        placeholder="e.g., necklace, gold, diamond"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Product Images</Label>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files)}
                            className="hidden"
                            id="image-upload"
                            disabled={uploadingImages}
                          />
                          <Button
                            type="button"
                            variant="luxuryOutline"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            className="w-full"
                            disabled={uploadingImages}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {uploadingImages ? 'Uploading...' : 'Upload Images'}
                          </Button>
                        </div>

                        {productForm.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {productForm.images.map((imageUrl, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={imageUrl}
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={productForm.featured}
                        onChange={(e) => setProductForm(prev => ({ ...prev, featured: e.target.checked }))}
                        className="rounded border-border"
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>

                    <div className="flex space-x-4">
                      <Button type="submit" variant="luxury">
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </Button>
                      <Button type="button" variant="ghost" onClick={resetProductForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="luxury-card">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-playfair font-semibold">{product.name}</h3>
                        {product.featured && (
                          <Badge className="bg-primary">Featured</Badge>
                        )}
                      </div>
                      
                      <p className="text-xl font-bold gold-text">
                        PKR {product.price.toLocaleString()}
                      </p>
                      
                      <p className="text-sm text-muted-foreground">
                        Qty: {product.quantity}
                      </p>
                      
                      {product.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      
                      {product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {product.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="luxuryOutline"
                          size="sm"
                          onClick={() => startEditingProduct(product)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Orders</h2>
            
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="luxury-card">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <h3 className="font-semibold">{order.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{order.phone_number}</p>
                        <div className="text-sm text-muted-foreground">
                          <p>{order.shipping_address}</p>
                          {order.city && (
                            <p>{order.city}, {order.state} {order.postal_code}</p>
                          )}
                          {order.country && <p>{order.country}</p>}
                        </div>
                      </div>
                      
                       <div>
                         <p className="font-bold gold-text">
                           PKR {order.total_amount.toLocaleString()}
                         </p>
                         <Collapsible>
                           <CollapsibleTrigger asChild>
                             <Button variant="ghost" size="sm" className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground">
                               {order.product_ids.length} item{order.product_ids.length !== 1 ? 's' : ''} <ChevronDown className="ml-1 h-3 w-3" />
                             </Button>
                           </CollapsibleTrigger>
                           <CollapsibleContent className="mt-2">
                             <div className="space-y-2 max-w-sm">
                               {order.products.map((product) => (
                                 <div key={product.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                                   {product.images && product.images.length > 0 && (
                                     <img
                                       src={product.images[0]}
                                       alt={product.name}
                                       className="w-10 h-10 object-cover rounded"
                                     />
                                   )}
                                   <div className="flex-1 min-w-0">
                                     <p className="text-xs font-medium truncate">{product.name}</p>
                                     <p className="text-xs text-muted-foreground">PKR {product.price.toLocaleString()}</p>
                                   </div>
                                 </div>
                               ))}
                               {order.products.length === 0 && (
                                 <p className="text-xs text-muted-foreground">Products not found</p>
                               )}
                             </div>
                           </CollapsibleContent>
                         </Collapsible>
                       </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <Select
                          value={order.status}
                          onValueChange={(value: string) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Processing">Processing</SelectItem>
                            <SelectItem value="Shipped">Shipped</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Badge
                          variant={
                            order.status === 'Delivered' ? 'default' :
                            order.status === 'Shipped' ? 'secondary' :
                            order.status === 'Cancelled' ? 'destructive' :
                            'outline'
                          }
                        >
                          {order.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {orders.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No orders found.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}