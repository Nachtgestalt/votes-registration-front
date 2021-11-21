import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ResultsService {

    constructor(private http: HttpClient) {
    }

    getTotalFavor() {
        return this.http.get(`${environment.base_url}/api/totalVoteLaborUnion`)
            .pipe(
                map((res: any) => res.data)
            )
    }

    getTotalNoFavor() {
        return this.http.get(`${environment.base_url}/api/totalNoVoteLaborUnion`)
            .pipe(
                map((res: any) => res.data)
            )
    }
}