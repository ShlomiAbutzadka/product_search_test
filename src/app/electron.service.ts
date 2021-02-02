import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {createIpcSender} from '../ipc/sender.ipc';

@Injectable({
  providedIn: "root",
})
export class ElectronService {
  private TAG: string = `[${this.constructor.name}]: `;

  constructor() {}


  public exec<A, R>(channel: string, payload: A): Observable<R> {
  return createIpcSender(channel, payload);
  }
}
