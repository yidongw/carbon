"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationDigestFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var notifications_1 = require("@carbon/notifications");
var client_1 = require("../../client");
// Roll up unread, undigested notifications older than DIGEST_MIN_AGE_MIN that
// share (userId, companyId, topic) when the group has DIGEST_THRESHOLD+ rows.
// One digest row replaces them in the topbar (the hook filters out rows
// where digestedInto is set), and child rows are kept for audit/recovery
// until the purge cron drops them.
//
// Re-runs absorb new children into an existing unread digest for the same
// group instead of creating a new digest each pass — that keeps the topbar
// to one entry per topic regardless of how often the cron fires.
var DIGEST_THRESHOLD = 5;
// Minutes. Set to 0 for instant testing; production target is ~60 so users
// get a chance to see live notifications before they roll up.
var DIGEST_MIN_AGE_MIN = 60;
var DIGEST_MAX_CANDIDATES = 5000;
function bucketKey(userId, companyId, topic) {
    return "".concat(userId, "::").concat(companyId, "::").concat(topic);
}
exports.notificationDigestFunction = client_1.inngest.createFunction({ id: "notification-digest", retries: 2 }, { cron: "*/15 * * * *" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var client, work, summary;
    var step = _b.step;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                client = (0, client_server_1.getCarbonServiceRole)();
                return [4 /*yield*/, step.run("collect-work", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var cutoff, _a, _b, candidateRows, candidateErr, _c, digestRows, digestErr, candidates, _i, _d, row, key, existing, digests, _e, _f, row, key, existing, keys;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    cutoff = new Date(Date.now() - DIGEST_MIN_AGE_MIN * 60 * 1000).toISOString();
                                    return [4 /*yield*/, Promise.all([
                                            client
                                                .from("notification")
                                                .select("id, userId, companyId, topic, createdAt")
                                                .is("readAt", null)
                                                .is("digestedInto", null)
                                                .neq("event", notifications_1.NotificationEvent.Digest)
                                                .lt("createdAt", cutoff)
                                                .order("createdAt", { ascending: true })
                                                .limit(DIGEST_MAX_CANDIDATES),
                                            client
                                                .from("notification")
                                                .select("id, userId, companyId, topic, createdAt")
                                                .is("readAt", null)
                                                .is("digestedInto", null)
                                                .eq("event", notifications_1.NotificationEvent.Digest)
                                                .order("createdAt", { ascending: true })
                                                .limit(DIGEST_MAX_CANDIDATES)
                                        ])];
                                case 1:
                                    _a = _g.sent(), _b = _a[0], candidateRows = _b.data, candidateErr = _b.error, _c = _a[1], digestRows = _c.data, digestErr = _c.error;
                                    if (candidateErr) {
                                        console.error("Failed to load digest candidates", candidateErr);
                                        throw candidateErr;
                                    }
                                    if (digestErr) {
                                        console.error("Failed to load existing digests", digestErr);
                                        throw digestErr;
                                    }
                                    candidates = new Map();
                                    for (_i = 0, _d = (candidateRows !== null && candidateRows !== void 0 ? candidateRows : []); _i < _d.length; _i++) {
                                        row = _d[_i];
                                        key = bucketKey(row.userId, row.companyId, row.topic);
                                        existing = candidates.get(key);
                                        if (existing) {
                                            existing.push(row);
                                        }
                                        else {
                                            candidates.set(key, [row]);
                                        }
                                    }
                                    digests = new Map();
                                    for (_e = 0, _f = (digestRows !== null && digestRows !== void 0 ? digestRows : []); _e < _f.length; _e++) {
                                        row = _f[_e];
                                        key = bucketKey(row.userId, row.companyId, row.topic);
                                        existing = digests.get(key);
                                        if (existing) {
                                            existing.push(row);
                                        }
                                        else {
                                            digests.set(key, [row]);
                                        }
                                    }
                                    keys = new Set(__spreadArray(__spreadArray([], candidates.keys(), true), digests.keys(), true));
                                    return [2 /*return*/, Array.from(keys).map(function (key) {
                                            var _a, _b;
                                            return ({
                                                candidates: (_a = candidates.get(key)) !== null && _a !== void 0 ? _a : [],
                                                digests: (_b = digests.get(key)) !== null && _b !== void 0 ? _b : [],
                                                key: key
                                            });
                                        })];
                            }
                        });
                    }); })];
            case 1:
                work = _c.sent();
                if (work.length === 0) {
                    return [2 /*return*/, { absorbed: 0, created: 0, groups: 0, merged: 0 }];
                }
                return [4 /*yield*/, step.run("apply-digests", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var created, merged, absorbed, _i, work_1, group, newChildren, existingDigests, head, description_1, _a, createdRow, insertError, updateError, keeper, others, repointErr, deleteErr, absorbErr, _b, childCount, countErr, total, description, titleErr;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    created = 0;
                                    merged = 0;
                                    absorbed = 0;
                                    _i = 0, work_1 = work;
                                    _c.label = 1;
                                case 1:
                                    if (!(_i < work_1.length)) return [3 /*break*/, 13];
                                    group = work_1[_i];
                                    newChildren = group.candidates;
                                    existingDigests = group.digests;
                                    if (!(existingDigests.length === 0)) return [3 /*break*/, 4];
                                    if (newChildren.length < DIGEST_THRESHOLD)
                                        return [3 /*break*/, 12];
                                    head = newChildren[0];
                                    description_1 = (0, notifications_1.getNotificationTopicPhrase)(head.topic, newChildren.length);
                                    return [4 /*yield*/, client
                                            .from("notification")
                                            .insert({
                                            companyId: head.companyId,
                                            event: notifications_1.NotificationEvent.Digest,
                                            payload: {
                                                count: newChildren.length,
                                                description: description_1,
                                                event: notifications_1.NotificationEvent.Digest,
                                                topic: head.topic
                                            },
                                            title: description_1,
                                            topic: head.topic,
                                            userId: head.userId
                                        })
                                            .select("id")
                                            .single()];
                                case 2:
                                    _a = _c.sent(), createdRow = _a.data, insertError = _a.error;
                                    if (insertError || !(createdRow === null || createdRow === void 0 ? void 0 : createdRow.id)) {
                                        console.error("Failed to insert digest row", insertError);
                                        return [3 /*break*/, 12];
                                    }
                                    return [4 /*yield*/, client
                                            .from("notification")
                                            .update({ digestedInto: createdRow.id })
                                            .in("id", newChildren.map(function (r) { return r.id; }))];
                                case 3:
                                    updateError = (_c.sent()).error;
                                    if (updateError) {
                                        console.error("Failed to attach children to digest", updateError);
                                        return [3 /*break*/, 12];
                                    }
                                    created += 1;
                                    absorbed += newChildren.length;
                                    return [3 /*break*/, 12];
                                case 4:
                                    keeper = existingDigests[0];
                                    others = existingDigests.slice(1);
                                    if (!(others.length > 0)) return [3 /*break*/, 7];
                                    return [4 /*yield*/, client
                                            .from("notification")
                                            .update({ digestedInto: keeper.id })
                                            .in("digestedInto", others.map(function (d) { return d.id; }))];
                                case 5:
                                    repointErr = (_c.sent()).error;
                                    if (repointErr) {
                                        console.error("Failed to repoint stacked digest children", repointErr);
                                        return [3 /*break*/, 12];
                                    }
                                    return [4 /*yield*/, client
                                            .from("notification")
                                            .delete()
                                            .in("id", others.map(function (d) { return d.id; }))];
                                case 6:
                                    deleteErr = (_c.sent()).error;
                                    if (deleteErr) {
                                        console.error("Failed to delete stacked digest rows", deleteErr);
                                        return [3 /*break*/, 12];
                                    }
                                    merged += others.length;
                                    _c.label = 7;
                                case 7:
                                    if (!(newChildren.length > 0)) return [3 /*break*/, 9];
                                    return [4 /*yield*/, client
                                            .from("notification")
                                            .update({ digestedInto: keeper.id })
                                            .in("id", newChildren.map(function (r) { return r.id; }))];
                                case 8:
                                    absorbErr = (_c.sent()).error;
                                    if (absorbErr) {
                                        console.error("Failed to absorb children into digest", absorbErr);
                                        return [3 /*break*/, 12];
                                    }
                                    absorbed += newChildren.length;
                                    _c.label = 9;
                                case 9: return [4 /*yield*/, client
                                        .from("notification")
                                        .select("id", { count: "exact", head: true })
                                        .eq("digestedInto", keeper.id)];
                                case 10:
                                    _b = _c.sent(), childCount = _b.count, countErr = _b.error;
                                    if (countErr) {
                                        console.error("Failed to count digest children", countErr);
                                        return [3 /*break*/, 12];
                                    }
                                    total = childCount !== null && childCount !== void 0 ? childCount : 0;
                                    description = (0, notifications_1.getNotificationTopicPhrase)(keeper.topic, total);
                                    return [4 /*yield*/, client
                                            .from("notification")
                                            .update({
                                            payload: {
                                                count: total,
                                                description: description,
                                                event: notifications_1.NotificationEvent.Digest,
                                                topic: keeper.topic
                                            },
                                            title: description
                                        })
                                            .eq("id", keeper.id)];
                                case 11:
                                    titleErr = (_c.sent()).error;
                                    if (titleErr) {
                                        console.error("Failed to refresh digest title", titleErr);
                                    }
                                    _c.label = 12;
                                case 12:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 13: return [2 /*return*/, { absorbed: absorbed, created: created, groups: work.length, merged: merged }];
                            }
                        });
                    }); })];
            case 2:
                summary = _c.sent();
                return [2 /*return*/, summary];
        }
    });
}); });
