"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobDetailsBlock = JobDetailsBlock;
var utils_1 = require("@carbon/utils");
var renderer_1 = require("@react-pdf/renderer");
var tw_1 = require("./tw");
var jobHeaderStyles = renderer_1.StyleSheet.create({
    jobHeader: {
        border: "1px solid #CCC",
        borderRadius: 6,
        padding: 16,
        fontSize: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
        gap: 60
    },
    leftSection: {
        flex: 1,
        marginTop: 5
    },
    rightSection: {
        flex: 1
    },
    infoRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4
    },
    label: {
        fontSize: 11,
        fontWeight: 600,
        color: "#374151"
    },
    value: {
        fontSize: 11,
        fontWeight: 400,
        color: "#111827"
    }
});
/** The two-column job info box (ids, qty, dates, thumbnail). */
function JobDetailsBlock(_a) {
    var _b, _c;
    var data = _a.data;
    var job = data.job, item = data.item, customer = data.customer, batchNumber = data.batchNumber, methodRevision = data.methodRevision, thumbnail = data.thumbnail, locale = data.locale, jobOperations = data.jobOperations;
    var getTargetInfo = function () {
        if (job.salesOrderId && job.salesOrderLineId) {
            return "Sales Order: ".concat(job.salesOrderReadableId || "Make to Order");
        }
        return "Inventory";
    };
    var getTrackingNumber = function () {
        if (batchNumber) {
            return "".concat(item.itemTrackingType, " Number: ").concat(batchNumber);
        }
        return null;
    };
    return (<renderer_1.View style={(0, tw_1.tw)("mb-6")}>
      <renderer_1.View style={jobHeaderStyles.jobHeader}>
        <renderer_1.View style={jobHeaderStyles.leftSection}>
          <renderer_1.View style={jobHeaderStyles.infoRow}>
            <renderer_1.Text style={jobHeaderStyles.label}>Job ID:</renderer_1.Text>
            <renderer_1.Text style={jobHeaderStyles.value}>{job.jobId}</renderer_1.Text>
          </renderer_1.View>

          <renderer_1.View style={jobHeaderStyles.infoRow}>
            <renderer_1.Text style={jobHeaderStyles.label}>Part ID:</renderer_1.Text>
            <renderer_1.Text style={jobHeaderStyles.value}>
              {job.itemReadableIdWithRevision}
            </renderer_1.Text>
          </renderer_1.View>

          {methodRevision && methodRevision !== "0" && (<renderer_1.View style={jobHeaderStyles.infoRow}>
              <renderer_1.Text style={jobHeaderStyles.label}>Method Revision:</renderer_1.Text>
              <renderer_1.Text style={jobHeaderStyles.value}>V{methodRevision}</renderer_1.Text>
            </renderer_1.View>)}

          {getTrackingNumber() && (<renderer_1.View style={jobHeaderStyles.infoRow}>
              <renderer_1.Text style={jobHeaderStyles.label}>Tracking:</renderer_1.Text>
              <renderer_1.Text style={jobHeaderStyles.value}>{getTrackingNumber()}</renderer_1.Text>
            </renderer_1.View>)}

          <renderer_1.View style={jobHeaderStyles.infoRow}>
            <renderer_1.Text style={jobHeaderStyles.label}>Item:</renderer_1.Text>
            <renderer_1.Text style={jobHeaderStyles.value}>
              {item.name || item.readableIdWithRevision}
            </renderer_1.Text>
          </renderer_1.View>

          <renderer_1.View style={jobHeaderStyles.infoRow}>
            <renderer_1.Text style={jobHeaderStyles.label}>Quantity:</renderer_1.Text>
            <renderer_1.Text style={jobHeaderStyles.value}>
              {(_c = (_b = jobOperations === null || jobOperations === void 0 ? void 0 : jobOperations[0]) === null || _b === void 0 ? void 0 : _b.targetQuantity) !== null && _c !== void 0 ? _c : job.quantity}{" "}
              {job.unitOfMeasureCode}
            </renderer_1.Text>
          </renderer_1.View>

          {job.scrapQuantity && job.scrapQuantity > 0 && (<renderer_1.View style={jobHeaderStyles.infoRow}>
              <renderer_1.Text style={jobHeaderStyles.label}>Scrap Qty:</renderer_1.Text>
              <renderer_1.Text style={jobHeaderStyles.value}>
                {job.scrapQuantity} {job.unitOfMeasureCode}
              </renderer_1.Text>
            </renderer_1.View>)}
          <renderer_1.View style={jobHeaderStyles.infoRow}>
            <renderer_1.Text style={jobHeaderStyles.label}>Target:</renderer_1.Text>
            <renderer_1.Text style={jobHeaderStyles.value}>{getTargetInfo()}</renderer_1.Text>
          </renderer_1.View>
          {customer && (<renderer_1.View style={jobHeaderStyles.infoRow}>
              <renderer_1.Text style={jobHeaderStyles.label}>Customer:</renderer_1.Text>
              <renderer_1.Text style={jobHeaderStyles.value}>{customer.name}</renderer_1.Text>
            </renderer_1.View>)}

          {job.startDate && (<renderer_1.View style={jobHeaderStyles.infoRow}>
              <renderer_1.Text style={jobHeaderStyles.label}>Start Date:</renderer_1.Text>
              <renderer_1.Text style={jobHeaderStyles.value}>
                {(0, utils_1.formatDate)(job.startDate, undefined, locale)}
              </renderer_1.Text>
            </renderer_1.View>)}

          {job.dueDate && (<renderer_1.View style={jobHeaderStyles.infoRow}>
              <renderer_1.Text style={jobHeaderStyles.label}>Due Date:</renderer_1.Text>
              <renderer_1.Text style={jobHeaderStyles.value}>
                {(0, utils_1.formatDate)(job.dueDate, undefined, locale)}
              </renderer_1.Text>
            </renderer_1.View>)}

          {job.deadlineType && (<renderer_1.View style={jobHeaderStyles.infoRow}>
              <renderer_1.Text style={jobHeaderStyles.label}>Deadline Type:</renderer_1.Text>
              <renderer_1.Text style={jobHeaderStyles.value}>{job.deadlineType}</renderer_1.Text>
            </renderer_1.View>)}
        </renderer_1.View>

        <renderer_1.View style={jobHeaderStyles.rightSection}>
          {thumbnail && (<renderer_1.View>
              <renderer_1.Image src={thumbnail} style={(0, tw_1.tw)("w-full h-auto border rounded-lg border-gray-300")}/>
            </renderer_1.View>)}
        </renderer_1.View>
      </renderer_1.View>
    </renderer_1.View>);
}
