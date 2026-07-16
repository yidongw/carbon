"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOnClickOutside = useOnClickOutside;
var react_1 = require("@carbon/react");
var react_2 = require("react");
/**
 * Custom hook that attaches event listeners to DOM elements, the window, or media query lists.
 * @template KW - The type of event for window events.
 * @template KH - The type of event for HTML or SVG element events.
 * @template KM - The type of event for media query list events.
 * @template T - The type of the DOM element (default is `HTMLElement`).
 * @param {KW | KH | KM} eventName - The name of the event to listen for.
 * @param {(event: WindowEventMap[KW] | HTMLElementEventMap[KH] | SVGElementEventMap[KH] | MediaQueryListEventMap[KM] | Event) => void} handler - The event handler function.
 * @param {RefObject<T>} [element] - The DOM element or media query list to attach the event listener to (optional).
 * @param {boolean | AddEventListenerOptions} [options] - An options object that specifies characteristics about the event listener (optional).
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-event-listener)
 * @example
 * ```tsx
 * // Example 1: Attach a window event listener
 * useEventListener('resize', handleResize);
 * ```
 * @example
 * ```tsx
 * // Example 2: Attach a document event listener with options
 * const elementRef = useRef(document);
 * useEventListener('click', handleClick, elementRef, { capture: true });
 * ```
 * @example
 * ```tsx
 * // Example 3: Attach an element event listener
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * useEventListener('click', handleButtonClick, buttonRef);
 * ```
 */
function useEventListener(eventName, handler, element, options) {
    // Create a ref that stores handler
    var savedHandler = (0, react_2.useRef)(handler);
    (0, react_1.useIsomorphicLayoutEffect)(function () {
        savedHandler.current = handler;
    }, [handler]);
    (0, react_2.useEffect)(function () {
        var _a;
        // Define the listening target
        var targetElement = (_a = element === null || element === void 0 ? void 0 : element.current) !== null && _a !== void 0 ? _a : window;
        if (!(targetElement && targetElement.addEventListener))
            return;
        // Create event listener that calls handler function stored in ref
        var listener = function (event) {
            savedHandler.current(event);
        };
        targetElement.addEventListener(eventName, listener, options);
        // Remove event listener on cleanup
        return function () {
            targetElement.removeEventListener(eventName, listener, options);
        };
    }, [eventName, element, options]);
}
/**
 * Custom hook that handles clicks outside a specified element.
 * @template T - The type of the element's reference.
 * @param {RefObject<T> | RefObject<T>[]} ref - The React ref object(s) representing the element(s) to watch for outside clicks.
 * @param {(event: MouseEvent | TouchEvent | FocusEvent) => void} handler - The callback function to be executed when a click outside the element occurs.
 * @param {EventType} [eventType] - The mouse event type to listen for (optional, default is 'mousedown').
 * @param {?AddEventListenerOptions} [eventListenerOptions] - The options object to be passed to the `addEventListener` method (optional).
 * @returns {void}
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-on-click-outside)
 * @example
 * ```tsx
 * const containerRef = useRef(null);
 * useOnClickOutside([containerRef], () => {
 *   // Handle clicks outside the container.
 * });
 * ```
 */
function useOnClickOutside(ref, handler, eventType, eventListenerOptions) {
    if (eventType === void 0) { eventType = "mousedown"; }
    if (eventListenerOptions === void 0) { eventListenerOptions = {}; }
    useEventListener(eventType, function (event) {
        var target = event.target;
        // Do nothing if the target is not connected element with document
        if (!target || !target.isConnected) {
            return;
        }
        var isOutside = Array.isArray(ref)
            ? ref
                .filter(function (r) { return Boolean(r.current); })
                .every(function (r) { return r.current && !r.current.contains(target); })
            : ref.current && !ref.current.contains(target);
        if (isOutside) {
            handler(event);
        }
    }, undefined, eventListenerOptions);
}
