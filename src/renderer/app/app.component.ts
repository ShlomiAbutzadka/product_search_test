import { Component } from '@angular/core';
import { SearchService } from './search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private TAG: string = `[${this.constructor.name}]: `;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
   console.log(this.TAG, 'ngOnInit')
  }
}
