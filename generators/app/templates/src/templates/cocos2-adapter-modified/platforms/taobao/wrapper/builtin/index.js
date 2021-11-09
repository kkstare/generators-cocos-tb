import _document from './document';
import * as _window from './window';

function inject() {
  // 暴露全局的 canvas
  _window.canvas = $global.screencanvas;
  _window.document = _document;

  _window.addEventListener = (type, listener) => {
    _window.document.addEventListener(type, listener)
  }
  _window.removeEventListener = (type, listener) => {
    _window.document.removeEventListener(type, listener)
  }
  _window.dispatchEvent = _window.document.dispatchEvent;

  // const { platform } = my.getSystemInfoSync()

  Object.assign($global, _window);
}

if (!global.__isAdapterInjected) {
  global.__isAdapterInjected = true
  inject()
}
