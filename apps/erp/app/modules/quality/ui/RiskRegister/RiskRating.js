"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskRating = RiskRating;
function RiskRating(_a) {
    var rating = _a.rating, _b = _a.size, size = _b === void 0 ? "default" : _b;
    var getColor = function (rating) {
        switch (rating) {
            case 5:
                return "bg-red-500";
            case 4:
                return "bg-orange-500";
            case 3:
                return "bg-yellow-500";
            case 2:
                return "bg-emerald-500";
            case 1:
            default:
                return "bg-emerald-500";
        }
    };
    var getBarSize = function (size) {
        switch (size) {
            case "sm":
                return "h-3 w-1";
            case "default":
            default:
                return "h-4 w-2";
        }
    };
    var bars = Array.from({ length: rating }, function (_, index) { return (<div key={index} className={"".concat(getBarSize(size), " ").concat(getColor(rating))}/>); });
    return <div className="flex items-center gap-0.5">{bars}</div>;
}
