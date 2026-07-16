"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestSubmit = void 0;
/**
 * Ponyfill of the HTMLFormElement.requestSubmit() method.
 * Based on polyfill from: https://github.com/javan/form-request-submit-polyfill/blob/main/form-request-submit-polyfill.js
 */
var requestSubmit = function (element, submitter) {
    // In vitest, let's test the polyfill.
    // Cypress will test the native implementation by nature of using chrome.
    if (typeof Object.getPrototypeOf(element).requestSubmit === "function") {
        element.requestSubmit(submitter);
        return;
    }
    if (submitter) {
        validateSubmitter(element, submitter);
        submitter.click();
        return;
    }
    var dummySubmitter = document.createElement("input");
    dummySubmitter.type = "submit";
    dummySubmitter.hidden = true;
    element.appendChild(dummySubmitter);
    dummySubmitter.click();
    element.removeChild(dummySubmitter);
};
exports.requestSubmit = requestSubmit;
function validateSubmitter(element, submitter) {
    // Should be redundant, but here for completeness
    var isHtmlElement = submitter instanceof HTMLElement;
    if (!isHtmlElement) {
        raise(TypeError, "parameter 1 is not of type 'HTMLElement'");
    }
    var hasSubmitType = "type" in submitter && submitter.type === "submit";
    if (!hasSubmitType)
        raise(TypeError, "The specified element is not a submit button");
    var isForCorrectForm = "form" in submitter && submitter.form === element;
    if (!isForCorrectForm)
        raise(DOMException, "The specified element is not owned by this form element", "NotFoundError");
}
function raise(errorConstructor, message, name) {
    throw new errorConstructor("Failed to execute 'requestSubmit' on 'HTMLFormElement': " + message + ".", name);
}
