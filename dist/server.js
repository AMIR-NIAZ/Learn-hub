"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const appInstance = new app_1.App();
console.log("aaa");
appInstance.app.listen(appInstance.port, () => {
    console.log(`Server running on port ${appInstance.port}`);
});
//# sourceMappingURL=server.js.map