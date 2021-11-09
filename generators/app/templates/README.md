# Cocos Creator 平台适配

## 安装

```
npm install
```

## 使用

### 2.4.6 适配
使用方式：

1. Cocos 里构建好支付宝版本
2. `cocos2.ts` 最上面修改 `BUILD_PATH` 路径
3. `npm run c2`
4. 去 `dist/cocos2` 查收

### 3.3.2 适配 （TODO）
1. Cocos 里构建好支付宝版本
2. `cocos3.ts` 最上面修改 `BUILD_PATH` 路径
3. `npm run c3`
4. 去 `dist/cocos3` 查收

### 生成 2.4.6 `adapter.js`
1. 编辑处理好 `templates/cocos2-adapter-modified`
2. 若要构建为压缩混淆后的最小版本，则修改 `webpack.config.js` 配置为`mode: "production"`
3. `npm run adapter2`，然后查收 `templates/cocos2/adapter.js`

## 目录说明

- `dist` 能运行在淘宝平台的发布版本 **（可修改）**
    -  `laya` Laya 构建出的版本，可在淘宝平台运行
    - `egret` 白鹭构建出的版本，可在淘宝平台运行
    - `cocos2` Cocos 2.4.6 项目适配后的目标位置
    - `cocos3` Cocos 3.3.2 项目适配后的目标位置
- `build` Cocos 直接构建的版本 **（勿修改）**
    - `cocos2` Cocos 2.4.6 官方示例项目
    - `cocos3` Cocos 3.3.2 官方示例项目
- `libs` 一些可能会用到的脚本，TypeScript 开发 **（可修改）**
    - `processGlobalVar.ts` 处理全局变量，将所有全局变量放在 $global 下
- `templates` 适配过程用到的模板文件，无侵入式修改
    - `cocos2` 从 Cocos 2.4.6 引擎中提取的淘宝平台项目模板 **（可修改）**
    - `cocos2-adapter` 从 Cocos 2.4.6 引擎中提取的淘宝平台的 adapter，入口点是 `cocos2-adapter/platforms/taobao/index.js`，其中的模块化写法淘宝平台不完全支持，需要 `rollup` 或 `webpack` 打包 **（勿修改）**
    - `cocos2-adapter-modified` 我修改了一丢丢的 adapter **（可修改）**

## 需求

将 Cocos Creator 2.x & 3.x 适配至指定平台，期望的使用过程如下：

1. 在 Cocos 中构建，将构建结果直接复制到 build 目录下。
2. 根据 Cocos 版本，执行 `npm run c2` 或 `npm run c3`。
3. 适配后的游戏包，自动创建至 `dist/cocos2` 或 `dist/cocos3`。

## 开发过程注意

1. 要考虑到未来引擎版本升级，采取无侵入式的适配方案。
2. 尽量以 NodeJS 脚本方式实现，而非 Cocos 插件。