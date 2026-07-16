"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinearIssueSchema = void 0;
var zod_1 = require("zod");
var utils_1 = require("./utils");
exports.LinearIssueSchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    description: zod_1.z.string().nullish(),
    url: zod_1.z.string(),
    state: zod_1.z.object({
        name: zod_1.z.string(),
        color: zod_1.z.string(),
        type: zod_1.z.nativeEnum(utils_1.LinearWorkStateType)
    }),
    identifier: zod_1.z.string(),
    dueDate: zod_1.z.string().nullish(),
    assignee: zod_1.z
        .object({
        email: zod_1.z.string()
    })
        .nullish()
});
