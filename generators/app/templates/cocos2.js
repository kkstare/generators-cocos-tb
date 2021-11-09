"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const processGlobalVar_1 = require("./src/libs/processGlobalVar");
// 路径配置
const BUILD_PATH = path_1.default.resolve(__dirname, 'build/cocos2-hello-world');
const DIST_PATH = path_1.default.resolve(__dirname, 'dist/cocos2');
const TPL_PATH = path_1.default.resolve(__dirname, './src/templates/cocos2');
async function main() {
    // 复制文件
    console.log(chalk_1.default.cyan('Copying files...'));
    fs_extra_1.default.emptyDirSync(DIST_PATH);
    fs_extra_1.default.copySync(BUILD_PATH, DIST_PATH);
    fs_extra_1.default.copySync(TPL_PATH, DIST_PATH);
    fs_extra_1.default.removeSync(path_1.default.join(DIST_PATH, 'adapter-min.js'));
    // 处理全局变量
    console.log(chalk_1.default.cyan('Processing global vars...'));
    await (0, processGlobalVar_1.processGlobalVar)(DIST_PATH);
    // app.js
    console.log(chalk_1.default.cyan('Updating files...'));
    let cocos2d = fs_extra_1.default.existsSync(path_1.default.join(DIST_PATH, './cocos2d-js.js')) ? 'cocos2d-js' : 'cocos2d-js-min';
    let physics = fs_extra_1.default.existsSync(path_1.default.join(DIST_PATH, './physics.js')) ? 'physics' : fs_extra_1.default.existsSync(path_1.default.join(DIST_PATH, './physics-min.js')) ? 'physics-min' : null;
    let contentCocos2d = fs_extra_1.default.readFileSync(path_1.default.join(DIST_PATH, 'app.js'), 'utf-8');
    contentCocos2d = contentCocos2d.replace(`'adapter-js-path'`, `'./adapter'`);
    contentCocos2d = contentCocos2d.replace(`'cocos2d-js-path'`, `'./${cocos2d}'`);
    contentCocos2d = contentCocos2d.replace(`require('physics-js-path');`, physics ? `require('./${physics}.js');` : '');
    fs_extra_1.default.writeFileSync(path_1.default.join(DIST_PATH, 'app.js'), contentCocos2d, 'utf-8');
    // cocos2d-js.js
    fs_extra_1.default.writeFileSync(path_1.default.join(DIST_PATH, `${cocos2d}.js`), fs_extra_1.default.readFileSync(path_1.default.join(DIST_PATH, `${cocos2d}.js`), 'utf-8')
        .replace(/window\.setTimeout/g, 'setTimeout')
        .replace(/"\.\.\/core\/renderer\/"/g, '"../core/renderer"'), 'utf-8');
    // ccRequre.js
    fs_extra_1.default.writeFileSync(path_1.default.join(DIST_PATH, `ccRequire.js`), fs_extra_1.default.readFileSync(path_1.default.join(DIST_PATH, `ccRequire.js`), 'utf-8')
        .replace(/\(\) \{ return require\('/g, `() { return require('./`), 'utf-8');
    console.log(chalk_1.default.green('All done.'));
    process.exit();
}
main();
