"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIpcSender = void 0;
var electron_1 = require("electron");
var rxjs_1 = require("rxjs");
var ipc_1 = require("./ipc");
function createIpcSender(channel, payload) {
    return rxjs_1.defer(function () {
        electron_1.ipcRenderer.send(channel, payload);
        var message$ = new rxjs_1.Observable(function (observer) {
            var channels = ipc_1.buildChannel(channel);
            var onNext = function (_a, args) {
                observer.next(args.value);
            };
            var onError = function (_a, args) {
                removeListeners();
                observer.error(args.error);
            };
            var onComplete = function (_a) {
                removeListeners();
                observer.complete();
            };
            var removeListeners = function () {
                electron_1.ipcRenderer.removeListener(channels.next, onNext);
                electron_1.ipcRenderer.removeListener(channels.error, onError);
                electron_1.ipcRenderer.removeListener(channels.complete, onComplete);
            };
            electron_1.ipcRenderer.on(channels.next, onNext);
            electron_1.ipcRenderer.once(channels.error, onError);
            electron_1.ipcRenderer.once(channels.complete, onComplete);
            return removeListeners;
        });
        return message$;
    });
}
exports.createIpcSender = createIpcSender;
//# sourceMappingURL=sender.ipc.js.map