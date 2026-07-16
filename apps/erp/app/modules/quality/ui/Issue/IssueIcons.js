"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPriorityIcon = getPriorityIcon;
exports.getSourceIcon = getSourceIcon;
var react_1 = require("@carbon/react");
var bs_1 = require("react-icons/bs");
var lu_1 = require("react-icons/lu");
var HighPriorityIcon_1 = require("~/assets/icons/HighPriorityIcon");
var LowPriorityIcon_1 = require("~/assets/icons/LowPriorityIcon");
var MediumPriorityIcon_1 = require("~/assets/icons/MediumPriorityIcon");
function getPriorityIcon(priority, overdue) {
    switch (priority) {
        case "Critical":
            return <bs_1.BsExclamationSquareFill className="text-red-500"/>;
        case "High":
            return <HighPriorityIcon_1.HighPriorityIcon className={(0, react_1.cn)(overdue ? "text-red-500" : "")}/>;
        case "Medium":
            return (<MediumPriorityIcon_1.MediumPriorityIcon className={(0, react_1.cn)(overdue ? "text-red-500" : "")}/>);
        case "Low":
            return <LowPriorityIcon_1.LowPriorityIcon />;
    }
}
function getSourceIcon(source, overdue) {
    switch (source) {
        case "Internal":
            return <lu_1.LuFactory />;
        case "External":
            return <lu_1.LuShoppingCart />;
    }
}
