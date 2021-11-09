const path = require('path');

module.exports = {
    // 若要调试，则修改为 "development" 后重新 npm run adapter2
    mode: "development", // "production" | "development" | "none"
    // Chosen mode tells webpack to use its built-in optimizations accordingly.
    entry: "./templates/cocos2-adapter-modified/platforms/taobao/index.js", // string | object | array
    // defaults to ./src
    // Here the application starts executing
    // and webpack starts bundling
    output: {
        path: path.resolve(__dirname, "templates/cocos2"), // string (default)
        filename: "adapter.js", // string (default)
        library: { // There is also an old syntax for this available (click to show)
            type: "commonjs", // universal module definition
            // name: "CocosTaobaoAdapter", // string | string[]
            export: 'default'
        },
    },
    devtool: false, // enum
    context: __dirname, // string (absolute path!)
    target: "web", // enum
}