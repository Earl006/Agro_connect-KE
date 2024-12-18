import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from "../global/topbar/topbar.component";
import { FooterComponent } from "../global/footer/footer.component";
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { Product, Category, Farmer } from '../../models/responses';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TopbarComponent, FooterComponent, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  currentSlide = 0;
  slideInterval: any

  slides = [
    { 
      image: 'bg2.jpg',
      title: 'Fresh Harvest Daily', 
      text: 'Locally sourced vegetables and produce straight from the farm'
    },
    { 
      image: 'bg1.jpg',
      title: 'Supporting Local Farmers', 
      text: 'Connect directly with Kenyan farmers for the best agricultural products'
    },
    { 
      image: 'bg3.jpg',
      title: 'Quality Livestock Products', 
      text: 'Premium dairy and livestock products from certified farmers'
    }
  ];
  products: Product[] = [];
  farmers: Farmer[] = [];
  categories: Category[] = [];
  searchQuery: string = '';
  selectedFarmer: string = '';
  selectedCategory: string = '';
  showCartNotification = false;
  notificationMessage = '';

  constructor(
    public authService: AuthService,
    private productService: ProductService,
    private userService: UserService,
    private router: Router,
    private categoryService: CategoryService,
    private cartService: CartService  // Add CartService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.startSlideShow();
    this.loadCategories();
    this.loadFarmers();
  }

  loadProducts() {
    this.productService.getAllProducts(0, 3).subscribe({
      next: (response) => {
        this.products = response.produce;
      },
      error: (error) => console.error('Error loading products:', error)
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadFarmers() {
    this.userService.getAllFarmers().subscribe(
      (data: any) => {
        this.farmers = data;
      },
      error => console.error('Error loading farmers:', error)
    );
  }

  onSearch() {
    this.productService.searchProducts(
      this.searchQuery,
      this.selectedFarmer,
      this.selectedCategory
    ).subscribe({
      next: (response) => {
        this.products = response.produce;
      },
      error: (error) => console.error('Error searching products:', error)
    });
  }

  onFarmerChange() {
    this.onSearch();
  }

  onCategoryChange() {
    this.onSearch();
  }

  startSlideShow() {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 7000);
  }
  setCurrentSlide(index: number) {
    this.currentSlide = index;
    // Reset interval when manually changing slides
    clearInterval(this.slideInterval);
    this.startSlideShow();
  }
  // home.component.ts
orderNow(product: any, event: Event) {
  event.stopPropagation(); // Prevent event bubbling
  
  if (!this.authService.isLoggedIn()) {
    this.router.navigate(['/login']);
    return;
  }

  // Navigate to order with product ID and default quantity
  this.router.navigate(['/order'], {
    queryParams: {
      productId: product.id,
      quantity: 1
    }
  });
}

viewProduct(productId: string) {
  this.router.navigate(['/product', productId]);
}

navigateToCart() {
  if (!this.authService.isLoggedIn()) {
    this.router.navigate(['/login']);
    return;
  }
  this.router.navigate(['/cart']);
}

addToCart(product: any, event: Event) {
  event.stopPropagation(); // Prevent navigation when clicking cart button
  
  // if (!this.authService.isLoggedIn()) {
  //   this.router.navigate(['/login']);
  //   return;
  // }

  this.cartService.addToCart(product.id);
  
  // Show notification
  this.notificationMessage = 'Added to cart!';
  this.showCartNotification = true;
  setTimeout(() => {
    this.showCartNotification = false;
  }, 3000);
}
isProductInCart(productId: string): boolean {
  return this.cartService.isProductInCart(productId);
}
}

