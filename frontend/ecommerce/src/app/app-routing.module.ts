import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { customerHomeComponent } from './customer/customer-home/customer-home.component';
import { ProductDetailComponent } from './customer/product-detail/product-detail.component';
import { CartComponent } from './customer/cart/cart.component';
import { OrderSuccessComponent } from './customer/order-success/order-success.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { ProductListComponent } from './admin/admin-panel/product-list/product-list.component';
import { AddProductComponent } from './admin/admin-panel/add-product/add-product.component';
import { HomeComponent } from './home/home.component';
import { OrderComponent } from './admin/admin-panel/order/order.component';
import { CustomerDetailsComponent } from './admin/admin-panel/customer-details/customer-details.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'customerHome', component: customerHomeComponent},
  {path: 'product/:id', component: ProductDetailComponent},
  {path: 'cart', component: CartComponent},
  {path: 'order/success/:id', component: OrderSuccessComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'login', component: LoginComponent},
  { path: 'admin', component: AdminPanelComponent},
  { path: 'admin/products', component: ProductListComponent },
  { path: 'admin/add-product', component: AddProductComponent },
  {path: 'admin/orders', component: OrderComponent},
  {path: 'admin/customers', component: CustomerDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
