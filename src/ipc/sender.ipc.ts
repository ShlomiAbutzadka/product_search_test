import { defer, Observable } from 'rxjs';
import { buildChannel } from './ipc';
const { ipcRenderer } = window.require('electron');

export function createIpcSender<A, R>(channel: string, payload: A) {
  return defer(() => {
    ipcRenderer.send(channel, payload);

    const message$: Observable<R> = new Observable((observer: any) => {
      const channels = buildChannel(channel);

      const onNext = ({  }: Event, args: { args: any; value: any }) => {
        observer.next(args.value);
      };

      const onError = ({  }: Event, args: { args: any; error: any }) => {
        removeListeners();
        observer.error(args.error);
      };

      const onComplete = ({  }: Event) => {
        removeListeners();
        observer.complete();
      };

      const removeListeners = () => {
        ipcRenderer.removeListener(channels.next, onNext);
        ipcRenderer.removeListener(channels.error, onError);
        ipcRenderer.removeListener(channels.complete, onComplete);
      };

      ipcRenderer.on(channels.next, onNext);
      ipcRenderer.once(channels.error, onError);
      ipcRenderer.once(channels.complete, onComplete);

      return removeListeners;
    });

    return message$;
  });
}