"use strict";
/**
 * Development seed script for Carbon
 *
 * This script creates a development user and company with all default seed data.
 * Run after `pnpm run db:build` to set up a fully functional local environment.
 *
 * Usage:
 *   pnpm run db:seed:dev -- --email your@email.com
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
var node_process_1 = require("node:process");
var node_util_1 = require("node:util");
var supabase_js_1 = require("@supabase/supabase-js");
var dotenv = require("dotenv");
var seed_data_ts_1 = require("../supabase/functions/lib/seed.data.ts");
var client_ts_1 = require("./client.ts");
// Load environment variables
dotenv.config();
var DEV_PASSWORD = "password";
var DEV_COMPANY_NAME = "Carbon Development";
/**
 * Infers a first name from an email address.
 * Takes the local part (before @), splits on common delimiters (., +, _),
 * takes the first segment, and capitalizes it.
 */
function inferFirstNameFromEmail(email) {
    var localPart = email.split("@")[0];
    // Split on common delimiters and take the first part
    var firstName = localPart.split(/[.+_-]/)[0];
    // Capitalize first letter, lowercase the rest
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
}
// Parse CLI arguments
var values = (0, node_util_1.parseArgs)({
    args: node_process_1.default.argv.slice(2).filter(function (a) { return a !== "--"; }),
    options: {
        email: {
            type: "string",
            short: "e"
        }
    },
    strict: true
}).values;
function printUsage() {
    console.log("\nUsage: pnpm run db:seed:dev -- --email <email>\n\nArguments:\n  --email, -e    Required. The email address for the dev user.\n\nExample:\n  pnpm run db:seed:dev -- --email developer@example.com\n  ");
}
function seedDev() {
    return __awaiter(this, void 0, void 0, function () {
        var email, emailRegex, supabaseAdmin, pgPool, client, existingUsers, existingUser, userId, updateError, _a, newUser, createError, firstName, companyResult, companyId, locationResult, locationId, err_1, error_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    email = values.email;
                    if (!email) {
                        console.error("Error: --email is required\n");
                        printUsage();
                        node_process_1.default.exit(1);
                    }
                    emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        console.error("Error: Invalid email format\n");
                        node_process_1.default.exit(1);
                    }
                    console.log("\nSeeding development environment for: ".concat(email, "\n"));
                    supabaseAdmin = (0, supabase_js_1.createClient)(node_process_1.default.env.SUPABASE_URL, node_process_1.default.env.SUPABASE_SERVICE_ROLE_KEY, {
                        auth: {
                            autoRefreshToken: false,
                            persistSession: false
                        }
                    });
                    pgPool = (0, client_ts_1.getPostgresConnectionPool)(1);
                    return [4 /*yield*/, pgPool.connect()];
                case 1:
                    client = _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 19, 20, 22]);
                    // Step 1: Check if user already exists (via Supabase Auth API - cannot be in transaction)
                    console.log("1. Checking for existing user...");
                    return [4 /*yield*/, supabaseAdmin.auth.admin.listUsers()];
                case 3:
                    existingUsers = (_c.sent()).data;
                    existingUser = (_b = existingUsers === null || existingUsers === void 0 ? void 0 : existingUsers.users) === null || _b === void 0 ? void 0 : _b.find(function (u) { return u.email === (email !== null && email !== void 0 ? email : ""); });
                    userId = void 0;
                    if (!existingUser) return [3 /*break*/, 5];
                    console.log("   User ".concat(email, " already exists, using existing user."));
                    userId = existingUser.id;
                    return [4 /*yield*/, supabaseAdmin.auth.admin.updateUserById(userId, {
                            password: DEV_PASSWORD
                        })];
                case 4:
                    updateError = (_c.sent()).error;
                    if (updateError) {
                        console.warn("   Warning: Could not update password: ".concat(updateError.message));
                    }
                    else {
                        console.log("   Password updated to: ".concat(DEV_PASSWORD));
                    }
                    return [3 /*break*/, 7];
                case 5:
                    // Create new user
                    console.log("   Creating new user...");
                    return [4 /*yield*/, supabaseAdmin.auth.admin.createUser({
                            email: email,
                            password: DEV_PASSWORD,
                            email_confirm: true,
                            app_metadata: {
                                role: "employee",
                                provider: "email",
                                providers: ["email"]
                            }
                        })];
                case 6:
                    _a = _c.sent(), newUser = _a.data, createError = _a.error;
                    if (createError) {
                        throw new Error("Failed to create user: ".concat(createError.message));
                    }
                    if (!newUser.user) {
                        throw new Error("Failed to create user: No user returned");
                    }
                    userId = newUser.user.id;
                    console.log("   User created with ID: ".concat(userId));
                    _c.label = 7;
                case 7:
                    firstName = inferFirstNameFromEmail(email !== null && email !== void 0 ? email : "");
                    console.log("2. Updating user first name to \"".concat(firstName, "\"..."));
                    return [4 /*yield*/, client.query("UPDATE \"user\" SET \"firstName\" = $1 WHERE id = $2", [
                            firstName,
                            userId
                        ])];
                case 8:
                    _c.sent();
                    // Step 3: Create + seed the company in a single transaction
                    console.log("3. Starting database transaction...");
                    return [4 /*yield*/, client.query("BEGIN")];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10:
                    _c.trys.push([10, 16, , 18]);
                    // Create the company. No companyGroupId -> seed_company() creates the group.
                    console.log("4. Creating company...");
                    return [4 /*yield*/, client.query("INSERT INTO company (name, \"baseCurrencyCode\") VALUES ($1, 'USD') RETURNING id", [DEV_COMPANY_NAME])];
                case 11:
                    companyResult = _c.sent();
                    companyId = companyResult.rows[0].id;
                    console.log("   Company ID: ".concat(companyId));
                    // Seed all default data through the same RPC the app uses on onboarding.
                    console.log("5. Seeding company via seed_company() RPC...");
                    return [4 /*yield*/, client.query("SELECT seed_company($1, $2, NULL, $3::jsonb)", [
                            companyId,
                            userId,
                            JSON.stringify(seed_data_ts_1.companySeedData)
                        ])];
                case 12:
                    _c.sent();
                    // Default location (dev convenience; not part of seed_company). Must come
                    // after seeding so the location trigger can copy from accountDefault.
                    console.log("6. Creating default location...");
                    return [4 /*yield*/, client.query("INSERT INTO location (name, \"addressLine1\", city, \"stateProvince\", \"postalCode\", \"countryCode\", timezone, \"companyId\", \"createdBy\")\n         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'system') RETURNING id", [
                            seed_data_ts_1.defaultLocation.name,
                            seed_data_ts_1.defaultLocation.addressLine1,
                            seed_data_ts_1.defaultLocation.city,
                            seed_data_ts_1.defaultLocation.stateProvince,
                            seed_data_ts_1.defaultLocation.postalCode,
                            seed_data_ts_1.defaultLocation.countryCode,
                            seed_data_ts_1.defaultLocation.timezone,
                            companyId
                        ])];
                case 13:
                    locationResult = _c.sent();
                    locationId = locationResult.rows[0].id;
                    // Link the employee to the location (employeeJob)
                    return [4 /*yield*/, client.query("INSERT INTO \"employeeJob\" (id, \"companyId\", \"locationId\") VALUES ($1, $2, $3)", [userId, companyId, locationId])];
                case 14:
                    // Link the employee to the location (employeeJob)
                    _c.sent();
                    // Commit the transaction
                    return [4 /*yield*/, client.query("COMMIT")];
                case 15:
                    // Commit the transaction
                    _c.sent();
                    console.log("   Transaction committed successfully.");
                    // Success!
                    console.log("\n========================================\nDev environment seeded successfully!\n========================================\n\nLogin credentials:\n  Email:    ".concat(email, "\n  Password: ").concat(DEV_PASSWORD, "\n\nCompany: ").concat(DEV_COMPANY_NAME, "\nCompany ID: ").concat(companyId, "\n\nYou can now start the app and log in!\n"));
                    return [3 /*break*/, 18];
                case 16:
                    err_1 = _c.sent();
                    // Rollback on any error
                    return [4 /*yield*/, client.query("ROLLBACK")];
                case 17:
                    // Rollback on any error
                    _c.sent();
                    console.error("   Transaction rolled back due to error.");
                    throw err_1;
                case 18: return [3 /*break*/, 22];
                case 19:
                    error_1 = _c.sent();
                    console.error("\nError seeding development environment:");
                    console.error(error_1);
                    node_process_1.default.exit(1);
                    return [3 /*break*/, 22];
                case 20:
                    client.release();
                    return [4 /*yield*/, pgPool.end()];
                case 21:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 22: return [2 /*return*/];
            }
        });
    });
}
seedDev();
