"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var execa_1 = require("execa");
var client_1 = require("./client");
var env_1 = require("./env");
function migrate() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, workspaces, error, hasErrors, _b, _c, _d, workspace, connection_string, database_url, database_password, service_role_key, project_id, anon_key, access_token, $$, error_2, e_1, error_1, e_2_1;
        var _e, e_2, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    console.log("✅ 🌱 Starting migrations");
                    return [4 /*yield*/, client_1.client
                            .from("workspaces")
                            .select("*")];
                case 1:
                    _a = _h.sent(), workspaces = _a.data, error = _a.error;
                    if (error) {
                        console.error("🔴 🍳 Failed to fetch workspaces", error);
                        process.exit(1);
                    }
                    hasErrors = false;
                    console.log("✅ 🛩️ Successfully retreived workspaces");
                    console.log("👯‍♀️ Copying supabase folder");
                    return [4 /*yield*/, (0, execa_1.$)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["cp -r ../packages/database/supabase ."], ["cp -r ../packages/database/supabase ."])))];
                case 2:
                    _h.sent();
                    return [4 /*yield*/, (0, execa_1.$)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["cp -r ../packages/database/src ."], ["cp -r ../packages/database/src ."])))];
                case 3:
                    _h.sent();
                    _h.label = 4;
                case 4:
                    _h.trys.push([4, 23, 24, 29]);
                    _b = true, _c = __asyncValues(workspaces);
                    _h.label = 5;
                case 5: return [4 /*yield*/, _c.next()];
                case 6:
                    if (!(_d = _h.sent(), _e = _d.done, !_e)) return [3 /*break*/, 22];
                    _g = _d.value;
                    _b = false;
                    workspace = _g;
                    _h.label = 7;
                case 7:
                    _h.trys.push([7, 20, , 21]);
                    console.log("\u2705 \uD83E\uDD5A Migrating ".concat(workspace.id));
                    connection_string = workspace.connection_string, database_url = workspace.database_url, database_password = workspace.database_password, service_role_key = workspace.service_role_key, project_id = workspace.project_id, anon_key = workspace.anon_key, access_token = workspace.access_token;
                    if (!database_url) {
                        console.log("\uD83D\uDD34\uD83C\uDF73 Missing database url for ".concat(workspace.id));
                        return [3 /*break*/, 21];
                    }
                    console.log("\u2705 \uD83D\uDD11 Setting up environment for ".concat(workspace.id));
                    $$ = (0, execa_1.$)({
                        // @ts-ignore
                        env: __assign({ SUPABASE_ACCESS_TOKEN: access_token === null ? env_1.SUPABASE_ACCESS_TOKEN : access_token, SUPABASE_URL: database_url !== null && database_url !== void 0 ? database_url : undefined, SUPABASE_DB_PASSWORD: database_password !== null && database_password !== void 0 ? database_password : undefined, SUPABASE_PROJECT_ID: project_id !== null && project_id !== void 0 ? project_id : undefined, SUPABASE_ANON_KEY: anon_key !== null && anon_key !== void 0 ? anon_key : undefined, SUPABASE_SERVICE_ROLE_KEY: service_role_key !== null && service_role_key !== void 0 ? service_role_key : undefined, SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID: env_1.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID, SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET: env_1.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET, SUPABASE_AUTH_EXTERNAL_GOOGLE_REDIRECT_URI: env_1.SUPABASE_AUTH_EXTERNAL_GOOGLE_REDIRECT_URI }, ((connection_string === null || connection_string === void 0 ? void 0 : connection_string.startsWith("postgresql://")) && {
                            PGSSLMODE: "disable",
                        })),
                        cwd: "supabase",
                    });
                    if (!project_id) return [3 /*break*/, 9];
                    return [4 /*yield*/, $$(templateObject_3 || (templateObject_3 = __makeTemplateObject(["supabase link"], ["supabase link"])))];
                case 8:
                    _h.sent();
                    _h.label = 9;
                case 9:
                    console.log("\u2705 \uD83D\uDC23 Starting migrations for ".concat(workspace.id));
                    if (!(connection_string && connection_string.startsWith("postgresql://"))) return [3 /*break*/, 11];
                    return [4 /*yield*/, $$(templateObject_4 || (templateObject_4 = __makeTemplateObject(["supabase db push --db-url ", " --include-all"], ["supabase db push --db-url ", " --include-all"])), connection_string)];
                case 10:
                    _h.sent();
                    return [3 /*break*/, 14];
                case 11: return [4 /*yield*/, $$(templateObject_5 || (templateObject_5 = __makeTemplateObject(["supabase db push --include-all"], ["supabase db push --include-all"])))];
                case 12:
                    _h.sent();
                    console.log("\u2705 \uD83D\uDC23 Starting deployments for ".concat(workspace.id));
                    return [4 /*yield*/, $$(templateObject_6 || (templateObject_6 = __makeTemplateObject(["supabase functions deploy"], ["supabase functions deploy"])))];
                case 13:
                    _h.sent();
                    _h.label = 14;
                case 14:
                    if (!!workspace.seeded) return [3 /*break*/, 19];
                    _h.label = 15;
                case 15:
                    _h.trys.push([15, 18, , 19]);
                    console.log("\u2705 \uD83C\uDF31 Seeding ".concat(workspace.id));
                    return [4 /*yield*/, $$(templateObject_7 || (templateObject_7 = __makeTemplateObject(["tsx ../../packages/database/src/seed.ts"], ["tsx ../../packages/database/src/seed.ts"])))];
                case 16:
                    _h.sent();
                    return [4 /*yield*/, client_1.client
                            .from("workspaces")
                            .update({ seeded: true })
                            .eq("id", workspace.id)];
                case 17:
                    error_2 = (_h.sent()).error;
                    if (error_2) {
                        throw new Error("\uD83D\uDD34 \uD83C\uDF73 Failed to mark ".concat(workspace.id, " as seeded: ").concat(error_2.message));
                    }
                    return [3 /*break*/, 19];
                case 18:
                    e_1 = _h.sent();
                    console.error("\uD83D\uDD34 \uD83C\uDF73 Failed to seed ".concat(workspace.id), e_1);
                    return [3 /*break*/, 19];
                case 19:
                    console.log("\u2705 \uD83D\uDC13 Successfully migrated ".concat(workspace.id));
                    return [3 /*break*/, 21];
                case 20:
                    error_1 = _h.sent();
                    console.error("\uD83D\uDD34 \uD83C\uDF73 Failed to migrate ".concat(workspace.id), error_1);
                    hasErrors = true;
                    return [3 /*break*/, 21];
                case 21:
                    _b = true;
                    return [3 /*break*/, 5];
                case 22: return [3 /*break*/, 29];
                case 23:
                    e_2_1 = _h.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 29];
                case 24:
                    _h.trys.push([24, , 27, 28]);
                    if (!(!_b && !_e && (_f = _c.return))) return [3 /*break*/, 26];
                    return [4 /*yield*/, _f.call(_c)];
                case 25:
                    _h.sent();
                    _h.label = 26;
                case 26: return [3 /*break*/, 28];
                case 27:
                    if (e_2) throw e_2.error;
                    return [7 /*endfinally*/];
                case 28: return [7 /*endfinally*/];
                case 29:
                    if (hasErrors) {
                        console.error("🔴 Migration completed with errors");
                        process.exit(1);
                    }
                    console.log("✅ All migrations completed successfully");
                    return [2 /*return*/];
            }
        });
    });
}
migrate().catch(function (error) {
    console.error("🔴 Unexpected error during migration", error);
    process.exit(1);
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
