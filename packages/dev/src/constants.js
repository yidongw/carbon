"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TLD = exports.PORTLESS_MIN_VERSION = exports.ALIAS_SERVICES = exports.APP_CHOICES = exports.COMPOSE_SHARED_FILE = exports.COMPOSE_DEV_FILE = void 0;
/** File names + paths used across the CLI. */
exports.COMPOSE_DEV_FILE = "docker-compose.dev.yml";
exports.COMPOSE_SHARED_FILE = "docker-compose.yml";
/** Apps the CLI knows how to spawn through portless. */
exports.APP_CHOICES = [
    { value: "erp", label: "ERP", hint: "main app" },
    { value: "mes", label: "MES", hint: "shop floor" }
];
/** Compose services that get registered as portless aliases (host TCP). */
exports.ALIAS_SERVICES = ["api", "studio", "mail", "inngest"];
/** Minimum portless version that supports bare invocation + package.json config. */
exports.PORTLESS_MIN_VERSION = "0.11.0";
/** Hostname TLD portless serves under. */
exports.TLD = "dev";
