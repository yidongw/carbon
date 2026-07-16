"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRegistry = void 0;
var ServiceRegistry = /** @class */ (function () {
    function ServiceRegistry() {
        this.services = new Map();
    }
    ServiceRegistry.prototype.register = function (service) {
        this.services.set(service.id, service);
    };
    ServiceRegistry.prototype.getService = function (id) {
        return this.services.get(id);
    };
    ServiceRegistry.prototype.getAllServices = function () {
        return Array.from(this.services.values());
    };
    return ServiceRegistry;
}());
exports.notificationRegistry = new ServiceRegistry();
