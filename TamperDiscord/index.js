const fs = require("fs");
const path = require("path");
const electron = require("electron");
var glob = require("glob");
const buildInfoFile = path.resolve(electron.app.getAppPath(), "..", "build_info.json");
const Module = require("module").Module;
Module.globalPaths.push(path.resolve(electron.app.getAppPath(), "..", "app.asar", "node_modules"));

const Utils = require("./utils");
const config = require("./config.json");

const AppData = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
const ExtFolder = AppData + "/TamperDiscord/";
if(!fs.existsSync(ExtFolder))
{
	fs.mkdirSync(ExtFolder);
}

/*

reused betterdiscord code (betterdiscord is trash btw, but code is now mine haha)

*/

const TamperDiscord = class TamperDiscord {
    constructor(mainWindow) {

        Utils.setWindow(mainWindow);

        this.disableCSP(mainWindow);

        Utils.log("Hooking dom-ready");
        mainWindow.webContents.on("dom-ready", this.load.bind(this));
    }

    get externalData() {
        return [
            {
                type: "script",
                url: "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js",
                backup: "//cdn.jsdelivr.net/gh/jquery/jquery@2.0.0/jquery.min.js",
                local: null
            },
            {
                type: "script",
                url: "https://pastebin.com/raw/uAkt4ia8",
                backup: "https://localhost/././././",
                local: null
            }
        ];
    }

    disableCSP(browserWindow) {
        browserWindow.webContents.session.webRequest.onHeadersReceived(function(details, callback) {
            if (!details.responseHeaders["content-security-policy-report-only"] && !details.responseHeaders["content-security-policy"]) return callback({cancel: false});
            delete details.responseHeaders["content-security-policy-report-only"];
            delete details.responseHeaders["content-security-policy"];
            callback({cancel: false, responseHeaders: details.responseHeaders});
        });
    }


    ensureFolders() {
    }

    async saveConfig() {
        return new Promise(resolve => fs.writeFile(path.resolve(__dirname, "config.json"), JSON.stringify(config, null, 4), resolve));
    }

    async loadApp() {
        for (const data of this.externalData) {
            const url = Utils.formatString((config.local && data.local != null) ? data.local : data.url, {repo: config.repo, hash: config.hash, minified: config.minified ? ".min" : ""});
            Utils.log(`Loading Resource (${url})`);
			const injector = (data.type == "script" ? Utils.injectScript : Utils.injectStyle).bind(Utils);
			try {
				await injector(url);
			}
			catch (err) {
				/**/
			}
        }

        Utils.log("Starting Up");

        glob(ExtFolder+"/*.js", function(er, files){
            files.forEach(f =>
                {
                    fs.readFile(f, 'utf8', function(err, content)
                        {
                            try
                            {
                                Utils.runJS(content);
                            }
                            catch(err)
                            {
                                Utils.runJS(`alert("Loading failed!\n Error loading ${f} has errors in it.\n${err}");`);
                            }
                        });
                });
        });

		Utils.log("Extensions started up. Starting the controller.");
        
        Utils.runJS(`(() => {
            try {
                var mainCore = new Core(${JSON.stringify(config)});
                mainCore.init();
            }
            catch (err) {}
        })();`);
    }

    async load() {
        Utils.log("Hooked dom-ready");
        Utils.log("Loading");

        await this.loadApp();
    }


};

module.exports = TamperDiscord;
