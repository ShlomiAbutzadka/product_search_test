import {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  net,
  IncomingMessage,
} from "electron";
import { IpcMainEvent } from "electron/main";
import * as path from "path";
import * as url from "url";

const BASE_URL: string =
  "https://pcsa57ebsj.execute-api.us-east-1.amazonaws.com";

export class Main {
  private window: BrowserWindow;
  private args: string[] = process.argv.slice(1);
  private serve: boolean = this.args.some((val) => val === "--serve");

  public init(): void {
    try {
      // This method will be called when Electron has finished
      // initialization and is ready to create browser windows.
      // Some APIs can only be used after this event occurs.
      // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
      app.on("ready", () => setTimeout(this.createWindow.bind(this), 400));
      // Quit when all windows are closed.
      app.on("window-all-closed", this.onWindowAllClosed.bind(this));
      app.on("activate", this.onActivate.bind(this));

      ipcMain.on("getProducts", (event: IpcMainEvent, query: string) => {
        this.getProducts(event, query);
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private async getProducts(event: IpcMainEvent, query: string): Promise<void> {
    const url: string = `${BASE_URL}/api/products/search?query=${query}`;
    const response: string = await this.makeClientRequest(url);
    event.reply("getProducts/next", response);
  }

  private makeClientRequest(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const request: Electron.ClientRequest = net.request({
        method: "GET",
        protocol: "https:",
        url: url,
      });

      request.on("response", (response: IncomingMessage) => {
        let body: string = "";
        response.on("data", (chunk: Buffer) => {
          body += chunk;
        });
        response.on("end", () => {
          resolve(body);
        });
        response.on("error", () => {
          reject();
        });
      });
      request.end();
    });
  }

  private onActivate(): void {
    this.createWindow();
    this.openWindow();
  }

  private onWindowAllClosed(): void {
    if (process.platform !== "darwin") {
      app.quit();
    }
  }

  private createWindow(): void {
    if (this.window) return;
    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    this.window = new BrowserWindow({
      x: 0,
      y: 0,
      width: size.width / 2,
      height: size.height / 2,
      webPreferences: {
        nodeIntegration: true,
        allowRunningInsecureContent: this.serve ? true : false,
        contextIsolation: false, // false if you want to run 2e2 test with Spectron
        enableRemoteModule: true, // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
      },
    });

    if (this.serve) {
      this.window.webContents.openDevTools();

      // require("electron-reload")(__dirname, {
      //   electron: require(`${__dirname}/node_modules/electron`),
      // });
      this.window.loadURL("http://localhost:4200");
    } else {
      // this.window.loadURL(
      //   url.format({
      //     pathname: path.join(__dirname, "dist/index.html"),
      //     protocol: "file:",
      //     slashes: true,
      //   })
      // );
    }
    // Emitted when the window is closed.
    this.window.on("closed", () => {
      // Dereference the window object, usually you would store window
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this.window = null;
    });
  }

  public openWindow(): void {
    if (this.window) {
      this.window.show();
      this.window.focus();
      this.window.webContents.focus();
      return;
    }
  }
}

new Main().init();
