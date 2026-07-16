"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var ROOT_ENV_PATH = (0, path_1.join)(process.cwd(), ".env");
var ROOT_ENV_LOCAL_PATH = (0, path_1.join)(process.cwd(), ".env.local");
if (!(0, fs_1.existsSync)(ROOT_ENV_PATH)) {
    throw new Error("No .env file found in root directory");
}
var APPS_DIR = (0, path_1.join)(process.cwd(), "apps");
var PACKAGES_DIR = (0, path_1.join)(process.cwd(), "packages");
// List of package folders that need .env symlinks
var PACKAGE_FOLDERS = ["database", "jobs", "kv"];
function createSymlink(targetPath, sourcePath) {
    try {
        // Remove existing symlink if it exists
        if ((0, fs_1.existsSync)(targetPath)) {
            (0, fs_1.unlinkSync)(targetPath);
        }
        // Create new symlink
        (0, fs_1.symlinkSync)(sourcePath, targetPath);
        console.log("Created symlink at ".concat(targetPath));
    }
    catch (error) {
        console.error("Failed to create symlink at ".concat(targetPath, ":"), error);
    }
}
function linkBoth(targetDir) {
    createSymlink((0, path_1.join)(targetDir, ".env"), ROOT_ENV_PATH);
    if ((0, fs_1.existsSync)(ROOT_ENV_LOCAL_PATH)) {
        createSymlink((0, path_1.join)(targetDir, ".env.local"), ROOT_ENV_LOCAL_PATH);
    }
}
// Create symlinks in apps directory
if ((0, fs_1.existsSync)(APPS_DIR)) {
    var apps = ["erp", "mes", "academy", "starter"];
    apps.forEach(function (app) { return linkBoth((0, path_1.join)(APPS_DIR, app)); });
}
// Create symlinks in selected packages
if ((0, fs_1.existsSync)(PACKAGES_DIR)) {
    PACKAGE_FOLDERS.forEach(function (pkg) { return linkBoth((0, path_1.join)(PACKAGES_DIR, pkg)); });
}
// Copy root .env into supabase/functions/.env so edge functions get all env vars
// Must be a copy (not symlink) because edge functions run inside Docker
var supabaseFunctionsDir = (0, path_1.join)(PACKAGES_DIR, "database", "supabase", "functions");
linkBoth(supabaseFunctionsDir);
console.log("Environment file setup complete!");
