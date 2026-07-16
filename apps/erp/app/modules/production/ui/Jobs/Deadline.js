"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeadlineIcon = getDeadlineIcon;
var bs_1 = require("react-icons/bs");
var HighPriorityIcon_1 = require("~/assets/icons/HighPriorityIcon");
var LowPriorityIcon_1 = require("~/assets/icons/LowPriorityIcon");
var MediumPriorityIcon_1 = require("~/assets/icons/MediumPriorityIcon");
function getDeadlineIcon(deadlineType) {
    switch (deadlineType) {
        case "ASAP":
            return <bs_1.BsExclamationSquareFill className="text-red-500"/>;
        case "Hard Deadline":
            return <HighPriorityIcon_1.HighPriorityIcon />;
        case "Soft Deadline":
            return <MediumPriorityIcon_1.MediumPriorityIcon />;
        case "No Deadline":
            return <LowPriorityIcon_1.LowPriorityIcon />;
    }
}
