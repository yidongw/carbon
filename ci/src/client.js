"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var env_1 = require("./env");
exports.client = (0, supabase_js_1.createClient)(env_1.SUPABASE_URL, env_1.SUPABASE_SERVICE_ROLE_KEY);
