import { app, BrowserWindow, screen } from "electron";
import { Observable } from "rxjs";
import { createIpcReceiver } from "./ipc/receiver.ipc";
import { AppConfig } from "./environments/environment";
import { createRequest } from "./ipc/request.ipc";

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
