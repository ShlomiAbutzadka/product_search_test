import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SearchComponent } from "./search/search.component";
import { SearchService } from "./search.service";
import { ElectronService } from "./electron.service";

@NgModule({
  declarations: [AppComponent, SearchComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [SearchService, ElectronService],
  bootstrap: [AppComponent],
})
export class AppModule {}
