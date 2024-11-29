import { Observable } from "rxjs";
import api from "../api-Config/rxjs-config";
import { Category, CategoryTo } from "@/models/category.model";
import { QueryParams } from "@/models/query-params.model";

export default class CategoryRest {
    getAllCategories(params: QueryParams): Observable<any> {
        return api.get(`/categories`, params);
    }
    createCategories(body: CategoryTo): Observable<any> {
        return api.post('/categories', body);
    }
    updateCategories(category: Category): Observable<any> {
        return api.put(`/categories/${category.id}`, { name: category.name });
    }
    deleteCategories(category: Category): Observable<any> {
        return api.deleteR(`/categories/${category.id}`);
    }
}