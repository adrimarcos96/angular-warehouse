import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { serverUrls } from "../../config/httpConfig";

import { Category } from "../../models/category";
import { Product } from "../../models/product";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  categoryDetails: any = {
    success: true,
    category: null,
    itemsPage: 0,
    totalItems: 0
  }

  private categoryDetailsUpdated = new Subject<{ success: boolean; category: Category|null; itemsPage: number; totalItems: number; }>();

  categoriesData: any = {
    page: 0,
    pages: [],
    categoriesToShow: 0,
    total: 0
  }

  private categoriesDataUpdated = new Subject<{ pages: any; categoriesToShow: number; page: number; total: number; }>();

  constructor(private http: HttpClient) { }

  getCategoriesByPages(page: number, pageSize: number) {
    const requestBody = {
      pageNo: page,
      pageSize: pageSize,
      filters: [{ Alias: "IsActive", Value: "True"}]
    };

    this.http.post(serverUrls.searchCategories, requestBody)
      .pipe(
        map((response: any) => {
          return {
            page: response.pageNo,
            pageSize: response.pageSize,
            success: response.success,
            categories: response.items.map((category: Category) => {
                return {
                  id: category.id,
                  name: category.name,
                  description: category.description,
                  image: category.image || 'assets/images/no-image.png'
                };
              }
            ),
            categoriesToShow: response.items.length,
            total: response.total
          };
        })
      )
      .subscribe((transformedResponse: any) => {
        let pages = []
        if (this.categoriesData.pages.length > 0 && transformedResponse.page === this.categoriesData.page) {
          pages = this.categoriesData.pages.map((page: any, index: number) => {
            if (index === transformedResponse.page) {
              return transformedResponse.categories;
            }

            return page;
          });
        } else {
          pages = [...this.categoriesData.pages, transformedResponse.categories];
        }

        this.categoriesData = {
          pages: pages,
          categoriesToShow: transformedResponse.categoriesToShow,
          page: transformedResponse.page,
          total: transformedResponse.total
        }
        this.categoriesDataUpdated.next(this.categoriesData)
      });
  }

  getCategoriesDataUpdadateListener() {
    return this.categoriesDataUpdated.asObservable();
  }

  getCategoryById(categoryId: string, itemsPageSize: number) {
    this.http.post(`${serverUrls.getCategoryDetails}/${categoryId}`, {})
      .pipe(
        switchMap((response: any) => {
          return this.http.post(
            serverUrls.searchProducts,
            {
              pageNo: 0,
              pageSize: itemsPageSize,
              filters: [
                { Alias: "IsActive", Value: "True"},
                { Alias: "CategoryName", Value: response.data.name}
              ]
            })
          .pipe(
            map((itemsResponse: any) => {
              return {
                success: itemsResponse.success,
                page: itemsResponse.pageNo,
                totalProducts: itemsResponse.total,
                productsToShow: itemsResponse.items ? itemsResponse.items.length : 0,
                category: {
                  id: response.data.id,
                  name: response.data.name,
                  description: response.data.description,
                  products: itemsResponse.items.map((product: Product) => {
                    return {
                      ...product,
                      image: product.image || 'assets/images/no-image.png'
                    }
                  })
                }
              };
            })
          )
        })
      )
      .subscribe((transformedCategoryDetails: any) => {
        this.categoryDetails = {
          success: transformedCategoryDetails.success,
          category: transformedCategoryDetails.category,
          itemsPage: transformedCategoryDetails.page,
          totalProducts: transformedCategoryDetails.totalProducts,
          productsToShow: transformedCategoryDetails.productsToShow
        }
        this.categoryDetailsUpdated.next(this.categoryDetails)
      });
  }

  getCategoryDetailsUpdadateListener() {
    return this.categoryDetailsUpdated.asObservable();
  }
}
