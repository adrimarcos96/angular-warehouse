import axios from "axios";
import { environment } from "../../environments/environment";

export const serverUrls = {
  searchCategories: environment.backendUrl +'/Category/Search',
  getCategoryDetails: environment.backendUrl +'/Category',
  searchProducts: environment.backendUrl +'/Item/Search',
  getProductDetails: environment.backendUrl +'/Item',

};

export const http = axios.create({
  baseURL: environment.backendUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
