import { environment } from "../../environments/environment";

export const serverUrls = {
  searchCategories: environment.backendUrl +'/Category/Search',
  getCategoryDetails: environment.backendUrl +'/Category',
  searchProducts: environment.backendUrl +'/Item/Search'
};
