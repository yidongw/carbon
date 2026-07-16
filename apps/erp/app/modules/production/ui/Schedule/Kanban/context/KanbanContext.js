"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanProvider = KanbanProvider;
exports.useKanban = useKanban;
var react_1 = require("react");
var KanbanContext = (0, react_1.createContext)(null);
function KanbanProvider(_a) {
    var children = _a.children, displaySettings = _a.displaySettings, selectedGroup = _a.selectedGroup, setSelectedGroup = _a.setSelectedGroup, tags = _a.tags, columnIds = _a.columnIds;
    return (<KanbanContext.Provider value={{
            displaySettings: displaySettings,
            selectedGroup: selectedGroup,
            setSelectedGroup: setSelectedGroup,
            tags: tags,
            columnIds: columnIds
        }}>
      {children}
    </KanbanContext.Provider>);
}
function useKanban() {
    var context = (0, react_1.useContext)(KanbanContext);
    if (!context) {
        throw new Error("useKanban must be used within a KanbanProvider");
    }
    return context;
}
