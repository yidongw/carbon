"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileBadge = FileBadge;
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var DocumentIcon_1 = require("~/components/DocumentIcon");
var shared_1 = require("~/modules/shared");
var ItemDocuments_1 = require("./ItemDocuments");
function FileBadge(_a) {
    var file = _a.file, itemId = _a.itemId, itemType = _a.itemType, className = _a.className;
    var _b = (0, ItemDocuments_1.useItemDocuments)({ itemId: itemId, type: itemType }), getPath = _b.getPath, download = _b.download;
    var type = (0, shared_1.getDocumentType)(file.name);
    return (<react_1.HStack className="group" spacing={1}>
      {["PDF", "Image"].includes(type) ? (<components_1.DocumentPreview bucket="private" pathToFile={getPath(file)} 
        // @ts-ignore
        type={type}>
          <react_1.Badge variant="secondary" className={(0, react_1.cn)("max-w-[240px]", className)}>
            <DocumentIcon_1.default type={type} className="flex-shrink-0 w-3 h-3 mr-1"/>
            {file.name}
          </react_1.Badge>
        </components_1.DocumentPreview>) : (<react_1.Badge variant="secondary" className={(0, react_1.cn)("max-w-[240px]", className)}>
          <DocumentIcon_1.default type={type} className="flex-shrink-0 w-3 h-3 mr-1"/>
          {file.name}
        </react_1.Badge>)}

      <lu_1.LuDownload onClick={function () { return download(file); }} className="cursor-pointer group-hover:opacity-100 opacity-0 transition-opacity duration-200 w-4 h-4 text-foreground"/>
    </react_1.HStack>);
}
