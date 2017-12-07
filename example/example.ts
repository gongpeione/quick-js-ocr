import JsOCR from '../src/jsocr';
import { toType, urlRegex } from '../src/jsocr';
import Vue from 'vue';

import './style.scss';

const vm = new Vue({
    el: 'main',
    data: {
        showContent: false,
        showLoading: false,
        showAlert: false,
        alertMsg: '',
        token: localStorage.getItem('token')
    },
    methods: {
        clickClose (e) {
            this.showContent = false;
        },
        upload (file: File | string) {
            let ocr = null;
            try {
                ocr = new JsOCR(file);
            } catch (e) {
                alert(e);
                return;
            }
            loading.classList.add('show');
            ocr.on('data', (data) => {
                img.src = typeof file === 'string' ? file : ocr.img.src;
                textArea.value = data.map(val => val.words).join('\n');
                content.classList.add('show');
                loading.classList.remove('show');
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
        }
    },
    computed: {
    },
    created () {
        document.addEventListener('paste', (e: ClipboardEvent) => {
            const url = e.clipboardData.getData('text');
            if (toType(e.clipboardData.files[0]) === 'file') {
                upload(e.clipboardData.files[0]);
            } else if (urlRegex.test(url)) {
                console.log(url);
                upload(url);
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
            upload(e.dataTransfer.files[0]);
            body.classList.remove('dragover');
        });
    }
});

const body = document.querySelector('body');
const setting = document.querySelector('.setting');
const tokenEl: HTMLInputElement = document.querySelector('.token');
const tokenBtn = document.querySelector('.token + button');
const loading = document.querySelector('#loading');
const content = document.querySelector('.content');
const img = content.querySelector('img');
const textArea = content.querySelector('textarea');
const close = content.querySelector('.close');
// close.addEventListener('click', e => {
//     e.stopPropagation();
//     content.classList.remove('show');
// });
// tokenBtn.addEventListener('click', e => {
//     const tokenVal = tokenEl.value;
//     if (!tokenEl) {
//         alert('Token cannot be empty.');
//         return;
//     }
//     localStorage.setItem('token', tokenVal);
//     alert('Token saved.');
// });

// const token = localStorage.getItem('token');
// if (token) {
//     tokenEl.value = token;
// }

const input: HTMLInputElement = document.querySelector('.inputField');
input.addEventListener('change', e => {
    upload((e.target as any).files[0]);
    input.value = '';
});


function upload (file: File | string) {
    let ocr = null;
    try {
        ocr = new JsOCR(file);
    } catch (e) {
        alert(e);
        return;
    }
    loading.classList.add('show');
    ocr.on('data', (data) => {
        img.src = typeof file === 'string' ? file : ocr.img.src;
        textArea.value = data.map(val => val.words).join('\n');
        content.classList.add('show');
        loading.classList.remove('show');
    });
}