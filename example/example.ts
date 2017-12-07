import JsOCR from '../src/jsocr';
import { toType, urlRegex } from '../src/jsocr';
import Vue from 'vue';

import './style.scss';

declare function Clipboard (string): void;

function loadScript (url, cb?) {
    const head = document.querySelector('head');
    const script = document.createElement('script');
    script.src = url;
    if (cb) {
        script.onload = cb;
    }
    head.appendChild(script);
}
const scripts = {
    'copy': 'https://cdn.bootcss.com/clipboard.js/1.7.1/clipboard.min.js'
}
const body = document.body;

const vm = new Vue({
    el: 'main',
    data: {
        showContent: false,
        showLoading: false,
        showAlert: false,
        alertMsg: '',
        token: localStorage.getItem('token'),
        imgSrc: null,
        content: '',
        flags: {
            enableCopy: true
        }
    },
    methods: {
        clickClose (e) {
            console.log(e);
            this.showContent = false;
        },
        clickUpload () {
            this.upload(this.$refs.inputField.files[0]);
            this.$refs.inputField.value = '';
        },
        upload (file: File | string) {
            let ocr = null;
            try {
                ocr = new JsOCR(file);
            } catch (e) {
                alert(e);
                return;
            }
            this.showLoading = true;
            ocr.on('data', (data) => {
                this.imgSrc = typeof file === 'string' ? file : ocr.img.src;
                this.content = data.map(val => val.words).join('\n');
                this.showContent = true;
                this.showLoading = false;
            });
        },
        saveToken () {
            if (localStorage.getItem('token') === this.token) {
                this.alert('Nothing change.');
                return;
            }
            localStorage.setItem('token', this.token);
            this.alert('Token saved.');
        },
        alert (msg) {
            this.showAlert = true;
            this.alertMsg = msg;
            window.setTimeout(() => {
                this.showAlert = false
            }, 3000);
        },
        scriptCB (shortcut) {
            switch (shortcut) {
                case 'copy': {
                    Vue.nextTick(() => {
                        const cp = new Clipboard('.copy');
                        cp.on('success', e => {
                            this.alert('Copy Successful.');    
                            e.clearSelection();
                        });
                        cp.on('error',  e => {
                            this.alert('Copy Failed, please copy by ctrl/command+c/v.');
                        });
                    });
                } break;
            }
        }
    },
    computed: {
    },
    created () {
        Object.keys(this.flags).forEach(flag => {
            const shortcut = flag.replace('enable', '').toLowerCase();
            if (this.flags[flag]) {
                loadScript(scripts[shortcut], () => {
                    this.scriptCB(shortcut);
                });
            }
        });
        document.addEventListener('paste', (e: ClipboardEvent) => {
            const url = e.clipboardData.getData('text');
            if (toType(e.clipboardData.files[0]) === 'file') {
                this.upload(e.clipboardData.files[0]);
            } else if (urlRegex.test(url)) {
                console.log(url);
                this.upload(url);
            }
        });
        document.addEventListener("dragover", e => {
            e.preventDefault();
            body.classList.add('dragover');
        });
        document.addEventListener("dragleave", e => {
            e.preventDefault();
            body.classList.remove('dragover');
        });
        document.addEventListener('drop', e => {
            e.preventDefault();
            this.upload(e.dataTransfer.files[0]);
            body.classList.remove('dragover');
        });
    }
});
