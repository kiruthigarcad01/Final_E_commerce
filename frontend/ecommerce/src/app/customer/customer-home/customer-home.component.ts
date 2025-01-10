import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../../service/product-service.service';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './customer-home.component.html',
  styleUrl: './customer-home.component.css'
})
export class customerHomeComponent implements OnInit {
    products:any = [];
    searchText:string = ''
    cartCount = 0;
    
    constructor(private apiService:ProductServiceService,
                private cartService: CartService
    ) {}

    ngOnInit(): void {
      this.apiService.getProducts();
      
      this.apiService.currentProducts.subscribe(
        (data:any) => {
          this.products = data.products
          
        }
      )

      this.cartService.currentItems.subscribe(
        (data:any) => {
          this.cartCount = data.length
        }
      )
    }

    search() {
      this.apiService.searchProducts(this.searchText);
    }
  
    clearSearch() {
      this.apiService.clearSearch(this.searchText);
    }
  
    searchByEnterKey() {
      this.search()
    }
}
