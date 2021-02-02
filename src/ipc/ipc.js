"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildChannel = void 0;
function buildChannel(name) {
    return {
        source: name,
        next: name + "/next",
        error: name + "/error",
        complete: name + "/complete",
    };
}
exports.buildChannel = buildChannel;
//# sourceMappingURL=ipc.js.map