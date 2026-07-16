"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var DocumentIcon_1 = require("~/components/DocumentIcon");
var path_1 = require("~/utils/path");
var FilesIconView = function (_a) {
    var items = _a.items, onDownload = _a.onDownload, onDelete = _a.onDelete, _b = _a.canDelete, canDelete = _b === void 0 ? false : _b, emptyMessage = _a.emptyMessage;
    var t = (0, macro_1.useLingui)().t;
    if (items.length === 0) {
        return (<div className="py-12 text-center text-muted-foreground">
        {emptyMessage !== null && emptyMessage !== void 0 ? emptyMessage : <macro_1.Trans>No files</macro_1.Trans>}
      </div>);
    }
    return (<div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-x-3 gap-y-4 p-1">
      {items.map(function (item) { return (<IconTile key={item.id} item={item} canDelete={canDelete} onDownload={onDownload} onDelete={onDelete} t={t}/>); })}
    </div>);
};
var IconTile = function (_a) {
    var item = _a.item, canDelete = _a.canDelete, onDownload = _a.onDownload, onDelete = _a.onDelete, t = _a.t;
    var openItem = function () {
        if (item.isModel && item.modelViewUrl) {
            window.open(item.modelViewUrl, "_blank");
            return;
        }
        if (item.previewType && item.pathToFile) {
            window.open(path_1.path.to.file.previewFile("private/".concat(item.pathToFile)), "_blank");
            return;
        }
        onDownload(item);
    };
    return (<div className="group relative flex flex-col items-center gap-1.5 text-center">
      <button type="button" aria-label={item.name} onClick={openItem} className="flex w-full flex-col items-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-muted/60">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border bg-background">
          <IconThumbnail item={item}/>
        </div>
        <span className="line-clamp-2 w-full break-all text-xs leading-tight">
          {item.name}
        </span>
      </button>

      <div className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More"], ["More"])))} icon={<lu_1.LuEllipsisVertical />} size="sm" variant="secondary"/>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent align="end">
            {item.isModel && item.modelViewUrl && (<react_1.DropdownMenuItem asChild>
                <react_router_1.Link to={item.modelViewUrl}>
                  <macro_1.Trans>View</macro_1.Trans>
                </react_router_1.Link>
              </react_1.DropdownMenuItem>)}
            {item.previewType && item.pathToFile && (<react_1.DropdownMenuItem onClick={openItem}>
                <macro_1.Trans>View</macro_1.Trans>
              </react_1.DropdownMenuItem>)}
            <react_1.DropdownMenuItem onClick={function () { return onDownload(item); }}>
              <macro_1.Trans>Download</macro_1.Trans>
            </react_1.DropdownMenuItem>
            {onDelete && (<react_1.DropdownMenuItem destructive disabled={!canDelete} onClick={function () { return onDelete(item); }}>
                <macro_1.Trans>Delete</macro_1.Trans>
              </react_1.DropdownMenuItem>)}
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </div>
    </div>);
};
var IconThumbnail = function (_a) {
    var item = _a.item;
    var _b = (0, react_2.useState)(false), failed = _b[0], setFailed = _b[1];
    if (item.previewType === "Image" && item.pathToFile && !failed) {
        return (<img alt="" className="h-full w-full object-cover" src={path_1.path.to.file.previewFile("private/".concat(item.pathToFile))} onError={function () { return setFailed(true); }}/>);
    }
    return <DocumentIcon_1.default type={item.documentType} className="h-10 w-10"/>;
};
exports.default = FilesIconView;
var templateObject_1;
