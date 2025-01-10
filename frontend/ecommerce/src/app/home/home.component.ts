import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductServiceService } from '../service/product-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredProducts = [
    {
      name: 'iPhone 13 Pro',
      category: 'Mobile Phones',
      image: 'assets/images/iphone-13-pro.jpg'
    },
    {
      name: 'MacBook Air M2',
      category: 'Laptops',
      image: 'assets/images/macbook-air-m2.jpg'
    },
    {
      name: 'Apple Watch Series 7',
      category: 'Watches',
      image: 'assets/images/apple-watch-7.jpg'
    },
    {
      name: 'AirPods Pro',
      category: 'Headsets',
      image: 'assets/images/airpods-pro.jpg'
    }
  ];

  categories = [
    { name: 'Mobile Phones', icon: 'smartphone' },
    { name: 'Laptops', icon: 'laptop' },
    { name: 'Watches', icon: 'watch' },
    { name: 'Headsets', icon: 'headset' }
  ];

  products:any[] = [];

  ngOnInit(): void {
    this.apiService.getProducts();
    
    this.apiService.currentProducts.subscribe(
      (data:any) => {
        this.products = data.products
        // console.log('Products:', this.products);
        
      }
    )

  }

  constructor(private router: Router, private apiService: ProductServiceService) {}

  onSubscribe(email: string) {
    console.log('Subscribing email:', email);
  }

  viewProductDetails(productName: string) {
    this.router.navigate(['/product', productName.toLowerCase().replace(' ', '-')]);
  }
}

