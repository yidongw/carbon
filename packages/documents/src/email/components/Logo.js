"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logo = Logo;
var components_1 = require("@react-email/components");
function Logo() {
    return (<components_1.Section className="mt-[32px]">
      <components_1.Img src="https://app.carbon.ms/carbon-word-light.png" width="auto" height="45" alt="Carbon" className="mb-4 mx-auto block dark-mode-hide"/>
      <components_1.Img src="https://app.carbon.ms/carbon-word-dark.png" width="auto" height="45" alt="Carbon" className="mb-4 mx-auto block dark-mode-show" style={{ display: "none" }}/>
    </components_1.Section>);
}
