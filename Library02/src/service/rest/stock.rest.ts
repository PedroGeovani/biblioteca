import { Observable } from "rxjs";
import api from "../api-Config/rxjs-config";
import { Stock } from "@/models/stock.model";
import { QueryParams } from "@/models/query-params.model";


export class StockRest{  
    getAllStock(params: QueryParams): Observable<any> {          
        return api.get("/stocks/", params);
    }

    getStockById(idBook: string): Observable<any> { 
        return api.get(`/stocks/${idBook}`);
    }
    
    postBookToStock(body: Stock): Observable<any> {       
        return api.post("/stocks/", body);       
    }

    updateStock(id: string, body: Stock): Observable<any> {
        return api.put(`/stocks/${id}`, body);
    } 

    deleteStock(id: string): Observable<any> {
        return api.deleteR(`/stocks/${id}`);
    }
}
