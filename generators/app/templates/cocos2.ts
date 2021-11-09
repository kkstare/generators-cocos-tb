import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import {processGlobalVar} from "./src/libs/processGlobalVar"

// 路径配置
const BUILD_PATH = path.resolve(__dirname, 'build/cocos2-hello-world');
const DIST_PATH = path.resolve(__dirname, 'dist/cocos2');
const TPL_PATH = path.resolve(__dirname, './src/templates/cocos2');

async function main() {
    // 复制文件
    console.log(chalk.cyan('Copying files...'));
    fs.emptyDirSync(DIST_PATH);
    fs.copySync(BUILD_PATH, DIST_PATH);
    fs.copySync(TPL_PATH, DIST_PATH);
    fs.removeSync(path.join(DIST_PATH, 'adapter-min.js'))

    // 处理全局变量
    console.log(chalk.cyan('Processing global vars...'));
    await processGlobalVar(DIST_PATH);

    
    
    // app.js
    console.log(chalk.cyan('Updating files...'));
    let cocos2d = fs.existsSync(path.join(DIST_PATH, './cocos2d-js.js')) ? 'cocos2d-js' : 'cocos2d-js-min';
    let physics = fs.existsSync(path.join(DIST_PATH, './physics.js')) ? 'physics' : fs.existsSync(path.join(DIST_PATH, './physics-min.js')) ? 'physics-min' : null;
    let contentCocos2d = fs.readFileSync(path.join(DIST_PATH, 'app.js'), 'utf-8');
    contentCocos2d = contentCocos2d.replace(`'adapter-js-path'`, `'./adapter'`);
    contentCocos2d = contentCocos2d.replace(`'cocos2d-js-path'`, `'./${cocos2d}'`);
    contentCocos2d = contentCocos2d.replace(`require('physics-js-path');`, physics ? `require('./${physics}.js');` : '');
    fs.writeFileSync(path.join(DIST_PATH, 'app.js'), contentCocos2d, 'utf-8');

    // cocos2d-js.js
    fs.writeFileSync(
        path.join(DIST_PATH, `${cocos2d}.js`),
        fs.readFileSync(path.join(DIST_PATH, `${cocos2d}.js`), 'utf-8')
            .replace(/window\.setTimeout/g, 'setTimeout')
            .replace(/"\.\.\/core\/renderer\/"/g, '"../core/renderer"'),
        'utf-8'
    );

    // ccRequre.js
    fs.writeFileSync(
        path.join(DIST_PATH, `ccRequire.js`),
        fs.readFileSync(path.join(DIST_PATH, `ccRequire.js`), 'utf-8')
            .replace(/\(\) \{ return require\('/g, `() { return require('./`),
        'utf-8'
    );

    console.log(chalk.green('All done.'));
    process.exit();
}

main();
