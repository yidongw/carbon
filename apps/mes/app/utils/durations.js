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
exports.makeDurations = makeDurations;
function makeDurations(operation) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35;
    var setupDuration = 0;
    var laborDuration = 0;
    var machineDuration = 0;
    // Calculate setup duration
    switch (operation.setupUnit) {
        case "Total Hours":
            setupDuration = ((_a = operation.setupTime) !== null && _a !== void 0 ? _a : 0) * 3600000; // Convert hours to milliseconds
            break;
        case "Total Minutes":
            setupDuration = ((_b = operation.setupTime) !== null && _b !== void 0 ? _b : 0) * 60000; // Convert minutes to milliseconds
            break;
        case "Hours/Piece":
            setupDuration =
                ((_c = operation.setupTime) !== null && _c !== void 0 ? _c : 0) *
                    ((_d = operation.operationQuantity) !== null && _d !== void 0 ? _d : 0) *
                    3600000;
            break;
        case "Hours/100 Pieces":
            setupDuration =
                (((_e = operation.setupTime) !== null && _e !== void 0 ? _e : 0) / 100) *
                    ((_f = operation.operationQuantity) !== null && _f !== void 0 ? _f : 0) *
                    3600000;
            break;
        case "Hours/1000 Pieces":
            setupDuration =
                (((_g = operation.setupTime) !== null && _g !== void 0 ? _g : 0) / 1000) *
                    ((_h = operation.operationQuantity) !== null && _h !== void 0 ? _h : 0) *
                    3600000;
            break;
        case "Minutes/Piece":
            setupDuration =
                ((_j = operation.setupTime) !== null && _j !== void 0 ? _j : 0) * ((_k = operation.operationQuantity) !== null && _k !== void 0 ? _k : 0) * 60000;
            break;
        case "Minutes/100 Pieces":
            setupDuration =
                (((_l = operation.setupTime) !== null && _l !== void 0 ? _l : 0) / 100) *
                    ((_m = operation.operationQuantity) !== null && _m !== void 0 ? _m : 0) *
                    60000;
            break;
        case "Minutes/1000 Pieces":
            setupDuration =
                (((_o = operation.setupTime) !== null && _o !== void 0 ? _o : 0) / 1000) *
                    ((_p = operation.operationQuantity) !== null && _p !== void 0 ? _p : 0) *
                    60000;
            break;
        case "Pieces/Hour":
            setupDuration =
                (((_q = operation.operationQuantity) !== null && _q !== void 0 ? _q : 0) / ((_r = operation.setupTime) !== null && _r !== void 0 ? _r : 0)) *
                    3600000;
            break;
        case "Pieces/Minute":
            setupDuration =
                (((_s = operation.operationQuantity) !== null && _s !== void 0 ? _s : 0) / ((_t = operation.setupTime) !== null && _t !== void 0 ? _t : 0)) *
                    60000;
            break;
        case "Seconds/Piece":
            setupDuration =
                ((_u = operation.setupTime) !== null && _u !== void 0 ? _u : 0) * ((_v = operation.operationQuantity) !== null && _v !== void 0 ? _v : 0) * 1000;
            break;
    }
    // Calculate labor duration
    switch (operation.laborUnit) {
        case "Total Hours":
            laborDuration = ((_w = operation.laborTime) !== null && _w !== void 0 ? _w : 0) * 3600000; // Convert hours to milliseconds
            break;
        case "Total Minutes":
            laborDuration = ((_x = operation.laborTime) !== null && _x !== void 0 ? _x : 0) * 60000; // Convert minutes to milliseconds
            break;
        case "Hours/Piece":
            laborDuration =
                ((_y = operation.laborTime) !== null && _y !== void 0 ? _y : 0) *
                    ((_z = operation.operationQuantity) !== null && _z !== void 0 ? _z : 0) *
                    3600000;
            break;
        case "Hours/100 Pieces":
            laborDuration =
                (((_0 = operation.laborTime) !== null && _0 !== void 0 ? _0 : 0) / 100) *
                    ((_1 = operation.operationQuantity) !== null && _1 !== void 0 ? _1 : 0) *
                    3600000;
            break;
        case "Hours/1000 Pieces":
            laborDuration =
                (((_2 = operation.laborTime) !== null && _2 !== void 0 ? _2 : 0) / 1000) *
                    ((_3 = operation.operationQuantity) !== null && _3 !== void 0 ? _3 : 0) *
                    3600000;
            break;
        case "Minutes/Piece":
            laborDuration =
                ((_4 = operation.laborTime) !== null && _4 !== void 0 ? _4 : 0) * ((_5 = operation.operationQuantity) !== null && _5 !== void 0 ? _5 : 0) * 60000;
            break;
        case "Minutes/100 Pieces":
            laborDuration =
                (((_6 = operation.laborTime) !== null && _6 !== void 0 ? _6 : 0) / 100) *
                    ((_7 = operation.operationQuantity) !== null && _7 !== void 0 ? _7 : 0) *
                    60000;
            break;
        case "Minutes/1000 Pieces":
            laborDuration =
                (((_8 = operation.laborTime) !== null && _8 !== void 0 ? _8 : 0) / 1000) *
                    ((_9 = operation.operationQuantity) !== null && _9 !== void 0 ? _9 : 0) *
                    60000;
            break;
        case "Pieces/Hour":
            laborDuration =
                (((_10 = operation.operationQuantity) !== null && _10 !== void 0 ? _10 : 0) / ((_11 = operation.laborTime) !== null && _11 !== void 0 ? _11 : 0)) *
                    3600000;
            break;
        case "Pieces/Minute":
            laborDuration =
                (((_12 = operation.operationQuantity) !== null && _12 !== void 0 ? _12 : 0) / ((_13 = operation.laborTime) !== null && _13 !== void 0 ? _13 : 0)) *
                    60000;
            break;
        case "Seconds/Piece":
            laborDuration =
                ((_14 = operation.laborTime) !== null && _14 !== void 0 ? _14 : 0) * ((_15 = operation.operationQuantity) !== null && _15 !== void 0 ? _15 : 0) * 1000;
            break;
    }
    // Calculate machine duration
    switch (operation.machineUnit) {
        case "Total Hours":
            machineDuration = ((_16 = operation.machineTime) !== null && _16 !== void 0 ? _16 : 0) * 3600000; // Convert hours to milliseconds
            break;
        case "Total Minutes":
            machineDuration = ((_17 = operation.machineTime) !== null && _17 !== void 0 ? _17 : 0) * 60000; // Convert minutes to milliseconds
            break;
        case "Hours/Piece":
            machineDuration =
                ((_18 = operation.machineTime) !== null && _18 !== void 0 ? _18 : 0) *
                    ((_19 = operation.operationQuantity) !== null && _19 !== void 0 ? _19 : 0) *
                    3600000;
            break;
        case "Hours/100 Pieces":
            machineDuration =
                (((_20 = operation.machineTime) !== null && _20 !== void 0 ? _20 : 0) / 100) *
                    ((_21 = operation.operationQuantity) !== null && _21 !== void 0 ? _21 : 0) *
                    3600000;
            break;
        case "Hours/1000 Pieces":
            machineDuration =
                (((_22 = operation.machineTime) !== null && _22 !== void 0 ? _22 : 0) / 1000) *
                    ((_23 = operation.operationQuantity) !== null && _23 !== void 0 ? _23 : 0) *
                    3600000;
            break;
        case "Minutes/Piece":
            machineDuration =
                ((_24 = operation.machineTime) !== null && _24 !== void 0 ? _24 : 0) *
                    ((_25 = operation.operationQuantity) !== null && _25 !== void 0 ? _25 : 0) *
                    60000;
            break;
        case "Minutes/100 Pieces":
            machineDuration =
                (((_26 = operation.machineTime) !== null && _26 !== void 0 ? _26 : 0) / 100) *
                    ((_27 = operation.operationQuantity) !== null && _27 !== void 0 ? _27 : 0) *
                    60000;
            break;
        case "Minutes/1000 Pieces":
            machineDuration =
                (((_28 = operation.machineTime) !== null && _28 !== void 0 ? _28 : 0) / 1000) *
                    ((_29 = operation.operationQuantity) !== null && _29 !== void 0 ? _29 : 0) *
                    60000;
            break;
        case "Pieces/Hour":
            machineDuration =
                (((_30 = operation.operationQuantity) !== null && _30 !== void 0 ? _30 : 0) / ((_31 = operation.machineTime) !== null && _31 !== void 0 ? _31 : 0)) *
                    3600000;
            break;
        case "Pieces/Minute":
            machineDuration =
                (((_32 = operation.operationQuantity) !== null && _32 !== void 0 ? _32 : 0) / ((_33 = operation.machineTime) !== null && _33 !== void 0 ? _33 : 0)) *
                    60000;
            break;
        case "Seconds/Piece":
            machineDuration =
                ((_34 = operation.machineTime) !== null && _34 !== void 0 ? _34 : 0) *
                    ((_35 = operation.operationQuantity) !== null && _35 !== void 0 ? _35 : 0) *
                    1000;
            break;
    }
    var totalDuration = setupDuration + laborDuration + machineDuration;
    // @ts-ignore
    return __assign(__assign({}, operation), { duration: totalDuration, setupDuration: setupDuration, laborDuration: laborDuration, machineDuration: machineDuration });
}
