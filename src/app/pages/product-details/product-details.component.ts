import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from "../../services";
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product'

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent {
  isLoading = true;
  product: Product | undefined;

  constructor(private route: ActivatedRoute, private productsService: ProductsService) { }

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id') || '';
    this.productsService.getProductById(productId).subscribe((data: any) => {
      this.product = data.product;
      this.isLoading = false;
    });
  }

  updateProduct() {
    if (this.product) {
      console.log(`Navigating to update product page. Product id: ${this.product.id}`);
    }
  }

  deleteProduct() {
    if (this.product) {
      console.log(`Removing product: ${this.product.id}`);
    }
  }
}
