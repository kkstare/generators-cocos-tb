"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const processGlobalVar_1 = require("../libs/processGlobalVar");
// 测试用，重现处理个别文件的全局变量
// 路径配置
const DIST_PATH = path_1.default.resolve(__dirname, '../dist/cocos2/src/assets/cases/05_scripting/10_network/socket-io.js');
async function main() {
    // 处理全局变量
    console.log('Processing global vars...');
    await (0, processGlobalVar_1.processGlobalVar)([DIST_PATH], console);
    console.log('All done.');
    process.exit();
}
main();
