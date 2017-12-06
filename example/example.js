(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */













function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var url = {
    ocr: 'https://api.geeku.net/ocr'
};
var paraments = {
    image: '',
    url: '',
    language_type: 'CHN_ENG',
    detect_direction: true,
    detect_language: true,
    probability: true
};
var bytesLimit = 4 * 1024 * 1024;
function toType(obj) {
    return Object.prototype.toString.call(obj).match(/\[\w+\s(\w+)\]/)[1].toLowerCase();
}
var urlRegex = /https?:\/\/.*?/;
var JsOCR = /** @class */ (function () {
    function JsOCR(content) {
        this._file = null;
        this._url = '';
        this.imgReader = new FileReader();
        this.img = new Image();
        this.config = null;
        this.token = '';
        this.eventListeners = {};
        if (!(this instanceof JsOCR)) {
            throw new Error('This is not a JsOCR instance.');
        }
        if (!/image\/(png)|(jpg)|(jpeg)|(bmp)/i.test(content.type)) {
            throw new Error("Image format(" + content.type + ") is not supported. Image format must be PNG, JPG or BMP.");
        }
        this.config = Object.assign(paraments);
        // Generate your own token: https://cloud.baidu.com/product/ocr.html
        var tokenFromLocal = localStorage.getItem('token');
        this.token = tokenFromLocal ?
            tokenFromLocal :
            '24.2f0d9a3b6a60817dfd94ae61ea6f7e99.2592000.1515124116.282335-10488404';
        var type = toType(content);
        switch (type) {
            case 'file':
                this.file = content;
                break;
            case 'event':
                this.file = content.target.files[0];
                break;
            case 'htmlinputelement':
                this.addChangeEvent(content);
                break;
            case 'string':
                this.url = content;
                break;
            default: throw Error('Parament type is illegal.');
        }
    }
    Object.defineProperty(JsOCR.prototype, "file", {
        get: function () {
            return this._file;
        },
        set: function (newVal) {
            if (newVal.size >= bytesLimit) {
                throw new Error('Image is oversize.');
            }
            console.dir(this.file);
            this._file = newVal;
            this.run();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsOCR.prototype, "url", {
        get: function () {
            return this._url;
        },
        set: function (newVal) {
            if (!urlRegex.test(newVal)) {
                throw new Error('Url format illegal.');
            }
            this._url = newVal;
            this.run('url');
        },
        enumerable: true,
        configurable: true
    });
    JsOCR.prototype.run = function (type) {
        if (type === void 0) { type = 'img'; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var base64, body, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        base64 = null;
                        if (!(type === 'img')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.img2Base64(this._file)];
                    case 1:
                        base64 = _a.sent();
                        this.config.image = base64.replace(/data:image\/\w+;base64,/, '');
                        this.config.url = undefined;
                        return [3 /*break*/, 3];
                    case 2:
                        if (type === 'url') {
                            this.config.image = undefined;
                            this.config.url = this.url;
                        }
                        _a.label = 3;
                    case 3:
                        console.log(this.config);
                        body = Object.keys(this.config)
                            .filter(function (key) { return _this.config[key]; })
                            .map(function (key) { return key + "=" + encodeURIComponent(_this.config[key]); }).join('&');
                        headers = new Headers();
                        headers.append('Content-Type', 'application/x-www-form-urlencoded');
                        fetch(url.ocr + ("?access_token=" + this.token), { method: 'POST', headers: headers, body: body })
                            .then(function (res) { return res.json(); })
                            .then(function (data) {
                            if (data.error_code) {
                                throw new Error("ERROR: " + data.error_code + ": " + data.error_msg);
                            }
                            else {
                                _this.eventListeners['data'] &&
                                    _this.eventListeners['data'].forEach(function (cb) { return cb.call(null, data.words_result); });
                                localStorage && localStorage.setItem('jsocrHistory', JSON.stringify({
                                    img: _this.config.url ? _this.config.url : _this.config.image,
                                    data: data
                                }));
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    JsOCR.prototype.on = function (eventName, cb) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName].push(cb);
        }
        else {
            this.eventListeners[eventName] = [cb];
        }
    };
    JsOCR.prototype.addChangeEvent = function (el) {
        var _this = this;
        el.addEventListener('change', function (e) {
            _this.file = e.target.files[0];
        });
    };
    JsOCR.prototype.img2Base64 = function (img) {
        var _this = this;
        this.img.crossOrigin = 'anonymous';
        return new Promise(function (r, j) {
            _this.imgReader.onload = function (e) {
                _this.img.src = e.target.result;
                document.querySelector('body').appendChild(_this.img);
                r(e.target.result);
            };
            _this.imgReader.readAsDataURL(img);
        });
    };
    return JsOCR;
}());

var body = document.querySelector('body');
var setting = document.querySelector('.setting');
var tokenEl = document.querySelector('.token');
var tokenBtn = document.querySelector('.token + button');
var loading = document.querySelector('#loading');
var content = document.querySelector('.content');
var img = content.querySelector('img');
var textArea = content.querySelector('textarea');
var close = content.querySelector('.close');
close.addEventListener('click', function (e) {
    e.stopPropagation();
    content.classList.remove('show');
});
setting.addEventListener('click', function (e) {
    e.stopPropagation();
});
tokenBtn.addEventListener('click', function (e) {
    var tokenVal = tokenEl.value;
    if (!tokenEl) {
        alert('Token cannot be empty.');
        return;
    }
    localStorage.setItem('token', tokenVal);
    alert('Token saved.');
});
var token = localStorage.getItem('token');
if (token) {
    tokenEl.value = token;
}
var input = document.querySelector('.inputField');
input.addEventListener('change', function (e) {
    upload(e.target.files[0]);
    input.value = '';
});
document.addEventListener('click', function (e) {
    if (content.classList.contains('show')) {
        return;
    }
    input.click();
});
document.addEventListener('paste', function (e) {
    var url = e.clipboardData.getData('text');
    if (toType(e.clipboardData.files[0]) === 'file') {
        upload(e.clipboardData.files[0]);
    }
    else if (urlRegex.test(url)) {
        console.log(url);
        upload(url);
    }
});
document.addEventListener("dragover", function (e) {
    // prevent default to allow drop
    e.preventDefault();
    body.classList.add('dragover');
});
document.addEventListener("dragleave", function (e) {
    e.preventDefault();
    body.classList.remove('dragover');
});
document.addEventListener('drop', function (e) {
    e.preventDefault();
    upload(e.dataTransfer.files[0]);
    body.classList.remove('dragover');
});
function upload(file) {
    var ocr = null;
    try {
        ocr = new JsOCR(file);
    }
    catch (e) {
        alert(e);
        return;
    }
    loading.classList.add('show');
    ocr.on('data', function (data) {
        img.src = typeof file === 'string' ? file : ocr.img.src;
        textArea.value = data.map(function (val) { return val.words; }).join('\n');
        content.classList.add('show');
        loading.classList.remove('show');
    });
}

})));
