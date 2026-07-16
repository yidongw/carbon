"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectionPool = void 0;
exports.getDatabaseClient = getDatabaseClient;
var driver_ts_1 = require("./driver.ts");
var index_ts_1 = require("./postgres/index.ts");
exports.getConnectionPool = index_ts_1.getPostgresConnectionPool;
function getDatabaseClient(pool) {
    return (0, index_ts_1.getPostgresClient)(pool, driver_ts_1.PostgresDriver);
}
