"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintersCard = PrintersCard;
var form_1 = require("@carbon/form");
var printing_1 = require("@carbon/printing");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var ConfirmDelete_1 = require("~/components/Modals/ConfirmDelete");
var path_1 = require("~/utils/path");
function getMediaSizeLabel(mediaSizeId) {
    var size = utils_1.labelSizes.find(function (s) { return s.id === mediaSizeId; });
    return size ? (0, utils_1.getLabelSizeLabel)(size) : mediaSizeId;
}
function PrintersCard(_a) {
    var _b, _c;
    var printerRoutes = _a.printerRoutes;
    var t = (0, macro_1.useLingui)().t;
    var routeFetcher = (0, react_router_1.useFetcher)();
    var formatOptions = [
        { value: "zpl", label: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["ZPL (Thermal Label)"], ["ZPL (Thermal Label)"]))) },
        { value: "pdf", label: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["PDF (Document)"], ["PDF (Document)"]))) }
    ];
    var newPrinterDisclosure = (0, react_1.useDisclosure)();
    var deletePrinterDisclosure = (0, react_1.useDisclosure)();
    var _d = (0, react_2.useState)(null), printerToDelete = _d[0], setPrinterToDelete = _d[1];
    // ZPL printers can only print thermal sizes; PDF printers can print any size
    var _e = (0, react_2.useState)("zpl"), selectedFormat = _e[0], setSelectedFormat = _e[1];
    var mediaSizeOptions = (0, react_2.useMemo)(function () {
        return utils_1.labelSizes
            .filter(function (s) { return (selectedFormat === "zpl" ? Boolean(s.zpl) : true); })
            .map(function (s) { return ({ value: s.id, label: (0, utils_1.getLabelSizeLabel)(s) }); });
    }, [selectedFormat]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: we don't need to re-run this effect when onClose changes
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d;
        if (((_a = routeFetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true && ((_b = routeFetcher.data) === null || _b === void 0 ? void 0 : _b.message)) {
            react_1.toast.success(routeFetcher.data.message);
            newPrinterDisclosure.onClose();
        }
        if (((_c = routeFetcher.data) === null || _c === void 0 ? void 0 : _c.success) === false && ((_d = routeFetcher.data) === null || _d === void 0 ? void 0 : _d.message)) {
            react_1.toast.error(routeFetcher.data.message);
        }
    }, [(_b = routeFetcher.data) === null || _b === void 0 ? void 0 : _b.message, (_c = routeFetcher.data) === null || _c === void 0 ? void 0 : _c.success]);
    return (<>
      <react_1.Card>
        <react_1.HStack className="w-full justify-between items-start">
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Printers</macro_1.Trans>
            </react_1.CardTitle>
            <react_1.CardDescription>
              <macro_1.Trans>Physical printers available for assignment.</macro_1.Trans>
            </react_1.CardDescription>
          </react_1.CardHeader>
          <react_1.CardAction className="py-6">
            <react_1.Button leftIcon={<lu_1.LuPlus />} onClick={function () {
            setSelectedFormat("zpl");
            newPrinterDisclosure.onOpen();
        }}>
              <macro_1.Trans>Add Printer</macro_1.Trans>
            </react_1.Button>
          </react_1.CardAction>
        </react_1.HStack>
        <react_1.CardContent>
          {printerRoutes.length > 0 ? (<div className="flex flex-col gap-2">
              {printerRoutes.map(function (route) { return (<div key={route.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-medium">{route.name}</span>
                    <span className="text-xs text-muted-foreground uppercase">
                      {route.format}
                    </span>
                    {route.mediaSizeId && (<span className="text-xs text-muted-foreground">
                        {getMediaSizeLabel(route.mediaSizeId)}
                      </span>)}
                    <span className="text-xs text-muted-foreground font-mono truncate max-w-[300px]">
                      {route.printerUrl}
                    </span>
                  </div>
                  <react_1.DropdownMenu>
                    <react_1.DropdownMenuTrigger asChild>
                      <react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["More"], ["More"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost" size="sm"/>
                    </react_1.DropdownMenuTrigger>
                    <react_1.DropdownMenuContent align="end">
                      <react_1.DropdownMenuItem onSelect={function () {
                    return routeFetcher.submit({ intent: "testPrint", routeId: route.id }, { method: "POST" });
                }}>
                        <react_1.DropdownMenuIcon icon={<lu_1.LuPlay />}/>
                        <macro_1.Trans>Test</macro_1.Trans>
                      </react_1.DropdownMenuItem>
                      <react_1.DropdownMenuItem destructive onSelect={function () {
                    setPrinterToDelete({
                        id: route.id,
                        name: route.name
                    });
                    deletePrinterDisclosure.onOpen();
                }}>
                        <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                        <macro_1.Trans>Delete</macro_1.Trans>
                      </react_1.DropdownMenuItem>
                    </react_1.DropdownMenuContent>
                  </react_1.DropdownMenu>
                </div>); })}
            </div>) : (<components_1.Empty>
              <p className="text-sm text-muted-foreground mt-10">
                <macro_1.Trans>
                  No printers configured. Click "Add Printer" to create one.
                </macro_1.Trans>
              </p>
            </components_1.Empty>)}
        </react_1.CardContent>
      </react_1.Card>

      {newPrinterDisclosure.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                if (!open)
                    newPrinterDisclosure.onClose();
            }}>
          <react_1.ModalContent size="large">
            <form_1.ValidatedForm method="post" validator={printing_1.printerRouteValidator} fetcher={routeFetcher} defaultValues={{ format: "zpl" }} className="flex flex-col h-full">
              <input type="hidden" name="intent" value="upsertRoute"/>
              <react_1.ModalHeader>
                <react_1.ModalTitle>
                  <macro_1.Trans>Add Printer</macro_1.Trans>
                </react_1.ModalTitle>
              </react_1.ModalHeader>
              <react_1.ModalBody>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4">
                    <form_1.Input name="name" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Name"], ["Name"])))} placeholder={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["e.g. Zebra 2x1"], ["e.g. Zebra 2x1"])))}/>
                    <form_1.Select name="format" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Format"], ["Format"])))} options={formatOptions} onChange={function (option) {
                if ((option === null || option === void 0 ? void 0 : option.value) === "zpl" ||
                    (option === null || option === void 0 ? void 0 : option.value) === "pdf") {
                    setSelectedFormat(option.value);
                }
            }}/>

                    <form_1.Select name="mediaSizeId" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Media Size"], ["Media Size"])))} options={mediaSizeOptions}/>
                    <form_1.Input name="templateId" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Template ID"], ["Template ID"])))} placeholder={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Leave blank for built-in"], ["Leave blank for built-in"])))}/>

                    <form_1.Input name="printerUrl" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Printer URL"], ["Printer URL"])))} placeholder="https://pbx-XXXX.pbxz.cloud/api/v1/print/..."/>
                    <form_1.Input name="apiKey" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["API Key"], ["API Key"])))} placeholder={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Optional"], ["Optional"])))}/>
                  </div>
                </div>
              </react_1.ModalBody>
              <react_1.ModalFooter>
                <react_1.HStack>
                  <react_1.Button size="md" variant="solid" onClick={newPrinterDisclosure.onClose}>
                    <macro_1.Trans>Cancel</macro_1.Trans>
                  </react_1.Button>
                  <form_1.Submit>
                    <macro_1.Trans>Add Printer</macro_1.Trans>
                  </form_1.Submit>
                </react_1.HStack>
              </react_1.ModalFooter>
            </form_1.ValidatedForm>
          </react_1.ModalContent>
        </react_1.Modal>)}

      {deletePrinterDisclosure.isOpen && printerToDelete && (<ConfirmDelete_1.default action={path_1.path.to.deletePrinterRoute(printerToDelete.id)} isOpen={deletePrinterDisclosure.isOpen} name={printerToDelete.name} text={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Are you sure you want to delete the printer \"", "\"? Any assignments referencing this printer will be cleared. This cannot be undone."], ["Are you sure you want to delete the printer \"", "\"? Any assignments referencing this printer will be cleared. This cannot be undone."])), printerToDelete.name)} onCancel={function () {
                deletePrinterDisclosure.onClose();
                setPrinterToDelete(null);
            }} onSubmit={function () {
                deletePrinterDisclosure.onClose();
                setPrinterToDelete(null);
            }}/>)}
    </>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
