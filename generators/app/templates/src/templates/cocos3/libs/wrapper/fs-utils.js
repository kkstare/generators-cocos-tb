var window = $global;

/****************************************************************************
 Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var fs = my.getFileSystemManager ? my.getFileSystemManager() : null;
var outOfStorageRegExp = /the maximum size of the file storage/;  // not exactly right

// base64 character set, plus padding character (=)
var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
// Regular expression to check formal correctness of base64 encoded strings
b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;

var fsUtils = {

    fs,

    isOutOfStorage(errMsg) {
        return outOfStorageRegExp.test(errMsg);
    },

    getUserDataPath() {
        return my.env.USER_DATA_PATH;
    },

    checkFsValid() {
        if (!fs) {
            console.warn('Can not get the file system!');
            return false;
        }
        return true;
    },

    deleteFile(filePath, onComplete) {
        fs.unlink({
            filePath: filePath,
            success: function () {
                onComplete && onComplete(null);
            },
            fail: function (res) {
                console.warn(`Delete file failed: path: ${filePath} message: ${res.errorMessage}`);
                onComplete && onComplete(new Error(res.errorMessage));
            }
        });
    },

    downloadFile(remoteUrl, filePath, header, onProgress, onComplete) {
        var options = {
            url: remoteUrl,
            success: function (res) {
                if (!filePath) {
                    onComplete && onComplete(null, res.apFilePath);
                }
                else {
                    fsUtils.copyFile(res.apFilePath, filePath, function (err) {
                        if (err) {
                            onComplete && onComplete(err);
                        } else {
                            onComplete && onComplete(null, filePath);
                        }
                    });
                }
            },
            fail: function (res) {
                console.warn(`Download file failed: path: ${remoteUrl} message: ${res.errorMessage}`);
                onComplete && onComplete(new Error(res.errorMessage), null);
            }
        }
        if (header) options.header = header;
        var task = my.downloadFile(options);
        onProgress && task.onProgressUpdate(onProgress);
    },

    saveFile(srcPath, destPath, onComplete) {
        // Hack, seems like my.saveFile dose not work
        fsUtils.copyFile(srcPath, destPath, onComplete);
    },

    copyFile(srcPath, destPath, onComplete) {
        fs.copyFile({
            srcPath: srcPath,
            destPath: destPath,
            success: function () {
                onComplete && onComplete(null);
            },
            fail: function (res) {
                console.warn(`Copy file failed: path: ${srcPath} message: ${res.errorMessage}`);
                onComplete && onComplete(new Error(res.errorMessage));
            }
        });
    },

    writeFile(path, data, encoding, onComplete) {
        fs.writeFile({
            filePath: path,
            encoding: encoding,
            data: data,
            success: function () {
                onComplete && onComplete(null);
            },
            fail: function (res) {
                console.warn(`Write file failed: path: ${path} message: ${res.errorMessage}`);
                onComplete && onComplete(new Error(res.errorMessage));
            }
        });
    },

    writeFileSync(path, data, encoding) {
        try {
            fs.writeFileSync({
                filePath: path,
                data: data,
                encoding: encoding,
            });
            return null;
        }
        catch (e) {
            console.warn(`Write file failed: path: ${path} message: ${e.message}`);
            return new Error(e.message);
        }
    },

    readFile(filePath, encoding, onComplete) {
        fs.readFile({
            filePath: filePath,
            encoding: encoding,
            success: function (res) {
                onComplete && onComplete(null, res.data);
            },
            fail: function (res) {
                console.warn(`Read file failed: path: ${filePath} message: ${res.errorMessage}`);
                onComplete && onComplete(new Error(res.errorMessage), null);
            }
        });
    },

    readDir(filePath, onComplete) {
        fs.readdir({
            dirPath: filePath,
            success: function (res) {
                onComplete && onComplete(null, res.files);
            },
            fail: function (res) {
                console.warn(`Read directory failed: path: ${filePath} message: ${res.errorMessage}`);
                onComplete && onComplete(new Error(res.errorMessage), null);
            }
        });
    },

    readText(filePath, onComplete) {
        fsUtils.readFile(filePath, 'utf8', onComplete);
    },

    readArrayBuffer(filePath, onComplete) {
        fsUtils.readFile(filePath, "base64", (err, data) => {
            onComplete(err, fsUtils.base64ToArrayBuffer(data));
        });
    },

    decode(str) {
        var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var res = '';
        var string = String(str).replace(/[=]+$/, '');
        var o,
            r,
            i = 0,
            currentIndex = 0;
        while (r = string.charAt(currentIndex)) {
            currentIndex = currentIndex + 1;
            r = encodings.indexOf(r);
            if (~r) {
                o = i % 4 ? 64 * o + r : r;
                if (i++ % 4) {
                    res += String.fromCharCode(255 & o >> (-2 * i & 6));
                }
            }
        }

        return res;
    },

    atob (string) {
        // atob can work with strings with whitespaces, even inside the encoded part,
        // but only \t, \n, \f, \r and ' ', which can be stripped.
        string = String(string).replace(/[\t\n\f\r ]+/g, "");
        try{
        if (!b64re.test(string)){
        throw new TypeError("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
        }
    
        }catch(e){
        console.warn(e);
        }
    
        // Adding the padding if missing, for semplicity
        string += "==".slice(2 - (string.length & 3));
        var bitmap, result = "",
        r1, r2, i = 0;
        for (; i < string.length;) {
        bitmap = b64.indexOf(string.charAt(i++)) << 18 | b64.indexOf(string.charAt(i++)) << 12 |
            (r1 = b64.indexOf(string.charAt(i++))) << 6 | (r2 = b64.indexOf(string.charAt(i++)));
    
        result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) :
            r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) :
            String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
        }
        return result;
    },

    base64ToArrayBuffer(base64) {
        // var binaryString = fsUtils.atob(base64);
        var string = fsUtils.atob(base64);
        var length = string.length;
        var uintArray = new Uint8Array(length);
        for (var i = 0; i < length; i++) {
            uintArray[i] = string.charCodeAt(i);
        }
        return uintArray.buffer;
    },

    readJson(filePath, onComplete) {
        fsUtils.readFile(filePath, 'utf8', function (err, text) {
            var out = null;
            if (!err) {
                try {
                    out = JSON.parse(text);
                }
                catch (e) {
                    console.warn(`Read json failed: path: ${filePath} message: ${e.message}`);
                    err = new Error(e.message);
                }
            }
            onComplete && onComplete(err, out);
        });
    },

    readJsonSync(path) {
        try {
            var res = fs.readFileSync({
                filePath: path,
                encoding: 'utf8',
            });
            return JSON.parse(res.data);
        }
        catch (e) {
            console.warn(`Read json failed: path: ${path} message: ${e.message}`);
            return new Error(e.message);
        }
    },

    makeDirSync(path, recursive) {
        try {
            fs.mkdirSync({
                dirPath: path,
                recursive: recursive,
            });
            return null;
        }
        catch (e) {
            console.warn(`Make directory failed: path: ${path} message: ${e.message}`);
            return new Error(e.message);
        }
    },

    rmdirSync(dirPath, recursive) {
        try {
            fs.rmdirSync({ dirPath, recursive });
        }
        catch (e) {
            console.warn(`rm directory failed: path: ${dirPath} message: ${e.message}`);
            return new Error(e.message);
        }
    },

    exists(filePath, onComplete) {
        //   fs.getFileInfo({ filePath: './' + filePath,
        //     success: (res) => {
        //       console.log(res);
        //     },
        //     fail (res) {
        //       console.warn(`getFileInfo failed: path: ${filePath} message: ${res.errorMessage}`);
        //   },
        // });
        // fs.exists(filePath, function (exists) {
        //     console.info("file exists", exists);
        //     onComplete && onComplete(exists ? true : false);
        // });
        // onComplete && onComplete(true);
        fs.readFile({
            filePath: filePath,
            encoding: '',
            success(res) {
                onComplete && onComplete(true);
            },
            fail() {
                onComplete && onComplete(false);
            }
        });
    },

    loadSubpackage(name, onProgress, onComplete) {
        throw new Error('Not Implemented');
    },

    unzip(zipFilePath, targetPath, onComplete) {
        fs.unzip({
            zipFilePath,
            targetPath,
            success() {
                onComplete && onComplete(null);
            },
            fail(res) {
                console.warn(`unzip failed: path: ${zipFilePath} message: ${res.errorMessage}`);
                onComplete && onComplete(new Error('unzip failed: ' + res.errorMessage));
            },
        })
    },
};

window.fsUtils = module.exports = fsUtils;
