import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ElectronService } from "./electron.service";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  private TAG: string = `[${this.constructor.name}]: `;
  products = new BehaviorSubject<any[]>([]);

  constructor(private _electronService: ElectronService) {

  }

  getProducts(query: string): void {
    console.log(this.TAG, 'getProducts', query);
    
    this._electronService.exec('getProducts', query)
    .subscribe({
      next: (value:any) => {
        // this.products.next(value);
        console.log(this.TAG, 'getProducts next:', value);
       
      },
      error: err => console.error(err),
      complete: () => console.log('End'),
    });

  }

  // getProducts2(query: string): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     electron.ipcRenderer.on(
  //       "getProductsResponse",
  //       (event: any, response: string) => {
  //         console.log(this.TAG, "getProductsResponse: ", response);
  //         this.products.next(JSON.parse(response));
  //       }
  //     );

  //     console.log(this.TAG, "getProducts: ", query);
  //     electron.ipcRenderer.send("getProducts", query);
  //   });
  // }
}
