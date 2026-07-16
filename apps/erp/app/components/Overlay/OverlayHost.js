"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverlayHost = OverlayHost;
var OverlayProvider_1 = require("./OverlayProvider");
var RegisteredOverlay_1 = require("./RegisteredOverlay");
function OverlayHost() {
    var _a = (0, OverlayProvider_1.useOverlay)(), instances = _a.instances, closeOverlay = _a.closeOverlay;
    return (<>
      {instances.map(function (instance, index) { return (<RegisteredOverlay_1.RegisteredOverlay key={instance.id} instance={instance} stackIndex={index} onClose={closeOverlay}/>); })}
    </>);
}
