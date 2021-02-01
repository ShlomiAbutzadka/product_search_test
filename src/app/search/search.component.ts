import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { SearchService } from "../search.service";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  private TAG: string = `[${this.constructor.name}]: `;
  query: string;
  queryChanged: Subject<string> = new Subject<string>();

  products: any[];

  constructor(
    private _searchService: SearchService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscribeToQueryChanges();
    this.subscribeToResultChanges();
  }

  private subscribeToResultChanges(): void {
    this._searchService.products.subscribe((value) => {
      this.products = value;
      console.log(this.TAG, 'subscribeToResultChanges: ', value);
      this._cdr.detectChanges();
    });
  }
ß
  private subscribeToQueryChanges(): void {
    // wait 300ms after the last event before emitting last event
    // only emit if value is different from previous value
    this.queryChanged
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        this.query = query;
        this._searchService.getProducts(query);
      });
  }

  changed(text: string): void {
    this.queryChanged.next(text);
  }
}
