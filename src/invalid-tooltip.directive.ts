import {
    ApplicationRef,
    ComponentFactoryResolver, ComponentRef, Directive, ElementRef, HostListener, Input, OnInit, ReflectiveInjector,
} from '@angular/core';
import {NgControl} from '@angular/forms';
import {TooltipComponent} from './tooltip/tooltip.component';

export interface InvalidTooltipErrorMap {
    [error: string]: string;
}

@Directive({
    selector: '[invalidTooltip]',
})
export class InvalidTooltipDirective implements OnInit {
    /**
     * An array of InvalidTooltipErrorMap, contains what message to show for each error
     * @type {InvalidTooltipErrorMap[]}
     */
    @Input('invalidTooltip') errorMaps: InvalidTooltipErrorMap = {};
    /**
     * Set to true when the tooltip is showing
     * @type {boolean}
     * @private
     */
    private _isTooltipShowing = false;
    /**
     * The value of the last error shown, used in order not to show the same error multiple times
     * @type {string}
     * @private
     */
    private _oldError = '';
    /**
     * A reference to the tooltip component
     * @type {ComponentRef<TooltipComponent>}
     */
    private _componentRef: ComponentRef<TooltipComponent>;
    /**
     * A listener that listens to the scroll event in the parents and moves the tooltip
     */
    private _scrollListener: EventListener;

    constructor(
        private _elementRef: ElementRef,
        private _applicationRef: ApplicationRef,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngControl: NgControl
    ) {

    }

    ngOnInit() {
        this._ngControl.statusChanges.subscribe(() => {
            this._showTooltipIfNeeded();
        });
    }

    /**
     * Decides whether the tooltip needs to be shown, and either shows it or removes it accordingly
     * @private
     */
    private _showTooltipIfNeeded() {
        if (this._ngControl.dirty && this._ngControl.invalid || this._ngControl.touched && this._ngControl.invalid) {
            // We take only the first error
            let newError: string = Object.keys(this._ngControl.errors)[0];

            if (this._oldError !== newError) {

                this._removeTooltip();

                this._oldError = newError;

                let tooltip: string
                    = this.errorMaps[this._oldError];

                if (tooltip) {
                    this._addTooltip(tooltip);
                }
            }
        } else {
            this._removeTooltip();
            this._oldError = '';
        }
    }

    /**
     * Creates the tooltip
     * @param {string} message - The message to show in the tooltip
     * @private
     */
    private _addTooltip(message: string) {
        this._componentRef =
            this._componentFactoryResolver.resolveComponentFactory(TooltipComponent)
                .create(ReflectiveInjector.resolveAndCreate([], this._applicationRef.components[0].injector));

        this._applicationRef.attachView(this._componentRef.hostView);
        document.querySelector('body').appendChild(this._componentRef.location.nativeElement);

        this._subscribeToScroll();
        this._adjustPosition();
        this._componentRef.instance.message = message;

        this._isTooltipShowing = true;
    }

    /**
     * Calculates the position of the tooltip and sets it accordingly
     * @private
     */
    private _adjustPosition() {
        let boundingRectangle = this._elementRef.nativeElement.getBoundingClientRect();
        let left = boundingRectangle.left + 10;
        let top = boundingRectangle.top + this._elementRef.nativeElement.clientHeight - 10;

        this._componentRef.instance.x = left;
        this._componentRef.instance.y = top;
    }

    /**
     * Decided whether to hide the tooltip temporarily because the element is hidden by something else
     * @private
     */
    private _adjustHidden() {
        let boundingRectangle = this._elementRef.nativeElement.getBoundingClientRect();
        let left = boundingRectangle.left + 1;
        let top = boundingRectangle.top + 1;

        let topMost = document.elementFromPoint(left, top);

        // if the element is not the top most element, hide the tooltip
        this._componentRef.instance.hidden = topMost !== this._elementRef.nativeElement;

    }

    /**
     * Removes the tooltip
     * @private
     */
    private _removeTooltip() {
        if (this._isTooltipShowing) {
            this._componentRef.destroy();
            this._unsubscribeFromScroll();
            this._isTooltipShowing = false;
        }
    }

    /**
     * Subscribes to scrolling event of parents
     * @private
     */
    private _subscribeToScroll() {
        this._scrollListener = () => {
            this._adjustPosition();
            this._adjustHidden();
        };
        document.addEventListener('scroll', this._scrollListener, true);
    }

    /**
     * Unsubscribes to scrolling event of parents
     * @private
     */
    private _unsubscribeFromScroll() {
        document.removeEventListener('scroll', this._scrollListener, true);
    }

    /**
     * When the host loses focus, it removes the tooltip
     */
    @HostListener('blur') onBlur() {
        this._removeTooltip();
        this._oldError = '';
    }

    /**
     * When the host gains focus, it shows the tooltip if needed
     */
    @HostListener('focus') onFocus() {
        this._showTooltipIfNeeded();
    }
}
