import {Component} from "@angular/core";

@Component({
    selector: 'validation-tooltip',
    styleUrls: ['./tooltip.scss'],
    templateUrl: './tooltip.html'
})
export class TooltipComponent {
    x: number = 0;
    y: number = 0;
    message: string;
    hidden: boolean = false;
}