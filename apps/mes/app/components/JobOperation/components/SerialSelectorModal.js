"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialSelectorModal = SerialSelectorModal;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
function SerialSelectorModal(_a) {
    var availableEntities = _a.availableEntities, onCancel = _a.onCancel, onClose = _a.onClose, onSelect = _a.onSelect;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(""), serial = _b[0], setSerial = _b[1];
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Select Serial Number</macro_1.Trans>
          </react_1.ModalTitle>
          <react_1.ModalDescription>
            <macro_1.Trans>
              Select a serial number to continue with this operation
            </macro_1.Trans>
          </react_1.ModalDescription>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          <react_1.Tabs defaultValue="scan">
            <react_1.TabsList className="grid w-full grid-cols-2 mb-4">
              <react_1.TabsTrigger value="scan">
                <lu_1.LuQrCode className="mr-2"/>
                <macro_1.Trans>Scan</macro_1.Trans>
              </react_1.TabsTrigger>
              <react_1.TabsTrigger value="select">
                <lu_1.LuList className="mr-2"/>
                <macro_1.Trans>Select</macro_1.Trans>
              </react_1.TabsTrigger>
            </react_1.TabsList>
            <react_1.TabsContent value="select" className="mt-4">
              <react_1.ScrollArea className="max-h-[40dvh]">
                <react_1.VStack spacing={2}>
                  {availableEntities.length === 0 ? (<p className="text-center text-muted-foreground">
                      <macro_1.Trans>No available serial numbers found</macro_1.Trans>
                    </p>) : (availableEntities.map(function (entity) {
            return (<react_1.HStack key={entity.id} className="w-full justify-between p-4 border rounded-md">
                          <react_1.VStack spacing={0} className="w-full items-start">
                            {entity.readableId ? (<>
                                <p className="text-sm font-medium">
                                  {entity.readableId}
                                </p>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {entity.id}
                                </p>
                              </>) : (<p className="text-xs text-muted-foreground font-mono">
                                {entity.id}
                              </p>)}
                          </react_1.VStack>
                          <react_1.Button size="lg" variant="secondary" onClick={function () { return onSelect(entity); }}>
                            <macro_1.Trans>Select</macro_1.Trans>
                          </react_1.Button>
                        </react_1.HStack>);
        }))}
                </react_1.VStack>
              </react_1.ScrollArea>
            </react_1.TabsContent>
            <react_1.TabsContent value="scan" className="mt-4">
              <react_1.VStack spacing={4}>
                <react_1.InputGroup>
                  <react_1.Input autoFocus size="lg" placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Scan or enter serial number"], ["Scan or enter serial number"])))} onKeyDown={function (e) {
            if (e.key === "Enter") {
                var val_1 = e.currentTarget.value;
                var entity = availableEntities.find(function (entity) {
                    return entity.id === val_1 || entity.readableId === val_1;
                });
                if (entity) {
                    onSelect(entity);
                }
            }
        }} value={serial} onChange={function (e) { return setSerial(e.target.value); }}/>
                  <react_1.InputRightElement>
                    {serial &&
            (availableEntities.some(function (entity) {
                return entity.id === serial || entity.readableId === serial;
            }) ? (<lu_1.LuCheck className="text-green-500"/>) : (<lu_1.LuX className="text-red-500"/>))}
                  </react_1.InputRightElement>
                </react_1.InputGroup>
              </react_1.VStack>
            </react_1.TabsContent>
          </react_1.Tabs>
        </react_1.ModalBody>
        <react_1.ModalFooter>
          <react_1.Button variant="secondary" size="lg" onClick={onCancel}>
            <macro_1.Trans>Cancel</macro_1.Trans>
          </react_1.Button>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1;
