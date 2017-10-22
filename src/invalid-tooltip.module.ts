import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TooltipComponent} from "./tooltip/tooltip.component";
import {InvalidTooltipDirective} from "./invalid-tooltip.directive";

@NgModule({
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule
  ],
  declarations: [
      InvalidTooltipDirective,
      TooltipComponent
  ],
  exports: [
      InvalidTooltipDirective
  ],
  entryComponents: [
      TooltipComponent
  ]
})
export class InvalidTooltipModule {
}
