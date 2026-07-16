"use strict";
/**
 * Promise.all with automatic dependency optimization and full type inference
 *
 * Usage:
 * const { a, b, c } = await all({
 *   a() { return 1 },
 *   async b() { return 'hello' },
 *   async c() { return (await this.$.a) + 10 }
 * })
 *
 * Credits: https://github.com/shuding/better-all/blob/main/lib/index.ts
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
exports.all = all;
exports.allSettled = allSettled;
/**
 * Internal core implementation for executing tasks with automatic dependency resolution.
 * This is shared between `all` and `allSettled`.
 */
function executeTasksInternal(tasks, handleSettled) {
    var _this = this;
    var taskNames = Object.keys(tasks);
    var results = new Map();
    var errors = new Map();
    var resolvers = new Map();
    var returnValue = {};
    var waitForDep = function (depName) {
        if (!(depName in tasks)) {
            return Promise.reject(new Error("Unknown task \"".concat(String(depName), "\"")));
        }
        if (results.has(depName)) {
            return Promise.resolve(results.get(depName));
        }
        if (errors.has(depName)) {
            return Promise.reject(errors.get(depName));
        }
        return new Promise(function (resolve, reject) {
            if (!resolvers.has(depName)) {
                resolvers.set(depName, []);
            }
            resolvers.get(depName).push([resolve, reject]);
        });
    };
    var handleResult = function (name, value) {
        results.set(name, value);
        if (handleSettled) {
            returnValue[name] = { status: "fulfilled", value: value };
        }
        else {
            returnValue[name] = value;
        }
        if (resolvers.has(name)) {
            for (var _i = 0, _a = resolvers.get(name); _i < _a.length; _i++) {
                var resolve = _a[_i][0];
                resolve(value);
            }
        }
    };
    var handleError = function (name, err) {
        errors.set(name, err);
        if (handleSettled) {
            returnValue[name] = { status: "rejected", reason: err };
        }
        if (resolvers.has(name)) {
            for (var _i = 0, _a = resolvers.get(name); _i < _a.length; _i++) {
                var _b = _a[_i], reject = _b[1];
                reject(err);
            }
        }
    };
    // Create dep proxy
    var depProxy = new Proxy({}, {
        get: function (_, depName) {
            return waitForDep(depName);
        }
    });
    // Create context with $ proxy
    var context = { $: depProxy };
    // Run all tasks in parallel
    var promises = taskNames.map(function (name) { return __awaiter(_this, void 0, void 0, function () {
        var taskFn, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    taskFn = tasks[name];
                    if (typeof taskFn !== "function") {
                        throw new Error("Task \"".concat(String(name), "\" is not a function"));
                    }
                    return [4 /*yield*/, taskFn.call(context)];
                case 1:
                    result = _a.sent();
                    handleResult(name, result);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    handleError(name, err_1);
                    if (!handleSettled) {
                        throw err_1;
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    if (handleSettled) {
        // For allSettled, wait for all promises to settle (never rejects)
        return Promise.allSettled(promises).then(function () { return returnValue; });
    }
    else {
        // For all, reject on first error (like Promise.all)
        return Promise.all(promises).then(function () { return returnValue; });
    }
}
/**
 * Execute tasks with automatic dependency resolution.
 *
 * @example
 * const { a, b, c } = await all({
 *   async a() { return 1 },
 *   async b() { return 'hello' },
 *   async c() { return (await this.$.a) + 10 }
 * })
 */
function all(tasks) {
    return executeTasksInternal(tasks, false);
}
/**
 * Execute tasks with automatic dependency resolution, returning settled results for all tasks.
 * Unlike `all`, this will never reject - failed tasks will be included in the result with their error.
 *
 * @example
 * const { a, b, c } = await allSettled({
 *   async a() { return 1 },
 *   async b() { throw new Error('failed') },
 *   async c() { return (await this.$.a) + 10 }
 * })
 * // a: { status: 'fulfilled', value: 1 }
 * // b: { status: 'rejected', reason: Error('failed') }
 * // c: { status: 'fulfilled', value: 11 }
 */
function allSettled(tasks) {
    return executeTasksInternal(tasks, true);
}
