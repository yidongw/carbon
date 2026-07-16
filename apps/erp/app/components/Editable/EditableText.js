"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var EditableText = function (mutation) {
    return function (_a) {
        var value = _a.value, row = _a.row, accessorKey = _a.accessorKey, onError = _a.onError, onUpdate = _a.onUpdate;
        var updateText = function (newValue) { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                // this is the optimistic update on the FE
                onUpdate((_a = {}, _a[accessorKey] = newValue, _a));
                // the is the actual update on the BE
                mutation(accessorKey, newValue, row)
                    .then(function (_a) {
                    var _b;
                    var error = _a.error;
                    if (error) {
                        onError();
                        onUpdate((_b = {}, _b[accessorKey] = value, _b));
                    }
                })
                    .catch(function () {
                    var _a;
                    onError();
                    onUpdate((_a = {}, _a[accessorKey] = value, _a));
                });
                return [2 /*return*/];
            });
        }); };
        var onKeyDown = function (event) {
            // only run the update if they click enter
            if (event.key === "Enter" || event.key === "Tab") {
                if (event.currentTarget.value !== value) {
                    updateText(event.currentTarget.value);
                }
            }
        };
        // run update if focus is lost
        var onBlur = function (event) {
            if (event.currentTarget.value !== value) {
                updateText(event.currentTarget.value);
            }
        };
        return (<react_1.Input autoFocus defaultValue={value} className="border-0 rounded-none w-full" size="sm" onBlur={onBlur} onKeyDown={onKeyDown}/>);
    };
};
exports.default = EditableText;
