import JsOCR from '../src/jsocr';

import './style.scss';

const loading = document.querySelector('#loading');
const content = document.querySelector('.content');
const img = content.querySelector('img');
const textArea = content.querySelector('textarea');
const close = content.querySelector('.close');
close.addEventListener('click', e => {
    content.classList.remove('show');
});

const input: HTMLInputElement = document.querySelector('.inputField');
input.addEventListener('change', e => {
    const ocr = new JsOCR(e as any);
    loading.classList.add('show');
    ocr.on('data', (data) => {
        img.src = ocr.img.src;
        textArea.value = data.map(val => val.words).join('\n');
        content.classList.add('show');
        loading.classList.remove('show');
    });
});

// document.addEventListener('click', (e) => {
//     if (content.classList.contains('show')) {
//         return;
//     }
//     input.click();
// });