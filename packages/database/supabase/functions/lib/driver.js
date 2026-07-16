"use strict";
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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _PostgresDriver_config, _PostgresDriver_connections, _PostgresDriver_pool, _PostgresConnection_client, _PostgresConnection_options;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresDriver = void 0;
var kysely_1 = require("kysely");
function extendStackTrace(err, stackError) {
    if (err instanceof Error &&
        typeof err.stack === "string" &&
        stackError.stack) {
        var stackExtension = stackError.stack.split("\n").slice(1).join("\n");
        err.stack += "\n".concat(stackExtension);
        return err;
    }
    return err;
}
var PRIVATE_RELEASE_METHOD = Symbol();
var PostgresDriver = /** @class */ (function () {
    function PostgresDriver(config) {
        _PostgresDriver_config.set(this, void 0);
        _PostgresDriver_connections.set(this, new WeakMap());
        _PostgresDriver_pool.set(this, void 0);
        __classPrivateFieldSet(this, _PostgresDriver_config, Object.freeze(__assign({}, config)), "f");
    }
    PostgresDriver.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                __classPrivateFieldSet(this, _PostgresDriver_pool, __classPrivateFieldGet(this, _PostgresDriver_config, "f").pool, "f");
                return [2 /*return*/];
            });
        });
    };
    PostgresDriver.prototype.acquireConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client, connection;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, __classPrivateFieldGet(this, _PostgresDriver_pool, "f").connect()];
                    case 1:
                        client = _c.sent();
                        connection = __classPrivateFieldGet(this, _PostgresDriver_connections, "f").get(client);
                        if (!!connection) return [3 /*break*/, 3];
                        connection = new PostgresConnection(client, {
                            cursor: (_a = __classPrivateFieldGet(this, _PostgresDriver_config, "f").cursor) !== null && _a !== void 0 ? _a : null,
                        });
                        __classPrivateFieldGet(this, _PostgresDriver_connections, "f").set(client, connection);
                        if (!((_b = __classPrivateFieldGet(this, _PostgresDriver_config, "f")) === null || _b === void 0 ? void 0 : _b.onCreateConnection)) return [3 /*break*/, 3];
                        return [4 /*yield*/, __classPrivateFieldGet(this, _PostgresDriver_config, "f").onCreateConnection(connection)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3: return [2 /*return*/, connection];
                }
            });
        });
    };
    PostgresDriver.prototype.beginTransaction = function (connection, settings) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!settings.isolationLevel) return [3 /*break*/, 2];
                        return [4 /*yield*/, connection.executeQuery(kysely_1.CompiledQuery.raw("start transaction isolation level ".concat(settings.isolationLevel)))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, connection.executeQuery(kysely_1.CompiledQuery.raw("begin"))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PostgresDriver.prototype.commitTransaction = function (connection) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection.executeQuery(kysely_1.CompiledQuery.raw("commit"))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PostgresDriver.prototype.rollbackTransaction = function (connection) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection.executeQuery(kysely_1.CompiledQuery.raw("rollback"))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PostgresDriver.prototype.releaseConnection = function (connection) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                connection[PRIVATE_RELEASE_METHOD]();
                return [2 /*return*/];
            });
        });
    };
    PostgresDriver.prototype.destroy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pool;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!__classPrivateFieldGet(this, _PostgresDriver_pool, "f")) return [3 /*break*/, 2];
                        pool = __classPrivateFieldGet(this, _PostgresDriver_pool, "f");
                        __classPrivateFieldSet(this, _PostgresDriver_pool, undefined, "f");
                        return [4 /*yield*/, pool.end()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return PostgresDriver;
}());
exports.PostgresDriver = PostgresDriver;
_PostgresDriver_config = new WeakMap(), _PostgresDriver_connections = new WeakMap(), _PostgresDriver_pool = new WeakMap();
var PostgresConnection = /** @class */ (function () {
    function PostgresConnection(client, options) {
        _PostgresConnection_client.set(this, void 0);
        _PostgresConnection_options.set(this, void 0);
        __classPrivateFieldSet(this, _PostgresConnection_client, client, "f");
        __classPrivateFieldSet(this, _PostgresConnection_options, options, "f");
    }
    PostgresConnection.prototype.executeQuery = function (compiledQuery) {
        return __awaiter(this, void 0, void 0, function () {
            var result, numAffectedRows, err_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, __classPrivateFieldGet(this, _PostgresConnection_client, "f").queryObject(compiledQuery.sql, __spreadArray([], compiledQuery.parameters, true))];
                    case 1:
                        result = _c.sent();
                        if (result.command === "INSERT" ||
                            result.command === "UPDATE" ||
                            result.command === "DELETE") {
                            numAffectedRows = BigInt(result.rowCount || 0);
                            return [2 /*return*/, {
                                    numUpdatedOrDeletedRows: numAffectedRows,
                                    numAffectedRows: numAffectedRows,
                                    rows: (_a = result.rows) !== null && _a !== void 0 ? _a : [],
                                }];
                        }
                        return [2 /*return*/, {
                                rows: (_b = result.rows) !== null && _b !== void 0 ? _b : [],
                            }];
                    case 2:
                        err_1 = _c.sent();
                        throw extendStackTrace(err_1, new Error());
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // deno-lint-ignore require-yield
    PostgresConnection.prototype.streamQuery = function (_compiledQuery, chunkSize) {
        return __asyncGenerator(this, arguments, function streamQuery_1() {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!__classPrivateFieldGet(this, _PostgresConnection_options, "f").cursor) {
                            throw new Error("'cursor' is not present in your postgres dialect config. It's required to make streaming work in postgres.");
                        }
                        if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
                            throw new Error("chunkSize must be a positive integer");
                        }
                        return [4 /*yield*/, __await(null)];
                    case 1: 
                    // stream not available
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PostgresConnection.prototype[(_PostgresConnection_client = new WeakMap(), _PostgresConnection_options = new WeakMap(), PRIVATE_RELEASE_METHOD)] = function () {
        __classPrivateFieldGet(this, _PostgresConnection_client, "f").release();
    };
    return PostgresConnection;
}());
