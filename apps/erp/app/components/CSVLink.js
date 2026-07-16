"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVLink = void 0;
var react_csv_1 = require("react-csv");
// `@types/react-csv` types CSVLink as a class whose `React.Component` signature is
// incompatible with the current React types under tsgo ("Property 'refs' is missing
// in type Component<LinkProps>" → TS2786). Re-export it cast to a plain component
// type so it's usable as JSX. Props stay loose — callers already pass the right shape.
exports.CSVLink = react_csv_1.CSVLink;
