import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
const electron = (<any>window).require("electron");

@Injectable({
  providedIn: "root",
})
export class SearchService {
  private TAG: string = `[${this.constructor.name}]: `;
  products = new BehaviorSubject<any[]>([]);

  constructor() {
    electron.ipcRenderer.on(
      "getProductsResponse",
      (event: any, response: string) => {
        console.log(this.TAG, "getProductsResponse: ", response);
        this.products.next(JSON.parse(response));
      }
    );
  }

  getProducts(query: string): void {
    console.log(this.TAG, "getProducts: ", query);
    electron.ipcRenderer.send("getProducts", query);
  }
}
