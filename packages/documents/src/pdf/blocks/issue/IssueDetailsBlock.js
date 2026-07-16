"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueDetailsBlock = IssueDetailsBlock;
var utils_1 = require("@carbon/utils");
var renderer_1 = require("@react-pdf/renderer");
var tw_1 = require("../tw");
/** Two-column issue metadata box (name/type/status/initiator + dates). */
function IssueDetailsBlock(_a) {
    var data = _a.data;
    var tw = (0, tw_1.useTw)();
    var nonConformance = data.nonConformance, nonConformanceTypes = data.nonConformanceTypes, assignees = data.assignees, locale = data.locale;
    var ncType = nonConformanceTypes.find(function (type) { return type.id === nonConformance.nonConformanceTypeId; });
    return (<renderer_1.View style={tw("border border-gray-200 mb-4")}>
      <renderer_1.View style={tw("flex flex-row")}>
        <renderer_1.View style={tw("w-1/2 p-3 border-r border-gray-200")}>
          <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
            Issue Details
          </renderer_1.Text>
          <renderer_1.View style={tw("text-[10px] text-gray-800")}>
            {nonConformance.name && (<renderer_1.Text style={tw("font-bold")}>{nonConformance.name}</renderer_1.Text>)}
            {(ncType === null || ncType === void 0 ? void 0 : ncType.name) && (<renderer_1.Text style={tw("mt-1")}>Type: {ncType.name}</renderer_1.Text>)}
            {nonConformance.status && (<renderer_1.Text>Status: {nonConformance.status}</renderer_1.Text>)}
            <renderer_1.Text>
              Initiated By: {assignees[nonConformance.createdBy] || "Unknown"}
            </renderer_1.Text>
          </renderer_1.View>
        </renderer_1.View>
        <renderer_1.View style={tw("w-1/2 p-3")}>
          <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
            Dates
          </renderer_1.Text>
          <renderer_1.View style={tw("text-[10px] text-gray-800")}>
            {nonConformance.openDate && (<renderer_1.Text>
                Started:{" "}
                {(0, utils_1.formatDate)(nonConformance.openDate, undefined, locale)}
              </renderer_1.Text>)}
            {nonConformance.closeDate && (<renderer_1.Text>
                Completed:{" "}
                {(0, utils_1.formatDate)(nonConformance.closeDate, undefined, locale)}
              </renderer_1.Text>)}
          </renderer_1.View>
        </renderer_1.View>
      </renderer_1.View>
    </renderer_1.View>);
}
