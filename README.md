```
   ██████╗ ██╗██████╗        █████╗  ██████╗ ███████╗███╗   ██╗████████╗
  ██╔════╝ ██║██╔══██╗      ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝
  ██║  ███╗██║██████╔╝█████╗███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   
  ██║   ██║██║██╔══██╗╚════╝██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   
  ╚██████╔╝██║██║  ██║      ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   
   ╚═════╝ ╚═╝╚═╝  ╚═╝      ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   
```

This package is specifically created for GrowItRapid, for privately performed tasks. Currently this is being used only to scrap courses to get it in well structure.

> Although this can be run through node, but it is using Node's SEA Api, through which it can be converted into Single Executable application, where Node isn't necessory.

## Build SEA

- Install Node >= v22.8.0
- create a file in the root directory named `.env` and put the following into it.
```properties
# Add all of the environmental variables here instead of 
# embedding them directly in the app and utilize them 
# with the `DotEnv` package.
VERSION=1.0.0
AGENT_SECRET_KEY=secret

PORT=5000
GOOGLE_AI_API_KEY=Your_Key
```
### For Windows

- Add `signtool.exe` to the environment variable.
  
  Todo so, first you need to find the location of the file. It's by default present in `Windows Kits`. The location it may exist are:

  - `C:\Program Files (x86)\Windows Kits\10\bin\10.0.16299.0\x64`
  - `C:\Program Files (x86)\Windows Kits\10\App Certification Kit`
  - `C:\Program Files (x86)\Windows Kits\10\bin\10.0.17763.0\x64`
  - `C:\Program Files (x86)\Windows Kits\10\bin\10.0.19041.0\x64`
  - `C:\Program Files (x86)\Microsoft SDKs\ClickOnce\SignTool`
  - `C:\Program Files (x86)\Windows Kits\10\bin\x64`

  Search all these location and where ever you found the `signtool.exe`, add the path of that folder to the environment variable.

  > If you don't know how to add path into Environment Variable, Search on Google.

- Open terminal in the root directory and run the following command.

  `npm run pkg:win`

- After the command has finished, you can find the executable in the following location: `dist/agent.exe`

### For Mac

- Ensure you have `codesign` available in your machine. If not go for Google.

- Open terminal in the root directory and run the following command.

  `npm run pkg:mac`

- After the command has finished, you can find the executable in the following location: `dist/agent`