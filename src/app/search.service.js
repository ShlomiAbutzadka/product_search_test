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
exports.SearchService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var electron_service_1 = require("./electron.service");
var SearchService = /** @class */ (function () {
    function SearchService(_electronService) {
        this._electronService = _electronService;
        this.TAG = "[" + this.constructor.name + "]: ";
        this.products = new rxjs_1.BehaviorSubject([]);
    }
    SearchService.prototype.getProducts = function (query) {
        var _this = this;
        console.log(this.TAG, 'getProducts', query);
        this._electronService.exec('getProducts', query)
            .subscribe({
            next: function (value) {
                _this.products.next(value);
                console.log(_this.TAG, 'getProducts next:', value);
            },
            error: function (err) { return console.error(err); },
            complete: function () { return console.log('End'); },
        });
    };
    SearchService = __decorate([
        core_1.Injectable({
            providedIn: "root",
        }),
        __metadata("design:paramtypes", [electron_service_1.ElectronService])
    ], SearchService);
    return SearchService;
}());
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map