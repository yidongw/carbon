"use strict";
/**
 * Welcome to UserSelect
 *
 * Controlled, accessible, multi-user select component for groups and people.
 *
 * A combobox is the combination of an `<input type="text"/>` and a list. In
 * this case, the list conforms to the `treeselect` pattern.
 *
 * @see WAI-ARIA Comobox https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 * @see WAI-ARIA Tree View https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
var react_1 = require("@carbon/react");
var hooks_1 = require("~/hooks");
var Combobox_1 = require("./components/Combobox");
var Container_1 = require("./components/Container");
var Input_1 = require("./components/Input");
var Popover_1 = require("./components/Popover");
var SelectionList_1 = require("./components/SelectionList");
var TreeSelect_1 = require("./components/TreeSelect");
var provider_1 = require("./provider");
var useUserSelect_1 = require("./useUserSelect");
function Component(props) {
    var permissions = (0, hooks_1.usePermissions)();
    if (!permissions.is("employee"))
        return null;
    return <UserSelect {...props}/>;
}
var UserSelect = function (props) {
    var state = (0, useUserSelect_1.default)(props);
    var dropdown = state.dropdown, _a = state.innerProps, hideSelections = _a.hideSelections, isMulti = _a.isMulti, isOptional = _a.isOptional, label = _a.label, readOnly = _a.readOnly, width = _a.width, containerRef = state.refs.containerRef, selectionItemsById = state.selectionItemsById;
    return (<provider_1.UserSelectContext.Provider value={state}>
      {label && <react_1.FormLabel isOptional={isOptional}>{label}</react_1.FormLabel>}
      <Container_1.default ref={containerRef} width={width}>
        {!(readOnly && isMulti) && (<Combobox_1.default>
            <Input_1.default />
            {dropdown.isOpen && (<Popover_1.default>
                <TreeSelect_1.default />
              </Popover_1.default>)}
          </Combobox_1.default>)}
        {!hideSelections &&
            isMulti &&
            Object.keys(selectionItemsById).length > 0 && <SelectionList_1.default />}
      </Container_1.default>
    </provider_1.UserSelectContext.Provider>);
};
