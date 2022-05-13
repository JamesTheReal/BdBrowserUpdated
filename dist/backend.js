(()=>{"use strict";var __webpack_modules__={984:()=>{eval('\n;// CONCATENATED MODULE: ../common/ipc.js\nclass IPC {\n  constructor(context) {\n    if (!context) throw new Error("Context is required");\n    this.context = context;\n  }\n\n  createHash() {\n    return Math.random().toString(36).substr(2, 10);\n  }\n\n  reply(message, data) {\n    this.send(message.event + "-reply", data, void 0, message.hash);\n  }\n\n  on(event, listener, once = false) {\n    const wrappedListener = message => {\n      if (message.data.event !== event || message.data.context === this.context) return;\n      const returnValue = listener(message.data, message.data.data);\n\n      if (returnValue == true && once) {\n        window.removeEventListener("message", wrappedListener);\n      }\n    };\n\n    window.addEventListener("message", wrappedListener);\n  }\n\n  send(event, data, callback = null, hash) {\n    if (!hash) hash = this.createHash();\n\n    if (callback) {\n      this.on(event + "-reply", message => {\n        if (message.hash === hash) {\n          callback(message.data);\n          return true;\n        }\n\n        return false;\n      }, true);\n    }\n\n    window.postMessage({\n      source: "betterdiscord-browser-" + this.context,\n      event: event,\n      context: this.context,\n      hash: hash,\n      data\n    });\n  }\n\n}\n;\n;// CONCATENATED MODULE: ../common/constants.js\nconst IPCEvents = {\n  INJECT_CSS: "bdbrowser-inject-css",\n  MAKE_REQUESTS: "bdbrowser-make-requests",\n  INJECT_THEME: "bdbrowser-inject-theme"\n};\n;// CONCATENATED MODULE: ../common/dom.js\nclass DOM {\n  /**@returns {HTMLElement} */\n  static createElement(type, options = {}, ...children) {\n    const node = document.createElement(type);\n    Object.assign(node, options);\n\n    for (const child of children) {\n      node.append(child);\n    }\n\n    return node;\n  }\n\n  static injectTheme(id, css) {\n    const [bdThemes] = document.getElementsByTagName("bd-themes");\n    const style = this.createElement("style", {\n      id: id,\n      type: "text/css",\n      innerHTML: css\n    });\n    style.setAttribute("data-bd-native", "");\n    bdThemes.append(style);\n  }\n\n  static injectCSS(id, css) {\n    const style = this.createElement("style", {\n      id: id,\n      type: "text/css",\n      innerHTML: css\n    });\n    this.headAppend(style);\n  }\n\n  static removeCSS(id) {\n    const style = document.querySelector("style#" + id);\n\n    if (style) {\n      style.remove();\n    }\n  }\n\n  static injectJS(id, src, silent = true) {\n    const script = this.createElement("script", {\n      id: id,\n      type: "text/javascript",\n      src: src\n    });\n    this.headAppend(script);\n    if (silent) script.addEventListener("load", () => {\n      script.remove();\n    }, {\n      once: true\n    });\n  }\n\n}\nDOM.headAppend = document.head.append.bind(document.head);\n;// CONCATENATED MODULE: ../common/logger.js\nclass Logger {\n  static _parseType(type) {\n    switch (type) {\n      case "info":\n      case "warn":\n      case "error":\n        return type;\n\n      default:\n        return "log";\n    }\n  }\n\n  static _log(type, module, ...nessage) {\n    type = this._parseType(type);\n    console[type](`%c[BetterDiscord]%c %c[${module}]%c`, "color: #3E82E5; font-weight: 700;", "", "color: #396CB8", "", ...nessage);\n  }\n\n  static log(module, ...message) {\n    this._log("log", module, ...message);\n  }\n\n  static info(module, ...message) {\n    this._log("info", module, ...message);\n  }\n\n  static warn(module, ...message) {\n    this._log("warn", module, ...message);\n  }\n\n  static error(module, ...message) {\n    this._log("error", module, ...message);\n  }\n\n}\n;// CONCATENATED MODULE: ./src/index.js\n\n\n\n\nLogger.log("Backend", "Initializing modules");\nconst ipcMain = new IPC("backend");\nLogger.log("Backend", "Registering events");\nipcMain.on(IPCEvents.INJECT_CSS, (_, data) => {\n  DOM.injectCSS(data.id, data.css);\n});\nipcMain.on(IPCEvents.INJECT_THEME, (_, data) => {\n  DOM.injectTheme(data.id, data.css);\n});\nipcMain.on(IPCEvents.MAKE_REQUESTS, (event, data) => {\n  fetch(data.url).catch(console.error.bind(null, "REQUEST FAILED:")).then(res => res.text()).then(text => {\n    ipcMain.reply(event, text);\n  });\n});\n\nconst SCRIPT_URL = (() => {\n  switch ("production") {\n    case "production":\n      return "https://JamesTheReal.github.io/BdBrowserUpdated/dist/frontend.js";\n\n    case "development":\n      return "http://127.0.0.1:5500/frontend.js";\n\n    default:\n      throw new Error("Unknown Environment");\n  }\n})();\n\nLogger.log("Backend", "Loading frontend script from", SCRIPT_URL);\nDOM.injectJS("BetterDiscordBrowser-frontend", SCRIPT_URL, false);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiOTg0LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4uL2NvbW1vbi9pcGMuanM/NDkzZSIsIndlYnBhY2s6Ly8vLi4vY29tbW9uL2NvbnN0YW50cy5qcz83MTA1Iiwid2VicGFjazovLy8uLi9jb21tb24vZG9tLmpzPzBmNGIiLCJ3ZWJwYWNrOi8vLy4uL2NvbW1vbi9sb2dnZXIuanM/MmZhOSIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanM/ZmE2OCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBJUEMge1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0KSB7XG4gICAgaWYgKCFjb250ZXh0KSB0aHJvdyBuZXcgRXJyb3IoXCJDb250ZXh0IGlzIHJlcXVpcmVkXCIpO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIH1cblxuICBjcmVhdGVIYXNoKCkge1xuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgMTApO1xuICB9XG5cbiAgcmVwbHkobWVzc2FnZSwgZGF0YSkge1xuICAgIHRoaXMuc2VuZChtZXNzYWdlLmV2ZW50ICsgXCItcmVwbHlcIiwgZGF0YSwgdm9pZCAwLCBtZXNzYWdlLmhhc2gpO1xuICB9XG5cbiAgb24oZXZlbnQsIGxpc3RlbmVyLCBvbmNlID0gZmFsc2UpIHtcbiAgICBjb25zdCB3cmFwcGVkTGlzdGVuZXIgPSBtZXNzYWdlID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLmRhdGEuZXZlbnQgIT09IGV2ZW50IHx8IG1lc3NhZ2UuZGF0YS5jb250ZXh0ID09PSB0aGlzLmNvbnRleHQpIHJldHVybjtcbiAgICAgIGNvbnN0IHJldHVyblZhbHVlID0gbGlzdGVuZXIobWVzc2FnZS5kYXRhLCBtZXNzYWdlLmRhdGEuZGF0YSk7XG5cbiAgICAgIGlmIChyZXR1cm5WYWx1ZSA9PSB0cnVlICYmIG9uY2UpIHtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIHdyYXBwZWRMaXN0ZW5lcik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCB3cmFwcGVkTGlzdGVuZXIpO1xuICB9XG5cbiAgc2VuZChldmVudCwgZGF0YSwgY2FsbGJhY2sgPSBudWxsLCBoYXNoKSB7XG4gICAgaWYgKCFoYXNoKSBoYXNoID0gdGhpcy5jcmVhdGVIYXNoKCk7XG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMub24oZXZlbnQgKyBcIi1yZXBseVwiLCBtZXNzYWdlID0+IHtcbiAgICAgICAgaWYgKG1lc3NhZ2UuaGFzaCA9PT0gaGFzaCkge1xuICAgICAgICAgIGNhbGxiYWNrKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LCB0cnVlKTtcbiAgICB9XG5cbiAgICB3aW5kb3cucG9zdE1lc3NhZ2Uoe1xuICAgICAgc291cmNlOiBcImJldHRlcmRpc2NvcmQtYnJvd3Nlci1cIiArIHRoaXMuY29udGV4dCxcbiAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgIGNvbnRleHQ6IHRoaXMuY29udGV4dCxcbiAgICAgIGhhc2g6IGhhc2gsXG4gICAgICBkYXRhXG4gICAgfSk7XG4gIH1cblxufVxuOyIsImV4cG9ydCBjb25zdCBJUENFdmVudHMgPSB7XG4gIElOSkVDVF9DU1M6IFwiYmRicm93c2VyLWluamVjdC1jc3NcIixcbiAgTUFLRV9SRVFVRVNUUzogXCJiZGJyb3dzZXItbWFrZS1yZXF1ZXN0c1wiLFxuICBJTkpFQ1RfVEhFTUU6IFwiYmRicm93c2VyLWluamVjdC10aGVtZVwiXG59OyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTSB7XG4gIC8qKkByZXR1cm5zIHtIVE1MRWxlbWVudH0gKi9cbiAgc3RhdGljIGNyZWF0ZUVsZW1lbnQodHlwZSwgb3B0aW9ucyA9IHt9LCAuLi5jaGlsZHJlbikge1xuICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuICAgIE9iamVjdC5hc3NpZ24obm9kZSwgb3B0aW9ucyk7XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBub2RlLmFwcGVuZChjaGlsZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBzdGF0aWMgaW5qZWN0VGhlbWUoaWQsIGNzcykge1xuICAgIGNvbnN0IFtiZFRoZW1lc10gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJkLXRoZW1lc1wiKTtcbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuY3JlYXRlRWxlbWVudChcInN0eWxlXCIsIHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHR5cGU6IFwidGV4dC9jc3NcIixcbiAgICAgIGlubmVySFRNTDogY3NzXG4gICAgfSk7XG4gICAgc3R5bGUuc2V0QXR0cmlidXRlKFwiZGF0YS1iZC1uYXRpdmVcIiwgXCJcIik7XG4gICAgYmRUaGVtZXMuYXBwZW5kKHN0eWxlKTtcbiAgfVxuXG4gIHN0YXRpYyBpbmplY3RDU1MoaWQsIGNzcykge1xuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5jcmVhdGVFbGVtZW50KFwic3R5bGVcIiwge1xuICAgICAgaWQ6IGlkLFxuICAgICAgdHlwZTogXCJ0ZXh0L2Nzc1wiLFxuICAgICAgaW5uZXJIVE1MOiBjc3NcbiAgICB9KTtcbiAgICB0aGlzLmhlYWRBcHBlbmQoc3R5bGUpO1xuICB9XG5cbiAgc3RhdGljIHJlbW92ZUNTUyhpZCkge1xuICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInN0eWxlI1wiICsgaWQpO1xuXG4gICAgaWYgKHN0eWxlKSB7XG4gICAgICBzdHlsZS5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgaW5qZWN0SlMoaWQsIHNyYywgc2lsZW50ID0gdHJ1ZSkge1xuICAgIGNvbnN0IHNjcmlwdCA9IHRoaXMuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiLCB7XG4gICAgICBpZDogaWQsXG4gICAgICB0eXBlOiBcInRleHQvamF2YXNjcmlwdFwiLFxuICAgICAgc3JjOiBzcmNcbiAgICB9KTtcbiAgICB0aGlzLmhlYWRBcHBlbmQoc2NyaXB0KTtcbiAgICBpZiAoc2lsZW50KSBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xuICAgICAgc2NyaXB0LnJlbW92ZSgpO1xuICAgIH0sIHtcbiAgICAgIG9uY2U6IHRydWVcbiAgICB9KTtcbiAgfVxuXG59XG5ET00uaGVhZEFwcGVuZCA9IGRvY3VtZW50LmhlYWQuYXBwZW5kLmJpbmQoZG9jdW1lbnQuaGVhZCk7IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nZ2VyIHtcbiAgc3RhdGljIF9wYXJzZVR5cGUodHlwZSkge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBcImluZm9cIjpcbiAgICAgIGNhc2UgXCJ3YXJuXCI6XG4gICAgICBjYXNlIFwiZXJyb3JcIjpcbiAgICAgICAgcmV0dXJuIHR5cGU7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBcImxvZ1wiO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBfbG9nKHR5cGUsIG1vZHVsZSwgLi4ubmVzc2FnZSkge1xuICAgIHR5cGUgPSB0aGlzLl9wYXJzZVR5cGUodHlwZSk7XG4gICAgY29uc29sZVt0eXBlXShgJWNbQmV0dGVyRGlzY29yZF0lYyAlY1ske21vZHVsZX1dJWNgLCBcImNvbG9yOiAjM0U4MkU1OyBmb250LXdlaWdodDogNzAwO1wiLCBcIlwiLCBcImNvbG9yOiAjMzk2Q0I4XCIsIFwiXCIsIC4uLm5lc3NhZ2UpO1xuICB9XG5cbiAgc3RhdGljIGxvZyhtb2R1bGUsIC4uLm1lc3NhZ2UpIHtcbiAgICB0aGlzLl9sb2coXCJsb2dcIiwgbW9kdWxlLCAuLi5tZXNzYWdlKTtcbiAgfVxuXG4gIHN0YXRpYyBpbmZvKG1vZHVsZSwgLi4ubWVzc2FnZSkge1xuICAgIHRoaXMuX2xvZyhcImluZm9cIiwgbW9kdWxlLCAuLi5tZXNzYWdlKTtcbiAgfVxuXG4gIHN0YXRpYyB3YXJuKG1vZHVsZSwgLi4ubWVzc2FnZSkge1xuICAgIHRoaXMuX2xvZyhcIndhcm5cIiwgbW9kdWxlLCAuLi5tZXNzYWdlKTtcbiAgfVxuXG4gIHN0YXRpYyBlcnJvcihtb2R1bGUsIC4uLm1lc3NhZ2UpIHtcbiAgICB0aGlzLl9sb2coXCJlcnJvclwiLCBtb2R1bGUsIC4uLm1lc3NhZ2UpO1xuICB9XG5cbn0iLCJpbXBvcnQgSVBDIGZyb20gXCJjb21tb24vaXBjXCI7XG5pbXBvcnQgeyBJUENFdmVudHMgfSBmcm9tIFwiY29tbW9uL2NvbnN0YW50c1wiO1xuaW1wb3J0IERPTSBmcm9tIFwiY29tbW9uL2RvbVwiO1xuaW1wb3J0IExvZ2dlciBmcm9tIFwiY29tbW9uL2xvZ2dlclwiO1xuTG9nZ2VyLmxvZyhcIkJhY2tlbmRcIiwgXCJJbml0aWFsaXppbmcgbW9kdWxlc1wiKTtcbmNvbnN0IGlwY01haW4gPSBuZXcgSVBDKFwiYmFja2VuZFwiKTtcbkxvZ2dlci5sb2coXCJCYWNrZW5kXCIsIFwiUmVnaXN0ZXJpbmcgZXZlbnRzXCIpO1xuaXBjTWFpbi5vbihJUENFdmVudHMuSU5KRUNUX0NTUywgKF8sIGRhdGEpID0+IHtcbiAgRE9NLmluamVjdENTUyhkYXRhLmlkLCBkYXRhLmNzcyk7XG59KTtcbmlwY01haW4ub24oSVBDRXZlbnRzLklOSkVDVF9USEVNRSwgKF8sIGRhdGEpID0+IHtcbiAgRE9NLmluamVjdFRoZW1lKGRhdGEuaWQsIGRhdGEuY3NzKTtcbn0pO1xuaXBjTWFpbi5vbihJUENFdmVudHMuTUFLRV9SRVFVRVNUUywgKGV2ZW50LCBkYXRhKSA9PiB7XG4gIGZldGNoKGRhdGEudXJsKS5jYXRjaChjb25zb2xlLmVycm9yLmJpbmQobnVsbCwgXCJSRVFVRVNUIEZBSUxFRDpcIikpLnRoZW4ocmVzID0+IHJlcy50ZXh0KCkpLnRoZW4odGV4dCA9PiB7XG4gICAgaXBjTWFpbi5yZXBseShldmVudCwgdGV4dCk7XG4gIH0pO1xufSk7XG5cbmNvbnN0IFNDUklQVF9VUkwgPSAoKCkgPT4ge1xuICBzd2l0Y2ggKEVOVikge1xuICAgIGNhc2UgXCJwcm9kdWN0aW9uXCI6XG4gICAgICByZXR1cm4gXCJodHRwczovL0phbWVzVGhlUmVhbC5naXRodWIuaW8vQmRCcm93c2VyVXBkYXRlZC9kaXN0L2Zyb250ZW5kLmpzXCI7XG5cbiAgICBjYXNlIFwiZGV2ZWxvcG1lbnRcIjpcbiAgICAgIHJldHVybiBcImh0dHA6Ly8xMjcuMC4wLjE6NTUwMC9mcm9udGVuZC5qc1wiO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gRW52aXJvbm1lbnRcIik7XG4gIH1cbn0pKCk7XG5cbkxvZ2dlci5sb2coXCJCYWNrZW5kXCIsIFwiTG9hZGluZyBmcm9udGVuZCBzY3JpcHQgZnJvbVwiLCBTQ1JJUFRfVVJMKTtcbkRPTS5pbmplY3RKUyhcIkJldHRlckRpc2NvcmRCcm93c2VyLWZyb250ZW5kXCIsIFNDUklQVF9VUkwsIGZhbHNlKTsiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///984\n')}},__webpack_exports__={};__webpack_modules__[984]()})();