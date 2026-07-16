"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guideSource = exports.source = void 0;
var server_1 = require("collections/server");
var source_1 = require("fumadocs-core/source");
exports.source = (0, source_1.loader)({
    baseUrl: "/docs",
    source: server_1.docs.toFumadocsSource(),
});
exports.guideSource = (0, source_1.loader)({
    baseUrl: "/guides",
    source: server_1.guide.toFumadocsSource(),
});
