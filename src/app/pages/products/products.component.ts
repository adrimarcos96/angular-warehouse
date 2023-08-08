import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ItemsListComponent } from '../../components/items-list/items-list.component';
import { ProductsService } from "../../services";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, ItemsListComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  currentPage = 0;
  pageSize = 5;
  productsToShow = 0;
  total = 0;

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.productsService.getProducts(0, this.pageSize);
    this.productsService.getProductsDataUpdadateListener().subscribe((data: any) => {
      this.productsToShow = data.productsToShow;
      this.total = data.total;
    })
  }
}
