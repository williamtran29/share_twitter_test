const TWITTER_SHARE_URL = 'https://twitter.com/intent/tweet'
const ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="#ffffff" class="sharect__icon"><path d="M8.2,20.2c6.5,0,11.7-5.2,11.8-11.6c0-0.1,0-0.1,0-0.2c0-0.2,0-0.4,0-0.5c0.8-0.6,1.5-1.3,2.1-2.2c-0.8,0.3-1.6,0.6-2.4,0.7c0.9-0.5,1.5-1.3,1.8-2.3c-0.8,0.5-1.7,0.8-2.6,1c-1.6-1.7-4.2-1.7-5.9-0.1c-1.1,1-1.5,2.5-1.2,3.9C8.5,8.7,5.4,7.1,3.3,4.6c-1.1,1.9-0.6,4.3,1.3,5.5c-0.7,0-1.3-0.2-1.9-0.5l0,0c0,2,1.4,3.7,3.3,4.1c-0.6,0.2-1.2,0.2-1.9,0.1c0.5,1.7,2.1,2.8,3.9,2.9c-1.7,1.4-3.9,2-6.1,1.7C3.8,19.5,6,20.2,8.2,20.2"/></svg>'
const ICON_SIZE = 26
const ARROW_SIZE = 9
const BUTTON_PADDING = 6
const TOP_OFFSET = 20
const CHAR_LIMIT = 120

class ShareTwitter {
  constructor() {
    this._top = 0;
    this._left = 0;
    this._selection = '';
    this._text = '';
    this.init();
  }

  init() {
    const _this = this;
    window.addEventListener('mouseup', function () {
      setTimeout(function mouseTimeout() {
        if (_this.hasTooltip()) {
          if (_this.selectionExists()) {
            _this._selection = window.getSelection();
            _this._text = _this._selection.toString();
            _this.moveTooltip();
            return;
          } else {
            document.querySelector('.share-twitter').remove();
          }
        }
        if (_this.selectionExists()) {
          _this._selection = window.getSelection();
          _this._text = _this._selection.toString();
          _this.drawTooltip();
        }
      }, 10);
    }, false);
  }

  getText(text) {
    let chunk = text.trim();
    if (chunk.length > CHAR_LIMIT - 2) {
      chunk = chunk.slice(0, CHAR_LIMIT - 3).trim() + "\u2026";
    }
    return "\u201C" + chunk + "\u201D";
  }

  parseText(text) {
    return text ? '&text=' + encodeURIComponent(this.getText(text)) : '';
  }

  getShareUrl(refUrl, text) {
    return TWITTER_SHARE_URL + '?url=' + encodeURIComponent(refUrl) + this.parseText(text);
  }

  selectionExists() {
    const selection = window.getSelection();
    return selection && selection.rangeCount > 0 && selection.getRangeAt(0) && !selection.getRangeAt(0).collapsed && selection.getRangeAt(0).getBoundingClientRect().width > 0 && selection.getRangeAt(0).getBoundingClientRect().height > 0;
  }

  hasTooltip() {
      return !!document.querySelector('.share-twitter');
  }

  moveTooltip() {
      this.setTooltipPosition();
      let tooltip = document.querySelector('.share-twitter');
      tooltip.style.top = this._top + 'px';
      tooltip.style.left = this._left + 'px';
  }

  setTooltipPosition() {
      const position = this._selection.getRangeAt(0).getBoundingClientRect();
      const DOCUMENT_SCROLL_TOP = window.pageXOffset || document.documentElement.scrollTop || document.body.scrollTop;
      this._top = position.top + DOCUMENT_SCROLL_TOP - ICON_SIZE - TOP_OFFSET;
      this._left = position.left + (position.width - ICON_SIZE) / 2;
  }

  drawTooltip() {
      this.setTooltipPosition();
      let div = document.createElement('div');
      div.className = 'share-twitter';
      div.style =  `line-height:0;
                    position:absolute;
                    background-color: #262626;
                    border-radius:6px;
                    top: ${this._top}px;
                    left: ${this._left}px;
                    transition:all .2s ease-in-out;`
      div.appendChild(this.tweetButton());
      document.body.appendChild(div);
  }

  popupCenter(url, title, w, h) {
      const dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
      const dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
      const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
      const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

      const left = width / 2 - w / 2 + dualScreenLeft;
      const top = height / 2 - h / 2 + dualScreenTop;

      const newWindow = window.open(url, title, `scrollbars=yes, width=${w},height=${h}, top=${top}, left=${left}`);
      // Puts focus on the newWindow
      if (window.focus && newWindow) {
        newWindow.focus();
      }
  }

  tweetButton() {
      const _this = this;
      let btn = document.createElement('div');
      btn.onclick = function () {
        _this.popupCenter(_this.getShareUrl(window.location.href, _this._text), 'Share Twitter', 600, 300);
        return false;
      };
      btn.style = `display:inline-block;
                   padding:${BUTTON_PADDING}px;
                   cursor:pointer;
                   transition:all .1s ease-in-out;`
      btn.innerHTML = ICON_SVG;
      let arrow = document.createElement('div');
      arrow.style = `position:absolute;
                     border-left: ${ARROW_SIZE}px solid transparent;
                     border-right: ${ARROW_SIZE}px solid transparent;
                     border-top: ${ARROW_SIZE}px solid #262626;
                     bottom: -${(ARROW_SIZE - 1)}px;
                     left: ${(ICON_SIZE / 2 - ARROW_SIZE + BUTTON_PADDING)}px;
                     width:0;
                     height:0;`

      btn.appendChild(arrow);
      return btn;
  }
};

export default new ShareTwitter()
