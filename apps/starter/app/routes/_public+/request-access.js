"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meta = void 0;
exports.default = RequestAccessRoute;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var meta = function () {
    return [
        {
            title: "Carbon Developers | Request Access"
        }
    ];
};
exports.meta = meta;
function RequestAccessRoute() {
    return (<>
      <div className="flex flex-col items-center justify-center">
        <img src="/carbon-mark-light.svg" alt="Carbon Logo" className="w-24 mb-3"/>
        <img src="/carbon-mark-dark.svg" alt="Carbon Logo" className="w-24 mb-3 hidden dark:block"/>

        <h3 className="font-mono font-bold leading-loose uppercase text-xl">
          Developers
        </h3>
      </div>
      <div className="rounded-lg bg-card flex flex-col gap-4 border border-border shadow-lg p-8 w-[380px]">
        <p>
          Request access to the developer portal by emailing {utils_1.SUPPORT_EMAIL}
        </p>
        <react_1.Button size="lg" asChild>
          <a href={(0, auth_1.getAppUrl)()}>Return to App</a>
        </react_1.Button>
      </div>
    </>);
}
