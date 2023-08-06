import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { serverUrls } from "../../config/httpConfig";

import { Category } from "../../models/category";
import { categories } from "../../mock/categories";
import { items } from "../../mock/items";

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
    page: 1,
    pages: [],
    categoriesToShow: 0,
    total: 0
  }

  private categoriesDataUpdated = new Subject<{ pages: any; categoriesToShow: number; page: number; total: number; }>();

  constructor(private http: HttpClient) {}

  getCategoriesByPages(page: number, pageSize: number) {
    // const finish = startIndex + pageSize > categories.length ? categories.length : startIndex + pageSize;
    const requestBody = {
      pageNo: page,
      pageSize: pageSize,
      filters: [{ Alias: "IsActive", Value: "True"}]
    };
    this.http.post<{ success: boolean; message: string; items: any; pageSize: number; pageNo: number; total: number; }>(serverUrls.searchCategories, requestBody)
      .pipe(
        map(response => {
          return {
            page: response.pageNo,
            pageSize: response.pageSize,
            success: response.success,
            categories: response.items.map((category:any) => {
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
        this.categoriesData = {
          pages: [...this.categoriesData.pages, transformedResponse.categories],
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
                totalItems: itemsResponse.total,
                category: {
                  id: response.data.id,
                  name: response.data.name,
                  description: response.data.description,
                  items: itemsResponse.items.map((item: any) => {
                    return {
                      ...item,
                      image: item.image || 'assets/images/no-image.png'
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
          totalItems: transformedCategoryDetails.totalItems
        }
        this.categoryDetailsUpdated.next(this.categoryDetails)
      });

    // const category: Category | undefined = categories.find(cat => cat.id === categoryId);
    // if (category) {
    //   const itemsFetched = items.filter(item => item.category === category.id)
    //   const finish = startIndex + itemsSize > itemsFetched.length ? itemsFetched.length : startIndex + itemsSize;
    //   category.items = itemsFetched.slice(startIndex, finish)
    // }

    // this.category = category;
    // return { category: this.category, totalItems: 92 };
  }

  getCategoryDetailsUpdadateListener() {
    return this.categoryDetailsUpdated.asObservable();
  }
}
