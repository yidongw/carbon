"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomeEmail = void 0;
var components_1 = require("@react-email/components");
var WelcomeEmail = function () {
    return (<components_1.Html>
      <components_1.Preview>Hey- I saw you just signed up for Carbon.</components_1.Preview>
      <components_1.Body>
        <components_1.Text>
          Hey- I saw you just signed up for Carbon. Appreciate it! Let me know
          if you want to meet or talk about anything.
        </components_1.Text>
        <components_1.Text>
          This is an automated email, but I'll respond to anything you send me.
        </components_1.Text>
        <components_1.Text>Thank you!</components_1.Text>
        <components_1.Text>— Chase</components_1.Text>
      </components_1.Body>
    </components_1.Html>);
};
exports.WelcomeEmail = WelcomeEmail;
exports.default = exports.WelcomeEmail;
