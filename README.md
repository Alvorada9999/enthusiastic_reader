#### 🚧 Experimental stage 🚧
## A firefox extension for discord rich presence at sites like ao3 and royal road

### Supported sites (As of now, more to come at later date)
- archiveofourown.org
- royalroad.com

## Manual installation
### On windows
- Update the registry at "HKEY_CURRENT_USER\SOFTWARE\Mozilla\NativeMessagingHosts\enthusiastic_reader_rpc" with the path to "enthusiastic_reader\native-host\manifest.json"
- Update the "path" property of "enthusiastic_reader/native-host/manifest.json" to the absolute path of "enthusiastic_reader/native-host/app.bat"
### On linux
- Update the "path" property of "enthusiastic_reader/native-host/manifest.json" to the absolute path of "enthusiastic_reader/native-host/app.sh"
- Copy the "enthusiastic_reader/native-host/manifest.json" at "~/.mozilla/native-messaging-hosts/"

### On browser side
- Go to "about:debugging#/runtime/this-firefox" at firefox, click at "Load Temporary Add-on" button and select "enthusiastic_reader/manifest.json"

#### Dependencies
- Node.js