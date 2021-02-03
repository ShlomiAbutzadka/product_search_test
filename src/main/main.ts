import { app, BrowserWindow, screen } from "electron";
import { Observable } from "rxjs";
import { createIpcReceiver } from "../common/ipc/receiver.ipc";
import { AppConfig } from "../common/environments/environment";
import { createRequest } from "../common/ipc/request.ipc";
import * as path from "path";

export class Main {
  private mainWindow: BrowserWindow;
  private isDevelopment = process.env.NODE_ENV !== "production";

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

      createIpcReceiver("getProducts", (args: string) =>
        this.getProducts(args)
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private getProducts(query: string): Observable<any> {
    const url: string = `${AppConfig.BASE_URL}/api/products/search?query=${query}`;
    const method: string = "GET";
    return createRequest({ method, url });
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
    if (this.mainWindow) return;
    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    this.mainWindow = new BrowserWindow({
      x: 0,
      y: 0,
      width: size.width / 2,
      height: size.height / 2,
      webPreferences: {
        nodeIntegration: true,
        allowRunningInsecureContent: this.isDevelopment ? true : false,
        contextIsolation: false, // false if you want to run 2e2 test with Spectron
        enableRemoteModule: true, // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
      },
    });

    if (this.isDevelopment) {
      this.mainWindow.webContents.openDevTools();
      this.mainWindow.loadURL(
        `http://${process.env.ELECTRON_WEBPACK_WDS_HOST}:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
      );
    } else {
      this.mainWindow.loadFile(path.resolve(__dirname, "index.html"));
    }
    // Emitted when the window is closed.
    this.mainWindow.on("closed", () => {
      // Dereference the window object, usually you would store window
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this.mainWindow = null;
    });
  }

  public openWindow(): void {
    if (this.mainWindow) {
      this.mainWindow.show();
      this.mainWindow.focus();
      this.mainWindow.webContents.focus();
      return;
    }
  }
}

new Main().init();
