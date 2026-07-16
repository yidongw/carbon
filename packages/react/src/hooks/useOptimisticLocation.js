"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOptimisticLocation = useOptimisticLocation;
// credit: Matt Aitken at trigger.dev
var react_router_1 = require("react-router");
function useOptimisticLocation() {
    var navigation = (0, react_router_1.useNavigation)();
    var location = (0, react_router_1.useLocation)();
    if (navigation.state === "idle" || !navigation.location) {
        return location;
    }
    return navigation.location;
}
