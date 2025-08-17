import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-primary-glow"></div>
              <span className="font-playfair text-xl font-bold gold-text">
                LuxeJewels
              </span>
            </div>
            <p className="text-muted-foreground">
              Exquisite jewelry crafted with passion and precision. Discover timeless elegance in every piece.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg font-semibold gold-text">Shop</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/?category=necklaces" className="hover:text-primary transition-colors">Necklaces</Link></li>
              <li><Link to="/?category=rings" className="hover:text-primary transition-colors">Rings</Link></li>
              <li><Link to="/?category=earrings" className="hover:text-primary transition-colors">Earrings</Link></li>
              <li><Link to="/?category=bracelets" className="hover:text-primary transition-colors">Bracelets</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg font-semibold gold-text">Customer Care</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors">Size Guide</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Care Instructions</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg font-semibold gold-text">About</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Craftsmanship</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Sustainability</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 LuxeJewels. All rights reserved. Crafted with luxury in mind.</p>
        </div>
      </div>
    </footer>
  );
}