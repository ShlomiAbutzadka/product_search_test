"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchComponent = void 0;
var core_1 = require("@angular/core");
var search_service_1 = require("../search.service");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var SearchComponent = /** @class */ (function () {
    function SearchComponent(_searchService, _cdr) {
        this._searchService = _searchService;
        this._cdr = _cdr;
        this.TAG = "[" + this.constructor.name + "]: ";
        this.queryChanged = new rxjs_1.Subject();
    }
    SearchComponent.prototype.ngOnInit = function () {
        this.subscribeToQueryChanges();
        this.subscribeToResultChanges();
    };
    SearchComponent.prototype.subscribeToResultChanges = function () {
        var _this = this;
        this._searchService.products.subscribe(function (value) {
            _this.products = value;
            console.log(_this.TAG, 'subscribeToResultChanges: ', value);
            _this._cdr.detectChanges();
        });
    };
    SearchComponent.prototype.subscribeToQueryChanges = function () {
        var _this = this;
        // wait 300ms after the last event before emitting last event
        // only emit if value is different from previous value
        this.queryChanged
            .pipe(operators_1.debounceTime(300), operators_1.distinctUntilChanged())
            .subscribe(function (query) {
            _this.query = query;
            _this._searchService.getProducts(query);
        });
    };
    SearchComponent.prototype.changed = function (text) {
        this.queryChanged.next(text);
    };
    SearchComponent = __decorate([
        core_1.Component({
            selector: "app-search",
            templateUrl: "./search.component.html",
            styleUrls: ["./search.component.scss"],
        }),
        __metadata("design:paramtypes", [search_service_1.SearchService,
            core_1.ChangeDetectorRef])
    ], SearchComponent);
    return SearchComponent;
}());
exports.SearchComponent = SearchComponent;
//# sourceMappingURL=search.component.js.map