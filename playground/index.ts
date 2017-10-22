/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import {ApplicationRef, NgModule} from '@angular/core';
import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {InvalidTooltipModule} from "ng-invalid-tooltip";


@Component({
  selector: 'app',
  template: `<input type="text" [invalidTooltip]="[{error: 'required', message: 'haha'}">`
})
class AppComponent {
  constructor(private appRef: ApplicationRef) {
    console.log(this.appRef);
  }
}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, InvalidTooltipModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
