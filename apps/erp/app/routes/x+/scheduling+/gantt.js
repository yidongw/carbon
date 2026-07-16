"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.default = GanttView;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var Gantt_1 = require("~/components/Gantt");
var useReplaceLocation_1 = require("~/hooks/useReplaceLocation");
var resizable_panels_1 = require("~/utils/resizable-panels");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var resizeSettings;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, resizable_panels_1.getResizableGanttSettings)(request)];
                case 2:
                    resizeSettings = _c.sent();
                    return [2 /*return*/, {
                            trace: {
                                events: [
                                    {
                                        id: "1",
                                        parentId: undefined,
                                        hasChildren: true,
                                        children: ["2", "3"],
                                        level: 0,
                                        data: {
                                            duration: 42000,
                                            offset: 0,
                                            level: "TRACE",
                                            message: "WO-012345",
                                            isPartial: false,
                                            isRoot: true,
                                            isError: false,
                                            style: {
                                                icon: "job"
                                            }
                                        }
                                    },
                                    {
                                        id: "2",
                                        parentId: "1",
                                        hasChildren: true,
                                        children: ["4"],
                                        level: 1,
                                        data: {
                                            duration: 10000,
                                            offset: 0,
                                            level: "TRACE",
                                            message: "Plasma",
                                            isPartial: false,
                                            isRoot: false,
                                            isError: false,
                                            style: {
                                                variant: "primary",
                                                icon: "operation"
                                            }
                                        }
                                    },
                                    {
                                        id: "4",
                                        parentId: "2",
                                        hasChildren: false,
                                        children: [],
                                        level: 2,
                                        data: {
                                            duration: 10000,
                                            offset: 0,
                                            level: "TRACE",
                                            message: "Timecard",
                                            isPartial: false,
                                            isRoot: false,
                                            isError: false,
                                            style: {
                                                variant: "primary",
                                                icon: "timecard",
                                                accessory: {
                                                    style: "person",
                                                    items: [
                                                        {
                                                            text: "Anne Barbin"
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: "3",
                                        parentId: "1",
                                        hasChildren: true,
                                        children: ["5", "6"],
                                        level: 1,
                                        data: {
                                            duration: 8000,
                                            offset: 13000,
                                            level: "TRACE",
                                            message: "Bend",
                                            isPartial: false,
                                            isRoot: false,
                                            isError: true,
                                            style: {
                                                variant: "primary",
                                                icon: "operation"
                                            }
                                        }
                                    },
                                    {
                                        id: "5",
                                        parentId: "3",
                                        hasChildren: false,
                                        children: [],
                                        level: 2,
                                        data: {
                                            duration: 8000,
                                            offset: 13000,
                                            level: "TRACE",
                                            message: "Timecard",
                                            isPartial: false,
                                            isRoot: false,
                                            isError: true,
                                            style: {
                                                variant: "primary",
                                                icon: "timecard",
                                                accessory: {
                                                    style: "person",
                                                    items: [
                                                        {
                                                            text: "Brad Barbin"
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: "6",
                                        parentId: "3",
                                        hasChildren: false,
                                        children: [],
                                        level: 2,
                                        data: {
                                            duration: 0,
                                            offset: 21000,
                                            level: "ERROR",
                                            message: "Inspection",
                                            isPartial: false,
                                            isRoot: false,
                                            isError: true,
                                            style: {
                                                icon: "inspection",
                                                variant: "primary",
                                                accessory: {
                                                    style: "person",
                                                    items: [
                                                        {
                                                            text: "Brigette Barbin"
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: "7",
                                        parentId: "1",
                                        hasChildren: true,
                                        children: ["8"],
                                        level: 1,
                                        data: {
                                            duration: 10000,
                                            offset: 21000,
                                            level: "TRACE",
                                            message: "Plasma",
                                            isPartial: false,
                                            isRoot: false,
                                            isError: false,
                                            style: {
                                                variant: "primary",
                                                icon: "operation"
                                            }
                                        }
                                    },
                                    {
                                        id: "8",
                                        parentId: "7",
                                        hasChildren: false,
                                        children: [],
                                        level: 2,
                                        data: {
                                            duration: 10000,
                                            offset: 21000,
                                            level: "TRACE",
                                            message: "Timecard",
                                            isPartial: false,
                                            isRoot: false,
                                            isError: false,
                                            style: {
                                                variant: "primary",
                                                icon: "timecard",
                                                accessory: {
                                                    style: "person",
                                                    items: [
                                                        {
                                                            text: "Anne Barbin"
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: "9",
                                        parentId: "1",
                                        hasChildren: true,
                                        children: ["10", "11"],
                                        level: 1,
                                        data: {
                                            duration: 8000,
                                            offset: 34000,
                                            level: "TRACE",
                                            message: "Bend",
                                            isPartial: false,
                                            isRoot: false,
                                            isError: false,
                                            style: {
                                                variant: "primary",
                                                icon: "operation"
                                            }
                                        }
                                    },
                                    {
                                        id: "10",
                                        parentId: "9",
                                        hasChildren: false,
                                        children: [],
                                        level: 2,
                                        data: {
                                            duration: 8000,
                                            offset: 34000,
                                            level: "TRACE",
                                            message: "Timecard",
                                            isPartial: false,
                                            isRoot: false,
                                            isError: false,
                                            style: {
                                                variant: "primary",
                                                icon: "timecard",
                                                accessory: {
                                                    style: "person",
                                                    items: [
                                                        {
                                                            text: "Brad Barbin"
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: "11",
                                        parentId: "9",
                                        hasChildren: false,
                                        children: [],
                                        level: 2,
                                        data: {
                                            duration: 0,
                                            offset: 42000,
                                            level: "LOG",
                                            message: "Inspection",
                                            isPartial: false,
                                            isRoot: false,
                                            isError: false,
                                            style: {
                                                icon: "inspection",
                                                variant: "primary",
                                                accessory: {
                                                    style: "person",
                                                    items: [
                                                        {
                                                            text: "Brigette Barbin"
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ],
                                parentReadableId: "",
                                duration: 42000,
                                rootSpanStatus: "completed",
                                rootStartedAt: new Date()
                            },
                            resizeSettings: resizeSettings
                        }];
            }
        });
    });
}
function getSpanId(location) {
    var _a;
    var search = new URLSearchParams(location.search);
    return (_a = search.get("span")) !== null && _a !== void 0 ? _a : undefined;
}
function GanttView() {
    var _a = (0, react_router_1.useLoaderData)(), trace = _a.trace, resizeSettings = _a.resizeSettings;
    var _b = (0, useReplaceLocation_1.useReplaceLocation)(), location = _b.location, replaceSearchParam = _b.replaceSearchParam;
    var selectedSpanId = getSpanId(location);
    var events = trace.events, parentReadableId = trace.parentReadableId, duration = trace.duration, rootSpanStatus = trace.rootSpanStatus, rootStartedAt = trace.rootStartedAt;
    var changeToSpan = (0, react_1.useDebounce)(function (selectedSpan) {
        replaceSearchParam("span", selectedSpan);
    }, 250);
    return (<div className={(0, react_1.cn)("grid h-full max-h-full grid-cols-1 overflow-hidden bg-background")}>
      <react_1.ClientOnly fallback={null}>
        {function () {
            var _a, _b, _c, _d;
            return (<react_1.ResizablePanelGroup direction="horizontal" className="h-full max-h-full" onLayout={function (layout) {
                    if (layout.length !== 2)
                        return;
                    if (!selectedSpanId)
                        return;
                    (0, resizable_panels_1.setResizableGanttSettings)(document, layout);
                }}>
            <react_1.ResizablePanel order={1} minSize={30} defaultSize={(_a = resizeSettings.layout) === null || _a === void 0 ? void 0 : _a[0]}>
              <Gantt_1.Gantt selectedId={selectedSpanId} key={(_c = (_b = events[0]) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : "-"} events={events} parentReadableId={parentReadableId} onSelectedIdChanged={function (selectedSpan) {
                    //instantly close the panel if no span is selected
                    if (!selectedSpan) {
                        replaceSearchParam("span");
                        return;
                    }
                    changeToSpan(selectedSpan);
                }} totalDuration={duration} rootSpanStatus={rootSpanStatus} rootStartedAt={rootStartedAt}/>
            </react_1.ResizablePanel>
            <react_1.ResizableHandle withHandle/>
            {selectedSpanId && (<react_1.ResizablePanel order={2} minSize={30} defaultSize={(_d = resizeSettings.layout) === null || _d === void 0 ? void 0 : _d[1]}>
                {/* <SpanView
                  runParam={run.readableId}
                  spanId={selectedSpanId}
                  closePanel={() => replaceSearchParam("span")}
                /> */}
              </react_1.ResizablePanel>)}
          </react_1.ResizablePanelGroup>);
        }}
      </react_1.ClientOnly>
    </div>);
}
