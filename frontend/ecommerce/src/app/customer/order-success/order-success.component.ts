import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductServiceService } from '../../service/product-service.service';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.css'
})
export class OrderSuccessComponent implements OnInit {
  orderId = ''
  searchText:string = ''
  cartCount = 0;
  constructor (
    private route: ActivatedRoute,
    private apiService:ProductServiceService,
    private cartService: CartService
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((data:any) => {
      this.orderId = data['id']
    })

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
