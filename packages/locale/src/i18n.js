"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocaleProvider = LocaleProvider;
var core_1 = require("@lingui/core");
var react_1 = require("@lingui/react");
var react_2 = require("react");
var config_1 = require("./config");
function LocaleProvider(_a) {
    var locale = _a.locale, catalog = _a.catalog, children = _a.children;
    var language = (0, config_1.resolveLanguage)(locale);
    var i18n = (0, react_2.useMemo)(function () {
        var runtime = (0, core_1.setupI18n)();
        runtime.load(language, catalog !== null && catalog !== void 0 ? catalog : {});
        runtime.activate(language);
        return runtime;
    }, [catalog, language]);
    return <react_1.I18nProvider i18n={i18n}>{children}</react_1.I18nProvider>;
}
