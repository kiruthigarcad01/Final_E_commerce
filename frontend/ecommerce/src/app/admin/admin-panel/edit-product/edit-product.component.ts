import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductServiceService } from '../../../service/product-service.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  @Input() productId: string = '';
  @Output() closeModal = new EventEmitter<void>();
  
  editProductForm: FormGroup;
  loading: boolean = false;
  // selectedFile: File | null = null;
  // base64Img: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductServiceService
  ) {
    this.editProductForm = this.fb.group({
      images: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      ratings: ['', [Validators.min(0), Validators.max(5)]],
      seller: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    if (this.productId) {
      this.loadProductData();
    }
  }

  loadProductData() {
    this.productService.getSingleProduct(this.productId).subscribe(
      (product: any) => {
        if (product) {
          this.editProductForm.patchValue({
            imageUrl: product.images,
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            ratings: product.ratings,
            seller: product.seller,
            stock: product.stock,
          });
        }
      },
      (error) => console.error('Failed to fetch product:', error)
    );
  }

  // async onFileSelected(event: Event) {
  //   const fileInput = event.target as HTMLInputElement;

  //   if (fileInput.files && fileInput.files.length > 0) {
  //     const file = fileInput.files[0];
  //     this.selectedFile = file;

  //     if (file) {
  //       await this.convertFileToBase64(file).then(base64String => {
  //         this.base64Img = base64String;
  //         this.editProductForm.patchValue({ image: base64String });
  //       });
  //     }
  //   }
  // }

  // convertFileToBase64(file: File): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const base64String = (reader.result as string).split(',')[1];
  //       resolve(base64String);
  //     };
  //     reader.onerror = reject;
  //     reader.readAsDataURL(file);
  //   });
  // }


  onSubmit() {
    if (this.editProductForm.valid) {
      // Update product details via the service
      this.productService.updateProduct(this.productId, this.editProductForm.value)
        .subscribe(
          () => {
            // Emit close event to close the modal
            this.closeModal.emit();
          },
          error => {
            console.error('Error updating product:', error);
          }
        );
    }
  }


  onClose() {
    this.closeModal.emit();
  }
}
