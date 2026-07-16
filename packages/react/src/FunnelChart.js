"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunnelChart = FunnelChart;
var curve_1 = require("@visx/curve");
var responsive_1 = require("@visx/responsive");
var scale_1 = require("@visx/scale");
var shape_1 = require("@visx/shape");
var text_1 = require("@visx/text");
var framer_motion_1 = require("framer-motion");
var react_1 = require("react");
var hooks_1 = require("./hooks");
var cn_1 = require("./utils/cn");
function FunnelChart(props) {
    var _a;
    return (<div className={(_a = props.className) !== null && _a !== void 0 ? _a : "size-full"}>
      <responsive_1.ParentSize className="relative">
        {function (_a) {
            var width = _a.width, height = _a.height;
            return width ? (<FunnelChartContent {...props} width={width} height={height || 420}/>) : null;
        }}
      </responsive_1.ParentSize>
    </div>);
}
var layers = [
    {
        opacity: 1,
        padding: 0
    },
    {
        opacity: 0.3,
        padding: 8
    },
    {
        opacity: 0.15,
        padding: 16
    }
];
var maxLayerPadding = 12;
var chartPadding = 40;
function FunnelChartContent(_a) {
    var width = _a.width, height = _a.height, steps = _a.steps, currencyFormatter = _a.currencyFormatter, numberFormatter = _a.numberFormatter, defaultTooltipStepId = _a.defaultTooltipStepId;
    var isMobile = (0, hooks_1.useIsMobile)();
    var _b = (0, react_1.useState)(defaultTooltipStepId !== null && defaultTooltipStepId !== void 0 ? defaultTooltipStepId : null), activeTooltip = _b[0], setActiveTooltip = _b[1];
    var activeStep = steps.find(function (_a) {
        var id = _a.id;
        return id === activeTooltip;
    });
    var funnelData = (0, react_1.useMemo)(function () {
        return Object.fromEntries(steps.map(function (_a, idx) {
            var _b, _c;
            var id = _a.id, value = _a.value;
            return [
                id,
                generateCurvePoints(value, (_c = (_b = steps[idx + 1]) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : steps[steps.length - 1].value)
            ];
        }));
    }, [steps]);
    var emptyData = (0, react_1.useMemo)(function () { return generateCurvePoints(0, 0); }, []);
    var highestValue = (0, react_1.useMemo)(function () { return Math.max.apply(Math, steps.map(function (step) { return step.value; })); }, [steps]);
    var xScale = (0, scale_1.scaleLinear)({
        domain: [0, steps.length],
        range: [0, width]
    });
    var yScale = (0, scale_1.scaleLinear)({
        domain: [highestValue, -highestValue],
        range: [
            height - maxLayerPadding - chartPadding,
            maxLayerPadding + chartPadding
        ]
    });
    return (<div className="relative">
      <svg width={width} height={height}>
        {steps.map(function (_a, idx) {
            var id = _a.id, value = _a.value, colorClassName = _a.colorClassName;
            var stepCenterX = (xScale(idx) + xScale(idx + 1)) / 2;
            return (<react_1.Fragment key={id}>
              {/* Background interaction area */}
              <rect x={xScale(idx)} y={0} width={width / steps.length} height={height} className="fill-transparent transition-colors hover:fill-foreground/5" onPointerEnter={function () { return setActiveTooltip(id); }} onPointerDown={function () { return setActiveTooltip(id); }} onPointerLeave={function () {
                    return !isMobile && setActiveTooltip(defaultTooltipStepId !== null && defaultTooltipStepId !== void 0 ? defaultTooltipStepId : null);
                }}/>

              {/* Vertical divider */}
              <line x1={xScale(idx)} y1={0} x2={xScale(idx)} y2={height} className="stroke-black/5 sm:stroke-black/10"/>

              {/* Funnel */}
              {layers.map(function (_a) {
                    var opacity = _a.opacity, padding = _a.padding;
                    return (<shape_1.Area key={"".concat(id, "-").concat(opacity, "-").concat(padding)} data={funnelData[id]} curve={curve_1.curveBasis} x={function (d) { return xScale(idx + d.x); }} y0={function (d) { return yScale(-d.y) - padding; }} y1={function (d) { return yScale(d.y) + padding; }}>
                  {function (_a) {
                            var path = _a.path;
                            return (<framer_motion_1.motion.path initial={{ d: path(emptyData) || "", opacity: 0 }} animate={{ d: path(funnelData[id]) || "", opacity: opacity }} className={(0, cn_1.cn)(colorClassName, "pointer-events-none")} fill="currentColor"/>);
                        }}
                </shape_1.Area>);
                })}

              <Percentage x={stepCenterX} y={height / 2} value={value === 0
                    ? "0%"
                    : formatPercent((value / highestValue) * 100, numberFormatter) + "%"} colorClassName={colorClassName}/>
            </react_1.Fragment>);
        })}
      </svg>
      {activeStep && (<div key={activeStep.id} className="pointer-events-none absolute flex items-center justify-center px-1 pb-4 animate-slide-up-fade top-1/2 -translate-y-1/2" style={{
                left: xScale(steps.findIndex(function (_a) {
                    var id = _a.id;
                    return id === activeStep.id;
                })),
                width: width / steps.length
            }}>
          <div className={(0, cn_1.cn)("rounded-lg border border-border bg-card text-base")}>
            <p className="border-b border-border p-3 text-sm text-foreground">
              {activeStep.label}
            </p>
            <div className="flex flex-wrap justify-between gap-3 p-3 text-sm">
              <div className="flex items-center gap-2">
                <div className={(0, cn_1.cn)(activeStep.colorClassName, "size-2 shrink-0 rounded-sm bg-current")}/>
                <p className="whitespace-nowrap text-muted-foreground">
                  {activeStep.value === 0
                ? "0%"
                : formatPercent((activeStep.value / highestValue) * 100, numberFormatter) + "%"}
                </p>
              </div>
              <p className="whitespace-nowrap text-foreground">
                {numberFormatter.format(activeStep.value)}
                {activeStep.additionalValue !== undefined && (<span className="text-muted-foreground">
                    {" "}
                    {currencyFormatter.format(activeStep.additionalValue)}
                  </span>)}
              </p>
            </div>
          </div>
        </div>)}
    </div>);
}
function Percentage(_a) {
    var _b, _c;
    var x = _a.x, y = _a.y, value = _a.value, colorClassName = _a.colorClassName;
    var textRef = (0, react_1.useRef)(null);
    var textWidth = (_c = (_b = textRef.current) === null || _b === void 0 ? void 0 : _b.getComputedTextLength()) !== null && _c !== void 0 ? _c : 0;
    return (<g>
      <text_1.Text innerTextRef={textRef} x={x} y={y} width={textWidth} textAnchor="middle" verticalAnchor="middle" fontSize={14} className={(0, cn_1.cn)("pointer-events-none select-none font-medium fill-white", colorClassName)}>
        {value}
      </text_1.Text>
    </g>);
}
function formatPercent(value, numberFormatter) {
    return value > 0 && value < 0.01 ? "< 0.01" : numberFormatter.format(value);
}
function generateCurvePoints(from, to) {
    return [
        { x: 0, y: from },
        { x: 0.3, y: from },
        { x: 0.5, y: (from + to) / 2 },
        { x: 0.7, y: to },
        { x: 1, y: to }
    ];
}
