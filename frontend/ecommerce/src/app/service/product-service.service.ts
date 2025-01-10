import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject} from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  constructor(private http: HttpClient) { }

  productsSource = new BehaviorSubject([])
  orderSource = new BehaviorSubject([])
  currentProducts = this.productsSource.asObservable();
  currentOrders = this.orderSource.asObservable();
  productsTmp = []
  orderTmp = []

  getProducts() {
     this.http.get(environment.apiUrl + '/api/v1/getproducts').subscribe(
      (data:any) => {
        this.productsSource.next(data)
        this.productsTmp = data
      },
      (error) => console.error('Failed to fetch products:', error)
     )
  }

  searchProducts(searchText: string) {
    this.http.get(environment.apiUrl + '/api/v1/products', {
       params: {keyword: searchText}
    }).subscribe(
      (data:any) => {
        this.productsSource.next(data)
      },
      (error) => console.error('Failed to search products:', error)
     )
  }

  clearSearch(searchText: string) {
    if(searchText == '') {
      this.productsSource.next(this.productsTmp)
    }
  }

  getSingleProduct(id:string) {
    return this.http.get(environment.apiUrl + '/api/v1/product/'+ id)
 }

 createProduct(productData: any) {
  return this.http.post(environment.apiUrl + '/api/v1/productsCreate', productData);
}

updateProduct(id: string, updatedProductData: any) {
  return this.http.put(
    environment.apiUrl + '/api/v1/productUpdate/' + id,
    updatedProductData
  );
}

deleteProduct(id: string) {
  return this.http.delete(`${environment.apiUrl}/api/v1/productDelete/${id}`);
}

 orderCreate(order: any) {
     return this.http.post(environment.apiUrl+ '/api/v1/order', order)
 }

  getOrders() {
    this.http.get(environment.apiUrl + '/api/v1/orders').subscribe(
      (data:any) => {
        this.orderSource.next(data)
        this.orderTmp = data
      },
      (error) => console.error('Failed to fetch orders:', error)
    )
  }

  updateOrderStatus(id: string, status: string) {
    return this.http.put(environment.apiUrl + '/api/v1/orderUpdate/' + id, {status});
  }
}
