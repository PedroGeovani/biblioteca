import { Category, CategoryTo } from "@/models/category.model";
import { QueryParams } from "@/models/query-params.model";
import CategoryRest from "@/service/rest/category.rest";
import { Subject, Observable, take, switchMap } from "rxjs";

export default class CategoryService {
    constructor(
        private _categories = new CategoryRest()
    ) { }
    
    private categories$: Subject<any> = new Subject<any>();
    categories: Observable<any> = this.categories$.asObservable();

    getAllCategories(params: QueryParams): void {
        this._categories
            .getAllCategories(params)
            .pipe(take(1))
            .subscribe({
                next: (response) => {
                    this.categories$.next(response);
                },
                error: (err) => {
                    this.categories$.error(err);
                }
            })
    }

    createCategories(newCategory: CategoryTo): void {
        this._categories
            .createCategories(newCategory)
            .pipe(
                take(1),
                switchMap(() =>
                    this._categories.getAllCategories(new QueryParams())
                ))
            .subscribe({
                next: (response) => {
                    this.categories$.next(response);
                },
                error: (err) => {
                    this.categories$.error(err);
                }
            })
    }

    updateCategories(category: Category): void {
        this._categories
            .updateCategories(category)
            .pipe(
                take(1),
                switchMap(() =>
                    this._categories.getAllCategories(new QueryParams())
                ))
            .subscribe({
                next: (response) => {
                    this.categories$.next(response);
                },
                error: (err) => {
                    this.categories$.error(err);
                }
            })
    }

    deleteCategories(category: Category): void {
        this._categories
            .deleteCategories(category)
            .pipe(
                take(1),
                switchMap(() =>
                    this._categories.getAllCategories(new QueryParams())
                ))
            .subscribe({
                next: (response) => {
                    this.categories$.next(response);
                },
                error: (err) => {
                    this.categories$.error(err);
                }
            })
    }
}