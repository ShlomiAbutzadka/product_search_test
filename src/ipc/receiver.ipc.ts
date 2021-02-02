import { ipcMain, IpcMainEvent } from "electron";
import { Observable } from "rxjs";
import { buildChannel } from "./ipc";

export function createIpcReceiver<A, R>(
  channel: string,
  invoke: (args: A) => Observable<R>
) {
  ipcMain.on(channel, async (event: IpcMainEvent, args: A) => {
    console.log(channel, args);
    const channels = buildChannel(channel);

    invoke(args).subscribe({
      next(value) {
        console.log(channels.next, value);
        event.sender.send(channels.next, {
          args,
          value,
        });
      },
      error(error) {
        let serializedError = error;
        if (error instanceof Error) {
          serializedError = {
            name: error.name,
            message: error.message,
            stack: error.stack,
          };
        }

        console.log(channels.error, serializedError);
        event.sender.send(channels.error, {
          args,
          error: serializedError,
        });
      },
      complete() {
        console.log(channels.complete);
        event.sender.send(channels.complete, {
          args,
        });
      },
    });
  });
}
