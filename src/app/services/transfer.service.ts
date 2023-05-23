import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {Observable} from "rxjs";
import {Transfer} from "../models/transfer";

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private readonly _transferPath = '/transfers';

  constructor(private httpService: HttpService) {
  }

  get(): Observable<Transfer[]> {
    return this.httpService.get<Transfer[]>(this._transferPath);
  }

  getById(id: number): Observable<Transfer> {
    return this.httpService.get<Transfer>(`${this._transferPath}/${id}`);
  }

  create(transfer: Transfer): Observable<Transfer[]> {
    return this.httpService.post<Transfer[]>(this._transferPath, transfer);
  }

  update(transfer: Transfer): Observable<Transfer[]> {
    return this.httpService.put<Transfer[]>(this._transferPath, transfer);
  }

  delete(id: any): Observable<any> {
    return this.httpService.delete(`${this._transferPath}/${id}`);
  }
}
