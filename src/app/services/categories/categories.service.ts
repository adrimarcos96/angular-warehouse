import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { http, serverUrls } from "../../config/httpConfig";

import { Category } from "../../models/category";
import { Product } from "../../models/product";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  categoriesData: any = {
    error: false,
    page: 0,
    pages: [],
    categoriesToShow: 0,
    total: 0
  }
  categoryDetails: any = {
    error: false,
    category: null,
    productsPage: 0,
    totalProducts: 0,
    productsToShow: 0
  }

  private categoriesDataUpdated = new BehaviorSubject<{ error: boolean, pages: any; categoriesToShow: number; page: number; total: number }>({
    error: false,
    pages: [],
    categoriesToShow: 0,
    page: 0,
    total: 0
  });
  private categoryDetailsUpdated = new BehaviorSubject<{ error: boolean; category: Category|null; productsPage: number; totalProducts: number; productsToShow: number }>({
    error: false,
    category: null,
    productsPage: 0,
    totalProducts: 0,
    productsToShow: 0
  });

  constructor() { }

  async getCategories(page: number, pageSize: number) {
    const requestBody = {
      pageNo: page,
      pageSize: pageSize,
      filters: [{ Alias: "IsActive", Value: "True"}]
    };

    try {
      const { data: categoryResponse } = await http.post(serverUrls.searchCategories, requestBody);

      if (categoryResponse.success) {
        const categories: Category[] = this.mapCategoriesData(categoryResponse.items);

        if (categories.length > 0) {
          const page = categoryResponse.pageNo;
          const total = categoryResponse.total;
          const { pages, categoriesToShow } = this.getCategoriesByPages(page, categories);

          this.categoriesData = {
            error: false,
            pages,
            categoriesToShow,
            page,
            total
          };
          this.categoriesDataUpdated.next(this.categoriesData);
        }
      } else {
        console.error('Error getting categories');
        this.categoriesDataUpdated.next({ ...this.categoriesData, error: true });
      }
    } catch (error) {
      console.error('Error getting categories', requestBody, error);
      this.categoriesDataUpdated.next({ ...this.categoriesData, error: true });
    }
  }

  async getCategoryById(categoryId: string, itemsPageSize: number) {
    try {
      const  { data: categoryResponse } = await http.post(`${serverUrls.getCategoryDetails}/${categoryId}`, {});

      if (categoryResponse.success) {
        const category: Category = {
          id: categoryResponse.data.id,
          name: categoryResponse.data.name,
          description: categoryResponse.data.description,
          image: categoryResponse.data.image || 'assets/images/no-image.png'
        };

        const { data: itemsResponse } = await http.post(serverUrls.searchProducts, {
          pageNo: 0,
          pageSize: itemsPageSize,
          filters: [
            { Alias: "IsActive", Value: "True" },
            { Alias: "CategoryName", Value: category.name }
          ]
        });

        if (itemsResponse.success) {
          const productsPage = itemsResponse.pageNo;
          const totalProducts = itemsResponse.total;
          const productsToShow = itemsResponse.items ? itemsResponse.items.length : 0;
          category.products = this.mapProducts(itemsResponse.items);

          this.categoryDetails = {
            error: false,
            category,
            productsPage,
            totalProducts,
            productsToShow
          };
          this.categoryDetailsUpdated.next(this.categoryDetails);
        } else {
          this.categoryDetailsUpdated.next({ ...this.categoryDetails, error: true});
          console.error('Error getting products for category:', category.name);
        }
      } else {
        console.log('Error getting category by id:', categoryId, 'Request did not success');
        this.categoryDetailsUpdated.next({ ...this.categoryDetails, error: true});
      }
    } catch (error) {
      console.log('Error getting category by id:', categoryId, error);
      this.categoryDetailsUpdated.next({ ...this.categoryDetails, error: true});
    }
  }

  async updateCategory(categoryId: string, dataToUpdate: any) {
    try {
      const { data: categoryResponse } = await http.put(`${serverUrls.getCategoryDetails}/${categoryId}`, dataToUpdate);

      if (categoryResponse.success) {
        const categoryUpdated: Category = {
          id: categoryResponse.data.id,
          name: categoryResponse.data.name,
          description: categoryResponse.data.description,
          image: categoryResponse.data.image || 'assets/images/no-image.png',
        };

        return { error: false, categoryUpdated };
      } else {
        console.error(`Error updating catgory: ${categoryId}. ${categoryResponse.message}`);
        return { error: true };
      }
    } catch (error) {
      console.error(`Error updating catgory: ${categoryId}`, error);
      return { error: true };
    }
  }

  async createCategory(data: any) {
    try {
      const { data: categoryResponse } = await http.post(serverUrls.getCategoryDetails, data);

      if (categoryResponse.success) {
        const newCategory: Category = {
          id: categoryResponse.data.id,
          name: categoryResponse.data.name,
          description: categoryResponse.data.description,
          image: categoryResponse.data.image || 'assets/images/no-image.png',
        };

        return { error: false, newCategory };
      } else {
        console.error(`Error creating catgory. ${categoryResponse.message}`);
        return { error: true };
      }
    } catch (error) {
      console.error(`Error creating category`, error);
      return { error: true };
    }
  }

  clearCategoriesData() {
    this.categoriesData = {
      error: false,
      page: 0,
      pages: [],
      categoriesToShow: 0,
      total: 0
    };
    this.categoriesDataUpdated.next(this.categoriesData);
  }

  clearCategoryDetails() {
    this.categoryDetails = {
      error: false,
      category: null,
      productsPage: 0,
      totalProducts: 0,
      productsToShow: 0
    };
    this.categoryDetailsUpdated.next(this.categoryDetails);
  }

  getCategoriesDataUpdadateListener() {
    return this.categoriesDataUpdated;
  }

  getCategoryDetailsUpdadateListener() {
    return this.categoryDetailsUpdated;
  }

  // Maps
  mapCategoriesData(categories: any[]): Category[] {
    if (categories && categories.length > 0) {
      return categories.map((category: any) => {
        return {
          id: category.id,
          name: category.name,
          description: category.description,
          image: category.image || 'assets/images/no-image.png'
        };
      });
    }

    return [];
  }

  getCategoriesByPages(currentPage: number, categories: Category[]) {
    let pages: Category[][] = [];
    let categoriesToShow = 0;

    if (this.categoriesData.pages.length > 0 && currentPage === this.categoriesData.page) {
      this.categoriesData.pages.forEach((page: Category[], index: number) => {
        if (index === currentPage) {
          categoriesToShow += categories.length;
          pages.push(categories);
        } else {
          categoriesToShow += page.length;
          pages.push(page);
        }
      });
    } else {
      categoriesToShow = this.categoriesData.categoriesToShow + categories.length
      pages = [...this.categoriesData.pages, categories];
    }

    return { pages, categoriesToShow };
  }

  mapProducts(data: any): Product[] {
    return data.map((product: any) => {
      return {
        id: product.id,
        code: product.code,
        name: product.name,
        category: product.category,
        description: product.description,
        image: product.image || 'assets/images/no-image.png'
      };
    });
  }
}
