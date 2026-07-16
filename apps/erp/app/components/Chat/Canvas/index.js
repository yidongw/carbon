"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canvas = Canvas;
var client_1 = require("@ai-sdk-tools/artifacts/client");
function Canvas() {
    // @ts-expect-error TS2339 - TODO: fix type
    var current = (0, client_1.useArtifacts)({
        exclude: ["chat-title", "followup-questions"]
    }).current;
    switch (current === null || current === void 0 ? void 0 : current.type) {
        // case "burn-rate":
        //   return <BurnRateCanvas />;
        default:
            return null;
    }
}
