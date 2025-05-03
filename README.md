#### 🚧 Experimental stage 🚧
## A firefox extension for discord rich presence at sites like ao3 and royal road

### Supported sites (As of now, more to come at later date)
- archiveofourown.org
- royalroad.com
- webnovel.com
- ranobes.net

## Manual installation
### On windows (Works with 3rd party clients)
- Update the registry at "HKEY_CURRENT_USER\SOFTWARE\Mozilla\NativeMessagingHosts\enthusiastic_reader_rpc" with the path to "enthusiastic_reader\native-host\manifest.json"
- Build "app_windows.exe"
- Update the "path" property of "enthusiastic_reader/native-host/manifest.json" to the absolute path of "enthusiastic_reader/native-host/app_windows.exe"
### On linux (Does not works with 3rd party clients AND does not works with discord flatpaks versions out of the box*)
- Update the "path" property of "enthusiastic_reader/native-host/manifest.json" to the absolute path of "enthusiastic_reader/native-host/app_linux"
- Build "app_linux"
- Copy the "enthusiastic_reader/native-host/manifest.json" at "~/.mozilla/native-messaging-hosts/"
###### *The "discord-rpc" dependency for "app_linux" from the "enthusiastic_reader/native-host/main.js" source code, at the function getIPCPath() returns the path to a know location of a discord created named pipe, flatpaks versions have other locations for them, update the function to return "/run/user/1000/app/com.discordapp.Discord/discord-ipc-0"

### On browser side
- Go to "about:debugging#/runtime/this-firefox" at firefox, click at "Load Temporary Add-on" button and select "enthusiastic_reader/manifest.json"

#### Build Dependencies
- Node.js
- pkg node package

### Building (Do so inside the "enthusiastic_reader/native-host" directory)
```bash
$ pkg main.js --targets node18-linux-x64 --output app_linux
```
```bash
$ pkg main.js --targets node18-win-x64 --output app_windows
```
