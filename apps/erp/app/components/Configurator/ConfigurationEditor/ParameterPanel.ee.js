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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParameterPanel;
var macro_1 = require("@lingui/react/macro");
var Icons_1 = require("../Icons");
function ParameterPanel(_a) {
    var parameters = _a.parameters, onChange = _a.onChange;
    var updateValue = function (index, value) {
        var newParameters = __spreadArray([], parameters, true);
        newParameters[index] = __assign(__assign({}, newParameters[index]), { value: value });
        onChange(newParameters);
    };
    var updateMaterialProperty = function (index, property, value) {
        var _a;
        var newParameters = __spreadArray([], parameters, true);
        var param = newParameters[index];
        if (param.type === "material" && typeof param.value === "object") {
            newParameters[index] = __assign(__assign({}, param), { value: __assign(__assign({}, param.value), (_a = {}, _a[property] = value || null, _a)) });
            onChange(newParameters);
        }
    };
    return (<div className="flex-1 p-4 overflow-y-auto text-sm">
      <h3 className="text-lg font-semibold mb-4">
        <macro_1.Trans>Parameters</macro_1.Trans>
      </h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 bg-accent border-b">
          <div className="px-4 py-2 font-medium text-muted-foreground border-r">
            <macro_1.Trans>Name</macro_1.Trans>
          </div>
          <div className="px-4 py-2 font-medium text-muted-foreground">
            <macro_1.Trans>Test Value</macro_1.Trans>
          </div>
        </div>

        {parameters
            .sort(function (a, b) { return a.name.localeCompare(b.name); })
            .map(function (parameter, index) {
            var _a;
            if (parameter.type === "material") {
                var materialValue = parameter.value;
                var materialProperties = [
                    { key: "id", value: materialValue.id },
                    { key: "materialFormId", value: materialValue.materialFormId },
                    {
                        key: "materialSubstanceId",
                        value: materialValue.materialSubstanceId
                    },
                    { key: "materialTypeId", value: materialValue.materialTypeId },
                    { key: "dimensionId", value: materialValue.dimensionId },
                    { key: "finishId", value: materialValue.finishId },
                    { key: "gradeId", value: materialValue.gradeId }
                ];
                return materialProperties.map(function (prop) { return (<div key={"".concat(parameter.name, ".").concat(prop.key)} className="grid grid-cols-2 border-b last:border-b-0 hover:bg-accent">
                  <div className="px-4 py-2 border-r flex items-center gap-2 min-w-[140px] overflow-hidden">
                    <Icons_1.ConfiguratorDataTypeIcon type={parameter.type}/>
                    <span className="text-sm font-medium text-foreground truncate">
                      {parameter.name}.{prop.key}
                    </span>
                  </div>
                  <div className="px-2 py-1 overflow-hidden">
                    <input type="text" value={prop.value || ""} onChange={function (e) {
                        return updateMaterialProperty(index, prop.key, e.target.value);
                    }} className="w-full h-full px-2 bg-transparent border-0 focus:ring-0 truncate" placeholder={prop.key}/>
                  </div>
                </div>); });
            }
            return (<div key={parameter.name} className="grid grid-cols-2 border-b last:border-b-0 hover:bg-accent">
                <div className="px-4 py-2 border-r flex items-center gap-2 min-w-[140px] overflow-hidden">
                  <Icons_1.ConfiguratorDataTypeIcon type={parameter.type}/>
                  <span className="text-sm font-medium text-foreground truncate">
                    {parameter.name}
                  </span>
                </div>
                <div className="px-2 py-1 overflow-hidden">
                  {parameter.type === "boolean" ? (<select value={parameter.value} onChange={function (e) { return updateValue(index, e.target.value); }} className="w-full h-full px-2 bg-transparent border-0 focus:ring-0 truncate">
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>) : parameter.type === "list" && ((_a = parameter.config) === null || _a === void 0 ? void 0 : _a.options) ? (<select value={parameter.value} onChange={function (e) { return updateValue(index, e.target.value); }} className="w-full h-full px-2 bg-transparent border-0 focus:ring-0 truncate">
                      {parameter.config.options.map(function (option) { return (<option key={option} value={option}>
                          {option}
                        </option>); })}
                    </select>) : (<input type={parameter.type === "numeric" ? "number" : "text"} value={parameter.value} onChange={function (e) { return updateValue(index, e.target.value); }} className="w-full h-full px-2 bg-transparent border-0 focus:ring-0 truncate"/>)}
                </div>
              </div>);
        })}
      </div>
    </div>);
}
