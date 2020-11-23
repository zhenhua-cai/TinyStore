import {HttpClient} from '@angular/common/http';
import {Product} from '../models/product.model';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {ProductCategory} from '../models/product-category.model';
import {ProductSearchResult} from '../models/product-search-result.model';
import {Country} from '../../checkout/Country';

@Injectable({
  providedIn: 'root'
})
export class DataTransactionService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {
  }

  fetchProducts(page: number, pageSize: number): Observable<ProductSearchResult> {
    return this.http.get<ProductSearchResult>(this.baseUrl + '/products?page=' + page + '&size=' + pageSize);
  }

  fetchProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<GetResponseProductCategory>(this.baseUrl + '/product-category')
      .pipe(map(
        responseData => {
          if (responseData.page.totalElements === 0) {
            return [];
          }
          return responseData._embedded.productCategory;
        })
      );
  }

  searchProductsByCategory(categoryId: number, page: number, pageSize: number): Observable<ProductSearchResult> {
    return this.http.get<ProductSearchResult>(`${this.baseUrl}/products/search/findByCategoryId?id=${categoryId}&page=${page}&size=${pageSize}`);
  }

  searchProductsByNameContaining(keyword: string, page: number, pageSize: number): Observable<ProductSearchResult> {
    return this.http.get<ProductSearchResult>(`${this.baseUrl}/products/search/findByNameContaining?name=${keyword}&page=${page}&size=${pageSize}`);
  }

  searchProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  fetchCountries(): Observable<Country[]> {
    return this.http.get<GetResponseCountries>(`${this.baseUrl}/countries?page=0&size=300`)
      .pipe(
        map((data) => {
          return data._embedded.countries;
        })
      );
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
  page: {
    totalElements: number;
  };
}
