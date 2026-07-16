"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewersBlock = ReviewersBlock;
var renderer_1 = require("@react-pdf/renderer");
var components_1 = require("../../components");
var tw_1 = require("../tw");
/** MRB reviewer list with per-reviewer status + notes. Empty → nothing. */
function ReviewersBlock(_a) {
    var data = _a.data;
    var tw = (0, tw_1.useTw)();
    var reviewers = data.reviewers;
    if (reviewers.length === 0)
        return null;
    return (<renderer_1.View style={tw("border border-gray-200 mb-4")}>
      <renderer_1.View style={tw("p-3")}>
        <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-2 uppercase")}>
          MRB
        </renderer_1.Text>
        {reviewers.map(function (reviewer, index) {
            var _a;
            return (<renderer_1.View key={reviewer.id} style={tw("flex flex-col gap-1 py-2 ".concat(index < reviewers.length - 1 ? "border-b border-gray-200" : ""))}>
            <renderer_1.View style={tw("flex flex-row justify-between")}>
              <renderer_1.Text style={tw("text-[10px] font-bold text-gray-800")}>
                {reviewer.title}
              </renderer_1.Text>
              <renderer_1.Text style={tw("text-[10px] text-gray-600")}>
                {reviewer.status}
              </renderer_1.Text>
            </renderer_1.View>

            {Object.keys((_a = reviewer.notes) !== null && _a !== void 0 ? _a : {}).length > 0 && (<renderer_1.View style={tw("mt-1")}>
                <components_1.Note content={reviewer.notes}/>
              </renderer_1.View>)}
          </renderer_1.View>);
        })}
      </renderer_1.View>
    </renderer_1.View>);
}
