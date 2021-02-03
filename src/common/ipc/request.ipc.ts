import { IncomingMessage, net } from "electron";
import { Observable } from "rxjs";

export function createRequest({method,url,}: {method: string;url: string;}): Observable<any> {
  return new Observable((observer: any) => {
    const request: Electron.ClientRequest = net.request({
      method: method,
      protocol: "https:",
      url: url,
    });

    request.on("response", (response: IncomingMessage) => {
      let body: string = "";
      response.on("data", (chunk: Buffer) => {
        body += chunk;
        observer.next(body);
      });
      response.on("end", () => observer.complete());
      response.on("error", (e: any) => observer.error(e));
    });
    request.end();
  });
}