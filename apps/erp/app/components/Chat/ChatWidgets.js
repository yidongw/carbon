"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatWidgets = ChatWidgets;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var ui_1 = require("~/stores/ui");
var CreateMenu_1 = require("../Layout/Topbar/CreateMenu");
function ChatWidgets(_a) {
    var recordButtonRef = _a.recordButtonRef;
    var openSearchModal = (0, ui_1.useUIStore)().openSearchModal;
    var handleVoiceClick = function () {
        var _a;
        (_a = recordButtonRef === null || recordButtonRef === void 0 ? void 0 : recordButtonRef.current) === null || _a === void 0 ? void 0 : _a.handleRecordClick();
    };
    return (<div className="w-full flex gap-3 justify-center items-center">
      <react_1.Button variant="secondary" className="rounded-full" leftIcon={<lu_1.LuSearch />} onClick={openSearchModal}>
        <macro_1.Trans>Search</macro_1.Trans>
      </react_1.Button>

      <CreateMenu_1.default trigger={<react_1.Button variant="secondary" className="rounded-full" leftIcon={<lu_1.LuSquarePen />} rightIcon={<lu_1.LuChevronDown />}>
            <macro_1.Trans>Create</macro_1.Trans>
          </react_1.Button>}/>

      <react_1.Button variant="secondary" className="rounded-full" leftIcon={<lu_1.LuAudioLines />} onClick={handleVoiceClick}>
        <macro_1.Trans>Voice</macro_1.Trans>
      </react_1.Button>
    </div>);
}
