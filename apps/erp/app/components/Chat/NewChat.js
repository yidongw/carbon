"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewChat = NewChat;
var react_1 = require("@carbon/react");
var ai_1 = require("ai");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("~/hooks");
function NewChat() {
    var _a = (0, hooks_1.useUrlParams)(), setParams = _a[1];
    var handleNewChat = function () {
        setParams({ chatId: (0, ai_1.generateId)() });
    };
    return (<react_1.Button variant="secondary" isIcon onClick={handleNewChat}>
      <lu_1.LuCirclePlus size={16}/>
    </react_1.Button>);
}
