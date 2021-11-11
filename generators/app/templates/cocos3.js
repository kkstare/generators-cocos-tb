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
const BUILD_PATH = path_1.default.resolve(__dirname, 'build/cocos3');
const DIST_PATH = path_1.default.resolve(__dirname, 'dist/cocos3');
const TPL_PATH = path_1.default.resolve(__dirname, './src/templates/cocos3');
async function main() {
    // 复制文件
    console.log(chalk_1.default.cyan('Copying files...'));
    fs_extra_1.default.emptyDirSync(DIST_PATH);
    fs_extra_1.default.copySync(BUILD_PATH, DIST_PATH);
    fs_extra_1.default.copySync(TPL_PATH, DIST_PATH);
    // 处理全局变量
    console.log(chalk_1.default.cyan('Processing global vars...'));
    await (0, processGlobalVar_1.processGlobalVar)(DIST_PATH);
    // game.js
    let contentGamejs = fs_extra_1.default.readFileSync(path_1.default.join(DIST_PATH, 'game.js'), 'utf-8');
    contentGamejs = contentGamejs.replace(`require("src/polyfills.bundle`, `require("./src/polyfills.bundle`);
    contentGamejs = contentGamejs.replace(`require("src/system.bundle`, `require("./src/system.bundle`);
    contentGamejs = contentGamejs.replace(`require("src/import-map`, `require("./src/import-map`);
    fs_extra_1.default.writeFileSync(path_1.default.join(DIST_PATH, 'game.js'), contentGamejs, 'utf-8');
    //@ts-ignore
    let applicationFileName = contentGamejs.match(/application(\S*).js/)[0];
    // console.log(applicationFileName);
    let contentApplicationjs = fs_extra_1.default.readFileSync(path_1.default.join(DIST_PATH, applicationFileName), 'utf-8');
    contentApplicationjs = contentApplicationjs.replace(` fsUtils `, ` window.fsUtils `);
    contentApplicationjs = contentApplicationjs.replace(`function loadSettingsJson(cc)`, `function loadSettingsJson(cc) {var settings = 'src/setting.js';return new Promise(function (resolve, reject) {require('./' + settings);resolve();});}\n\t\tfunction loadSettingsJson1(cc)`);
    fs_extra_1.default.writeFileSync(path_1.default.join(DIST_PATH, applicationFileName), contentApplicationjs, 'utf-8');
    //@ts-ignore
    let settingFileName = contentApplicationjs.match(/settings(\S*).json/)[0];
    // console.log(settingFileName);
    let settingPath = path_1.default.join(DIST_PATH, 'src/' + settingFileName);
    let contentSettingjs = fs_extra_1.default.readFileSync(settingPath, 'utf-8');
    contentSettingjs = 'var window = $global;\nwindow._CCSettings = ' + contentSettingjs;
    fs_extra_1.default.writeFileSync(settingPath, contentSettingjs, 'utf-8');
    fs_extra_1.default.rename(settingPath, settingPath.replace(settingFileName, 'setting.js'));
    let files = fs_extra_1.default.readdirSync(path_1.default.join(DIST_PATH, 'cocos-js'));
    for (let index = 0; index < files.length; index++) {
        const element = files[index];
        let cocosJsPath = path_1.default.join(DIST_PATH, 'cocos-js/' + element);
        let cocosJs = fs_extra_1.default.readFileSync(cocosJsPath, 'utf-8');
        cocosJs = `var globalThis = {"Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Int8Array": Int8Array,  "Int16Array": Int16Array, "Int32Array": Int32Array, "Float32Array": Float32Array, "Float64Array": Float64Array};\n` + cocosJs;
        fs_extra_1.default.writeFileSync(cocosJsPath, cocosJs, 'utf-8');
    }
    // let files = fs.readdirSync(path.join(DIST_PATH, 'cocos-js'));
    // let cocosJsPath = path.join(DIST_PATH, 'cocos-js/' + files[0]);
    // let cocosJs = fs.readFileSync(cocosJsPath, 'utf-8');
    // cocosJs = `var performance = { now: Date.now };\n` + cocosJs;
    // fs.writeFileSync(cocosJsPath, cocosJs, 'utf-8');
    // app.js
    // console.log(chalk.cyan('Updating files...'));
    // let cocos2d = fs.existsSync(path.join(DIST_PATH, './cocos2d-js.js')) ? 'cocos2d-js' : 'cocos2d-js-min';
    // let physics = fs.existsSync(path.join(DIST_PATH, './physics.js')) ? 'physics' : fs.existsSync(path.join(DIST_PATH, './physics-min.js')) ? 'physics-min' : null;
    // let contentCocos2d = fs.readFileSync(path.join(DIST_PATH, 'app.js'), 'utf-8');
    // contentCocos2d = contentCocos2d.replace(`'adapter-js-path'`, `'./adapter'`);
    // contentCocos2d = contentCocos2d.replace(`'cocos2d-js-path'`, `'./${cocos2d}'`);
    // contentCocos2d = contentCocos2d.replace(`require('physics-js-path');`, physics ? `require('./${physics}.js');` : '');
    // fs.writeFileSync(path.join(DIST_PATH, 'app.js'), contentCocos2d, 'utf-8');
    // // cocos2d-js.js
    // fs.writeFileSync(
    //     path.join(DIST_PATH, `${cocos2d}.js`),
    //     fs.readFileSync(path.join(DIST_PATH, `${cocos2d}.js`), 'utf-8')
    //         .replace(/window\.setTimeout/g, 'setTimeout')
    //         .replace(/"\.\.\/core\/renderer\/"/g, '"../core/renderer"'),
    //     'utf-8'
    // );
    // // ccRequre.js
    // fs.writeFileSync(
    //     path.join(DIST_PATH, `ccRequire.js`),
    //     fs.readFileSync(path.join(DIST_PATH, `ccRequire.js`), 'utf-8')
    //         .replace(/\(\) \{ return require\('/g, `() { return require('./`),
    //     'utf-8'
    // );
    console.log(chalk_1.default.green('All done.'));
    process.exit();
}
main();
