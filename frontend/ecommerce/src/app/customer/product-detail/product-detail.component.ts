import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductServiceService } from '../../service/product-service.service';
import { CartService } from '../../service/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: any = null
  qty:number = 1
  searchText:string = ''
  cartCount = 0;

  constructor (
    private route: ActivatedRoute, 
    private apiService: ProductServiceService,
    private cartService: CartService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id']
      console.log('Product ID:', id)
      this.apiService.getSingleProduct(id).subscribe(
        (data:any) => {
          this.product = data.product
        }
      )
    })

    this.cartService.currentItems.subscribe(
      (data:any) => {
        this.cartCount = data.length
      }
    )
  }

  increaseQty() {
    if(this.qty == this.product.stock) {
      this.toastr.error('Cannot add item due to Out of Stock', 'MiniEcommerce', {
        positionClass: "toast-top-center"
      })
      return;
    }
    this.qty += 1
  }

  decreaseQty() {
    if(this.qty == 1) {
      return;
    }
    this.qty -= 1
  }

  addToCart() {
    const newCartItem = {
      product: this.product,
      qty: this.qty
    }

    if(this.product.stock == 0) {
      this.toastr.error('Cannot add item due to Out of Stock', 'MiniEcommerce', {
        positionClass: "toast-top-center"
      })
      return
    }

    this.cartService.addItem(newCartItem)
    this.toastr.success('Cart Item Added', 'MiniEcommerce', {
      positionClass: "toast-top-center"
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
