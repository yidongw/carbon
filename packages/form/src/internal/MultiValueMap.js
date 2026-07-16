"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMultiValueMap = exports.MultiValueMap = void 0;
var react_1 = require("react");
var MultiValueMap = /** @class */ (function () {
    function MultiValueMap() {
        var _this = this;
        this.dict = new Map();
        this.add = function (key, value) {
            if (_this.dict.has(key)) {
                _this.dict.get(key).push(value);
            }
            else {
                _this.dict.set(key, [value]);
            }
        };
        this.delete = function (key) {
            _this.dict.delete(key);
        };
        this.remove = function (key, value) {
            if (!_this.dict.has(key))
                return;
            var array = _this.dict.get(key);
            var index = array.indexOf(value);
            if (index !== -1)
                array.splice(index, 1);
            if (array.length === 0)
                _this.dict.delete(key);
        };
        this.getAll = function (key) {
            var _a;
            return (_a = _this.dict.get(key)) !== null && _a !== void 0 ? _a : [];
        };
        this.entries = function () { return _this.dict.entries(); };
        this.values = function () { return _this.dict.values(); };
        this.has = function (key) { return _this.dict.has(key); };
    }
    return MultiValueMap;
}());
exports.MultiValueMap = MultiValueMap;
var useMultiValueMap = function () {
    var ref = (0, react_1.useRef)(null);
    return (0, react_1.useCallback)(function () {
        if (ref.current)
            return ref.current;
        ref.current = new MultiValueMap();
        return ref.current;
    }, []);
};
exports.useMultiValueMap = useMultiValueMap;
