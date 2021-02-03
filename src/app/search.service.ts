import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ElectronService } from "./electron.service";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  private TAG: string = `[${this.constructor.name}]: `;
  private _products: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public readonly products$: Observable<any[]> = this._products.asObservable();

  constructor(private _electronService: ElectronService) {}

  getProducts(query: string): void {
    this._electronService
      .exec("getProducts", query)
      .subscribe((value: any) => this._products.next(value));
  }
}
