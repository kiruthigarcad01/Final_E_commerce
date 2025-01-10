import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../../../service/product-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  showAddProductForm = false;
  showEditProductForm = false;
  selectedProductId: string = '';

  constructor(private productService: ProductServiceService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts();
    this.productService.currentProducts.subscribe(
      (data: any) => {
        this.products = data.products;
        // const products = `http://localhost:5000/${data.products.image}`;
        console.log('Products:', this.products);
        
      }
    );
  }

  deleteProduct(id: string) {
    if (id) {
      if (confirm('Are you sure you want to delete this product?')) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            alert('Product deleted successfully');
            this.loadProducts(); // Refresh the product list
          },
          error: (err) => {
            console.error('Error deleting product:', err);
            alert('Failed to delete product. Please try again.');
          }
        });
      }
    } else {
      alert('Invalid product ID. Unable to delete.');
    }
  }

  openAddProductForm() {
    this.showAddProductForm = true;
  }

  closeAddProductForm() {
    this.showAddProductForm = false;
    this.loadProducts(); // Refresh the product list
  }

  openEditProductForm(id: string) {
    this.selectedProductId = id;
    this.showEditProductForm = true;
  }

  closeEditProductForm() {
    this.showEditProductForm = false;
    this.selectedProductId = '';
    this.loadProducts(); // Refresh the product list
  }

  editProduct(id: string) {
    if (id) {
      this.openEditProductForm(id);
    } else {
      console.error('Invalid product ID.');
    }
  }

  navigateToAddProduct() {
    this.router.navigate(['/admin/add-product']);
  }

  logout() {
    // Implement your logout logic here
    console.log('Logout clicked');
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Phones': '#2196F3',
      'Laptops': '#4CAF50',
      'Accessories': '#FF9800',
      'Audio': '#9C27B0'
    };
    return colors[category] || '#757575';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  }
}

