"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var provider_1 = require("../provider");
var useUserSelect_1 = require("../useUserSelect");
var SelectionList = function () {
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, provider_1.default)(), _b = _a.innerProps, alwaysSelected = _b.alwaysSelected, checkedSelections = _b.checkedSelections, readOnly = _b.readOnly, selectionsMaxHeight = _b.selectionsMaxHeight, width = _b.width, instanceId = _a.instanceId, selectionItemsById = _a.selectionItemsById, onDeselect = _a.onDeselect, onExplode = _a.onExplode, onToggleChecked = _a.onToggleChecked;
    var selected = (0, react_2.useMemo)(function () {
        return Object.values(selectionItemsById).sort(function (a, b) {
            return a.label < b.label ? -1 : 0;
        });
    }, [selectionItemsById]);
    return (<ul className="w-full mt-1" style={{
            maxWidth: width,
            maxHeight: selectionsMaxHeight,
            overflowY: selectionsMaxHeight ? "auto" : undefined
        }}>
      {selected.map(function (item) {
            var _a;
            var id = "UserSelection:SelectedItem-".concat(item.id);
            var canExpand = !checkedSelections && !readOnly && (0, useUserSelect_1.isGroup)(item);
            return (<li className="p-2 rounded-md hover:bg-accent" key={item.id}>
            <div className="flex items-center space-x-2">
              {checkedSelections ? (<react_1.HStack className="w-full">
                  <react_1.Checkbox id={"".concat(instanceId, ":").concat(id, ":checkbox")} data-testid={id} isChecked={item.isChecked} onCheckedChange={function () { return onToggleChecked(item); }}/>
                  <p className="flex-grow text-sm line-clamp-1">{item.label}</p>
                </react_1.HStack>) : (<>
                  {"fullName" in item ? (<components_1.Avatar name={(_a = item.fullName) !== null && _a !== void 0 ? _a : undefined} path={item.avatarUrl} size="sm"/>) : (<components_1.Avatar name={item.name} path={null} size="sm"/>)}

                  <div className="flex items-center flex-grow">
                    <p className="text-sm line-clamp-1">{item.label}</p>
                  </div>
                </>)}

              {!!canExpand && (<react_1.Tooltip>
                  <react_1.TooltipTrigger>
                    <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Expand ", ""], ["Expand ", ""])), item.label)} icon={<lu_1.LuListPlus />} onClick={function () { return onExplode(item); }} variant="secondary"/>
                  </react_1.TooltipTrigger>
                  <react_1.TooltipContent side="top">
                    <span>
                      <macro_1.Trans>Expand</macro_1.Trans>
                    </span>
                  </react_1.TooltipContent>
                </react_1.Tooltip>)}

              {!readOnly && !alwaysSelected.includes(item.id) && (<react_1.Tooltip>
                  <react_1.TooltipTrigger>
                    <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Remove ", ""], ["Remove ", ""])), item.label)} icon={<lu_1.LuX />} onClick={function () { return onDeselect(item); }} variant="secondary"/>
                  </react_1.TooltipTrigger>
                  <react_1.TooltipContent side="top">
                    <span>
                      <macro_1.Trans>Remove</macro_1.Trans>
                    </span>
                  </react_1.TooltipContent>
                </react_1.Tooltip>)}
            </div>
          </li>);
        })}
    </ul>);
};
exports.default = SelectionList;
var templateObject_1, templateObject_2;
