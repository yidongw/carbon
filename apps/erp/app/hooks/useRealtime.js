"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRealtime = useRealtime;
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var useUser_1 = require("./useUser");
function useRealtime(table, filter) {
    var company = (0, useUser_1.useUser)().company;
    var revalidator = (0, react_router_1.useRevalidator)();
    var channel = (0, react_1.useRealtimeChannel)({
        topic: "postgres_changes:".concat(table),
        dependencies: [company.id, filter],
        setup: function (channel) {
            return channel.on("postgres_changes", { event: "*", schema: "public", table: table, filter: filter }, function (payload) {
                if ("companyId" in payload && payload.companyId !== company.id) {
                    return;
                }
                console.log("🌀 Revalidaiton payload received:", payload);
                revalidator.revalidate();
            });
        }
    });
    return channel;
}
