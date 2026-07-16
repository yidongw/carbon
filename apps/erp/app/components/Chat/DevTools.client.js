"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevTools = DevTools;
var devtools_1 = require("@ai-sdk-tools/devtools");
var auth_1 = require("@carbon/auth");
var path_1 = require("~/utils/path");
function DevTools() {
    return (<devtools_1.AIDevtools config={{
            streamCapture: {
                enabled: true,
                endpoint: "".concat((0, auth_1.getAppUrl)()).concat(path_1.path.to.api.chat),
                autoConnect: true
            }
        }}/>);
}
