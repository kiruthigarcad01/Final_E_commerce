import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../../../service/product-service.service';

interface Order {
  _id: string;
  product: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  statusOptions: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered'];

  constructor(private apiService: ProductServiceService) {}

  ngOnInit(): void {
    this.apiService.getOrders();
    this.apiService.currentOrders.subscribe(
      (data:any) => {
        this.orders = data.orders
        // console.log('Orders:', this.orders);
        
      }
    )
  }

  updateOrderStatus(orderId: string, newStatus: Order['status']): void {
    this.apiService.updateOrderStatus(orderId, newStatus).subscribe((response: any) => {
      const order = this.orders.find((o) => o.id === orderId);
      if (order) {
        order.status = newStatus;
      }
    });
  }

  getStatusColor(status: Order['status']): string {
    const colors = {
      pending: '#ff9800',
      processing: '#2196F3',
      shipped: '#9C27B0',
      delivered: '#4CAF50',
    };
    return colors[status];
  }

  getStatusIcon(status: Order['status']): string {
    const icons = {
      pending: 'hourglass_empty',
      processing: 'sync',
      shipped: 'local_shipping',
      delivered: 'check_circle'
    };
    return icons[status];
  }

  formatAmount(amount: number): string {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}
