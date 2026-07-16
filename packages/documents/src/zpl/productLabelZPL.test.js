"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@carbon/utils");
var vitest_1 = require("vitest");
var template_1 = require("../template");
var ProductLabelZPL_1 = require("./ProductLabelZPL");
var item = {
    itemId: "WIDGET-100",
    revision: "A",
    quantity: 5,
    number: "SN-0001",
    trackedEntityId: "dtClCvNm9blDY0H3FXmDC",
    trackingType: "Serial"
};
var zplSizes = utils_1.labelSizes.filter(function (s) { return s.zpl; });
var size = function (id) {
    var found = utils_1.labelSizes.find(function (s) { return s.id === id; });
    if (!found)
        throw new Error("Missing label size ".concat(id));
    return found;
};
/** Template exercising every barcode placement path (right/full/center). */
var allPlacementsTemplate = __assign(__assign({}, (0, template_1.resolveTemplate)("trackingLabel", null)), { blocks: [
        { id: "h", type: "labelHeading", visible: true },
        {
            id: "b1",
            type: "labelBarcode",
            visible: true,
            symbology: "code128",
            value: "{label.trackedEntityId}",
            placement: "right"
        },
        {
            id: "b2",
            type: "labelBarcode",
            visible: true,
            symbology: "qrcode",
            value: "{label.trackedEntityId}",
            placement: "center"
        },
        {
            id: "b3",
            type: "labelBarcode",
            visible: true,
            symbology: "code128",
            value: "{label.trackedEntityId}",
            placement: "full"
        }
    ] });
(0, vitest_1.describe)("generateProductLabelZPL", function () {
    (0, vitest_1.it)("emits the standard header (size, no media tracking, UTF-8)", function () {
        for (var _i = 0, zplSizes_1 = zplSizes; _i < zplSizes_1.length; _i++) {
            var s = zplSizes_1[_i];
            var dpi = s.zpl.dpi || 203;
            var zpl = (0, ProductLabelZPL_1.generateProductLabelZPL)(item, s);
            (0, vitest_1.expect)(zpl.startsWith("^XA")).toBe(true);
            (0, vitest_1.expect)(zpl).toContain("^PW".concat(Math.round(s.zpl.width * dpi)));
            (0, vitest_1.expect)(zpl).toContain("^LL".concat(Math.round(s.zpl.height * dpi)));
            (0, vitest_1.expect)(zpl).toContain("^MNW^CI28");
            (0, vitest_1.expect)(zpl.endsWith("^XZ")).toBe(true);
        }
    });
    (0, vitest_1.it)("QR codes carry the MA, prefix (error correction + auto mode)", function () {
        var zpl = (0, ProductLabelZPL_1.generateProductLabelZPL)(item, size("label2x1"));
        (0, vitest_1.expect)(zpl).toContain("^FDMA,".concat(item.trackedEntityId));
    });
    (0, vitest_1.it)("QR module size scales with the label stock", function () {
        (0, vitest_1.expect)((0, ProductLabelZPL_1.generateProductLabelZPL)(item, size("label2x1"))).toContain("^BQN,2,4");
        (0, vitest_1.expect)((0, ProductLabelZPL_1.generateProductLabelZPL)(item, size("label4x2"))).toContain("^BQN,2,8");
    });
    (0, vitest_1.it)("fonts and margins scale with the label stock", function () {
        // 2x1 = baseline scale 1; 4x2 = scale 2.
        (0, vitest_1.expect)((0, ProductLabelZPL_1.generateProductLabelZPL)(item, size("label2x1"))).toContain("^FO20,30^A0N,25,25");
        (0, vitest_1.expect)((0, ProductLabelZPL_1.generateProductLabelZPL)(item, size("label4x2"))).toContain("^FO40,60^A0N,50,50");
    });
    (0, vitest_1.it)("emits only integer coordinates and sizes for every placement", function () {
        for (var _i = 0, zplSizes_2 = zplSizes; _i < zplSizes_2.length; _i++) {
            var s = zplSizes_2[_i];
            var zpl = (0, ProductLabelZPL_1.generateProductLabelZPL)(item, s, allPlacementsTemplate);
            (0, vitest_1.expect)(zpl).not.toMatch(/\d+\.\d+/);
        }
    });
    (0, vitest_1.it)("throws for sizes without ZPL support", function () {
        (0, vitest_1.expect)(function () { return (0, ProductLabelZPL_1.generateProductLabelZPL)(item, size("avery5163")); }).toThrow();
    });
});
(0, vitest_1.describe)("trackingLabel default template", function () {
    (0, vitest_1.it)("has no page chrome (labels carry no header or footer)", function () {
        var resolved = (0, template_1.resolveTemplate)("trackingLabel", null);
        (0, vitest_1.expect)(resolved.headerSectionId).toBeNull();
        (0, vitest_1.expect)(resolved.footerSectionId).toBeNull();
    });
});
