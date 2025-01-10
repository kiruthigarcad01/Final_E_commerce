import { Component, OnInit } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { ProductServiceService } from '../../service/product-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
    cartItems:any = []
    searchText:string = ''
    cartCount = 0
  subTotal = 0
  estTotal = 0

  constructor(
    private cartService:CartService, 
    private apiService: ProductServiceService,
    private router: Router,
    private toastr: ToastrService,
  ) {

  }
  
  ngOnInit(): void {
    this.cartService.currentItems.subscribe(
      (data:any) => {
        this.cartItems = data
      }
    )

    this.cartService.currentItems.subscribe(
      (data:any) => {
        this.cartCount = data.length
      }
    )
    this.calculateCartItems()
  }

  deleteItem(product_id:string) {
    const prevItem:any = this.cartItems.find((item:any) => item.product.id == product_id)
    if (prevItem) {
      const filteredItems = this.cartItems.filter((item:any) => item.product.id !== product_id)
      // this.cartItems = filteredItems;
      this.cartService.updateItems(filteredItems)
    }
    this.calculateCartItems()
  }

  calculateCartItems() {
    this.cartCount = this.cartItems.length
    this.subTotal = this.cartItems.reduce((acc:any,current:any) => {
      return acc + current.qty
    }, 0)

    this.estTotal = this.cartItems.reduce((acc:any,current:any) => {
       const price = parseFloat(current.product.price.replace(/,/g, ''));
       return acc + (price * current.qty)
    }, 0)
  }  

  decreaseQty(product_id:string) {
      const previousCartItem:any = this.cartItems.find((item:any) => item.product.id == product_id)
      let qty = previousCartItem.qty
      if(qty == 1)
        return
      qty = qty - 1
      if(previousCartItem) {
        this.cartItems = this.cartItems.map((item:any) => {
          if(item.product.id == previousCartItem.product.id) {
            item.qty = qty
          }
          return item
        })
      } 
      this.cartService.updateItems(this.cartItems)
      this.calculateCartItems()
  }

  increaseQty(product_id:string) {
    const previousCartItem:any = this.cartItems.find((item:any) => item.product.id == product_id)
    let qty = previousCartItem.qty
    const price = parseFloat(previousCartItem.product.price.replace(/,/g, ''));
    if(qty == previousCartItem.product.stock) {
      this.toastr.error('Cannot increase qty!', 'MiniEcommerce', {
        positionClass: "toast-top-center"
      })
      return
    }
    qty = qty + 1
    if(previousCartItem) {
      this.cartItems = this.cartItems.map((item:any) => {
        if(item.product.id == previousCartItem.product.id) {
          item.qty = qty
        }
        return item
      })
    }
    this.cartService.updateItems(this.cartItems)
    this.calculateCartItems()
  }

  orderComplete() {
    const order = this.cartItems
    this.apiService.orderCreate(order).subscribe((data:any) => {
      if(data.success == true) {
        const orderId = data.order.id
        this.router.navigate(['order', 'success', orderId])
        this.cartService.updateItems([])
      }
    })
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
