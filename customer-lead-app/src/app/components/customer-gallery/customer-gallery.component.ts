import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-gallery.component.html',
  styleUrls: ['./customer-gallery.component.css']
})
export class CustomerGalleryComponent {
  customerId: string = '';
  images: any[] = [];
  selectedFile?: File;
  selectedFiles: File[] = [];
  currentImageIndex = 0;
  customer: any = null;
  previewUrls: string[] = [];

  constructor(private service: CustomerService) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onFilesSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    this.previewUrls = [];
    for (const file of this.selectedFiles) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }


  upload() {
    if (!this.selectedFiles.length) return;

    const fileReaders = this.selectedFiles.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders).then(base64Images => {
      this.service.uploadImages(this.customerId, base64Images).subscribe({
        next: imgs => {
          this.images = imgs;
          this.currentImageIndex = 0;
          this.selectedFiles = [];
          this.previewUrls = []; // <-- Clear previews after upload
        },
        error: err => alert(err.error)
      });
    });
  }

  loadImages() {
    this.previewUrls = [];
    this.selectedFiles = [];
    this.service.getCustomer(this.customerId).subscribe({
      next: customer => {
        this.customer = customer;
        this.service.getImages(this.customerId).subscribe({
          next: imgs => {
            this.images = imgs;
            this.currentImageIndex = 0;
          },
          error: err => {
            this.images = [];
            this.currentImageIndex = 0;
          }
        });
      },
      error: err => {
        this.customer = null;
        this.images = [];
        this.currentImageIndex = 0;
      }
    });
  }

  prevImage() {
    if (this.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    }
  }

  nextImage() {
    if (this.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }
  }

  removePreview(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  deleteImage() {
    if (!this.customerId || !this.images.length) return;
    const image = this.images[this.currentImageIndex];
    if (!image?.id) return;

    if (confirm('Are you sure you want to delete this image?')) {
      this.service.deleteImage(this.customerId, image.id).subscribe({
        next: imgs => {
          this.images = imgs;
          if (this.currentImageIndex >= this.images.length) {
            this.currentImageIndex = Math.max(0, this.images.length - 1);
          }
        },
        error: err => alert('Failed to delete image.')
      });
    }
  }
}
