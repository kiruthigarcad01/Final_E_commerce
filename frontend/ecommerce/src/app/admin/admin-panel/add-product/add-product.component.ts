import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductServiceService } from '../../../service/product-service.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  @Output() closeModal = new EventEmitter<void>();
  
  productForm: FormGroup;
  // selectedFile: File | null = null;
  // fileName: string = '';
  // base64Img: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductServiceService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      ratings: ['', Validators.required],
      images: ['', Validators.required],
      category: ['', Validators.required],
      seller: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
    });
  }

  // async onFileSelected(event: Event) {
  //   const fileInput = event.target as HTMLInputElement;

  //   if (fileInput.files && fileInput.files.length > 0) {
  //     const file = fileInput.files[0];
  //     this.fileName = file.name;

  //     if (file) {
  //       await this.convertFileToBase64(file).then((base64String) => {
  //         this.base64Img = base64String;
  //         this.productForm.patchValue({ image: this.base64Img });
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
    if (this.productForm.valid) {
      this.productService.createProduct(this.productForm.value).subscribe(
        () => {
          this.closeModal.emit();
        },
        error => {
          console.error('Error creating product:', error);
        }
      );
    }
  }

  onClose() {
    this.closeModal.emit();
  }
}
