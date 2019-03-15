(function () {
  // utils begin ======================================
  var _ = {
    trim: function (str) {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
      return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    }
  };
  var ArrayProto = Array.prototype;
  var nativeForEach = ArrayProto.forEach;
  var slice = ArrayProto.slice;
  var nativeIsArray = Array.isArray;
  var breaker = {};

  // 唯一标识 uuid
  _.uuid = function () {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // 绑定事件
  _.on = function (target, type, handler) {
    if (target.addEventListener) {
      target.addEventListener(type, handler, false);
    } else {
      target.attachEvent('on' + type,
        function (event) {
          return handler.call(target, event);
        }, false);
    }
  };
  _.isObject = function (obj) {
    return (obj === Object(obj) && !_.isArray(obj));
  };
  _.isArray = nativeIsArray || function (obj) {
    return toString.call(obj) === '[object Array]';
  };
  _.isFunction = function (f) {
    try {
      return /^\s*\bfunction\b/.test(f);
    } catch (x) {
      return false;
    }
  };
  /**
   * @param {*=} obj
   * @param {function(...[*])=} iterator
   * @param {Object=} context
   */
  _.each = function (obj, iterator, context) {
    if (obj === null || obj === undefined) {
      return;
    }
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
          return;
        }
      }
    } else {
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) {
            return;
          }
        }
      }
    }
  };
  _.extend = function (obj) {
    _.each(slice.call(arguments, 1), function (source) {
      for (var prop in source) {
        if (source[prop] !== void 0) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // YhtSdk begin ======================================

  var YhtSdk = function () {};

  YhtSdk.prototype.init = function (config) {
    this['config'] = {};
    this['parmas'] = {};
    var _that = this;
    window.sessionStorage.setItem('page_guid', _.uuid());
    _that.set_config(_.extend({}, DEFAULT_CONFIG, config));

    // 设置单页面 history 的 pushState replaceState 控制
    (function (history) {
      var replaceState = history.replaceState;
      if (replaceState) {
        history.replaceState = function (state, param) {
          var url = arguments[2];
          if (typeof _that.onPushStateHandler === 'function') {
            _that.onPushStateHandler({
              state: state,
              param: param,
              url: url
            });
          }
          return replaceState.apply(history, arguments);
        };
      }
    })(window.history);

    (function (history) {
      var pushState = history.pushState;
      if (pushState) {
        history.pushState = function (state, param) {
          var url = arguments[2];
          if (typeof _that.onPushStateHandler === 'function') {
            _that.onPushStateHandler({
              state: state,
              param: param,
              url: url
            });
          }
          return pushState.apply(history, arguments);
        };
      }
    })(window.history);

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      _that.onload();
    } else {
      _.on(document, 'DOMContentLoaded', _that.onload);
    }
  };

  YhtSdk.prototype.pageInfo = function () {
    if (document) {
      this['parmas'].page_info = {
        sourceUrl: this['config'].originUrl || document.referrer || '',
        currentUrl: this['config'].currentUrl || document.URL || '',
        title: document.title || ''
      };
    }
    return this;
  };
  // 加载完成，记录加载完成信息
  YhtSdk.prototype.onload = function () {
    var _that = yht_master;
    _that.pageInfo();
    _that['parmas'].Event = 'loaded';
    _that['parmas'].currentTime = new Date().getTime();
    _that['config'].originUrl = document.URL; // 标记当前url
    _that.saveParmas(_that['parmas']);
    _that.submit();
    // _that.send(_that['parmas']);
    _that.event();
  };

  // 每次执行操作（加载或者打开新的页面就存在数据到本地缓存）
  YhtSdk.prototype.saveParmas = function (parmas) {
    parmas.page_guid = window.sessionStorage.getItem('page_guid');
    var tinyuba = JSON.parse(window.localStorage.getItem('tinyuba')) || {};
    tinyuba.user_info = JSON.parse(window.localStorage.getItem('userInfo')) || {};
    tinyuba.user_info.tokenId = JSON.parse(window.localStorage.getItem('header')).tokenId || ''; // 页面token_id
    if (!_.isArray(tinyuba.list)) {
      tinyuba.list = [];
    }
    tinyuba.list.push(parmas);
    window.localStorage.setItem('tinyuba', JSON.stringify(tinyuba));
  };

  // 用于添加条件来判断是否有上传需求
  YhtSdk.prototype.submit = function () {
    var _that = this;
    var tinyuba = JSON.parse(window.localStorage.getItem('tinyuba')) || {};
    if (tinyuba && tinyuba.list.length > this['config'].track_num) { // 因为每次跳转url，会生成两组数据（离开上一个页面，初始化下一个页面），再加上第一次加载的一条，所以选择偶数上传会更好。
      if (!_that['config'].isSend) {
        _that.send(tinyuba);
      }
    }
  };

  // 请求，发送数据
  YhtSdk.prototype.send = function (tinyuba) {
    var _that = this;
    _that['config'].isSend = true;
    var xhr = null;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.onreadystatechange = function () { // 服务器返回值的处理函数，此处使用匿名函数进行实现
      if (xhr.readyState === 4) {
        _that['config'].isSend = false;
        window.localStorage.setItem('tinyuba', JSON.stringify({}));
      }
    };
    xhr.open('POST', _that['config'].api_host);
    xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.setRequestHeader('YHT-Source-Url', encodeURI(_that['parmas'].sourceUrl));
    // xhr.setRequestHeader('YHT-Current-Url', encodeURI(_that['parmas'].currentUrl));
    xhr.withCredentials = false;
    xhr.send(JSON.stringify(tinyuba));
  };

  // onpushstate 事件回调
  YhtSdk.prototype.onPushStateHandler = function (_state) {
    var _that = this;
    if (_that['parmas'] && _that['parmas'].currentTime && (new Date().getTime() - _that['parmas'].currentTime) > 100) {
      _that['parmas'].Event = 'unload';
      _that['parmas'].currentTime = new Date().getTime();
      _that.saveParmas(_that['parmas']);
      _that.submit();

      // 离开上一个页面，进入下一个页面
      setTimeout(function () {
        _that['parmas'].Event = 'loaded';
        window.sessionStorage.setItem('page_guid', _.uuid());
        _that.pageInfo();
        _that['config'].originUrl = document.URL; // 标记当前url
        _that.saveParmas(_that['parmas']);
        _that.submit();
      }, 1000);
    }
  };

  // 浏览器前进后退事件处理函数
  YhtSdk.prototype.onPopStateHandler = function () {
    var _that = yht_master;
    if (_that['parmas'] && _that['parmas'].currentTime && (new Date().getTime() - _that['parmas'].currentTime) > 100) {
      if (typeof Promise === 'function') {
        var runAsync = function () {
          var p = new Promise(function (resolve, reject) {
            _that['parmas'].Event = 'unload';
            _that['parmas'].currentTime = new Date().getTime();
            _that.saveParmas(_that['parmas']);
            _that.submit();
            resolve();
          });
          return p;
        };
        runAsync().then(function () {
          _that['parmas'].Event = 'loaded';
          window.sessionStorage.setItem('page_guid', _.uuid());
          _that.pageInfo();
          _that['config'].originUrl = document.URL; // 标记当前url
          _that.saveParmas(_that['parmas']);
          _that.submit();
        });
      }
    }
  };

  // 系统级事件初始化
  YhtSdk.prototype.event = function () {
    // var clickEvent = ['click'];
    // for (var j = 0; j < clickEvent.length; j++) {
    //   _.on(document.body, clickEvent[j], this.clickHandler);
    // }

    // 当页面应用，路由切换触发事件
    _.on(window, 'popstate', this.onPopStateHandler);
  };

  YhtSdk.prototype.set_config = function (config) {
    if (_.isObject(config)) {
      _.extend(this['config'], config);
    }
  };
  /**
   * 默认配置
   */
  var DEFAULT_CONFIG = {
    'api_host': 'https://www.easy-mock.com/mock/5ad85d1fc0574640cf73e948/sunline-admin/api/track'
  };
  var yht_master = new YhtSdk();
  yht_master.init({
    api_host: '/demo_common/tiny_uba_servlet.tml',
    track_num: 10
  });
  window.YhtSdk = yht_master;
}(window));
