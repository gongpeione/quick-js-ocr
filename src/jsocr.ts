interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

const url = {
    ocr: 'http://api.geeku.net/ocr'
}
const paraments = {
    image: '',
    url: '',
    language_type: 'CHN_ENG',
    detect_direction: true,
    detect_language: true,
    probability: true
}
const bytesLimit = 4 * 1024 * 1024;

export default class JsOCR {
    _file: File = null
    _url: string = ''
    get file (): File {
        return this._file;
    }
    set file (newVal) {
        if (newVal.size >= bytesLimit) {
            throw new Error('Image is oversize.');
        }
        this._file = newVal;
        this.run();
    }
    get url (): string {
        return this._url;
    }
    set url (newVal) {
        if (!/https?:\/\/.*?/.test(newVal)) {
            throw new Error('Url format illegal.');
        }
        this._url = newVal;
        this.run('url');
    }
    imgReader = new FileReader()
    img = new Image()
    config = null
    token = ''
    eventListeners = {}
    constructor (contentType: HTMLInputElement | HTMLInputEvent | File | string) {

        if (!((this as any) instanceof JsOCR)) {
            throw new Error('this is not a JsOCR instance.');
        }

        this.config = Object.assign(paraments);
        // you can generate your own token: https://cloud.baidu.com/product/ocr.html
        const tokenFromLocal = localStorage.getItem('token');
        this.token = tokenFromLocal ? 
                        tokenFromLocal : 
                        '24.2f0d9a3b6a60817dfd94ae61ea6f7e99.2592000.1515124116.282335-10488404';
        const type = Object.prototype.toString.call(contentType).match(/\[\w+\s(\w+)\]/)[1].toLowerCase();
        
        switch (type) {
            case 'file': this.file = contentType as File; break;
            case 'event': this.file = (contentType as HTMLInputEvent).target.files[0] as File; break;
            case 'htmlinputelement': this.addChangeEvent(contentType as HTMLInputElement); break;
            case 'string': this.url = contentType as string;
            default: throw Error('Parament type is illegal.');
        }
    }

    async run (type: string = 'img') {
        let base64 = null;
        if (type === 'img') {
            base64 = await this.img2Base64(this._file);
            this.config.image = base64.replace(/data:image\/\w+;base64,/, '');
            this.config.url = undefined;
        } else if (type === 'url') {

        }
        console.log(this.config);
        const body = Object.keys(this.config)
                        .filter(key => this.config[key])
                        .map(key => `${key}=${encodeURIComponent(this.config[key])}`).join('&');
        // console.log(body);
        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        fetch(url.ocr + `?access_token=${this.token}`, { method: 'POST', headers, body })
            .then(res => res.json())
            .then(data => {
                if (data.error_code) {
                    throw new Error(`ERROR: ${data.error_code}: ${data.error_msg}`)
                } else {
                    console.log(data.words_result);
                    this.eventListeners['data'].forEach(cb => cb.call(null, data.words_result));
                }
            });
    }

    on (eventName: string, cb: Function) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName].push(cb);
        } else {
            this.eventListeners[eventName] = [cb]
        }
    }

    private addChangeEvent (el: HTMLInputElement) {
        el.addEventListener('change', (e: HTMLInputEvent) => {
            this.file = e.target.files[0];
        });
    }

    img2Base64 (img) {
        this.img.crossOrigin = 'anonymous';
        return new Promise((r, j) => {
            this.imgReader.onload = e => {
                this.img.src = (e.target as any).result;
                document.querySelector('body').appendChild(this.img);
                r((e.target as any).result);
            }
            this.imgReader.readAsDataURL(img);
        });
    }
}