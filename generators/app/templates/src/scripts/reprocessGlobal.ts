import path from "path";
import { processGlobalVar } from "../libs/processGlobalVar";

// 测试用，重现处理个别文件的全局变量

// 路径配置
const DIST_PATH = path.resolve(__dirname, '../dist/cocos2/src/assets/cases/05_scripting/10_network/socket-io.js');

async function main() {
    // 处理全局变量
    console.log('Processing global vars...');
    await processGlobalVar([DIST_PATH], console);

    console.log('All done.');
    process.exit();
}

main();