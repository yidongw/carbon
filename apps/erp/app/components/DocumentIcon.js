"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var bs_1 = require("react-icons/bs");
var lu_1 = require("react-icons/lu");
var documentIconBaseClass = "flex w-6 h-6 flex-shrink-0";
var DocumentIcon = function (_a) {
    var type = _a.type, className = _a.className;
    switch (type) {
        case "Document":
            return (<bs_1.BsFileWordFill className={(0, react_1.cn)(documentIconBaseClass, "text-blue-500", className)}/>);
        case "Spreadsheet":
            return (<bs_1.BsFileExcelFill className={(0, react_1.cn)(documentIconBaseClass, "text-emerald-700", className)}/>);
        case "Presentation":
            return (<bs_1.BsFilePptFill className={(0, react_1.cn)(documentIconBaseClass, "text-orange-400", className)}/>);
        case "PDF":
            return (<bs_1.BsFilePdfFill className={(0, react_1.cn)(documentIconBaseClass, "text-red-600", className)}/>);
        case "Archive":
            return <bs_1.BsFileZipFill className={(0, react_1.cn)(documentIconBaseClass, className)}/>;
        case "Text":
            return (<bs_1.BsFileTextFill className={(0, react_1.cn)(documentIconBaseClass, className)}/>);
        case "Image":
            return (<bs_1.BsFileImageFill className={(0, react_1.cn)(documentIconBaseClass, "text-yellow-400", className)}/>);
        case "Video":
            return (<bs_1.BsFileEarmarkPlayFill className={(0, react_1.cn)(documentIconBaseClass, "text-purple-500", className)}/>);
        case "Audio":
            return (<bs_1.BsFileEarmarkPlayFill className={(0, react_1.cn)(documentIconBaseClass, "text-cyan-400", className)}/>);
        case "Model":
            return (<lu_1.LuAxis3D className={(0, react_1.cn)(documentIconBaseClass, "text-emerald-500", className)}/>);
        case "Other":
        default:
            return (<bs_1.BsFileEarmarkFill className={(0, react_1.cn)(documentIconBaseClass, className)}/>);
    }
};
exports.default = DocumentIcon;
