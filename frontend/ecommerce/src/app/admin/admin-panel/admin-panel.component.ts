import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductServiceService } from '../../service/product-service.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {
  productsCount:any = 0
  ordersCount:any = 0
  customersCount:any = 0

  constructor(private router: Router, private apiService: ProductServiceService, private userService: UserService) {}

  products:any[] = [];

  recentOrders:any = [];

  ngOnInit(): void {
    this.apiService.getProducts();
    this.apiService.getOrders();

    this.userService.getCustomerData().subscribe(
      (data:any) => {
        this.customersCount = data.customers.length
      }
    )
    
    this.apiService.currentProducts.subscribe(
      (data:any) => {
        this.productsCount = data.products.length
        // console.log('Products:', this.products);
      }
    )

    this.apiService.currentOrders.subscribe(
      (data:any) => {
        this.ordersCount = data.orders.length
        // console.log('Orders:', this.recentOrders);
      } 
    )

    this.apiService.currentProducts.subscribe(
      (data:any) => {
        this.products = data.products
      }
    )

    this.apiService.currentOrders.subscribe(
      (data:any) => {
        this.recentOrders = data.orders
        console.log('Orders:', this.recentOrders);
        
      }
    )
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
