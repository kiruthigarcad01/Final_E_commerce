import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }
  itemsSource = new BehaviorSubject([]);
  currentItems = this.itemsSource.asObservable()
  cartItems:any = [];

  addItem(newCartItem:any) {
    const previousCartItem = this.cartItems.find((el:any) => el.product.id == newCartItem.product.id)
    if(previousCartItem) {
      this.cartItems = this.cartItems.map((item:any) => {
        if(item.product.id == previousCartItem.product.id) {
          item.qty = item.qty + 1
        }
        return item
      })

    } else {
      this.cartItems.push(newCartItem)
    }
     this.itemsSource.next(this.cartItems)
  }

  updateItems(items: []) {
    this.cartItems = items
    this.itemsSource.next(this.cartItems)
  }
}
