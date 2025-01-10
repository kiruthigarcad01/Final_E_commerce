import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent implements OnInit {
  customers: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.userService.getCustomerData().subscribe(
      (data: any) => {
        this.customers = data.customers
        console.log('Customers:', this.customers);
      }
    );
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  }

  // getFormattedDate(date: Date): string {
  //   return date.toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric'
  //   });
  // }

}
