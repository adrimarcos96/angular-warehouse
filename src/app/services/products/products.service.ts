import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { serverUrls } from "../../config/httpConfig";
import { Product } from "../../models/product";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  productsData: any = {
    page: 0,
    pages: [],
    productsToShow: 0,
    total: 0
  }

  private productsDataUpdated = new Subject<{ pages: any; categoriesToShow: number; page: number; total: number; }>();

  constructor(private http: HttpClient) { }

  getProductsByPages(page: number, pageSize: number) {
    const requestBody = {
      pageNo: page,
      pageSize: pageSize,
      filters: [{ Alias: "IsActive", Value: "True"}]
    };

    this.http.post(serverUrls.searchProducts, requestBody)
      .pipe(
        map((response: any) => {
          return {
            page: response.pageNo,
            pageSize: response.pageSize,
            success: response.success,
            products: response.items.map((product: Product) => {
                return {
                  id: product.id,
                  code: product.code,
                  name: product.name,
                  description: product.description,
                  image: product.image || 'assets/images/no-image.png'
                };
              }
            ),
            productsToShow: response.items.length,
            total: response.total
          };
        })
      )
      .subscribe((transformedResponse: any) => {
        this.productsData = {
          page: transformedResponse.page,
          productsToShow: transformedResponse.productsToShow,
          total: transformedResponse.total,
          pages: [...this.productsData.pages, transformedResponse.products]
        }
        this.productsDataUpdated.next(this.productsData)
      });
  }

  getProductsDataUpdadateListener() {
    return this.productsDataUpdated.asObservable();
  }
}
