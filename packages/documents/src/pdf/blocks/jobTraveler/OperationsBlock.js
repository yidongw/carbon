"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationsBlock = OperationsBlock;
var env_1 = require("@carbon/env");
var utils_1 = require("@carbon/utils");
var renderer_1 = require("@react-pdf/renderer");
var qr_code_1 = require("../../../qr/qr-code");
var components_1 = require("../../components");
var tw_1 = require("./tw");
function getStartPath(operationId) {
    return "".concat((0, env_1.getMESUrl)(), "/x/start/").concat(operationId);
}
function getEndPath(operationId) {
    return "".concat((0, env_1.getMESUrl)(), "/x/end/").concat(operationId);
}
function getParallelizedOrder(index, item, items) {
    var _a;
    if ((item === null || item === void 0 ? void 0 : item.operationOrder) !== "With Previous")
        return index + 1;
    // traverse backwards to find the first non-"With Previous" item.
    for (var i = index - 1; i >= 0; i--) {
        if (((_a = items[i]) === null || _a === void 0 ? void 0 : _a.operationOrder) !== "With Previous") {
            return i + 1;
        }
    }
    return 1;
}
/** Routing table: seq, operation, expected times, QR actions, steps, work instructions. */
function OperationsBlock(_a) {
    var _b;
    var block = _a.block, data = _a.data;
    var jobOperations = data.jobOperations;
    var includeWorkInstructions = (_b = block.showWorkInstructions) !== null && _b !== void 0 ? _b : false;
    return (<renderer_1.View style={(0, tw_1.tw)("mb-6 text-xs")}>
      <renderer_1.View style={(0, tw_1.tw)("flex flex-row justify-between items-center py-3 px-[6px] border-t border-b border-gray-300 font-bold uppercase page-break-inside-avoid gap-x-6")}>
        <renderer_1.Text style={(0, tw_1.tw)("w-1/12 text-left")}>Seq</renderer_1.Text>
        <renderer_1.Text style={(0, tw_1.tw)("w-8/12 text-left")}>Operation</renderer_1.Text>
        <renderer_1.Text style={(0, tw_1.tw)("w-3/12 text-left")}>Expected Times</renderer_1.Text>
      </renderer_1.View>

      {jobOperations
            .sort(function (a, b) { return a.order - b.order; })
            .map(function (operation, index) {
            var isInside = operation.operationType === "Inside";
            var setupQrCode = operation.setupTime > 0
                ? (0, qr_code_1.generateQRCode)("".concat(getStartPath(operation.id), "?type=Setup"), 10)
                : null;
            var laborQrCode = operation.laborTime > 0
                ? (0, qr_code_1.generateQRCode)("".concat(getStartPath(operation.id), "?type=Labor"), 10)
                : null;
            var machiningQrCode = operation.machineTime > 0
                ? (0, qr_code_1.generateQRCode)("".concat(getStartPath(operation.id), "?type=Machine"), 10)
                : null;
            var completeQrCode = (0, qr_code_1.generateQRCode)(getEndPath(operation.id), 10);
            if (setupQrCode === null &&
                laborQrCode === null &&
                machiningQrCode === null) {
                laborQrCode = (0, qr_code_1.generateQRCode)("".concat(getStartPath(operation.id), "?type=Labor"), 10);
            }
            var setupTimeFormatted = (0, utils_1.formatFactor)(operation.setupTime, operation.setupUnit);
            var laborTimeFormatted = (0, utils_1.formatFactor)(operation.laborTime, operation.laborUnit);
            var machineTimeFormatted = (0, utils_1.formatFactor)(operation.machineTime, operation.machineUnit);
            var hasExpectedTimes = setupTimeFormatted || laborTimeFormatted || machineTimeFormatted;
            var workInstruction = operation.workInstruction;
            var hasWorkInstruction = includeWorkInstructions &&
                workInstruction &&
                typeof workInstruction === "object" &&
                "content" in workInstruction &&
                Array.isArray(workInstruction.content) &&
                workInstruction.content.length > 0;
            var hasProcedureSteps = includeWorkInstructions &&
                operation.jobOperationStep &&
                operation.jobOperationStep.length > 0;
            return (<renderer_1.View style={(0, tw_1.tw)("flex flex-col border-b border-gray-300 py-4 px-[6px] page-break-inside-avoid")} key={operation.id} wrap={includeWorkInstructions ? true : false}>
              <renderer_1.View style={(0, tw_1.tw)("flex flex-col gap-y-4")} wrap={false}>
                <renderer_1.View style={(0, tw_1.tw)("flex flex-row justify-between items-start gap-x-6")} wrap={false}>
                  <renderer_1.Text style={(0, tw_1.tw)("w-1/12 font-bold text-left")}>
                    {getParallelizedOrder(index, operation, jobOperations)}
                  </renderer_1.Text>
                  <renderer_1.View style={(0, tw_1.tw)("w-8/12 text-left text-[12px]")}>
                    <renderer_1.Text style={(0, tw_1.tw)("font-bold")}>{operation.description}</renderer_1.Text>
                  </renderer_1.View>
                  <renderer_1.View style={(0, tw_1.tw)("w-3/12 text-left")}>
                    {hasExpectedTimes && (<renderer_1.View style={(0, tw_1.tw)("flex flex-col gap-1")}>
                        {setupTimeFormatted && (<renderer_1.Text style={(0, tw_1.tw)("text-[10px]")}>
                            Setup: {setupTimeFormatted}
                          </renderer_1.Text>)}
                        {laborTimeFormatted && (<renderer_1.Text style={(0, tw_1.tw)("text-[10px]")}>
                            Labor: {laborTimeFormatted}
                          </renderer_1.Text>)}
                        {machineTimeFormatted && (<renderer_1.Text style={(0, tw_1.tw)("text-[10px]")}>
                            Machine: {machineTimeFormatted}
                          </renderer_1.Text>)}
                      </renderer_1.View>)}
                  </renderer_1.View>
                </renderer_1.View>

                <renderer_1.View style={(0, tw_1.tw)("flex flex-row justify-between items-center py-3 px-[6px] border-gray-300 font-bold uppercase page-break-inside-avoid")}>
                  <renderer_1.Text style={(0, tw_1.tw)("text-left pr-4")}>Actions</renderer_1.Text>
                </renderer_1.View>

                <renderer_1.View style={(0, tw_1.tw)("w-full flex flex-row justify-start gap-2")}>
                  {isInside && setupQrCode && (<renderer_1.View style={(0, tw_1.tw)("flex flex-col items-center w-1/4")}>
                      <>
                        <renderer_1.Image src={setupQrCode} style={(0, tw_1.tw)("w-16 h-16")}/>
                        <renderer_1.Text style={(0, tw_1.tw)("text-[10px] mt-1")}>Setup</renderer_1.Text>
                      </>
                    </renderer_1.View>)}

                  {isInside && laborQrCode && (<renderer_1.View style={(0, tw_1.tw)("flex flex-col items-center w-1/4")}>
                      <>
                        <renderer_1.Image src={laborQrCode} style={(0, tw_1.tw)("w-16 h-16")}/>
                        <renderer_1.Text style={(0, tw_1.tw)("text-[10px] mt-1")}>Labor</renderer_1.Text>
                      </>
                    </renderer_1.View>)}
                  {isInside && machiningQrCode && (<renderer_1.View style={(0, tw_1.tw)("flex flex-col items-center w-1/4")}>
                      <>
                        <renderer_1.Image src={machiningQrCode} style={(0, tw_1.tw)("w-16 h-16")}/>
                        <renderer_1.Text style={(0, tw_1.tw)("text-[10px] mt-1")}>Machine</renderer_1.Text>
                      </>
                    </renderer_1.View>)}
                  <renderer_1.View style={(0, tw_1.tw)("flex flex-col items-center w-1/4")}>
                    <renderer_1.Image src={completeQrCode} style={(0, tw_1.tw)("w-16 h-16")}/>
                    <renderer_1.Text style={(0, tw_1.tw)("text-[10px] mt-1")}>Complete</renderer_1.Text>
                  </renderer_1.View>
                </renderer_1.View>
              </renderer_1.View>

              {(hasWorkInstruction || hasProcedureSteps) && (<renderer_1.View style={(0, tw_1.tw)("mt-2 ml-8")}>
                  {hasProcedureSteps && (<renderer_1.View style={(0, tw_1.tw)("mb-2")}>
                      <renderer_1.Text style={{
                            marginBottom: 8,
                            borderTopWidth: 1,
                            borderTopColor: "#d1d5db",
                            borderBottomWidth: 1,
                            borderColor: "#d1d5db",
                            paddingTop: 4,
                            paddingBottom: 4,
                            fontSize: 9,
                            fontWeight: 700,
                            textTransform: "uppercase"
                        }}>
                        Procedure Steps
                      </renderer_1.Text>
                      {operation
                            .jobOperationStep.sort(function (a, b) { return a.sortOrder - b.sortOrder; })
                            .map(function (step) {
                            var stepDescription = step.description;
                            var hasStepDescription = stepDescription &&
                                typeof stepDescription === "object" &&
                                "content" in stepDescription &&
                                Array.isArray(stepDescription.content) &&
                                stepDescription.content.length > 0;
                            return (<renderer_1.View key={step.id} style={(0, tw_1.tw)("flex flex-row items-start mb-1")}>
                              <renderer_1.View style={{
                                    width: 9,
                                    height: 9,
                                    borderWidth: 1,
                                    borderColor: "#374151",
                                    marginRight: 6,
                                    marginTop: 1
                                }}/>
                              <renderer_1.View style={(0, tw_1.tw)("flex-1")}>
                                <renderer_1.Text style={(0, tw_1.tw)("text-[9px] font-bold")}>
                                  {step.name}
                                </renderer_1.Text>
                                {hasStepDescription && (<components_1.Note title="Procedure Step" content={stepDescription}/>)}
                              </renderer_1.View>
                            </renderer_1.View>);
                        })}
                    </renderer_1.View>)}
                  {hasWorkInstruction && (<components_1.Note title="Work Instructions" content={workInstruction}/>)}
                </renderer_1.View>)}
            </renderer_1.View>);
        })}
    </renderer_1.View>);
}
