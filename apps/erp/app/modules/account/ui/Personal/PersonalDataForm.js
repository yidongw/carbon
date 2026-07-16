"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var Form_1 = require("~/components/Form");
var path_1 = require("~/utils/path");
var account_models_1 = require("../../account.models");
var PersonalDataForm = function (_a) {
    var personalData = _a.personalData;
    return (<div className="w-full">
      <form_1.ValidatedForm method="post" action={path_1.path.to.accountPersonal} validator={account_models_1.accountPersonalDataValidator} defaultValues={personalData}>
        <react_1.VStack spacing={4} className="mt-4">
          <Form_1.Submit>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
        </react_1.VStack>
      </form_1.ValidatedForm>
    </div>);
};
exports.default = PersonalDataForm;
