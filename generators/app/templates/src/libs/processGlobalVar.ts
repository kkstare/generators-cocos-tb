import { Linter, Rule } from 'eslint';
import fs from "fs-extra";
import { glob } from "glob";
import 'k8w-extend-native';
import path from "path";

const EXCLUDES = [
    '$global',
    'window',
    'global',
    'exports',
    'module',
    'define',
    'my',
    'wx',
    'App',
    'Page',
    'require',
    'setTimeout',
    'clearTimeout',
    'console',
    'setInterval',
    'clearInterval'
];

const VAR_ALIAS: { [key: string]: string | undefined } = {
    window: '$global',
    global: '$global',
    wx: 'my'
};

/**
 * 处理全局变量
 * @param dir - 目标文件夹
 * @param globalObj - 全局变量 Object 名
 * @param globalAlias - 被视为全局 Object 的变量名（例如 window、object）
 * @param ignores - 忽略的项目
 */
export async function processGlobalVar(dir: string | string[], logger?: typeof console) {
    // 读取文件列表
    const filepaths = Array.isArray(dir) ? dir : await glob.sync(path.join(dir, '**/*.js'));

    // 逐个通过 ESLint 解决全局变量问题
    for (let filepath of filepaths) {
        // 查找问题
        let content = await fs.readFile(filepath, 'utf-8');
        const { output, messages, fixed } = linter.verifyAndFix(content, {
            env: {
                es2021: true
            },
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: 'module'
            },
            rules: {
                'no-global-var': ['error']
            }
        });
        content = output;

        // 提取出全局变量名
        let globalVarNames: { [varName: string]: 1 } = {};
        for (let msg of messages) {
            // logger?.log(msg);
            let varName = msg.message.match(/^'(.+)' is not defined./)?.[1];
            if (varName) {
                globalVarNames[varName] = 1;
            }
            // else {
            //     console.warn(chalk.yellow(filepath), msg);
            // }
        }
        logger?.log('globalVarNames', Object.keys(globalVarNames).join(), filepath);

        // 创建前置 polyfill 语句
        let polyfills: string[] = [];
        for (let varName in VAR_ALIAS) {
            if (globalVarNames[varName]) {
                polyfills.push(`var ${varName} = ${VAR_ALIAS[varName]};`);
            }
        }

        // 存在 polyfill 语句，写入之
        if (polyfills.length) {
            // 如果源码第一行是 "use strict" 则从第二行开始写入
            if (content.startsWith('"use strict";\n')) {
                content = content.replace(/^"use strict";\n/, `"use strict";\n${polyfills.join('\n')}\n\n`);
            }
            else {
                content = `${polyfills.join('\n')}\n\n${content}`;
            }
        }

        await fs.writeFile(filepath, content, 'utf-8');
    }
}


/**
 * Checks if the given node is the argument of a typeof operator.
 * @param {ASTNode} node The AST node being checked.
 * @returns {boolean} Whether or not the node is the argument of a typeof operator.
 */
function hasTypeOfOperator(node: any) {
    const parent = node.parent;

    return parent.type === "UnaryExpression" && parent.operator === "typeof";
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ruleNoGlobalVar: Rule.RuleModule = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow the use of undeclared variables unless mentioned in `/*global */` comments",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-undef"
        },

        schema: [
            {
                type: "object",
                properties: {
                    typeof: {
                        type: "boolean",
                        default: false
                    }
                },
                additionalProperties: false
            }
        ],
        messages: {
            undef: "'{{name}}' is not defined."
        },
        fixable: 'code'
    },

    create(context) {
        const options = context.options[0];
        const considerTypeOf = options && options.typeof === true || false;

        return {
            "Program:exit"(/* node */) {
                const globalScope = context.getScope();

                globalScope.through.forEach(ref => {
                    const identifier = ref.identifier;

                    if (!considerTypeOf && hasTypeOfOperator(identifier)) {
                        return;
                    }

                    context.report({
                        node: identifier,
                        messageId: "undef",
                        data: { name: identifier.name },
                        fix: function (fixer) {
                            if (identifier.range && EXCLUDES.indexOf(identifier.name) === -1) {
                                return fixer.replaceTextRange(identifier.range, `$global.${identifier.name}`);
                            }
                            return null;
                        }
                    });
                });
            }
        };
    }
} as const;

const linter = new Linter();
linter.defineRule('no-global-var', ruleNoGlobalVar);
