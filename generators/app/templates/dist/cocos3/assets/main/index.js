var window = $global;

$global.System.register("chunks:///_virtual/configuration.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, _createClass, cclegacy, _decorator, sys, log;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      sys = module.sys;
      log = module.log;
    }],
    execute: function () {
      var _dec, _class, _class2, _temp;

      cclegacy._RF.push({}, "05c37maoztIcqYQxP8Afj1j", "configuration", undefined);

      var ccclass = _decorator.ccclass;
      var configuration = exports('configuration', (_dec = ccclass("configuration"), _dec(_class = (_temp = _class2 = /*#__PURE__*/function () {
        function configuration() {
          _defineProperty(this, "jsonData", null);

          _defineProperty(this, "path", null);

          _defineProperty(this, "KEY_CONFIG", 'CarConfig');

          _defineProperty(this, "markSave", false);

          _defineProperty(this, "saveTimer", -1);
        }

        var _proto = configuration.prototype;

        _proto.start = function start() {
          var _this = this;

          this.jsonData = {
            "userId": ""
          };
          this.path = this.getConfigPath();
          var content;

          if (sys.isNative) {
            var valueObject = $global.jsb.fileUtils.getValueMapFromFile(this.path);
            content = valueObject[this.KEY_CONFIG];
          } else {
            content = sys.localStorage.getItem(this.KEY_CONFIG);
          }

          if (content && content.length) {
            if (content.startsWith('@')) {
              content = content.substring(1);
            }

            try {
              //初始化操作
              var jsonData = JSON.parse(content);
              this.jsonData = jsonData;
            } catch (excepaiton) {}
          } //启动无限定时器，每1秒保存一次数据，而不是无限保存数据


          this.saveTimer = setInterval(function () {
            _this.scheduleSave();
          }, 500);
        };

        _proto.setConfigDataWithoutSave = function setConfigDataWithoutSave(key, value) {
          var account = this.jsonData.userId;

          if (this.jsonData[account]) {
            this.jsonData[account][key] = value;
          } else {
            console.error("no account can not save");
          }
        };

        _proto.setConfigData = function setConfigData(key, value) {
          this.setConfigDataWithoutSave(key, value); // this.save();

          this.markSave = true; //标记为需要存储，避免一直在写入，而是每隔一段时间进行写入
        };

        _proto.getConfigData = function getConfigData(key) {
          var account = this.jsonData.userId;

          if (this.jsonData[account]) {
            var value = this.jsonData[account][key];
            return value ? value : "";
          } else {
            log("no account can not load");
            return "";
          }
        };

        _proto.setGlobalData = function setGlobalData(key, value) {
          this.jsonData[key] = value;
          this.save();
        };

        _proto.getGlobalData = function getGlobalData(key) {
          return this.jsonData[key];
        };

        _proto.setUserId = function setUserId(userId) {
          this.jsonData.userId = userId;

          if (!this.jsonData[userId]) {
            this.jsonData[userId] = {};
          }

          this.save();
        };

        _proto.getUserId = function getUserId() {
          return this.jsonData.userId;
        };

        _proto.scheduleSave = function scheduleSave() {
          if (!this.markSave) {
            return;
          }

          this.save();
        }
        /**
         * 标记为已修改
         */
        ;

        _proto.markModified = function markModified() {
          this.markSave = true;
        };

        _proto.save = function save() {
          // 写入文件
          var str = JSON.stringify(this.jsonData);
          var zipStr = str;
          this.markSave = false;

          if (!sys.isNative) {
            var ls = sys.localStorage;
            ls.setItem(this.KEY_CONFIG, zipStr);
            return;
          }

          var valueObj = {};
          valueObj[this.KEY_CONFIG] = zipStr;
          $global.jsb.fileUtils.writeToFile(valueObj, this.path);
        };

        _proto.getConfigPath = function getConfigPath() {
          var platform = sys.platform;
          var path = "";

          if (platform === sys.OS_WINDOWS) {
            path = "src/conf";
          } else if (platform === sys.OS_LINUX) {
            path = "./conf";
          } else {
            if (sys.isNative) {
              path = $global.jsb.fileUtils.getWritablePath();
              path = path + "conf";
            } else {
              path = "src/conf";
            }
          }

          return path;
        };

        _proto.parseUrl = function parseUrl(paramStr) {
          if (!paramStr || typeof paramStr === 'string' && paramStr.length <= 0) {
            // 没有带参数，直接忽略
            return;
          }

          var dictParam = {};

          if (typeof paramStr === 'string') {
            paramStr = paramStr.split('?')[1]; // 去除掉 ？号

            var arrParam = paramStr.split("&");
            arrParam.forEach(function (paramValue) {
              var idxEqual = paramValue.indexOf("=");

              if (idxEqual !== -1) {
                var key = paramValue.substring(0, idxEqual);
                dictParam[key] = paramValue.substring(idxEqual + 1);
              }
            });
          } else {
            dictParam = paramStr;
          }

          if (dictParam.action) {
            this.setGlobalData('urlParams', dictParam);
          } // todo：记录来源，以后用到


          if (dictParam.source) {
            this.setGlobalData('source', dictParam.source);
          }

          if (dictParam.adchannelid) {
            this.setGlobalData('adchannelid', dictParam.adchannelid);
          }
        }
        /**
         * 生成随机账户
         * @returns
         */
        ;

        configuration.generateGuestAccount = function generateGuestAccount() {
          return "" + Date.now() + (0 | 10);
        };

        _createClass(configuration, null, [{
          key: "instance",
          get: function get() {
            if (this._instance) {
              return this._instance;
            }

            this._instance = new configuration();

            this._instance.start();

            return this._instance;
          }
        }]);

        return configuration;
      }(), _defineProperty(_class2, "_instance", void 0), _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/carManager.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './fightConstants.ts', './clientEvent.ts', './resourceUtil.ts', './constant.ts', './poolManager.ts', './car.ts', './follow.ts', './roadPoint.ts', './localConfig.ts', './playerData.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Vec3, macro, Component, fightConstants, clientEvent, resourceUtil, constant, poolManager, car, follow, roadPoint, localConfig, playerData;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Vec3 = module.Vec3;
      macro = module.macro;
      Component = module.Component;
    }, function (module) {
      fightConstants = module.fightConstants;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      resourceUtil = module.resourceUtil;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      poolManager = module.poolManager;
    }, function (module) {
      car = module.car;
    }, function (module) {
      follow = module.follow;
    }, function (module) {
      roadPoint = module.roadPoint;
    }, function (module) {
      localConfig = module.localConfig;
    }, function (module) {
      playerData = module.playerData;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "0ab97H51jJALJr6aO9gzNGg", "carManager", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var carManager = exports('carManager', (_dec = ccclass("carManager"), _dec2 = property({
        type: follow
      }), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(carManager, _Component);

        function carManager() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "followCamera", _descriptor, _assertThisInitialized(_this));

          return _this;
        }

        var _proto = carManager.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.onEnable = function onEnable() {
          clientEvent.on('showInvincible', this.showInvincible, this);
        };

        _proto.onDisable = function onDisable() {
          clientEvent.off('showInvincible', this.showInvincible, this);
        };

        _proto.showInvincible = function showInvincible() {
          if (this.mainCar) {
            this.mainCar.isInvincible = true;
          }
        };

        _proto.init = function init(fightMap, customerManager) {
          this._fightMap = fightMap;
          this._customerManager = customerManager;
          this.creatMainCar();
        };

        _proto.creatMainCar = function creatMainCar() {
          var _this2 = this;

          var car = playerData.instance.showCar ? playerData.instance.showCar : constant.INITIAL_CAR;
          var carInfo = localConfig.instance.queryByID('car', car.toString());
          var skin = carInfo ? carInfo.model : constant.MIN_CAR_ID;
          resourceUtil.getCar(skin, function (err, pfCar) {
            if (err) {
              console.error(err);
              return;
            }

            if (_this2.mainCar) {
              poolManager.instance.putNode(_this2.mainCar.node);
            }

            var nodeCar = poolManager.instance.getNode(pfCar, _this2.node);
            _this2.mainCar = nodeCar.getComponent('car');

            _this2.mainCar.markMainCar(true);

            _this2.mainCar.setEntry(_this2._fightMap.path[0]);

            _this2.mainCar.manager = _this2._customerManager;
            _this2.mainCar.maxProgress = _this2._fightMap.levelProgressCnt;

            _this2.mainCar.setMoveOverListener(function () {});

            _this2.followCamera.followTarget = nodeCar;

            _this2.followCamera.showStart();
          }); // this.nodeTailLine = instantiate(this.pfTailLine);
          // this.nodeTailLine.parent = this.node;
          // this.nodeTailLine.active = false;
        } //预加载所有ai车辆
        ;

        _proto.preloadAICar = function preloadAICar(callback) {
          var arrPreload = [];

          for (var idx = 1; idx < this._fightMap.path.length; idx++) {
            var nodeRoadPoint = this._fightMap.path[idx];
            var point = nodeRoadPoint.getComponent(roadPoint);

            if (point.type !== fightConstants.ROAD_POINT_TYPE.AI_START) {
              return;
            }

            var arrCars = point.cars.split(',');

            for (var _idx = 0; _idx < arrCars.length; _idx++) {
              if (arrPreload.indexOf(arrCars[_idx]) === -1) {
                arrPreload.push(arrCars[_idx]);
              }
            }
          }

          var cur = 0;
          resourceUtil.getCarsBatch(arrPreload, function (arg) {
            //批量加载，每一辆，先加载2%
            cur++;

            if (cur <= 15) {
              clientEvent.dispatchEvent('updateLoading', 2);
            }
          }, function () {
            if (cur <= 15) {
              clientEvent.dispatchEvent('updateLoading', 30 - cur * 2);
            }

            callback && callback();
          });
        };

        _proto.startGenerateEnemy = function startGenerateEnemy() {
          this.genAICar = this.genAICar.bind(this);

          for (var idx = 1; idx < this._fightMap.path.length; idx++) {
            var nodeRoadPoint = this._fightMap.path[idx];
            var point = nodeRoadPoint.getComponent(roadPoint);
            point.startGenerateCar(this.genAICar);
          }
        };

        _proto.stopGenerateEnemy = function stopGenerateEnemy() {
          for (var idx = 1; idx < this._fightMap.path.length; idx++) {
            var nodeRoadPoint = this._fightMap.path[idx];
            var point = nodeRoadPoint.getComponent(roadPoint);
            point.stopGenerateCar();
          }
        };

        _proto.genAICar = function genAICar(road, randCar) {
          var _this3 = this; //应该动态生成


          resourceUtil.getCar(randCar, function (err, pfCar) {
            if (err) {
              console.error(err);
              return;
            }

            var otherCar = poolManager.instance.getNode(pfCar, _this3.node);
            var car = otherCar.getComponent('car');
            car.setEntry(road.node);
            car.minSpeed = road.carSpeed;
            car.maxSpeed = road.carSpeed;
            car.startRunning();
            car.markMainCar(false);
            car.setMoveOverListener(function (car) {
              poolManager.instance.putNode(car.node);
            });
          });
        };

        _proto.reset = function reset() {
          this.mainCar.setEntry(this._fightMap.path[0]);
          this.mainCar.maxProgress = this._fightMap.levelProgressCnt;
          this.followCamera.followTarget = this.mainCar.node;
          this.stopGenerateEnemy();
          this.recycleAllAICar();
        }
        /**
         *回收所有地方车辆
         *
         * @memberof carManager
         */
        ;

        _proto.recycleAllAICar = function recycleAllAICar() {
          var arrCars = [];
          var children = this.node.children;
          children.forEach(function (nodeCar) {
            arrCars.push(nodeCar);
          }, this);
          arrCars.forEach(function (nodeCar) {
            var car = nodeCar.getComponent('car');

            if (car && !car.isMain) {
              //车辆回收
              poolManager.instance.putNode(nodeCar);
            }
          });
        }
        /**
         *回收指定范围大小车辆
         *
         * @memberof carManager
         */
        ;

        _proto.recycleLimitAICar = function recycleLimitAICar() {
          var _this4 = this;

          var arrCars = [];
          var children = this.node.children;
          children.forEach(function (nodeCar) {
            arrCars.push(nodeCar);
          }, this);
          arrCars.forEach(function (nodeCar) {
            var car = nodeCar.getComponent('car');
            var distance = Vec3.distance(nodeCar.worldPosition, _this4.mainCar.node.worldPosition);

            if (car && !car.isMain && Math.abs(distance) <= 5) {
              //车辆回收
              poolManager.instance.putNode(nodeCar);
            } else {
              car.isOver = false;
              car.startRunning();
            }
          });
        }
        /**
         * 由UI层调用，控制车辆行驶
         * @param isRunning
         */
        ;

        _proto.controlMainCar = function controlMainCar(isRunning) {
          if (isRunning) {
            clientEvent.dispatchEvent('showGuide', false);
            this.mainCar.startRunning();
          } else {
            this.mainCar.stopRunning();
          }
        };

        _proto.startGame = function startGame() {
          clientEvent.dispatchEvent('showGuide', true);
          this.mainCar.startWithMinSpeed();
          this.startGenerateEnemy(); //开启定时检测车辆跟AI车辆是否相近

          this.schedule(this.checkCarIsCloser, 0.2, macro.REPEAT_FOREVER); //每0.2s检测一次
        };

        _proto.gameOver = function gameOver() {
          this.followCamera.followTarget = null; //将镜头跟随移除，免得一直晃

          this.stopGenerateEnemy(); //取消车辆的定时检测

          this.unschedule(this.checkCarIsCloser); //将其余车给停下来

          this.node.children.forEach(function (nodeCar) {
            var carScript = nodeCar.getComponent(car);
            carScript.stopImmediately();
          });
        };

        _proto.changeCameraFollowRotation = function changeCameraFollowRotation() {
          //镜头方式修改
          this.followCamera.isFollowRotation = !this.followCamera.isFollowRotation;
        }
        /**
         * 获取当前关卡进度
         *
         * @memberof carManager
         */
        ;

        _proto.getCurrentProgress = function getCurrentProgress() {
          return {
            cur: this.mainCar.curProgress,
            isOver: !this.mainCar.hasCustomer
          };
        };

        _proto.revive = function revive() {
          this.recycleLimitAICar();
          this.mainCar.revive();
          this.followCamera.followTarget = this.mainCar.node;
          this.startGenerateEnemy();
        };

        _proto.checkCarIsCloser = function checkCarIsCloser() {
          if (!this.mainCar.isCarMoving) {
            return; //车辆没有在移动，不需要检测
          }

          var nodeMainCar = this.mainCar.node;
          var posMainCar = nodeMainCar.getWorldPosition();
          this.node.children.forEach(function (nodeCar) {
            if (nodeCar !== nodeMainCar) {
              var posCar = nodeCar.getWorldPosition();
              var forward = nodeCar.forward;
              posCar.x -= forward.x;
              posCar.z -= forward.z;

              if (Math.abs(posCar.x - posMainCar.x) < 2 && Math.abs(posCar.z - posMainCar.z) < 2) {
                nodeCar.getComponent(car).tooting();
              }
            }
          });
        };

        return carManager;
      }(Component), _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "followCamera", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/eventListener.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator, error, log;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      error = module.error;
      log = module.log;
    }],
    execute: function () {
      var _dec, _class, _temp, _dec2, _class3;

      cclegacy._RF.push({}, "10a09om3sZD8q2H50TLwLIc", "eventListener", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var oneToOneListener = (_dec = ccclass("oneToOneListener"), _dec(_class = (_temp = /*#__PURE__*/function () {
        function oneToOneListener() {
          _defineProperty(this, "supportEvent", {});

          _defineProperty(this, "handle", {});

          this.supportEvent = null;
        }

        var _proto = oneToOneListener.prototype;

        _proto.on = function on(eventName, handler, target) {
          this.handle[eventName] = {
            handler: handler,
            target: target
          };
        };

        _proto.off = function off(eventName, handler) {
          var oldObj = this.handle[eventName];

          if (oldObj && oldObj.handler && oldObj.handler === handler) {
            delete this.handle[eventName];
          }
        };

        _proto.dispatchEvent = function dispatchEvent(eventName) {
          if (this.supportEvent !== null && !this.supportEvent.hasOwnProperty(eventName)) {
            error("please add the event into clientEvent.js");
            return;
          }

          var objHandler = this.handle[eventName];
          var args = [];

          for (var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
          }

          if (objHandler.handler) {
            objHandler.handler.apply(objHandler.target, args);
          } else {
            log("not register " + eventName + "    callback func");
          }
        };

        _proto.setSupportEventList = function setSupportEventList(arrSupportEvent) {
          if (!(arrSupportEvent instanceof Array)) {
            error("supportEvent was not array");
            return false;
          }

          this.supportEvent = {};

          for (var i in arrSupportEvent) {
            var eventName = arrSupportEvent[i];
            this.supportEvent[eventName] = i;
          }

          return true;
        };

        return oneToOneListener;
      }(), _temp)) || _class);
      var eventListener = exports('eventListener', (_dec2 = ccclass("eventListener"), _dec2(_class3 = /*#__PURE__*/function () {
        function eventListener() {}

        eventListener.getBaseClass = function getBaseClass(type) {
          return oneToOneListener;
        };

        return eventListener;
      }()) || _class3));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/oneToMultiListener.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator, error;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      error = module.error;
    }],
    execute: function () {
      var _dec, _class, _class2, _temp;

      cclegacy._RF.push({}, "10a25g6TDNP2IICdF4Htopx", "oneToMultiListener", undefined);

      var ccclass = _decorator.ccclass;
      var oneToMultiListener = exports('oneToMultiListener', (_dec = ccclass("oneToMultiListener"), _dec(_class = (_temp = _class2 = /*#__PURE__*/function () {
        function oneToMultiListener() {}

        oneToMultiListener.on = function on(eventName, handler, target) {
          var objHandler = {
            handler: handler,
            target: target
          };
          var handlerList = this.handlers[eventName];

          if (!handlerList) {
            handlerList = [];
            this.handlers[eventName] = handlerList;
          }

          for (var i = 0; i < handlerList.length; i++) {
            if (!handlerList[i]) {
              handlerList[i] = objHandler;
              return i;
            }
          }

          handlerList.push(objHandler);
          return handlerList.length;
        };

        oneToMultiListener.off = function off(eventName, handler, target) {
          var handlerList = this.handlers[eventName];

          if (!handlerList) {
            return;
          }

          for (var i = 0; i < handlerList.length; i++) {
            var oldObj = handlerList[i];

            if (oldObj.handler === handler && (!target || target === oldObj.target)) {
              handlerList.splice(i, 1);
              break;
            }
          }
        };

        oneToMultiListener.dispatchEvent = function dispatchEvent(eventName) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          } // if (this.supportEvent !== null && !this.supportEvent.hasOwnProperty(eventName)) {
          //     cc.error("please add the event into clientEvent.js");
          //     return;
          // }


          var handlerList = this.handlers[eventName];
          var i;

          for (i = 1; i < arguments.length; i++) {}

          if (!handlerList) {
            return;
          }

          for (i = 0; i < handlerList.length; i++) {
            var objHandler = handlerList[i];

            if (objHandler.handler) {
              objHandler.handler.apply(objHandler.target, args);
            }
          }
        };

        oneToMultiListener.setSupportEventList = function setSupportEventList(arrSupportEvent) {
          if (!(arrSupportEvent instanceof Array)) {
            error("supportEvent was not array");
            return false;
          }

          this.supportEvent = {};

          for (var i in arrSupportEvent) {
            var eventName = arrSupportEvent[i];
            this.supportEvent[eventName] = i;
          }

          return true;
        };

        return oneToMultiListener;
      }(), _defineProperty(_class2, "handlers", void 0), _defineProperty(_class2, "supportEvent", void 0), _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/shop.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './clientEvent.ts', './resourceUtil.ts', './constant.ts', './poolManager.ts', './util.ts', './localConfig.ts', './playerData.ts', './uiManager.ts', './shopPage.ts', './gameLogic.ts', './LanguageData.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Label, Node, Prefab, Sprite, instantiate, Vec3, Button, Color, Component, clientEvent, resourceUtil, constant, poolManager, util, localConfig, playerData, uiManager, shopPage, gameLogic, i18n;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
      Node = module.Node;
      Prefab = module.Prefab;
      Sprite = module.Sprite;
      instantiate = module.instantiate;
      Vec3 = module.Vec3;
      Button = module.Button;
      Color = module.Color;
      Component = module.Component;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      resourceUtil = module.resourceUtil;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      poolManager = module.poolManager;
    }, function (module) {
      util = module.util;
    }, function (module) {
      localConfig = module.localConfig;
    }, function (module) {
      playerData = module.playerData;
    }, function (module) {
      uiManager = module.uiManager;
    }, function (module) {
      shopPage = module.shopPage;
    }, function (module) {
      gameLogic = module.gameLogic;
    }, function (module) {
      i18n = module.i18n;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _temp;

      cclegacy._RF.push({}, "15effXNtKpGeLctODlTRqhl", "shop", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var MAX_PAGE_SIZE = 9; //一页最多9个

      var shop = exports('shop', (_dec = ccclass("shop"), _dec2 = property(Label), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Label), _dec8 = property(Label), _dec9 = property(Label), _dec10 = property(Node), _dec11 = property(Node), _dec12 = property(Prefab), _dec13 = property(Sprite), _dec14 = property(Label), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(shop, _Component);

        function shop() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "lbGold", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeGet", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeGold", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeBuy", _descriptor4, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeGo", _descriptor5, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbDesc", _descriptor6, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbPrice", _descriptor7, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbGo", _descriptor8, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeCarParent", _descriptor9, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodePages", _descriptor10, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "pfPage", _descriptor11, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spCarBlack", _descriptor12, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbPage", _descriptor13, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "currentPage", null);

          _defineProperty(_assertThisInitialized(_this), "currentCar", null);

          _defineProperty(_assertThisInitialized(_this), "carDegree", 0);

          _defineProperty(_assertThisInitialized(_this), "rotateSpeed", 30);

          _defineProperty(_assertThisInitialized(_this), "currentCarInfo", void 0);

          _defineProperty(_assertThisInitialized(_this), "pageIndex", 0);

          _defineProperty(_assertThisInitialized(_this), "maxPage", 0);

          _defineProperty(_assertThisInitialized(_this), "currentCarID", 0);

          return _this;
        }

        var _proto = shop.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.onEnable = function onEnable() {
          clientEvent.on('updateGold', this.updateGold, this);
          clientEvent.on('onShopItemSelect', this.onShopItemSelect, this);
          clientEvent.on('updateBuyTask', this.updateButtons, this);
        };

        _proto.onDisable = function onDisable() {
          clientEvent.off('updateGold', this.updateGold, this);
          clientEvent.off('onShopItemSelect', this.onShopItemSelect, this);
          clientEvent.off('updateBuyTask', this.updateButtons, this);
        };

        _proto.show = function show() {
          var cars = localConfig.instance.getCars();
          this.maxPage = Math.floor(cars.length / MAX_PAGE_SIZE);
          this.updateGold();
          this.showPage();
        };

        _proto.showPage = function showPage() {
          if (!this.currentPage) {
            this.currentPage = instantiate(this.pfPage);
            this.currentPage.parent = this.nodePages;
            this.pageIndex = 0;
            this.refreshPageLabel();
            this.currentPage.getComponent(shopPage).setPage(this.pageIndex);
          }

          this.currentPage.getComponent(shopPage).show();
        };

        _proto.updateGold = function updateGold() {
          var gold = playerData.instance.playerInfo.gold || 0;
          this.lbGold.string = util.formatMoney(gold);
        };

        _proto.onBtnCloseClick = function onBtnCloseClick() {
          uiManager.instance.hideDialog('shop/shop');
        };

        _proto.getCar = function getCar() {
          var _this2 = this; // playerData.instance.buyCar(this.currentCarInfo.ID);


          gameLogic.buyCar(this.currentCarInfo.ID);
          var rewardInfo = {
            rewardType: constant.REWARD_TYPE.CAR,
            amount: 1,
            ID: this.currentCarInfo.ID
          };
          uiManager.instance.showDialog('common/showReward', [rewardInfo, false,
          /*i18n.t("showReward.buySuccessful")*/
          '购买成功', function () {
            //启用
            gameLogic.useCar(_this2.currentCarInfo.ID);

            _this2.currentPage.getComponent(shopPage).refreshUse(_this2.currentCarInfo.ID);
          }, null,
          /*i18n.t("showReward.confirm")*/
          '确认']);
        };

        _proto.onBtnGetClick = function onBtnGetClick() {
          var carID = this.currentCarInfo.ID;

          if (playerData.instance.hasCar(carID)) {
            return;
          } else if (this.currentCarInfo.type === constant.BUY_CAR_TYPE.GOLD) {
            if (this.currentCarInfo.num > playerData.instance.playerInfo.gold) {
              //金币不足
              // return;
              uiManager.instance.showTips(
              /*i18n.t("shop.getGold")*/
              '获取金币', function () {});
              return;
            } //扣款


            gameLogic.addGold(-this.currentCarInfo.num); //获得车

            this.getCar();
          } else {
            var currentProgress = playerData.instance.getBuyTypeProgress(this.currentCarInfo.type);

            if (currentProgress >= this.currentCarInfo.num) {
              //可以获得了
              this.getCar();
            } else {
              //对应任务，对应界面
              switch (this.currentCarInfo.type) {
                case constant.BUY_CAR_TYPE.GAME:
                case constant.BUY_CAR_TYPE.LOGIN:
                case constant.BUY_CAR_TYPE.CONTINUOUS_LOGIN:
                case constant.BUY_CAR_TYPE.PASS_LEVEL:
                  this.onBtnCloseClick();
                  break;

                case constant.BUY_CAR_TYPE.SIGNIN:
                  this.onBtnCloseClick(); //显示签到界面

                  uiManager.instance.showDialog('signIn/signIn');
                  break;

                case constant.BUY_CAR_TYPE.SHARE:
                  gameLogic.openReward(constant.SHARE_FUNCTION.SHOP_SHARE, function (err, type) {});
                  break;

                case constant.BUY_CAR_TYPE.VIDEO:
                  gameLogic.openReward(constant.SHARE_FUNCTION.SHOP_VIDEO, function (err, isOver) {});
                  break;
              }
            }
          }
        };

        _proto.checkBtn = function checkBtn() {};

        _proto.onBtnGoldClick = function onBtnGoldClick() {
          var _this3 = this;

          gameLogic.openReward(constant.SHARE_FUNCTION.SHOP_VIDEO, function (err) {
            if (!err) {
              gameLogic.showFlyReward(constant.REWARD_TYPE.GOLD, function () {
                gameLogic.addGold(300);

                _this3.updateButtons();
              });
            }
          });
        };

        _proto.onShopItemSelect = function onShopItemSelect(carID, useCar) {
          var _this4 = this;

          var curPage = this.currentPage.getComponent(shopPage);
          curPage.unSelectAll();

          if (useCar) {
            curPage.unUseAll();
          }

          if (this.currentCar) {
            poolManager.instance.putNode(this.currentCar);
            this.currentCar = null;
          } //刷新界面展示


          this.currentCarInfo = localConfig.instance.queryByID('car', carID.toString());

          if (this.currentCarInfo.type === constant.BUY_CAR_TYPE.SHARE) {
            //分享审核的时候特殊处理
            this.currentCarInfo.type = constant.BUY_CAR_TYPE.GOLD;
            this.currentCarInfo.num = 2000;
          }

          if (playerData.instance.hasCar(carID)) {
            this.spCarBlack.node.active = false;
            resourceUtil.getUICar(this.currentCarInfo.model, function (err, prefab) {
              if (err) {
                console.error(err, _this4.currentCarInfo.model);
                return;
              }

              _this4.carDegree = 0;
              _this4.currentCar = poolManager.instance.getNode(prefab, _this4.nodeCarParent);
            });
          } else {
            this.spCarBlack.node.active = true;
            resourceUtil.setCarIcon(this.currentCarInfo.model, this.spCarBlack, true, function () {});
          }

          this.updateButtons();
        };

        _proto.update = function update(deltaTime) {
          // Your update function goes here.
          //旋转展示车辆
          if (this.currentCar) {
            this.carDegree -= deltaTime * this.rotateSpeed;

            if (this.carDegree <= -360) {
              this.carDegree += 360;
            }

            this.currentCar.eulerAngles = new Vec3(0, this.carDegree, 0);
          }
        };

        _proto.updateButtons = function updateButtons() {
          if (playerData.instance.hasCar(this.currentCarInfo.ID)) {
            //已拥有该车辆
            this.lbDesc.string = '';
            this.nodeGo.active = true;
            this.nodeBuy.active = false;
            this.lbGo.string =
            /*i18n.t('shop.acquired')*/
            '获取'; //TODO 引擎点击事件传递有问题，先开起来

            this.nodeGet.getComponent(Button).interactable = true; //即刻玩那边特殊处理，如果是分享则变成用金币获取
          } else if (this.currentCarInfo.type === constant.BUY_CAR_TYPE.GOLD) {
            this.lbDesc.string = '';
            this.lbPrice.string = this.currentCarInfo.num;

            if (playerData.instance.playerInfo.gold >= this.currentCarInfo.num) {
              this.lbPrice.color = Color.WHITE;
              this.nodeGet.getComponent(Button).interactable = true; // this.nodeGold.active = false;
            } else {
              this.lbPrice.color = Color.RED;
              this.nodeGet.getComponent(Button).interactable = true; // this.nodeGold.active = true;
            }

            this.nodeGo.active = false;
            this.nodeBuy.active = true;
          } else {
            this.nodeGet.getComponent(Button).interactable = true;
            this.nodeGo.active = true;
            this.nodeBuy.active = false;
            var num = playerData.instance.getBuyTypeProgress(this.currentCarInfo.type);

            if (num < this.currentCarInfo.num) {
              this.lbGo.string =
              /*i18n.t('shop.go')*/
              '前往商店';
            } else {
              this.lbGo.string =
              /*i18n.t('shop.receive')*/
              '获取';
            }

            var strDesc = i18n.t("carTask." + this.currentCarInfo.show);

            if (this.currentCarInfo.type !== constant.BUY_CAR_TYPE.SIGNIN) {
              strDesc += "(" + i18n.t("shop.current") + "\uFF1A" + num + "/" + this.currentCarInfo.num + ")";
            }

            this.lbDesc.string = strDesc;
          }
        };

        _proto.refreshPageLabel = function refreshPageLabel() {
          this.lbPage.string = this.pageIndex + 1 + "/" + (this.maxPage + 1);
        };

        _proto.onBtnLeftClick = function onBtnLeftClick() {
          var shopPageScript = this.currentPage.getComponent(shopPage);

          if (this.pageIndex > 0) {
            this.pageIndex--;
          } else {
            this.pageIndex = this.maxPage;
          }

          this.refreshPageLabel();
          shopPageScript.setPage(this.pageIndex);
          shopPageScript.show();
        };

        _proto.onBtnRightClick = function onBtnRightClick() {
          var shopPageScript = this.currentPage.getComponent(shopPage);

          if (this.pageIndex >= this.maxPage) {
            this.pageIndex = 0;
          } else {
            this.pageIndex++;
          }

          this.refreshPageLabel();
          shopPageScript.setPage(this.pageIndex);
          shopPageScript.show();
        };

        return shop;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "lbGold", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "nodeGet", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "nodeGold", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "nodeBuy", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "nodeGo", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "lbDesc", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "lbPrice", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "lbGo", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "nodeCarParent", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "nodePages", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "pfPage", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "spCarBlack", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "lbPage", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/constant.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "1ad87mpTDFDV7de0xMwTCq4", "constant", undefined);

      var constant = exports('constant', function constant() {});

      _defineProperty(constant, "GAME_NAME", 'car');

      _defineProperty(constant, "LOCAL_CACHE", {
        PLAYER: 'player',
        //玩家基础数据缓存，如金币砖石等信息，暂时由客户端存储，后续改由服务端管理
        SETTINGS: 'settings',
        //设置相关，所有杂项都丢里面进去
        DATA_VERSION: 'dataVersion',
        //数据版本
        ACCOUNT: 'account',
        //玩家账号
        // TMP_DATA: 'tmpData',             //临时数据，不会存储到云盘
        HISTORY: "history",
        //关卡通关数据
        BAG: "bag" //玩家背包，即道具列表，字典类型

      });

      _defineProperty(constant, "MAX_LEVEL", 20);

      _defineProperty(constant, "MIN_CAR_ID", 101);

      _defineProperty(constant, "MAX_CAR_ID", 109);

      _defineProperty(constant, "AUDIO_SOUND", {
        BACKGROUND: 'background',
        //背景音乐
        CRASH: "crash",
        //撞车
        GET_MONEY: "getMoney",
        //赚钱
        IN_CAR: "inCar",
        //上车
        NEW_ORDER: "newOrder",
        //新订单
        CAR_START: "carStart",
        //车辆启动
        WIN: "win",
        //胜利
        STOP: "stop",
        //刹车
        TOOTING1: "tooting1",
        //鸣笛声1
        TOOTING2: "tooting2" //鸣笛声2

      });

      _defineProperty(constant, "SIGNIN_REWARD_STATUS", {
        RECEIVED: 0,
        //已经领取的
        RECEIVABLE: 1,
        //可以领取的
        UNRECEIVABLE: 2,
        //已经领取的
        FILL_SIGNIN: 3,
        //补签的
        AFTER_FILL_SIGNIN: 4 //已经补签的

      });

      _defineProperty(constant, "MAX_SIGNIN_DAY", 7);

      _defineProperty(constant, "NORMAL_SHOW_TIME", 3);

      _defineProperty(constant, "NEWBEE_LEVEL", 2);

      _defineProperty(constant, "REWARD_TYPE", {
        DIAMOND: 1,
        //钻石
        GOLD: 2,
        //金币
        CAR: 3 //车辆

      });

      _defineProperty(constant, "ONLINE", {
        MAX_TIME: 60,
        //30分钟
        // MAX_TIME: 60,            //4个小时
        PROFIT_PER_SECOND: 0.3,
        //每秒收益
        TIME_PER_CIRCLE: 10 //转一圈所需时间

      });

      _defineProperty(constant, "SHARE_FUNCTION", {
        BALANCE: 'balance',
        //结算分享 
        RELIVE: 'relive',
        //复活
        OFFLINE: 'offline',
        //离线奖励
        RANK: 'rank',
        //排行榜
        LOTTERY: 'lottery',
        //抽奖
        LOTTERY_REWARD: 'lotteryReward',
        //抽奖奖励，用于双倍分享
        TRIAL: 'trial',
        //试用
        CLICK_BOX: 'clickBox',
        //点开宝箱
        ONLINE: 'online',
        //在线奖励
        SIGNIN: 'signIn',
        //签到
        FILL_SIGNIN: 'fillSignIn',
        //补签
        INVINCIBLE: 'invincible',
        //无敌
        SHOP_SHARE: 'shopShare',
        //商店里头的分享触发的
        SHOP_VIDEO: 'shopVideo' //商店里头的视频触发的

      });

      _defineProperty(constant, "INITIAL_CAR", 1);

      _defineProperty(constant, "BUY_CAR_TYPE", {
        GOLD: 1,
        //金币 
        LOGIN: 2,
        //2登录
        CONTINUOUS_LOGIN: 3,
        //3连续登录 
        SHARE: 4,
        //4分享
        VIDEO: 5,
        //5看视频
        GAME: 6,
        //6进行游戏
        INVITE: 7,
        //7邀请好友
        SIGNIN: 8,
        //8签到
        PASS_LEVEL: 9 //9通关获得

      });

      _defineProperty(constant, "OPEN_REWARD_TYPE", {
        AD: 0,
        SHARE: 1,
        NULL: 2
      });

      _defineProperty(constant, "GOLD_REWARD", {
        SECOND: 500,
        //第二天
        SEVENT: 500 //第七天

      });

      _defineProperty(constant, "LOTTERY", {
        MONEY: 2000,
        //1000块钱抽1次
        EXCHANGE: 500 //抽到已有的车自动转换成钱数

      });

      _defineProperty(constant, "CUSTOMER_MAX_CNT", 2);

      _defineProperty(constant, "MENU_INIT_BOTTOM", 40);

      _defineProperty(constant, "MENU_BOTTOM", 250);

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/polyglot.min.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      exports('polyglot', polyglot);

      cclegacy._RF.push({}, "26839JcVWpGabE9xA7/uWJw", "polyglot.min", undefined);

      var forEach = function forEach(arr, fn, target) {
        // var arr = Array.isArray(arguments[0]) ? arguments[0] : new Array;
        arr = arguments[0];
        fn = typeof arguments[1] === 'function' ? arguments[1] : new Function();

        if (Array.isArray(arr)) {
          arr.forEach(function (item, idx, array) {
            fn(item, idx);
          });
        } else {
          for (var key in arr) {
            if (arr.hasOwnProperty(key)) {
              var element = arr[key];
              fn(element, key);
            }
          }
        }
      };

      var warning = function warning(message) {
        console.warn(message);
      };

      var _has = function has(obj, key) {
        return obj.hasOwnProperty(key);
      };

      function trim(x) {
        return x.replace(/^\s+|\s+$/gm, '');
      }

      var warn = function warn(message) {
        warning(message);
      };

      var replace = String.prototype.replace;
      var split = String.prototype.split; // #### Pluralization methods
      // The string that separates the different phrase possibilities.

      var delimiter = '||||';

      var russianPluralGroups = function russianPluralGroups(n) {
        var lastTwo = n % 100;
        var end = lastTwo % 10;

        if (lastTwo !== 11 && end === 1) {
          return 0;
        }

        if (2 <= end && end <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) {
          return 1;
        }

        return 2;
      };

      var defaultPluralRules = {
        // Mapping from pluralization group plural logic.
        pluralTypes: {
          arabic: function arabic(n) {
            // http://www.arabeyes.org/Plural_Forms
            if (n < 3) {
              return n;
            }

            var lastTwo = n % 100;
            if (lastTwo >= 3 && lastTwo <= 10) return 3;
            return lastTwo >= 11 ? 4 : 5;
          },
          bosnian_serbian: russianPluralGroups,
          chinese: function chinese() {
            return 0;
          },
          croatian: russianPluralGroups,
          french: function french(n) {
            return n > 1 ? 1 : 0;
          },
          german: function german(n) {
            return n !== 1 ? 1 : 0;
          },
          russian: russianPluralGroups,
          lithuanian: function lithuanian(n) {
            if (n % 10 === 1 && n % 100 !== 11) {
              return 0;
            }

            return n % 10 >= 2 && n % 10 <= 9 && (n % 100 < 11 || n % 100 > 19) ? 1 : 2;
          },
          czech: function czech(n) {
            if (n === 1) {
              return 0;
            }

            return n >= 2 && n <= 4 ? 1 : 2;
          },
          polish: function polish(n) {
            if (n === 1) {
              return 0;
            }

            var end = n % 10;
            return 2 <= end && end <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
          },
          icelandic: function icelandic(n) {
            return n % 10 !== 1 || n % 100 === 11 ? 1 : 0;
          },
          slovenian: function slovenian(n) {
            var lastTwo = n % 100;

            if (lastTwo === 1) {
              return 0;
            }

            if (lastTwo === 2) {
              return 1;
            }

            if (lastTwo === 3 || lastTwo === 4) {
              return 2;
            }

            return 3;
          }
        },
        // Mapping from pluralization group to individual language codes/locales.
        // Will look up based on exact match, if not found and it's a locale will parse the locale
        // for language code, and if that does not exist will default to 'en'
        pluralTypeToLanguages: {
          arabic: ['ar'],
          bosnian_serbian: ['bs-Latn-BA', 'bs-Cyrl-BA', 'srl-RS', 'sr-RS'],
          chinese: ['id', 'id-ID', 'ja', 'ko', 'ko-KR', 'lo', 'ms', 'th', 'th-TH', 'zh'],
          croatian: ['hr', 'hr-HR'],
          german: ['fa', 'da', 'de', 'en', 'es', 'fi', 'el', 'he', 'hi-IN', 'hu', 'hu-HU', 'it', 'nl', 'no', 'pt', 'sv', 'tr'],
          french: ['fr', 'tl', 'pt-br'],
          russian: ['ru', 'ru-RU'],
          lithuanian: ['lt'],
          czech: ['cs', 'cs-CZ', 'sk'],
          polish: ['pl'],
          icelandic: ['is'],
          slovenian: ['sl-SL']
        }
      };

      function langToTypeMap(mapping) {
        var ret = {};
        forEach(mapping, function (langs, type) {
          forEach(langs, function (lang) {
            ret[lang] = type;
          }, this);
        }, this);
        return ret;
      }

      function pluralTypeName(pluralRules, locale) {
        var langToPluralType = langToTypeMap(pluralRules.pluralTypeToLanguages); //@ts-ignore

        return langToPluralType[locale] || langToPluralType[split.call(locale, /-/, 1)[0]] || langToPluralType.en;
      }

      function pluralTypeIndex(pluralRules, locale, count) {
        return pluralRules.pluralTypes[pluralTypeName(pluralRules, locale)](count);
      }

      function escape(token) {
        return token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }

      function constructTokenRegex(opts) {
        var prefix = opts && opts.prefix || '%{';
        var suffix = opts && opts.suffix || '}';

        if (prefix === delimiter || suffix === delimiter) {
          throw new RangeError('"' + delimiter + '" token is reserved for pluralization');
        }

        return new RegExp(escape(prefix) + '(.*?)' + escape(suffix), 'g');
      }

      var defaultTokenRegex = /%\{(.*?)\}/g; // ### transformPhrase(phrase, substitutions, locale)
      //
      // Takes a phrase string and transforms it by choosing the correct
      // plural form and interpolating it.
      //
      //     transformPhrase('Hello, %{name}!', {name: 'Spike'});
      //     // "Hello, Spike!"
      //
      // The correct plural form is selected if substitutions.smart_count
      // is set. You can pass in a number instead of an Object as `substitutions`
      // as a shortcut for `smart_count`.
      //
      //     transformPhrase('%{smart_count} new messages |||| 1 new message', {smart_count: 1}, 'en');
      //     // "1 new message"
      //
      //     transformPhrase('%{smart_count} new messages |||| 1 new message', {smart_count: 2}, 'en');
      //     // "2 new messages"
      //
      //     transformPhrase('%{smart_count} new messages |||| 1 new message', 5, 'en');
      //     // "5 new messages"
      //
      // You should pass in a third argument, the locale, to specify the correct plural type.
      // It defaults to `'en'` with 2 plural forms.

      function _transformPhrase(phrase, substitutions, locale, tokenRegex, pluralRules) {
        if (typeof phrase !== 'string') {
          throw new TypeError('Polyglot.transformPhrase expects argument #1 to be string');
        }

        if (substitutions == null) {
          return phrase;
        }

        var result = phrase;
        var interpolationRegex = tokenRegex || defaultTokenRegex;
        var pluralRulesOrDefault = pluralRules || defaultPluralRules; // allow number as a pluralization shortcut

        var options = typeof substitutions === 'number' ? {
          smart_count: substitutions
        } : substitutions; // Select plural form: based on a phrase text that contains `n`
        // plural forms separated by `delimiter`, a `locale`, and a `substitutions.smart_count`,
        // choose the correct plural form. This is only done if `count` is set.

        if (options.smart_count != null && result) {
          var texts = split.call(result, delimiter);
          result = trim(texts[pluralTypeIndex(pluralRulesOrDefault, locale || 'en', options.smart_count)] || texts[0]);
        } // Interpolate: Creates a `RegExp` object for each interpolation placeholder.


        result = replace.call(result, interpolationRegex, function (expression, argument) {
          if (!_has(options, argument) || options[argument] == null) {
            return expression;
          }

          return options[argument];
        });
        return result;
      } // ### Polyglot class constructor


      var Polyglot = exports('Polyglot', /*#__PURE__*/function () {
        Polyglot.transformPhrase = function transformPhrase(phrase, substitutions, locale) {
          //@ts-ignore
          return _transformPhrase(phrase, substitutions, locale);
        };

        function Polyglot(options) {
          _defineProperty(this, "phrases", {});

          _defineProperty(this, "pluralRules", {});

          _defineProperty(this, "currentLocale", '');

          _defineProperty(this, "onMissingKey", null);

          _defineProperty(this, "warn", null);

          _defineProperty(this, "tokenRegex", void 0);

          var opts = options || {};
          this.extend(opts.phrases || {});
          this.currentLocale = opts.locale || 'en';
          var allowMissing = opts.allowMissing ? _transformPhrase : null;
          this.onMissingKey = typeof opts.onMissingKey === 'function' ? opts.onMissingKey : allowMissing;
          this.warn = opts.warn || warn;
          this.tokenRegex = constructTokenRegex(opts.interpolation);
          this.pluralRules = opts.pluralRules || defaultPluralRules;
        } // ### polyglot.has(key)
        //
        // Check if polyglot has a translation for given key


        var _proto = Polyglot.prototype;

        _proto.has = function has(key) {
          return _has(this.phrases, key);
        } // ### polyglot.t(key, options)
        //
        // The most-used method. Provide a key, and `t` will return the
        // phrase.
        //
        //     polyglot.t("hello");
        //     => "Hello"
        //
        // The phrase value is provided first by a call to `polyglot.extend()` or
        // `polyglot.replace()`.
        //
        // Pass in an object as the second argument to perform interpolation.
        //
        //     polyglot.t("hello_name", {name: "Spike"});
        //     => "Hello, Spike"
        //
        // If you like, you can provide a default value in case the phrase is missing.
        // Use the special option key "_" to specify a default.
        //
        //     polyglot.t("i_like_to_write_in_language", {
        //       _: "I like to write in %{language}.",
        //       language: "JavaScript"
        //     });
        //     => "I like to write in JavaScript."
        //
        ;

        _proto.t = function t(key, options) {
          var phrase, result;
          var opts = options == null ? {} : options;

          if (typeof this.phrases[key] === 'string') {
            phrase = this.phrases[key];
          } else if (typeof opts._ === 'string') {
            phrase = opts._;
          } else if (this.onMissingKey) {
            var onMissingKey = this.onMissingKey;
            result = onMissingKey(key, opts, this.currentLocale, this.tokenRegex, this.pluralRules);
          } else {
            this.warn('Missing translation for key: "' + key + '"');
            result = key;
          }

          if (typeof phrase === 'string') {
            result = _transformPhrase(phrase, opts, this.currentLocale, this.tokenRegex, this.pluralRules);
          }

          return result;
        } // ### polyglot.replace(phrases)
        //
        // Completely replace the existing phrases with a new set of phrases.
        // Normally, just use `extend` to add more phrases, but under certain
        // circumstances, you may want to make sure no old phrases are lying around.
        ;

        _proto.replace = function replace(newPhrases) {
          this.clear();
          this.extend(newPhrases);
        } // ### polyglot.clear()
        //
        // Clears all phrases. Useful for special cases, such as freeing
        // up memory if you have lots of phrases but no longer need to
        // perform any translation. Also used internally by `replace`.
        ;

        _proto.clear = function clear() {
          this.phrases = {};
        } // ### polyglot.locale([locale])
        //
        // Get or set locale. Internally, Polyglot only uses locale for pluralization.
        ;

        _proto.locale = function locale(newLocale) {
          if (newLocale) this.currentLocale = newLocale;
          return this.currentLocale;
        } // ### polyglot.extend(phrases)
        //
        // Use `extend` to tell Polyglot how to translate a given key.
        //
        //     polyglot.extend({
        //       "hello": "Hello",
        //       "hello_name": "Hello, %{name}"
        //     });
        //
        // The key can be any string.  Feel free to call `extend` multiple times;
        // it will override any phrases with the same key, but leave existing phrases
        // untouched.
        //
        // It is also possible to pass nested phrase objects, which get flattened
        // into an object with the nested keys concatenated using dot notation.
        //
        //     polyglot.extend({
        //       "nav": {
        //         "hello": "Hello",
        //         "hello_name": "Hello, %{name}",
        //         "sidebar": {
        //           "welcome": "Welcome"
        //         }
        //       }
        //     });
        //
        //     console.log(polyglot.phrases);
        //     // {
        //     //   'nav.hello': 'Hello',
        //     //   'nav.hello_name': 'Hello, %{name}',
        //     //   'nav.sidebar.welcome': 'Welcome'
        //     // }
        //
        // `extend` accepts an optional second argument, `prefix`, which can be used
        // to prefix every key in the phrases object with some string, using dot
        // notation.
        //
        //     polyglot.extend({
        //       "hello": "Hello",
        //       "hello_name": "Hello, %{name}"
        //     }, "nav");
        //
        //     console.log(polyglot.phrases);
        //     // {
        //     //   'nav.hello': 'Hello',
        //     //   'nav.hello_name': 'Hello, %{name}'
        //     // }
        //
        // This feature is used internally to support nested phrase objects.
        ;

        _proto.extend = function extend(morePhrases, prefix) {
          var _this = this;

          forEach(morePhrases, function (phrase, key) {
            var prefixedKey = prefix ? prefix + '.' + key : key;

            if (typeof phrase === 'object') {
              _this.extend(phrase, prefixedKey);
            } else {
              _this.phrases[prefixedKey] = phrase;
            }
          }, this);
        } // ### polyglot.unset(phrases)
        // Use `unset` to selectively remove keys from a polyglot instance.
        //
        //     polyglot.unset("some_key");
        //     polyglot.unset({
        //       "hello": "Hello",
        //       "hello_name": "Hello, %{name}"
        //     });
        //
        // The unset method can take either a string (for the key), or an object hash with
        // the keys that you would like to unset.
        ;

        _proto.unset = function unset(morePhrases, prefix) {
          if (typeof morePhrases === 'string') {
            delete this.phrases[morePhrases];
          } else {
            forEach(morePhrases, function (phrase, key) {
              var prefixedKey = prefix ? prefix + '.' + key : key;

              if (typeof phrase === 'object') {
                this.unset(phrase, prefixedKey);
              } else {
                delete this.phrases[prefixedKey];
              }
            }, this);
          }
        };

        return Polyglot;
      }());

      function polyglot(options) {
        return new Polyglot(options);
      }

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/fightMap.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './fightConstants.ts', './clientEvent.ts', './resourceUtil.ts', './poolManager.ts', './roadPoint.ts', './LanguageData.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Node, Vec3, Component, fightConstants, clientEvent, resourceUtil, poolManager, roadPoint, i18n;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Vec3 = module.Vec3;
      Component = module.Component;
    }, function (module) {
      fightConstants = module.fightConstants;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      resourceUtil = module.resourceUtil;
    }, function (module) {
      poolManager = module.poolManager;
    }, function (module) {
      roadPoint = module.roadPoint;
    }, function (module) {
      i18n = module.i18n;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "273adkVLRhECoDje+nCdBuE", "fightMap", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property; // import {writeFile} from 'fs';

      var fightMap = exports('fightMap', (_dec = ccclass("fightMap"), _dec2 = property({
        type: Node,
        displayName: "各路线起点"
      }), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(fightMap, _Component);

        function fightMap() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "path", _descriptor, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "_progressListener", undefined);

          _defineProperty(_assertThisInitialized(_this), "_completeListener", undefined);

          _defineProperty(_assertThisInitialized(_this), "curProgress", 0);

          _defineProperty(_assertThisInitialized(_this), "maxProgress", 0);

          _defineProperty(_assertThisInitialized(_this), "levelProgressCnt", 0);

          return _this;
        }

        var _proto = fightMap.prototype; //关卡总进度
        //构建地图

        _proto.buildMap = function buildMap(jsonInfo, progressCb, completeCb) {
          this._progressListener = progressCb;
          this._completeListener = completeCb;
          this.objMap = jsonInfo; //构建地面

          this.curProgress = 0;
          this.maxProgress = 6;
          this.buildModel('plane');
          this.buildModel('road');
          this.buildModel('tree');
          this.buildModel('house');
          this.buildModel('sign');
          this.buildPath();
        };

        _proto.buildModel = function buildModel(type) {
          var _this2 = this;

          if (!this.objMap.hasOwnProperty(type)) {
            //继续
            this.triggerFinished(type);
            return;
          } //搜索所需资源


          var arrName = [];
          var objPlane = this.objMap[type];

          for (var idx = 0; idx < objPlane.children.length; idx++) {
            var _name = objPlane.children[idx].name;

            if (arrName.indexOf(_name) === -1) {
              arrName.push(_name);
            }
          }

          var dictPrefab = {};
          resourceUtil.getMapObjs(type, arrName, function () {}, function (err, arrPrefabs) {
            if (err) {
              console.error(err);
              return;
            }

            for (var _idx = 0; _idx < arrPrefabs.length; _idx++) {
              var prefab = arrPrefabs[_idx];
              dictPrefab[prefab.data.name] = prefab;
            } //开始创建
            //先创建父节点


            var nodeParent = new Node(type);
            nodeParent.parent = _this2.node;
            nodeParent.setPosition(new Vec3(objPlane.pX, objPlane.pY, objPlane.pZ)); //开始创建子节点

            for (var _idx2 = 0; _idx2 < objPlane.children.length; _idx2++) {
              var child = objPlane.children[_idx2];
              var _prefab = dictPrefab[child.name];
              var node = poolManager.instance.getNode(_prefab, nodeParent);
              node.setPosition(child.pX, child.pY, child.pZ);
              node.eulerAngles = new Vec3(child.rX, child.rY, child.rZ);
              node.setScale(child.sX, child.sY, child.sZ);
            }

            _this2.triggerFinished(type);
          });
        };

        _proto.buildPath = function buildPath() {
          if (!this.objMap.hasOwnProperty('path')) {
            //继续
            return;
          }

          this.path = [];
          this.levelProgressCnt = 0;
          var objPathRoot = this.objMap.path;
          var nodePathRoot = new Node('path');
          nodePathRoot.parent = this.node;
          nodePathRoot.setPosition(objPathRoot.pX, objPathRoot.pY, objPathRoot.pZ); //开始创建各条路径

          for (var idx = 0; idx < objPathRoot.children.length; idx++) {
            var objPath = objPathRoot.children[idx];
            var nodePath = new Node(objPath.name);
            nodePath.parent = nodePathRoot;
            nodePath.setPosition(objPath.pX, objPath.pY, objPath.pZ); //开始递归创建路径

            var start = this.createRoadPoint(objPath.path, nodePath);

            if (start) {
              this.path.push(start);
            }
          }

          this.triggerFinished('path');
        };

        _proto.createRoadPoint = function createRoadPoint(objPoint, parent) {
          if (!objPoint) {
            return null;
          }

          var nodeRoadPoint = new Node(objPoint.name);
          nodeRoadPoint.parent = parent;
          nodeRoadPoint.setPosition(objPoint.pX, objPoint.pY, objPoint.pZ);
          nodeRoadPoint.setScale(objPoint.sX, objPoint.sY, objPoint.sZ);
          nodeRoadPoint.eulerAngles = new Vec3(objPoint.rX, objPoint.rY, objPoint.rZ);
          var point = nodeRoadPoint.addComponent(roadPoint);
          point.type = objPoint.type;
          point.moveType = objPoint.moveType;
          point.clockwise = objPoint.clockwise;
          point.direction = objPoint.direction;
          point.delayTime = objPoint.delayTime;
          point.genInterval = objPoint.genInterval;
          point.carSpeed = objPoint.carSpeed;
          point.cars = objPoint.cars;

          if (point.type === fightConstants.ROAD_POINT_TYPE.PLATFORM) {
            this.levelProgressCnt++;
          }

          if (objPoint.next) {
            point.next = this.createRoadPoint(objPoint.next, parent);
          }

          return nodeRoadPoint;
        };

        _proto.triggerFinished = function triggerFinished(type) {
          console.log("build " + type + " finished!");
          var tips = '';

          switch (type) {
            case 'plane':
              tips = i18n.t('fightMap.trimTheGround');
              break;

            case 'road':
              tips = i18n.t('fightMap.pavingTheRoad');
              break;

            case 'tree':
              tips = i18n.t('fightMap.plantingTree');
              break;

            case 'house':
              tips = i18n.t('fightMap.decorateHouse');
              break;

            case 'sign':
              tips = i18n.t('fightMap.paintLandmarks');
              break;
          }

          if (tips) {
            clientEvent.dispatchEvent('updateLoading', 10, tips);
          }

          this.curProgress++;

          if (this._progressListener) {
            this._progressListener(this.curProgress, this.maxProgress);
          }

          if (this.curProgress >= this.maxProgress && this._completeListener) {
            this._completeListener();
          }
        };

        _proto.recycle = function recycle() {
          console.log('recycle map elements...');
          this.recycleModel('plane');
          this.recycleModel('road');
          this.recycleModel('tree');
          this.recycleModel('house');
          this.recycleModel('sign'); //路径属于空节点挂脚本，直接做清除操作

          this.node.removeAllChildren();
        };

        _proto.recycleModel = function recycleModel(type) {
          var nodeParent = this.node.getChildByName(type);

          if (!nodeParent) {
            return;
          }

          for (var idx = 0; idx < nodeParent.children.length; idx++) {
            var child = nodeParent.children[idx];
            poolManager.instance.putNode(child);
          }
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }
        ;

        return fightMap;
      }(Component), _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "path", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/LocalizedSprite.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './SpriteFrameSet.ts'], function (exports) {
  'use strict';

  var _defineProperty, _applyDecoratedDescriptor, _inheritsLoose, _assertThisInitialized, _initializerDefineProperty, cclegacy, _decorator, Sprite, error, Component, SpriteFrameSet;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _assertThisInitialized = module.assertThisInitialized;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Sprite = module.Sprite;
      error = module.error;
      Component = module.Component;
    }, function (module) {
      SpriteFrameSet = module.default;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _class3, _temp;

      cclegacy._RF.push({}, "28bd9xEMv1GKLbTuAi4B4dI", "LocalizedSprite", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var LocalizedSprite = exports('default', (_dec = ccclass("LocalizedSprite"), _dec2 = property({
        type: [SpriteFrameSet],
        displayOrder: 1
      }), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(LocalizedSprite, _Component);

        function LocalizedSprite() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _defineProperty(_assertThisInitialized(_this), "sprite", null);

          _initializerDefineProperty(_assertThisInitialized(_this), "spriteFrameSet", _descriptor, _assertThisInitialized(_this));

          return _this;
        }

        var _proto = LocalizedSprite.prototype;

        _proto.onLoad = function onLoad() {
          this.fetchRender();
        };

        _proto.fetchRender = function fetchRender() {
          var sprite = this.getComponent(Sprite);

          if (sprite) {
            this.sprite = sprite;
            this.updateSprite(window.i18nConfig.curLang);
            return;
          }
        };

        _proto.getSpriteFrameByLang = function getSpriteFrameByLang(lang) {
          for (var i = 0; i < this.spriteFrameSet.length; ++i) {
            if (this.spriteFrameSet[i].language === lang) {
              return this.spriteFrameSet[i].spriteFrame;
            }
          }
        };

        _proto.updateSprite = function updateSprite(language) {
          if (!this.sprite) {
            error('Failed to update localized sprite, sprite component is invalid!');
            return;
          }

          var spriteFrame = this.getSpriteFrameByLang(language);

          if (!spriteFrame && this.spriteFrameSet[0]) {
            spriteFrame = this.spriteFrameSet[0].spriteFrame;
          }

          if (spriteFrame) {
            this.sprite.spriteFrame = spriteFrame;
          }
        };

        return LocalizedSprite;
      }(Component), _defineProperty(_class3, "editor", {
        executeInEditMode: true,
        inspector: 'packages://i18n/inspector/localized-sprite.js',
        menu: 'i18n/LocalizedSprite'
      }), _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "spriteFrameSet", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/shopItem.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './clientEvent.ts', './resourceUtil.ts', './poolManager.ts', './playerData.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, _createClass, cclegacy, _decorator, Node, Sprite, Component, clientEvent, resourceUtil, poolManager, playerData;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Sprite = module.Sprite;
      Component = module.Component;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      resourceUtil = module.resourceUtil;
    }, function (module) {
      poolManager = module.poolManager;
    }, function (module) {
      playerData = module.playerData;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

      cclegacy._RF.push({}, "2b1f3615PZNnqYSDTVo5tI8", "shopItem", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var shopItem = exports('shopItem', (_dec = ccclass("shopItem"), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Sprite), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(shopItem, _Component);

        function shopItem() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeSelect", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeUsed", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeRedDot", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spCarIcon", _descriptor4, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "currentCar", null);

          _defineProperty(_assertThisInitialized(_this), "carInfo", {
            ID: 0,
            type: 0,
            num: 0,
            model: ''
          });

          return _this;
        }

        var _proto = shopItem.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.onEnable = function onEnable() {
          clientEvent.on('buyCar', this.refreshCarIcon, this);
          clientEvent.on('updateBuyTask', this.updateBuyTask, this);
        };

        _proto.onDisable = function onDisable() {
          clientEvent.off('buyCar', this.refreshCarIcon, this);
          clientEvent.off('updateBuyTask', this.updateBuyTask, this);
        };

        _proto.refreshCarIcon = function refreshCarIcon() {
          if (!this.carInfo) {
            return;
          }

          resourceUtil.setCarIcon(this.carInfo.model, this.spCarIcon, !playerData.instance.hasCar(this.carInfo.ID), function () {});
          this.updateBuyTask();
        };

        _proto.updateBuyTask = function updateBuyTask() {
          if (!playerData.instance.hasCar(this.carInfo.ID)) {
            var curProgress = playerData.instance.getBuyTypeProgress(this.carInfo.type);
            this.nodeRedDot.active = curProgress >= this.carInfo.num;
          } else {
            this.nodeRedDot.active = false;
          }
        };

        _proto.show = function show(carInfo) {
          var _this2 = this;

          this.carInfo = carInfo;
          this.select = false;
          this.nodeUsed.active = false;

          if (this.currentCar) {
            poolManager.instance.putNode(this.currentCar);
            this.currentCar = null;
          }

          if (!carInfo) {
            //空目录
            this.spCarIcon.node.active = false;
            return;
          }

          this.spCarIcon.node.active = true;
          this.refreshCarIcon();

          if (this.carInfo.ID === playerData.instance.getCurrentCar()) {
            this.scheduleOnce(function () {
              //选中一下
              _this2.onItemClick(false);
            }, 0);
          }
        };

        _proto.onItemClick = function onItemClick(isShowIntertitial) {
          if (!this.carInfo) {
            return;
          }

          var hasCar = playerData.instance.hasCar(this.carInfo.ID);
          clientEvent.dispatchEvent('onShopItemSelect', this.carInfo.ID, hasCar);
          this.select = true;

          if (hasCar) {
            this.used = true;
            playerData.instance.useCar(this.carInfo.ID);
            clientEvent.dispatchEvent('updateCar');
          }
        };

        _proto.updateUseState = function updateUseState() {
          this.used = this.carInfo.ID === playerData.instance.getCurrentCar();
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }
        ;

        _createClass(shopItem, [{
          key: "select",
          get: function get() {
            return this.nodeSelect.active;
          },
          set: function set(value) {
            this.nodeSelect.active = value;
          }
        }, {
          key: "used",
          get: function get() {
            return this.nodeUsed.active;
          },
          set: function set(value) {
            this.nodeUsed.active = value;
          }
        }]);

        return shopItem;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "nodeSelect", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "nodeUsed", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "nodeRedDot", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "spCarIcon", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/online.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './clientEvent.ts', './constant.ts', './util.ts', './playerData.ts', './uiManager.ts', './gameLogic.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Sprite, Label, Component, clientEvent, constant, util, playerData, uiManager, gameLogic;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Sprite = module.Sprite;
      Label = module.Label;
      Component = module.Component;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      util = module.util;
    }, function (module) {
      playerData = module.playerData;
    }, function (module) {
      uiManager = module.uiManager;
    }, function (module) {
      gameLogic = module.gameLogic;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "349acC5lWBNyZL7loxYm/uD", "online", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var online = exports('online', (_dec = ccclass("online"), _dec2 = property(Sprite), _dec3 = property(Sprite), _dec4 = property(Label), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(online, _Component);

        function online() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "spTimeProgress", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "perTimeProgress", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbGold", _descriptor3, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "currentTime", 0);

          _defineProperty(_assertThisInitialized(_this), "isOverflow", false);

          _defineProperty(_assertThisInitialized(_this), "currentGold", 0);

          return _this;
        }

        var _proto = online.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.onEnable = function onEnable() {
          //触发界面刷新
          this.refresh();
        };

        _proto.refresh = function refresh() {
          //每圈计时
          this.currentTime = 0;
          this.perTimeProgress.fillRange = 0;
          var lastTime = playerData.instance.getLastOnlineRewardTime();
          var offsetTime = Math.floor((playerData.instance.getCurrentTime() - lastTime) / 1000);
          offsetTime = offsetTime > 0 ? offsetTime : 0;
          offsetTime = offsetTime < constant.ONLINE.MAX_TIME ? offsetTime : constant.ONLINE.MAX_TIME;
          this.isOverflow = offsetTime === constant.ONLINE.MAX_TIME; //设置当前收益

          this.currentGold = Math.floor(offsetTime * constant.ONLINE.PROFIT_PER_SECOND);
          this.lbGold.string = util.formatMoney(this.currentGold); //进度条

          var percent = offsetTime / constant.ONLINE.MAX_TIME;
          percent = percent > 1 ? 1 : percent;
          this.spTimeProgress.fillRange = percent;
        };

        _proto.clear = function clear() {
          this.currentGold = 0;
          this.lbGold.string = '0';
          this.spTimeProgress.fillRange = 0;
          playerData.instance.updateLastOnlineRewardTime(this.currentTime);
          this.isOverflow = false;
        };

        _proto.onBtnOnlineClick = function onBtnOnlineClick() {
          var _this2 = this;

          if (this.currentGold <= 0) {
            return;
          }

          var pro = this.spTimeProgress.fillRange; //如果超过了50%要问是否要双倍，否则直接领取

          if (pro >= 0.5) {
            //显示弹窗
            uiManager.instance.showDialog('main/onlineDouble', [this.currentGold, function () {
              _this2.clear();
            }]);
          } else {
            // gameLogic.addGold(this.currentGold);
            playerData.instance.updatePlayerInfo('gold', this.currentGold); //播放特效
            //....

            gameLogic.showFlyReward(constant.REWARD_TYPE.GOLD, function () {
              clientEvent.dispatchEvent('updateGold');
            });
            this.clear();
          }
        };

        _proto.update = function update(deltaTime) {
          // Your update function goes here.
          if (!this.isOverflow) {
            this.currentTime += deltaTime;

            if (this.currentTime > constant.ONLINE.TIME_PER_CIRCLE) {
              this.refresh();
            } else {
              var progress = this.currentTime / constant.ONLINE.TIME_PER_CIRCLE;
              this.perTimeProgress.fillRange = progress;
            }
          }
        };

        return online;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "spTimeProgress", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "perTimeProgress", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lbGold", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/shopPage.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './localConfig.ts', './shopItem.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Prefab, instantiate, Component, localConfig, shopItem;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Prefab = module.Prefab;
      instantiate = module.instantiate;
      Component = module.Component;
    }, function (module) {
      localConfig = module.localConfig;
    }, function (module) {
      shopItem = module.shopItem;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "35980PVGZdO6o5scEE8kciy", "shopPage", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var MAX_PAGE_SIZE = 9; //一页最多9个

      var shopPage = exports('shopPage', (_dec = ccclass("shopPage"), _dec2 = property(Prefab), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(shopPage, _Component);

        function shopPage() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "pfShopItem", _descriptor, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "page", 0);

          return _this;
        }

        var _proto = shopPage.prototype; // objShopItems: any = {};

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.setPage = function setPage(iPage) {
          this.page = iPage;
        };

        _proto.show = function show() {
          var arrCars = localConfig.instance.getCars();
          var start = this.page * MAX_PAGE_SIZE;
          var end = (this.page + 1) * MAX_PAGE_SIZE;
          var idxCnt = 0;

          for (var idx = start; idx < end; idx++, idxCnt++) {
            var item = null;

            if (idxCnt < this.node.children.length) {
              item = this.node.children[idxCnt];
            } else {
              item = instantiate(this.pfShopItem);
              item.parent = this.node;
            }

            item.getComponent(shopItem).show(arrCars[idx]);
          }
        };

        _proto.unSelectAll = function unSelectAll() {
          this.node.children.forEach(function (nodeItem) {
            nodeItem.getComponent(shopItem).select = false;
          });
        };

        _proto.unUseAll = function unUseAll() {
          this.node.children.forEach(function (nodeItem) {
            nodeItem.getComponent(shopItem).used = false;
          });
        };

        _proto.refreshUse = function refreshUse(carId) {
          this.node.children.forEach(function (nodeItem) {
            var item = nodeItem.getComponent(shopItem);

            if (item.carInfo.ID === carId) {
              item.onItemClick();
            }
          });
        };

        return shopPage;
      }(Component), _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "pfShopItem", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/zh.ts", ['cc'], function () {
  'use strict';

  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "3c2acsRBE9KO4h4sGTiBlRL", "zh", undefined);

      if (!window.i18nConfig) window.i18nConfig = {};
      if (!window.i18nConfig.languages) window.i18nConfig.languages = {};
      window.i18nConfig.languages.zh = {
        // write your key value pairs here
        //注意是改那些需要展示给用户看的
        // "start": {
        //     "startGame": "开始游戏"
        // },
        // "main": {
        //     "%{value}/s": "%{value}/每秒",
        //     "free": "免费"
        // },
        // "signReward": {
        //     "你已经连续签到%{value}天，继续保持": "你已经连续签到 %{value} 天，继续保持",
        //     "diamondsNum": "钻石数量x2",
        // },
        // "button": {
        //     "normalReceive": "<u><color=#ffffff>普通领取</color></u>",
        //     "receive": "领取",
        //     "directCollection": "<u><color=#ffffff>直接领取</color></u>",
        //     "doubleReceive": "双倍领取",
        //     "noUpdate": "<u><color=#ffffff>不升级</color></u>",
        //     "giveUpReward": "<u><color=#ffffff>放弃奖励</color></u>"
        // },
        "main": {
          "dataLoading": "数据加载中...",
          "dataLoadOver": "数据加载完成...",
          "loginSuccess": "登录成功...",
          "gameResourceLoading": "游戏资源加载中...",
          "audioResourceLoading": "音效资源加载中...",
          "mappingResourceLoading": "贴图资源加载中...",
          "modelResourceLoading": "模型资源加载中...",
          "entering": "正在进入..."
        },
        "mainUI": {
          "start": "点击屏幕开始",
          "changeCar": "换车"
        },
        "shop": {
          "btnClose": "关闭",
          "go": "前往",
          "acquired": "已获得",
          "current": "当前",
          "receive": "领取",
          "getGold": "看广告可获取金币"
        },
        "balance": {
          "你完成了%{value}个订单": "你完成了%{value}个订单",
          "youEarnedIt": "你赚到了",
          "clickReceive": "点击领取",
          "receiveImmediately": "立即领取"
        },
        "carTask": {
          "初始车辆": "初始车辆",
          "分享获得": "分享获得",
          "签到获得": "签到获得",
          "通过关卡获得": "通过关卡获得"
        },
        "signin": {
          "title": "七日登录",
          "notYet": "暂不领取",
          "normalReceive": "普通领取",
          "receive": "领取",
          "doubleReceive": "双倍领取",
          "fillSignin": "补签"
        },
        "fightManager": {
          "loadingMap": "正在加载地图...",
          "buildingCity": "开始建造城市...",
          "cityLoadOver": "城市加载完毕..."
        },
        "fightMap": {
          "trimTheGround": "正在修整地面...",
          "pavingTheRoad": "正在铺路中...",
          "plantingTree": "正在栽树中...",
          "decorateHouse": "正在装修房屋中...",
          "paintLandmarks": "正在粉刷地标中..."
        },
        "online": {
          "close": "关闭",
          "clickReceive": "点击领取",
          "dailyIncome": "日常收益可领取"
        },
        "lottery": {
          "title": "幸运大转盘",
          "free": "免费"
        },
        "talk": {
          "你好,请到街对面接我.": "你好,请到街对面接我.",
          "停车!停车!": "停车!停车!",
          "去消费最高的地方.": "去消费最高的地方.",
          "去附近的希尔顿酒店.": "去附近的希尔顿酒店.",
          "司机快来!我老婆要生了!": "司机快来!我老婆要生了!",
          "大哥快点,我赶时间.": "大哥快点,我赶时间.",
          "师傅,5分钟内能到吗?": "师傅,5分钟内能到吗?",
          "师傅,你是老司机嘛?": "师傅,你是老司机嘛?",
          "师傅,你跑一天能赚多少?": "师傅,你跑一天能赚多少?",
          "师傅快点,我要赶飞机.": "师傅快点,我要赶飞机.",
          "师傅跟上那辆法拉利.": "师傅跟上那辆法拉利.",
          "带我去最近的银行.": "带我去最近的银行.",
          "帮我跟上前面那辆车!": "帮我跟上前面那辆车!",
          "快去火车站,我赶车!": "快去火车站,我赶车!",
          "我在酒店大堂门口等你.": "我在酒店大堂门口等你.",
          "要下雨了,你快来!": "要下雨了,你快来!"
        },
        "showReward": {
          "title": "奖励",
          "normalReceive": "普通领取",
          "ReceiveImmediately": " 立即领取",
          "doubleReceive": "双倍领取",
          "alreadyHadCar": "您已拥有该车辆，自动转成对应金币",
          "buySuccessful": "购买成功",
          "confrim": "确认",
          "signinReward": "签到奖励"
        },
        "revive": {
          "reviveImmediately": "立即复活",
          "skip": "跳过",
          "tips": "真可惜，只差一点就到终点了!",
          "continue": "复活继续"
        },
        "clickBox": {
          "title": "神秘大礼",
          "progress": "点击越快奖励越多",
          "clickMe": "快点我",
          "normalReceive": "普通领取",
          "doubleReceive": "双倍领取"
        },
        "trial": {
          "title": "免费试用",
          "tryItNow": "立即试用",
          "giveUp": "放弃试用, 开始游戏"
        },
        "invinceible": {
          "title": "无敌开局",
          "confirm": "确认",
          "close": "关闭"
        },
        "setting": {
          "title": "设置",
          "version": "版本号:",
          "close": "关闭"
        }
      };

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/updateValueLabel.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _inheritsLoose, _defineProperty, _assertThisInitialized, cclegacy, _decorator, Label, Component;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _defineProperty = module.defineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _temp;

      cclegacy._RF.push({}, "4b7cfRS5bdP8qo8rorNgln5", "updateValueLabel", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property,
          requireComponent = _decorator.requireComponent;
      var updateValueLabel = exports('updateValueLabel', (_dec = ccclass("updateValueLabel"), _dec2 = requireComponent(Label), _dec(_class = _dec2(_class = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(updateValueLabel, _Component);

        function updateValueLabel() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _defineProperty(_assertThisInitialized(_this), "isPlaying", false);

          _defineProperty(_assertThisInitialized(_this), "startVal", 0);

          _defineProperty(_assertThisInitialized(_this), "endVal", 0);

          _defineProperty(_assertThisInitialized(_this), "diffVal", 0);

          _defineProperty(_assertThisInitialized(_this), "currTime", 0);

          _defineProperty(_assertThisInitialized(_this), "changingTime", 0);

          _defineProperty(_assertThisInitialized(_this), "label", null);

          return _this;
        }

        var _proto = updateValueLabel.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.playUpdateValue = function playUpdateValue(startVal, endVal, changingTime) {
          this.startVal = startVal;
          this.endVal = endVal;
          this.diffVal = this.endVal - this.startVal;
          this.currTime = 0;
          this.changingTime = changingTime;
          this.label = this.node.getComponent(Label);
          this.label.string = startVal.toString();
          this.isPlaying = true;
        };

        _proto.update = function update(dt) {
          if (!this.isPlaying) {
            return;
          }

          if (this.currTime < this.changingTime) {
            this.currTime += dt;
            var currVal = this.startVal + parseInt((this.currTime / this.changingTime * this.diffVal).toString());

            if (currVal < this.startVal) {
              currVal = this.startVal;
            } else if (currVal > this.endVal) {
              currVal = this.endVal;
            }

            this.label.string = "" + currVal;
            return;
          }

          this.label.string = "" + this.endVal;
          this.isPlaying = false;
        } // update (deltaTime) {
        //     // Your update function goes here.
        // }
        ;

        return updateValueLabel;
      }(Component), _temp)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/setting.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './configuration.ts', './audioManager.ts', './localConfig.ts', './uiManager.ts', './gameLogic.ts', './LanguageData.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Sprite, SpriteFrame, Label, Component, configuration, audioManager, localConfig, uiManager, gameLogic, i18n;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Sprite = module.Sprite;
      SpriteFrame = module.SpriteFrame;
      Label = module.Label;
      Component = module.Component;
    }, function (module) {
      configuration = module.configuration;
    }, function (module) {
      audioManager = module.audioManager;
    }, function (module) {
      localConfig = module.localConfig;
    }, function (module) {
      uiManager = module.uiManager;
    }, function (module) {
      gameLogic = module.gameLogic;
    }, function (module) {
      i18n = module.i18n;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

      cclegacy._RF.push({}, "501ddLP5JZNPaa02x+rFKAH", "setting", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var setting = exports('setting', (_dec = ccclass("setting"), _dec2 = property(Sprite), _dec3 = property(Sprite), _dec4 = property(SpriteFrame), _dec5 = property(SpriteFrame), _dec6 = property(Label), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(setting, _Component);

        function setting() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "spVibrateSwitch", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spSoundSwitch", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "imgSwitchOpen", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "imgSwitchClose", _descriptor4, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbVersion", _descriptor5, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "isSoundOpen", void 0);

          _defineProperty(_assertThisInitialized(_this), "isVibrateOpen", void 0);

          _defineProperty(_assertThisInitialized(_this), "clickTimes", 0);

          return _this;
        } //展示次数


        setting.checkState = function checkState() {
          var data = audioManager.instance.getConfiguration(true);

          if (!data) {
            audioManager.instance.closeMusic();
            audioManager.instance.closeSound();
          } else {
            audioManager.instance.openMusic();
            audioManager.instance.openSound();
          }
        };

        var _proto = setting.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.show = function show() {
          this.clickTimes += 1;
          this.lbVersion.string = i18n.t("setting.version") + " " + localConfig.instance.getVersion();
          this.isSoundOpen = audioManager.instance.getConfiguration(true);
          this.isVibrateOpen = gameLogic.isVibrateOpen();
          this.refreshSwitchUI();
        };

        _proto.refreshSwitchUI = function refreshSwitchUI() {
          if (this.isVibrateOpen) {
            this.spVibrateSwitch.spriteFrame = this.imgSwitchOpen;
          } else {
            this.spVibrateSwitch.spriteFrame = this.imgSwitchClose;
          }

          if (this.isSoundOpen) {
            this.spSoundSwitch.spriteFrame = this.imgSwitchOpen;
          } else {
            this.spSoundSwitch.spriteFrame = this.imgSwitchClose;
          }
        };

        _proto.onBtnVibrateClick = function onBtnVibrateClick() {// this.isVibrateOpen = !this.isVibrateOpen;
          // configuration.instance.setGlobalData('vibrate', this.isVibrateOpen);
          // this.refreshSwitchUI();
        };

        _proto.onBtnSoundClick = function onBtnSoundClick() {
          this.isSoundOpen = !this.isSoundOpen;

          if (!this.isSoundOpen) {
            audioManager.instance.closeMusic();
            audioManager.instance.closeSound();
          } else {
            audioManager.instance.openMusic();
            audioManager.instance.openSound();
          }

          configuration.instance.setGlobalData('music', "" + this.isSoundOpen);
          this.refreshSwitchUI();
        };

        _proto.onBtnCloseClick = function onBtnCloseClick() {
          uiManager.instance.hideDialog('main/setting');
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }
        ;

        return setting;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "spVibrateSwitch", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "spSoundSwitch", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "imgSwitchOpen", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "imgSwitchClose", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "lbVersion", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/customerManager.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './fightConstants.ts', './clientEvent.ts', './resourceUtil.ts', './audioManager.ts', './constant.ts', './poolManager.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Vec3, Animation, isValid, Component, fightConstants, clientEvent, resourceUtil, audioManager, constant, poolManager;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Vec3 = module.Vec3;
      Animation = module.Animation;
      isValid = module.isValid;
      Component = module.Component;
    }, function (module) {
      fightConstants = module.fightConstants;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      resourceUtil = module.resourceUtil;
    }, function (module) {
      audioManager = module.audioManager;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      poolManager = module.poolManager;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "586a8tdaBhPQprl2rcvzztA", "customerManager", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var customerManager = exports('customerManager', (_dec = ccclass("customerManager"), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(customerManager, _Component);

        function customerManager() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "moveSpeed", _descriptor, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "nodeCustomer", null);

          _defineProperty(_assertThisInitialized(_this), "_targetPos", null);

          _defineProperty(_assertThisInitialized(_this), "_callback", undefined);

          _defineProperty(_assertThisInitialized(_this), "_offset", null);

          _defineProperty(_assertThisInitialized(_this), "customerId", -1);

          _defineProperty(_assertThisInitialized(_this), "retryTimes", 0);

          return _this;
        }

        var _proto = customerManager.prototype;

        _proto.start = function start() {// Your initialization goes here.
        }
        /**
         * 触发新订单
         *
         * @memberof customerManager
         */
        ;

        _proto.newOrder = function newOrder() {
          //随机个乘客给他
          this.customerId = Math.floor(Math.random() * constant.CUSTOMER_MAX_CNT) + 1;
          clientEvent.dispatchEvent('showTalk', this.customerId, fightConstants.CUSTOMER_TALK_TIME.NEW_ORDER);
        }
        /**
         * 接客
         * @param {Vec3} carWorldPos 车辆当前位置
         * @param direction 乘客的方向
         * @param callback 乘客上车后的回调函数
         */
        ;

        _proto.greeting = function greeting(carWorldPos, direction, callback) {
          var _this2 = this;

          if (this.customerId === -1) {
            //还没有产生过乘客
            //随机个乘客给他
            this.customerId = Math.floor(Math.random() * constant.CUSTOMER_MAX_CNT) + 1;
          } //使用订单时产生的乘客


          if (this.nodeCustomer) {
            poolManager.instance.putNode(this.nodeCustomer);
            this.nodeCustomer = null;
          }

          resourceUtil.getCustomer(this.customerId.toString(), function (err, prefab) {
            if (err) {
              console.error(err); //尝试重新加载一次

              if (_this2.retryTimes < 3) {
                _this2.greeting(carWorldPos, direction, callback);
              }

              return;
            }

            _this2.retryTimes = 0;
            _this2.nodeCustomer = poolManager.instance.getNode(prefab, _this2.node);
            _this2.nodeCustomer.active = true; // direction = new Vec3(direction.x, direction.y, direction.z);

            var tmpVec3 = new Vec3();
            Vec3.multiplyScalar(tmpVec3, direction, 1.3);
            Vec3.add(tmpVec3, carWorldPos, tmpVec3);
            var customerPos = tmpVec3.clone();
            Vec3.multiplyScalar(tmpVec3, direction, 0.25);
            Vec3.add(tmpVec3, carWorldPos, tmpVec3);
            var targetPos = tmpVec3.clone();

            _this2.nodeCustomer.setWorldPosition(customerPos);

            if (direction.x !== 0) {
              if (direction.x > 0) {
                _this2.nodeCustomer.eulerAngles = new Vec3(0, 270, 0);
              } else {
                _this2.nodeCustomer.eulerAngles = new Vec3(0, 90, 0);
              }
            } else {
              if (direction.z > 0) {
                _this2.nodeCustomer.eulerAngles = new Vec3(0, 180, 0);
              } else {
                _this2.nodeCustomer.eulerAngles = new Vec3(0, 0, 0);
              }
            }

            audioManager.instance.playSound(constant.AUDIO_SOUND.NEW_ORDER);

            _this2.customerMove(targetPos, function () {
              audioManager.instance.playSound(constant.AUDIO_SOUND.IN_CAR); //接完客后

              callback && callback(); //触发乘客问候

              _this2.scheduleOnce(function () {
                clientEvent.dispatchEvent('showTalk', _this2.customerId, fightConstants.CUSTOMER_TALK_TIME.INTO_THE_CAR);
              }, 1);
            });
          });
        }
        /**
         * 送客
         * @param carWorldPos 车辆当前位置
         * @param direction 乘客前往的方向
         * @param isLastCustomer 是否最后一位乘客
         * @param callback 乘客上车后的回调函数
         */
        ;

        _proto.takeCustomer = function takeCustomer(carWorldPos, direction, isLastCustomer, callback) {
          var _this3 = this;

          if (!this.nodeCustomer) {
            //没有顾客可能有异常直接过
            if (callback) {
              callback();
            }

            return;
          }

          direction = new Vec3(direction.x, direction.y, direction.z);
          var tmpVec3 = new Vec3();
          Vec3.multiplyScalar(tmpVec3, direction, 0.25);
          Vec3.add(tmpVec3, carWorldPos, tmpVec3);
          var posCur = tmpVec3.clone();
          this.nodeCustomer.active = true;
          this.nodeCustomer.setWorldPosition(posCur);

          if (direction.x !== 0) {
            if (direction.x > 0) {
              this.nodeCustomer.eulerAngles = new Vec3(0, 90, 0);
            } else {
              this.nodeCustomer.eulerAngles = new Vec3(0, 270, 0);
            }
          } else {
            if (direction.z > 0) {
              this.nodeCustomer.eulerAngles = new Vec3(0, 0, 0);
            } else {
              this.nodeCustomer.eulerAngles = new Vec3(0, 180, 0);
            }
          }

          Vec3.multiplyScalar(tmpVec3, direction, 1.3);
          Vec3.add(tmpVec3, carWorldPos, tmpVec3);
          var targetPos = tmpVec3.clone();
          audioManager.instance.playSound(constant.AUDIO_SOUND.GET_MONEY);
          this.customerMove(targetPos, function () {
            //送完客后
            if (callback) {
              callback();
            } //2秒后触发新订单
            //需要检测是否已经结束


            if (!isLastCustomer) {
              //触发新订单
              _this3.scheduleOnce(function () {
                _this3.newOrder();
              }, 2);
            }
          });
        };

        _proto.customerMove = function customerMove(targetPos, callback) {
          this._targetPos = targetPos;
          this._callback = callback;
          var ani = this.nodeCustomer.getComponent(Animation);
          ani.play('walk');
          this._offset = Vec3.subtract(new Vec3(), this._targetPos, this.nodeCustomer.worldPosition);

          this._offset.multiplyScalar(this.moveSpeed);
        };

        _proto.update = function update(deltaTime) {
          // Your update function goes here.
          if (this._targetPos && this.nodeCustomer) {
            var posWorld = this.nodeCustomer.getWorldPosition();
            var offset = new Vec3();
            Vec3.multiplyScalar(offset, this._offset, deltaTime);
            posWorld.add(offset);

            if (Vec3.subtract(offset, posWorld, this._targetPos).lengthSqr() < 0.01) {
              //到达目标
              this.onMoveOver();
            } else {
              this.nodeCustomer.setWorldPosition(posWorld);
            }
          }
        };

        _proto.onMoveOver = function onMoveOver() {
          this.nodeCustomer.setWorldPosition(this._targetPos);
          this.nodeCustomer.active = false;
          this._targetPos = null;
          this._callback && this._callback();
        };

        _proto.reset = function reset() {
          if (this.nodeCustomer && isValid(this.nodeCustomer)) {
            var ani = this.nodeCustomer.getComponent(Animation); // ani.stop();

            ani.getState('walk').stop();
            this.nodeCustomer.destroy();
            this.nodeCustomer = null;
          }

          this.customerId = -1;
        };

        return customerManager;
      }(Component), _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/clientEvent.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './oneToMultiListener.ts'], function (exports) {
  'use strict';

  var _defineProperty, _inheritsLoose, cclegacy, _decorator, oneToMultiListener;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      oneToMultiListener = module.oneToMultiListener;
    }],
    execute: function () {
      var _dec, _class, _class2, _temp;

      cclegacy._RF.push({}, "5a305zVBk5GUIdzJLbOwV+H", "clientEvent", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var clientEvent = exports('clientEvent', (_dec = ccclass("clientEvent"), _dec(_class = (_temp = _class2 = /*#__PURE__*/function (_oneToMultiListener) {
        _inheritsLoose(clientEvent, _oneToMultiListener);

        function clientEvent() {
          return _oneToMultiListener.apply(this, arguments) || this;
        }

        return clientEvent;
      }(oneToMultiListener), _defineProperty(_class2, "handlers", {}), _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/onlineDouble.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './clientEvent.ts', './constant.ts', './util.ts', './playerData.ts', './uiManager.ts', './gameLogic.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _defineProperty, _assertThisInitialized, _initializerDefineProperty, cclegacy, _decorator, Label, Sprite, Component, clientEvent, constant, util, playerData, uiManager, gameLogic;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _defineProperty = module.defineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
      Sprite = module.Sprite;
      Component = module.Component;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      util = module.util;
    }, function (module) {
      playerData = module.playerData;
    }, function (module) {
      uiManager = module.uiManager;
    }, function (module) {
      gameLogic = module.gameLogic;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "5b356wyJ3BCYZpADXUOyafo", "onlineDouble", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var onlineDouble = exports('onlineDouble', (_dec = ccclass("onlineDouble"), _dec2 = property(Label), _dec3 = property(Label), _dec4 = property(Sprite), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(onlineDouble, _Component);

        function onlineDouble() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _defineProperty(_assertThisInitialized(_this), "rewardMoney", 0);

          _defineProperty(_assertThisInitialized(_this), "overCallback", null);

          _initializerDefineProperty(_assertThisInitialized(_this), "lbGoldNormal", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbGoldMulti", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spIcon", _descriptor3, _assertThisInitialized(_this));

          return _this;
        }

        var _proto = onlineDouble.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.show = function show(money, cb) {
          this.rewardMoney = money;
          this.overCallback = cb;
          this.lbGoldNormal.string = util.formatMoney(money);
          this.lbGoldMulti.string = util.formatMoney(money * 3);
          gameLogic.updateRewardIcon(constant.SHARE_FUNCTION.ONLINE, this.spIcon);
        };

        _proto.onBtnGetNormalClick = function onBtnGetNormalClick() {
          //普通领取
          this.rewardOver(this.rewardMoney);
        };

        _proto.onBtnGetMultiClick = function onBtnGetMultiClick() {
          var _this2 = this; //3倍领取


          gameLogic.openReward(constant.SHARE_FUNCTION.ONLINE, function (err) {
            if (!err) {
              _this2.rewardOver(_this2.rewardMoney * 3);
            }
          });
        };

        _proto.rewardOver = function rewardOver(money) {
          // gameLogic.addGold(money);
          //TODO 触发特效
          playerData.instance.updatePlayerInfo('gold', money);
          uiManager.instance.hideDialog('main/onlineDouble');
          gameLogic.showFlyReward(constant.REWARD_TYPE.GOLD, function () {
            clientEvent.dispatchEvent('updateGold');
          });

          if (this.overCallback) {
            this.overCallback();
          }
        };

        _proto.onBtnCloseClick = function onBtnCloseClick() {
          uiManager.instance.hideDialog('main/onlineDouble');
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }
        ;

        return onlineDouble;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "lbGoldNormal", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "lbGoldMulti", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "spIcon", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/trial.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './clientEvent.ts', './resourceUtil.ts', './constant.ts', './poolManager.ts', './localConfig.ts', './playerData.ts', './uiManager.ts', './gameLogic.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Node, Widget, Sprite, Vec3, Component, clientEvent, resourceUtil, constant, poolManager, localConfig, playerData, uiManager, gameLogic;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Widget = module.Widget;
      Sprite = module.Sprite;
      Vec3 = module.Vec3;
      Component = module.Component;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      resourceUtil = module.resourceUtil;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      poolManager = module.poolManager;
    }, function (module) {
      localConfig = module.localConfig;
    }, function (module) {
      playerData = module.playerData;
    }, function (module) {
      uiManager = module.uiManager;
    }, function (module) {
      gameLogic = module.gameLogic;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "5bf756By5JOmoKbG0aoUzq6", "trial", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var trial = exports('trial', (_dec = ccclass("trial"), _dec2 = property(Node), _dec3 = property(Widget), _dec4 = property(Sprite), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(trial, _Component);

        function trial() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeCarParent", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "wgMenu", _descriptor2, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "currentCar", null);

          _defineProperty(_assertThisInitialized(_this), "carDegree", 0);

          _defineProperty(_assertThisInitialized(_this), "rotateSpeed", 30);

          _defineProperty(_assertThisInitialized(_this), "carId", 0);

          _initializerDefineProperty(_assertThisInitialized(_this), "spIcon", _descriptor3, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "_callback", undefined);

          return _this;
        }

        var _proto = trial.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.show = function show(callback) {
          var _this2 = this;

          this._callback = callback;
          gameLogic.updateRewardIcon(constant.SHARE_FUNCTION.TRIAL, this.spIcon);

          if (this.currentCar) {
            poolManager.instance.putNode(this.currentCar);
            this.currentCar = null;
          } //随机辆未拥有的车


          var arrCars = localConfig.instance.getCars(); //获得所有车

          var arrLottery = [];
          arrCars.forEach(function (element) {
            if (!playerData.instance.hasCar(element.ID)) {
              //未拥有的车辆，加入抽奖列表
              arrLottery.push(element.ID);
            }
          });

          if (arrLottery.length <= 0) {
            //已经拥有全部车辆
            this.onBtnCloseClick();
            return;
          }

          var rand = Math.floor(Math.random() * arrLottery.length);
          this.carId = arrLottery[rand];
          var carInfo = localConfig.instance.queryByID('car', this.carId.toString());
          resourceUtil.getUICar(carInfo.model, function (err, prefab) {
            if (err) {
              console.error(err, carInfo.model);
              return;
            }

            _this2.carDegree = 0;
            _this2.currentCar = poolManager.instance.getNode(prefab, _this2.nodeCarParent);
          });
        };

        _proto.onBtnCloseClick = function onBtnCloseClick() {
          uiManager.instance.hideDialog('main/trial');
          this._callback && this._callback();
        };

        _proto.onBtnTrialClick = function onBtnTrialClick() {
          var _this3 = this;

          gameLogic.openReward(constant.SHARE_FUNCTION.TRIAL, function (err, type) {
            if (err) {
              return;
            }

            playerData.instance.showCar = _this3.carId;
            clientEvent.dispatchEvent('updateCar');

            _this3.onBtnCloseClick();
          });
        };

        _proto.update = function update(deltaTime) {
          //旋转展示车辆
          if (this.currentCar) {
            this.carDegree -= deltaTime * this.rotateSpeed;

            if (this.carDegree <= -360) {
              this.carDegree += 360;
            }

            this.currentCar.eulerAngles = new Vec3(0, this.carDegree, 0);
          }
        };

        return trial;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "nodeCarParent", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "wgMenu", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "spIcon", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/tips.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './poolManager.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Label, Vec3, UITransform, isValid, tween, Component, poolManager;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
      Vec3 = module.Vec3;
      UITransform = module.UITransform;
      isValid = module.isValid;
      tween = module.tween;
      Component = module.Component;
    }, function (module) {
      poolManager = module.poolManager;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "60f49uw4/dA4rGh/C738U1T", "tips", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var tips = exports('tips', (_dec = ccclass('tips'), _dec2 = property(Label), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(tips, _Component);

        function tips() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "lbTips", _descriptor, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "targetPos", void 0);

          return _this;
        }

        var _proto = tips.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.show = function show(content, callback) {
          var _this2 = this;

          this.targetPos = new Vec3(0, 200, 0);
          this.node.setPosition(this.targetPos); // this.node.getComponent(Sprite).color = new Color(255, 255, 255, 255);
          // this.lbTips.maxWidth = 0;
          // this.lbTips.string = '<color=#001D34>'+ content +'</color>';
          // //修改底图大小
          // let width = this.lbTips._linesWidth;
          // if (width.length && width[0] < 500) {
          //     this.lbTips.maxWidth = width[0];
          // } else {
          //     this.lbTips.maxWidth = 500;
          //     this.lbTips.node.setContentSize(500, this.lbTips.node.getContentSize().height);
          // }

          this.lbTips.string = content;
          var lbTipTrans = this.lbTips.node.getComponent(UITransform);
          var size = lbTipTrans.contentSize;

          if (!isValid(size)) {
            //size不存在，自我销毁
            // tipsNode.destroy();
            poolManager.instance.putNode(this.node);
            return;
          }

          var uiTrans = this.node.getComponent(UITransform);
          uiTrans.setContentSize(size.width + 100 < 240 ? 240 : size.width + 100, size.height + 30);
          this.scheduleOnce(function () {
            tween(_this2.targetPos).by(0.8, new Vec3(0, 150, 0)).call(function () {
              callback && callback();
              poolManager.instance.putNode(_this2.node);
            }).start();
          }, 0.8);
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }
        ;

        return tips;
      }(Component), _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "lbTips", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/flyRewardItem.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _inheritsLoose, _defineProperty, _assertThisInitialized, cclegacy, _decorator, Vec3, Sprite, tween, Component;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _defineProperty = module.defineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Vec3 = module.Vec3;
      Sprite = module.Sprite;
      tween = module.tween;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class, _temp;

      cclegacy._RF.push({}, "62dd66o/TBEyqhX8gZkE8/G", "flyRewardItem", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var flyRewardItem = exports('flyRewardItem', (_dec = ccclass("flyRewardItem"), _dec(_class = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(flyRewardItem, _Component);

        function flyRewardItem() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _defineProperty(_assertThisInitialized(_this), "targetPos", new Vec3());

          _defineProperty(_assertThisInitialized(_this), "targetRotation", new Vec3(0, 0, 0));

          _defineProperty(_assertThisInitialized(_this), "targetScale", new Vec3(1, 1, 1));

          _defineProperty(_assertThisInitialized(_this), "posLast", new Vec3());

          _defineProperty(_assertThisInitialized(_this), "_callback", null);

          return _this;
        }

        var _proto = flyRewardItem.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.show = function show(imgItem, posLast, callback) {
          var _this2 = this;

          this.posLast.set(posLast);
          this._callback = callback;
          var sprite = this.node.addComponent(Sprite);
          sprite.trim = false;
          sprite.sizeMode = Sprite.SizeMode.RAW;
          sprite.spriteFrame = imgItem;
          this.node.eulerAngles = new Vec3(0, 0, Math.floor(Math.random() * 360));
          this.targetRotation = new Vec3(this.node.eulerAngles); //每个去配个动作
          // let randDegree = Math.floor(Math.random()*360);

          var randTargetPos = new Vec3(Math.floor(Math.random() * 300) - 150, Math.floor(Math.random() * 300) - 150, 0);
          var costTime = Vec3.distance(randTargetPos, new Vec3(0, 0, 0)) / 400;
          tween(this.targetPos) //    .to(costTime, randTargetPos, {easing: 'Circular-InOut'})
          .to(costTime, randTargetPos, {
            easing: 'cubicInOut'
          }).start();
          var randRotation = 120 + Math.floor(Math.random() * 60);
          randRotation = this.targetRotation.z + Math.floor(Math.random() * 2) === 1 ? randRotation : -randRotation;
          tween(this.targetRotation).to(costTime, new Vec3(0, 0, randRotation)).start();
          tween(this.targetScale).to(costTime * 2 / 3, new Vec3(1.4, 1.4, 1.4)).to(costTime / 3, new Vec3(1, 1, 1)).call(function () {
            _this2.move2Target();
          }).start();
        };

        _proto.move2Target = function move2Target() {
          var _this3 = this;

          var move2TargetTime = Vec3.distance(this.node.position, this.posLast) / 1500;
          var delayTime = Math.floor(Math.random() * 10) / 10; //0~1s

          tween(this.targetScale).to(0.3, new Vec3(1.4, 1.4, 1.4)).to(0.7, new Vec3(1, 1, 1)).union().repeat(50).start();
          this.scheduleOnce(function () {
            tween(_this3.targetPos).to(move2TargetTime, _this3.posLast).call(function () {
              //飞行结束
              _this3._callback && _this3._callback(_this3.node);
            }).start();
          }, delayTime);
        };

        _proto.update = function update(deltaTime) {
          // Your update function goes here.
          this.node.position = this.targetPos;
          this.node.eulerAngles = this.targetRotation;
          this.node.setScale(this.targetScale);
        };

        return flyRewardItem;
      }(Component), _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/csvManager.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class, _temp;

      cclegacy._RF.push({}, "64d5aR01mZIArZ14oqSxdz0", "csvManager", undefined);

      var ccclass = _decorator.ccclass;
      var CELL_DELIMITERS = [",", ";", "\t", "|", "^"];
      var LINE_DELIMITERS = ["\r\n", "\r", "\n"];

      var getterCast = function getterCast(value, index, cast, d) {
        if (cast instanceof Array) {
          if (cast[index] === "number") {
            return Number(d[index]);
          } else if (cast[index] === "boolean") {
            return d[index] === "true" || d[index] === "t" || d[index] === "1";
          } else {
            return d[index];
          }
        } else {
          if (!isNaN(Number(value))) {
            return Number(d[index]);
          } else if (value == "false" || value == "true" || value == "t" || value == "f") {
            return d[index] === "true" || d[index] === "t" || d[index] === "1";
          } else {
            return d[index];
          }
        }
      };

      var CSV = {
        //

        /* =========================================
            * Constants ===============================
            * ========================================= */
        STANDARD_DECODE_OPTS: {
          skip: 0,
          limit: false,
          header: false,
          cast: false,
          comment: ""
        },
        STANDARD_ENCODE_OPTS: {
          delimiter: CELL_DELIMITERS[0],
          newline: LINE_DELIMITERS[0],
          skip: 0,
          limit: false,
          header: false
        },
        quoteMark: '"',
        doubleQuoteMark: '""',
        quoteRegex: /"/g,
        opts: {},

        /* =========================================
            * Utility Functions =======================
            * ========================================= */
        assign: function assign() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var params = Array.prototype.slice.call(arguments);
          var base = args[0];
          var rest = args.slice(1);

          for (var i = 0, len = rest.length; i < len; i++) {
            for (var attr in rest[i]) {
              base[attr] = rest[i][attr];
            }
          }

          return base;
        },
        map: function map(collection, fn) {
          var results = [];

          for (var i = 0, len = collection.length; i < len; i++) {
            results[i] = fn(collection[i], i);
          }

          return results;
        },
        getType: function getType(obj) {
          return Object.prototype.toString.call(obj).slice(8, -1);
        },
        getLimit: function getLimit(limit, len) {
          return limit === false ? len : 1;
        },
        buildObjectConstructor: function buildObjectConstructor(fields, sample, cast) {
          return function (d) {
            var object = {};

            var setter = function setter(attr, value) {
              return object[attr] = value;
            };

            if (cast) {
              fields.forEach(function (attr, idx) {
                setter(attr, getterCast(sample[idx], idx, cast, d));
              });
            } else {
              fields.forEach(function (attr, idx) {
                setter(attr, getterCast(sample[idx], idx, null, d));
              });
            } // body.push("return object;");
            // body.join(";\n");


            return object;
          };
        },
        buildArrayConstructor: function buildArrayConstructor(fields, sample, cast) {
          return function (d) {
            var row = new Array(sample.length);

            var setter = function setter(idx, value) {
              return row[idx] = value;
            };

            if (cast) {
              fields.forEach(function (attr, idx) {
                setter(attr, getterCast(sample[idx], idx, cast, d));
              });
            } else {
              fields.forEach(function (attr, idx) {
                setter(attr, getterCast(sample[idx], idx, null, d));
              });
            }

            return row;
          };
        },
        frequency: function frequency(coll, needle, limit) {
          if (limit === void 0) limit = false;
          var count = 0;
          var lastIndex = 0;
          var maxIndex = this.getLimit(limit, coll.length);

          while (lastIndex < maxIndex) {
            lastIndex = coll.indexOf(needle, lastIndex);
            if (lastIndex === -1) break;
            lastIndex += 1;
            count++;
          }

          return count;
        },
        mostFrequent: function mostFrequent(coll, needles, limit) {
          var max = 0;
          var detected = '';

          for (var cur = needles.length - 1; cur >= 0; cur--) {
            if (this.frequency(coll, needles[cur], limit) > max) {
              detected = needles[cur];
            }
          }

          return detected || needles[0];
        },
        unsafeParse: function unsafeParse(text, opts, fn) {
          var lines = text.split(opts.newline);

          if (opts.skip > 0) {
            lines.splice(opts.skip);
          }

          var fields;
          var constructor;

          function cells(lines) {
            var line = lines.shift();

            if (line.indexOf('"') >= 0) {
              // 含引号
              // 找到这行完整的数据, 找到对称的双引号
              var lastIndex = 0;
              var findIndex = 0;
              var count = 0;

              while (lines.length > 0) {
                lastIndex = line.indexOf('"', findIndex);
                if (lastIndex === -1 && count % 2 === 0) break;

                if (lastIndex !== -1) {
                  findIndex = lastIndex + 1;
                  count++;
                } else {
                  line = line + opts.newline + lines.shift();
                }
              }

              var list = [];
              var item;
              var quoteCount = 0;
              var start = 0;
              var end = 0;
              var length = line.length;

              for (var key in line) {
                if (!line.hasOwnProperty(key)) {
                  continue;
                }

                var numKey = parseInt(key);
                var _value = line[key];

                if (numKey === 0 && _value === '"') {
                  quoteCount++;
                  start = 1;
                }

                if (_value === '"') {
                  quoteCount++;

                  if (line[numKey - 1] === opts.delimiter && start === numKey) {
                    start++;
                  }
                }

                if (_value === '"' && quoteCount % 2 === 0) {
                  if (line[numKey + 1] === opts.delimiter || numKey + 1 === length) {
                    end = numKey;
                    item = line.substring(start, end);
                    list.push(item);
                    start = end + 2;
                    end = start;
                  }
                }

                if (_value === opts.delimiter && quoteCount % 2 === 0) {
                  end = numKey;

                  if (end > start) {
                    item = line.substring(start, end);
                    list.push(item);
                    start = end + 1;
                    end = start;
                  } else if (end === start) {
                    list.push("");
                    start = end + 1;
                    end = start;
                  }
                }
              }

              end = length;

              if (end >= start) {
                item = line.substring(start, end);
                list.push(item);
              }

              return list;
            } else {
              return line.split(opts.delimiter);
            }
          }

          if (opts.header) {
            if (opts.header === true) {
              opts.comment = cells(lines); // 第一行是注释

              opts.cast = cells(lines); // 第二行是数据类型

              fields = cells(lines);
            } else if (this.getType(opts.header) === "Array") {
              fields = opts.header;
            }

            constructor = this.buildObjectConstructor(fields, lines[0].split(opts.delimiter), opts.cast);
          } else {
            constructor = this.buildArrayConstructor(fields, lines[0].split(opts.delimiter), opts.cast);
          }

          while (lines.length > 0) {
            var row = cells(lines);

            if (row.length > 1) {
              fn(constructor(row), fields[0]);
            }
          }

          return true;
        },
        safeParse: function safeParse(text, opts) {
          var newline = opts.newline;
          var lines = text.split(newline);

          if (opts.skip > 0) {
            lines.splice(opts.skip);
          }

          return true;
        },
        encodeCells: function encodeCells(line, delimiter, newline) {
          var row = line.slice(0);

          for (var i = 0, len = row.length; i < len; i++) {
            if (row[i].indexOf(this.quoteMark) !== -1) {
              row[i] = row[i].replace(this.quoteRegex, this.doubleQuoteMark);
            }

            if (row[i].indexOf(delimiter) !== -1 || row[i].indexOf(newline) !== -1) {
              row[i] = this.quoteMark + row[i] + this.quoteMark;
            }
          }

          return row.join(delimiter);
        },
        encodeArrays: function encodeArrays(coll, opts, fn) {
          var delimiter = opts.delimiter;
          var newline = opts.newline;

          if (opts.header && this.getType(opts.header) === "Array") {
            fn(this.encodeCells(opts.header, delimiter, newline));
          }

          for (var cur = 0, lim = this.getLimit(opts.limit, coll.length); cur < lim; cur++) {
            fn(this.encodeCells(coll[cur], delimiter, newline));
          }

          return true;
        },
        encodeObjects: function encodeObjects(coll, opts, fn) {
          var delimiter = opts.delimiter;
          var newline = opts.newline;
          var header = [];
          var row = [];

          for (var key in coll[0]) {
            header.push(key);
            row.push(coll[0][key]);
          }

          if (opts.header === true) {
            fn(this.encodeCells(header, delimiter, newline));
          } else if (this.getType(opts.header) === "Array") {
            fn(this.encodeCells(opts.header, delimiter, newline));
          }

          fn(this.encodeCells(row, delimiter, '\n'));

          for (var cur = 1, lim = this.getLimit(opts.limit, coll.length); cur < lim; cur++) {
            row = [];

            for (var i = 0, len = header.length; i < len; i++) {
              row.push(coll[cur][header[i]]);
            }

            fn(this.encodeCells(row, delimiter, newline));
          }

          return true;
        },
        parse: function parse(text, opts, fn) {
          var rows = [];

          if (this.getType(opts) === "Function") {
            fn = opts;
            opts = {};
          } else if (this.getType(fn) !== "Function") {
            fn = rows.push.bind(rows);
          }

          opts = this.assign({}, this.STANDARD_DECODE_OPTS, opts);
          this.opts = opts;

          if (!opts.delimiter || !opts.newline) {
            var limit = Math.min(48, Math.floor(text.length / 20), text.length);
            opts.delimiter = opts.delimiter || this.mostFrequent(text, CELL_DELIMITERS, limit !== 0);
            opts.newline = opts.newline || this.mostFrequent(text, LINE_DELIMITERS, limit !== 0);
          } // modify by jl 由表自行控制不要含有双引号.提高解析效率


          return this.unsafeParse(text, opts, fn) && (rows.length > 0 ? rows : true);
        },
        encode: function encode(coll, opts, fn) {
          var lines = [];

          if (this.getType(opts) === "Function") {
            fn = opts; // opts = {};
          } else if (this.getType(fn) !== "Function") {
            lines = [];
            fn = lines.push.bind(lines);
          }

          opts = this.assign({}, this.STANDARD_ENCODE_OPTS, opts);

          if (opts.skip > 0) {
            coll = coll.slice(opts.skip);
          }

          return (this.getType(coll[0]) === "Array" ? this.encodeArrays : this.encodeObjects)(coll, opts, fn) && (lines.length > 0 ? lines.join(opts.newline) : true);
        }
      };
      var csvManager = exports('csvManager', (_dec = ccclass("csvManager"), _dec(_class = (_temp = /*#__PURE__*/function () {
        function csvManager() {
          _defineProperty(this, "csvTables", {});

          _defineProperty(this, "csvTableForArr", {});

          _defineProperty(this, "tableCast", {});

          _defineProperty(this, "tableComment", {});
        }

        var _proto = csvManager.prototype;

        _proto.addTable = function addTable(tableName, tableContent, force) {
          if (this.csvTables[tableName] && !force) {
            return;
          }

          var tableData = {};
          var tableArr = [];
          var opts = {
            header: true
          };
          CSV.parse(tableContent, opts, function (row, keyName) {
            tableData[row[keyName]] = row;
            tableArr.push(row);
          });
          this.tableCast[tableName] = CSV.opts.cast;
          this.tableComment[tableName] = CSV.opts.comment;
          this.csvTables[tableName] = tableData;
          this.csvTableForArr[tableName] = tableArr; //this.csvTables[tableName].initFromText(tableContent);
        };

        _proto.getTableArr = function getTableArr(tableName) {
          return this.csvTableForArr[tableName];
        };

        _proto.getTable = function getTable(tableName) {
          return this.csvTables[tableName];
        };

        _proto.queryOne = function queryOne(tableName, key, value) {
          var table = this.getTable(tableName);

          if (!table) {
            return null;
          }

          if (key) {
            for (var tbItem in table) {
              if (!table.hasOwnProperty(tbItem)) {
                continue;
              }

              if (table[tbItem][key] === value) {
                return table[tbItem];
              }
            }
          } else {
            return table[value];
          }
        };

        _proto.queryByID = function queryByID(tableName, ID) {
          return this.queryOne(tableName, null, ID);
        };

        _proto.queryAll = function queryAll(tableName, key, value) {
          var table = this.getTable(tableName);

          if (!table || !key) {
            return null;
          }

          var ret = {};

          for (var tbItem in table) {
            if (!table.hasOwnProperty(tbItem)) {
              continue;
            }

            if (table[tbItem][key] === value) {
              ret[tbItem] = table[tbItem];
            }
          }

          return ret;
        };

        _proto.queryIn = function queryIn(tableName, key, values) {
          var table = this.getTable(tableName);

          if (!table || !key) {
            return null;
          }

          var ret = {};
          var keys = Object.keys(table);
          var length = keys.length;

          for (var i = 0; i < length; i++) {
            var item = table[keys[i]];

            if (values.indexOf(item[key]) > -1) {
              ret[keys[i]] = item;
            }
          }

          return ret;
        };

        _proto.queryByCondition = function queryByCondition(tableName, condition) {
          if (condition.constructor !== Object) {
            return null;
          }

          var table = this.getTable(tableName);

          if (!table) {
            return null;
          }

          var ret = {};
          var tableKeys = Object.keys(table);
          var tableKeysLength = tableKeys.length;
          var keys = Object.keys(condition);
          var keysLength = keys.length;

          for (var i = 0; i < tableKeysLength; i++) {
            var item = table[tableKeys[i]];
            var fit = true;

            for (var j = 0; j < keysLength; j++) {
              var key = keys[j];
              fit = fit && condition[key].indexOf(item[key]) > -1 && !ret[tableKeys[i]];
            }

            if (fit) {
              ret[tableKeys[i]] = item;
            }
          }

          return ret;
        };

        return csvManager;
      }(), _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/mainUI.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './clientEvent.ts', './constant.ts', './util.ts', './localConfig.ts', './playerData.ts', './uiManager.ts', './gameLogic.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Sprite, Label, Node, Vec3, tween, Component, clientEvent, constant, util, localConfig, playerData, uiManager, gameLogic;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Sprite = module.Sprite;
      Label = module.Label;
      Node = module.Node;
      Vec3 = module.Vec3;
      tween = module.tween;
      Component = module.Component;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      util = module.util;
    }, function (module) {
      localConfig = module.localConfig;
    }, function (module) {
      playerData = module.playerData;
    }, function (module) {
      uiManager = module.uiManager;
    }, function (module) {
      gameLogic = module.gameLogic;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp;

      cclegacy._RF.push({}, "6e662xQs9xPfZ4Gn7vNo4u5", "mainUI", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var mainUI = exports('mainUI', (_dec = ccclass("mainUI"), _dec2 = property(Sprite), _dec3 = property(Label), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(mainUI, _Component);

        function mainUI() {
          var _this2;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this2 = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this2), "spIcon", _descriptor, _assertThisInitialized(_this2));

          _initializerDefineProperty(_assertThisInitialized(_this2), "lbGold", _descriptor2, _assertThisInitialized(_this2));

          _initializerDefineProperty(_assertThisInitialized(_this2), "nodeBtnService", _descriptor3, _assertThisInitialized(_this2));

          _initializerDefineProperty(_assertThisInitialized(_this2), "nodeSignInRedDot", _descriptor4, _assertThisInitialized(_this2));

          _initializerDefineProperty(_assertThisInitialized(_this2), "nodeGoldIcon", _descriptor5, _assertThisInitialized(_this2));

          _initializerDefineProperty(_assertThisInitialized(_this2), "nodeShopRedDot", _descriptor6, _assertThisInitialized(_this2));

          _defineProperty(_assertThisInitialized(_this2), "targetScale", new Vec3(1, 1, 1));

          _defineProperty(_assertThisInitialized(_this2), "isGoldPlaying", false);

          _defineProperty(_assertThisInitialized(_this2), "arrCars", []);

          _defineProperty(_assertThisInitialized(_this2), "isShowAniFinished", false);

          _defineProperty(_assertThisInitialized(_this2), "debugIdx", 0);

          _defineProperty(_assertThisInitialized(_this2), "debugTimer", 0);

          return _this2;
        }

        var _proto = mainUI.prototype;

        _proto.start = function start() {
          // Your initialization goes here.
          //界面启动后表示登录完了
          gameLogic.afterLogin();
          this.updateSignIn();
        };

        _proto.onEnable = function onEnable() {
          clientEvent.on('updateGold', this.updateGold, this);
          clientEvent.on('updateSignIn', this.updateSignIn, this);
          clientEvent.on('receiveGold', this.receiveGold, this);
          clientEvent.on('updateCar', this.updateCar, this);
          clientEvent.on('buyCar', this.updateCarReceived, this);
        };

        _proto.onDisable = function onDisable() {
          clientEvent.off('updateGold', this.updateGold, this);
          clientEvent.off('updateSignIn', this.updateSignIn, this);
          clientEvent.off('receiveGold', this.receiveGold, this);
          clientEvent.off('updateCar', this.updateCar, this);
          clientEvent.off('buyCar', this.updateCarReceived, this);
        };

        _proto.updateGold = function updateGold() {
          var gold = playerData.instance.playerInfo.gold || 0;
          this.lbGold.string = util.formatMoney(gold);
        };

        _proto.receiveGold = function receiveGold() {
          var _this3 = this;

          this.isGoldPlaying = true;
          this.nodeGoldIcon.setScale(new Vec3(1, 1, 1));
          tween(this.targetScale).to(0.2, new Vec3(1.2, 1.2, 1.2)).to(0.2, new Vec3(1, 1, 1)).call(function () {
            _this3.isGoldPlaying = false;
          }).start();
        }
        /**
         * 更新签到的红点显隐
         */
        ;

        _proto.updateSignIn = function updateSignIn() {
          playerData.instance.updateSignInCurrentDay();
          var signInStatus = playerData.instance.getSignInReceivedInfo();
          this.nodeSignInRedDot.active = !signInStatus.isAllReceived;
        };

        _proto.onBtnBgClick = function onBtnBgClick() {
          var _this4 = this; //先咨询，要不要试用车辆


          if (playerData.instance.playerInfo.level > constant.NEWBEE_LEVEL) {
            uiManager.instance.showDialog('main/trial', [function () {
              _this4.askInvincible();
            }]);
          } else {
            //前2关不试用
            this.showStart();
          }
        };

        _proto.askInvincible = function askInvincible() {
          var _this5 = this;

          if (playerData.instance.playerInfo.level > constant.NEWBEE_LEVEL) {
            uiManager.instance.showDialog('main/invincible', [function () {
              _this5.showStart();
            }]);
          } else {
            this.showStart();
          }
        };

        _proto.showStart = function showStart() {
          clientEvent.dispatchEvent('startGame');
        };

        _proto.onBtnDailyClick = function onBtnDailyClick() {
          //7日签到
          uiManager.instance.showDialog('signIn/signIn');
        };

        _proto.onBtnLotteryClick = function onBtnLotteryClick() {
          //大转盘
          uiManager.instance.showDialog('lottery/lottery');
        };

        _proto.onBtnRankClick = function onBtnRankClick() {
          //排行榜
          uiManager.instance.showDialog('rank/rank');
        };

        _proto.onBtnChangeCarClick = function onBtnChangeCarClick() {
          //换车
          uiManager.instance.showDialog('shop/shop');
        };

        _proto.onBtnSettingClick = function onBtnSettingClick() {
          //设置按钮
          uiManager.instance.showDialog('main/setting');
        };

        _proto.updateCar = function updateCar() {};

        _proto.updateCarReceived = function updateCarReceived() {
          this.nodeShopRedDot.active = playerData.instance.hasCarCanReceived();
        };

        _proto.onBtnLeftClick = function onBtnLeftClick() {
          var car = playerData.instance.showCar;
          var idx = this.arrCars.indexOf(car);
          idx--;

          if (idx < 0) {
            idx = this.arrCars.length - 1;
          }

          playerData.instance.showCar = this.arrCars[idx];
          clientEvent.dispatchEvent('updateCar');
        };

        _proto.onBtnRightClick = function onBtnRightClick() {
          var car = playerData.instance.showCar;
          var idx = this.arrCars.indexOf(car);
          idx++;

          if (idx >= this.arrCars.length) {
            idx = 0;
          }

          playerData.instance.showCar = this.arrCars[idx];
          clientEvent.dispatchEvent('updateCar');
        };

        _proto.show = function show() {
          var _this6 = this;

          this.updateGold();
          this.nodeShopRedDot.active = playerData.instance.hasCarCanReceived();
          this.arrCars.length = 0;
          var arr = localConfig.instance.getCars();
          arr.forEach(function (element) {
            _this6.arrCars.push(element.ID);
          });
          this.isShowAniFinished = true;
          gameLogic.updateRewardIcon(constant.SHARE_FUNCTION.TRIAL, this.spIcon, function () {
            if (playerData.instance.hasCar(playerData.instance.showCar)) {
              _this6.spIcon.node.active = false;
            }
          });

          if (playerData.instance.isComeFromBalance) {
            this.onBtnBgClick();
          }
        };

        _proto.update = function update(deltaTime) {
          // Your update function goes here.
          if (this.isGoldPlaying || this.targetScale.x !== 1) {
            this.nodeGoldIcon.setScale(this.targetScale);
          }
        };

        _proto.onBtnDebugClick = function onBtnDebugClick() {
          return;
        };

        return mainUI;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "spIcon", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "lbGold", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "nodeBtnService", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "nodeSignInRedDot", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "nodeGoldIcon", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "nodeShopRedDot", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/showReward.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './clientEvent.ts', './resourceUtil.ts', './constant.ts', './poolManager.ts', './localConfig.ts', './playerData.ts', './uiManager.ts', './gameLogic.ts', './LanguageData.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, SpriteFrame, Sprite, Label, Node, Animation, Vec3, Component, clientEvent, resourceUtil, constant, poolManager, localConfig, playerData, uiManager, gameLogic, i18n;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      SpriteFrame = module.SpriteFrame;
      Sprite = module.Sprite;
      Label = module.Label;
      Node = module.Node;
      Animation = module.Animation;
      Vec3 = module.Vec3;
      Component = module.Component;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      resourceUtil = module.resourceUtil;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      poolManager = module.poolManager;
    }, function (module) {
      localConfig = module.localConfig;
    }, function (module) {
      playerData = module.playerData;
    }, function (module) {
      uiManager = module.uiManager;
    }, function (module) {
      gameLogic = module.gameLogic;
    }, function (module) {
      i18n = module.i18n;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _temp;

      cclegacy._RF.push({}, "880e1kClIdKPqdXdgTIpdv2", "showReward", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var showReward = exports('showReward', (_dec = ccclass("showReward"), _dec2 = property(SpriteFrame), _dec3 = property(Sprite), _dec4 = property(Label), _dec5 = property(Label), _dec6 = property(Label), _dec7 = property(Label), _dec8 = property(Node), _dec9 = property(Node), _dec10 = property(Node), _dec11 = property(Node), _dec12 = property(Animation), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(showReward, _Component);

        function showReward() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "sfGold", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spIcon", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbRewardValue", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbTips", _descriptor4, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbTitle", _descriptor5, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbImmediateBtn", _descriptor6, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "ndCarParent", _descriptor7, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "ndBtnDouble", _descriptor8, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "ndBtnNormal", _descriptor9, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "ndBtnImmediately", _descriptor10, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "aniReward", _descriptor11, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "isDouble", false);

          _defineProperty(_assertThisInitialized(_this), "callback", null);

          _defineProperty(_assertThisInitialized(_this), "isLast", false);

          _defineProperty(_assertThisInitialized(_this), "rewardType", 0);

          _defineProperty(_assertThisInitialized(_this), "amount", 0);

          _defineProperty(_assertThisInitialized(_this), "itemInfo", void 0);

          _defineProperty(_assertThisInitialized(_this), "_isHadCar", false);

          _defineProperty(_assertThisInitialized(_this), "currentCar", null);

          _defineProperty(_assertThisInitialized(_this), "carDegree", 0);

          _defineProperty(_assertThisInitialized(_this), "rotateSpeed", 30);

          return _this;
        }

        var _proto = showReward.prototype;

        _proto.start = function start() {// Your initialization goes here.
        }
        /**
         *
         *
         * @param {*} itemInfo
         * @param {boolean} isDouble 是“双倍领取、普通领取”组合或者单独一个“立即领取”
         * @param {string} title
         * @param {Function} callback
         * @param {string} [tips]
         * @memberof showReward
         */
        ;

        _proto.show = function show(itemInfo, isDouble, title, callback, tips, txtImmediateBtn) {
          var _this2 = this;

          this.itemInfo = itemInfo;
          this.rewardType = itemInfo.rewardType;
          this.amount = itemInfo.amount;
          this.ndBtnDouble.active = isDouble;
          this.ndBtnNormal.active = isDouble;
          this.ndBtnImmediately.active = !isDouble;
          this.lbTitle.string = title;
          this.lbRewardValue.string = itemInfo.rewardType === constant.REWARD_TYPE.CAR ? '' : String(this.amount);
          this.callback = callback;

          if (tips) {
            this.lbTips.node.active = true;
            this.lbTips.string = tips;
          } else {
            this.lbTips.node.active = false;
          }

          this.showRewardPage();
          this.aniReward.play('rewardShow');
          this.aniReward.once(Animation.EventType.FINISHED, function () {
            _this2.aniReward.play('rewardIdle');
          }, this);

          if (txtImmediateBtn) {
            this.lbImmediateBtn.string = txtImmediateBtn;
          } else {
            this.lbImmediateBtn.string = i18n.t('balance.receiveImmediately');
          }
        }
        /**
         * 设置奖励界面图标
         */
        ;

        _proto.showRewardPage = function showRewardPage() {
          var _this3 = this;

          if (this.currentCar) {
            poolManager.instance.putNode(this.currentCar);
            this.currentCar = null;
          }

          switch (this.rewardType) {
            case constant.REWARD_TYPE.DIAMOND:
              break;

            case constant.REWARD_TYPE.GOLD:
              this.spIcon.spriteFrame = this.sfGold;
              this.spIcon.node.active = true;
              break;

            case constant.REWARD_TYPE.CAR:
              this.spIcon.node.active = false;
              var targetCar = localConfig.instance.queryByID('car', this.itemInfo.ID);
              var carModel = targetCar.model;
              resourceUtil.getUICar(carModel, function (err, prefab) {
                if (err) {
                  console.error(err);
                  return;
                }

                _this3.currentCar = poolManager.instance.getNode(prefab, _this3.ndCarParent);
                _this3.carDegree = 0;
              }); // resourceUtil.setCarIcon(carModel, this.spIcon, false, ()=>{});

              break;
          }
        };

        _proto.onBtnNormalClick = function onBtnNormalClick() {
          this.addReward();
        };

        _proto.onBtnDoubleClick = function onBtnDoubleClick() {
          var _this4 = this;

          gameLogic.openReward(constant.SHARE_FUNCTION.SIGNIN, function (err) {
            if (!err) {
              _this4.amount *= 2;

              _this4.addReward();
            }
          });
        };

        _proto.onBtnImmediatelyClick = function onBtnImmediatelyClick() {
          this.addReward();
        };

        _proto.addReward = function addReward() {
          switch (this.rewardType) {
            case constant.REWARD_TYPE.DIAMOND:
              break;

            case constant.REWARD_TYPE.GOLD:
              // gameLogic.addGold(this.amount);
              playerData.instance.updatePlayerInfo('gold', this.amount);
              gameLogic.showFlyReward(constant.REWARD_TYPE.GOLD, function () {
                clientEvent.dispatchEvent('updateGold');
              });
              break;

            case constant.REWARD_TYPE.CAR:
              gameLogic.buyCar(this.itemInfo.ID);
              break;
          }

          uiManager.instance.hideDialog('common/showReward');
          this.callback && this.callback();
        };

        _proto.update = function update(deltaTime) {
          //旋转展示车辆
          if (this.currentCar) {
            this.carDegree -= deltaTime * this.rotateSpeed;

            if (this.carDegree <= -360) {
              this.carDegree += 360;
            }

            this.currentCar.eulerAngles = new Vec3(0, this.carDegree, 0);
          }
        };

        return showReward;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "sfGold", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "spIcon", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lbRewardValue", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "lbTips", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "lbTitle", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "lbImmediateBtn", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "ndCarParent", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "ndBtnDouble", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "ndBtnNormal", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "ndBtnImmediately", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "aniReward", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/clickBox.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './fightConstants.ts', './constant.ts', './uiManager.ts', './gameLogic.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, ProgressBarComponent, Node, Label, Sprite, Component, fightConstants, constant, uiManager, gameLogic;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      ProgressBarComponent = module.ProgressBarComponent;
      Node = module.Node;
      Label = module.Label;
      Sprite = module.Sprite;
      Component = module.Component;
    }, function (module) {
      fightConstants = module.fightConstants;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      uiManager = module.uiManager;
    }, function (module) {
      gameLogic = module.gameLogic;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _temp;

      cclegacy._RF.push({}, "884dcSQc2hHsJby3+7ljIyd", "clickBox", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var clickBox = exports('clickBox', (_dec = ccclass("clickBox"), _dec2 = property(ProgressBarComponent), _dec3 = property(Node), _dec4 = property(Label), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec8 = property(Sprite), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(clickBox, _Component);

        function clickBox() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "progress", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeReward", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbReward", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeBox", _descriptor4, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeMenu", _descriptor5, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeClickBtn", _descriptor6, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spIcon", _descriptor7, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "scheduleTime", 0);

          _defineProperty(_assertThisInitialized(_this), "curProgress", 50);

          _defineProperty(_assertThisInitialized(_this), "clickTimes", 15);

          _defineProperty(_assertThisInitialized(_this), "curClick", 0);

          _defineProperty(_assertThisInitialized(_this), "isOpenBox", false);

          _defineProperty(_assertThisInitialized(_this), "rewardValue", 0);

          return _this;
        }

        var _proto = clickBox.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.show = function show() {
          this.scheduleTime = 0;
          this.curProgress = 50;
          this.clickTimes = 10 + Math.floor(Math.random() * 5); //10-15次随机次数

          this.curClick = 0;
          this.isOpenBox = false;
          this.nodeClickBtn.active = true;
          this.progress.node.active = true;
          this.nodeBox.active = true;
          this.nodeReward.active = false;
          this.nodeMenu.active = false;
          gameLogic.updateRewardIcon(constant.SHARE_FUNCTION.CLICK_BOX, this.spIcon);
        };

        _proto.onBtnBoxClick = function onBtnBoxClick() {
          if (this.isOpenBox) {
            return;
          }

          this.curClick++;

          if (this.curClick > this.clickTimes) {
            //TODO 打开宝箱
            this.isOpenBox = true; //切换展示

            this.showReward();
          } else {
            this.curProgress += 20;
            this.curProgress = this.curProgress > 100 ? 100 : this.curProgress;
          }
        };

        _proto.showReward = function showReward() {
          this.nodeClickBtn.active = false;
          this.progress.node.active = false;
          this.nodeBox.active = false;
          this.nodeReward.active = true;
          this.nodeMenu.active = true;
          this.lbReward.string = "+" + fightConstants.CLICK_BOX_REWARD;
          this.rewardValue = fightConstants.CLICK_BOX_REWARD; //TODO 展示一倍或者三倍奖励
          // playerData.instance.updatePlayerInfo('gold', fightConstants.CLICK_BOX_REWARD);
        };

        _proto.update = function update(deltaTime) {
          this.scheduleTime += deltaTime;

          if (this.scheduleTime >= 0.1) {
            //100ms减3%
            this.curProgress -= 3;
            this.curProgress = this.curProgress < 0 ? 0 : this.curProgress;
            this.scheduleTime = 0;
          }

          this.progress.progress = this.curProgress / 100;
        };

        _proto.onBtnNormalClick = function onBtnNormalClick() {
          gameLogic.addGold(fightConstants.CLICK_BOX_REWARD);
          this.close();
        };

        _proto.onBtnDoubleClick = function onBtnDoubleClick() {
          var _this2 = this;

          gameLogic.openReward(constant.SHARE_FUNCTION.CLICK_BOX, function (err) {
            if (!err) {
              gameLogic.addGold(fightConstants.CLICK_BOX_REWARD * 2);

              _this2.close();
            }
          });
        };

        _proto.close = function close() {
          uiManager.instance.hideDialog('fight/clickBox');
        };

        return clickBox;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "progress", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "nodeReward", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lbReward", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "nodeBox", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "nodeMenu", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "nodeClickBtn", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "spIcon", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/signInItem.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './clientEvent.ts', './resourceUtil.ts', './constant.ts', './localConfig.ts', './playerData.ts', './uiManager.ts', './gameLogic.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, SpriteFrame, Sprite, Node, Label, Animation, Component, clientEvent, resourceUtil, constant, localConfig, playerData, uiManager, gameLogic;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      SpriteFrame = module.SpriteFrame;
      Sprite = module.Sprite;
      Node = module.Node;
      Label = module.Label;
      Animation = module.Animation;
      Component = module.Component;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      resourceUtil = module.resourceUtil;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      localConfig = module.localConfig;
    }, function (module) {
      playerData = module.playerData;
    }, function (module) {
      uiManager = module.uiManager;
    }, function (module) {
      gameLogic = module.gameLogic;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _temp;

      cclegacy._RF.push({}, "8a6efh8jF9Js7ZZXyAL57KG", "signInItem", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var signInItem = exports('signInItem', (_dec = ccclass("signInItem"), _dec2 = property(SpriteFrame), _dec3 = property(SpriteFrame), _dec4 = property(Sprite), _dec5 = property(SpriteFrame), _dec6 = property(Node), _dec7 = property(Node), _dec8 = property(Node), _dec9 = property(Label), _dec10 = property(Node), _dec11 = property(Label), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(signInItem, _Component);

        function signInItem() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "sfBgBlue", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "sfYellow", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spReward", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "sfGold", _descriptor4, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeTick", _descriptor5, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeBtnFillSign", _descriptor6, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeBtnAfterFillSign", _descriptor7, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbDayIndex", _descriptor8, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeLight", _descriptor9, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbValue", _descriptor10, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "_parent", null);

          _defineProperty(_assertThisInitialized(_this), "itemInfo", null);

          _defineProperty(_assertThisInitialized(_this), "isHadCar", null);

          return _this;
        }

        var _proto = signInItem.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.init = function init(itemInfo, parent) {
          this._parent = parent;
          this.itemInfo = itemInfo;
          this.lbValue.string = itemInfo.rewardType === constant.REWARD_TYPE.CAR ? '' : String(itemInfo.amount);
          this.lbDayIndex.string = String(itemInfo.ID);
          this.setIcon(itemInfo.rewardType);
          this.setStatus(itemInfo.status);
          this.node.getComponent(Sprite).spriteFrame = Number(itemInfo.ID) >= 7 ? this.sfBgBlue : this.sfYellow;
        };

        _proto.setIcon = function setIcon(type) {
          switch (type) {
            case constant.REWARD_TYPE.DIAMOND:
              break;

            case constant.REWARD_TYPE.GOLD:
              this.spReward.spriteFrame = this.sfGold;
              break;

            case constant.REWARD_TYPE.CAR:
              var targetCar = localConfig.instance.queryByID('car', this.itemInfo.amount);
              var carModel = targetCar.model;

              if (playerData.instance.isHadCarAndDuringPeriod(this.itemInfo.amount)) {
                this.spReward.spriteFrame = this.sfGold;

                if (this.itemInfo.ID == 2) {
                  this.lbValue.string = String(constant.GOLD_REWARD.SECOND);
                } else if (this.itemInfo.ID == 7) {
                  this.lbValue.string = String(constant.GOLD_REWARD.SEVENT);
                }
              } else {
                resourceUtil.setCarIcon(carModel, this.spReward, false, function () {});
              }

              break;
          }
        };

        _proto.setStatus = function setStatus(status) {
          switch (status) {
            case constant.SIGNIN_REWARD_STATUS.RECEIVED:
              this.showItemUI(false, true, false, false);
              break;

            case constant.SIGNIN_REWARD_STATUS.RECEIVABLE:
              this.showItemUI(true, false, false, false);
              break;

            case constant.SIGNIN_REWARD_STATUS.UNRECEIVABLE:
              this.showItemUI(false, false, false, false);
              break;

            case constant.SIGNIN_REWARD_STATUS.FILL_SIGNIN:
              this.showItemUI(false, false, true, false);
              break;

            case constant.SIGNIN_REWARD_STATUS.AFTER_FILL_SIGNIN:
              this.showItemUI(true, false, false, true);
              break;
          }
        };

        _proto.showItemUI = function showItemUI(isShowLight, isShowTick, isShowBtnFillSignIn, isShowBtnReceive) {
          this.nodeLight.active = isShowLight;
          var lightAni = this.nodeLight.getComponent(Animation);
          isShowLight ? lightAni.play() : lightAni.stop();
          this.nodeTick.active = isShowTick;
          this.nodeBtnFillSign.active = isShowBtnFillSignIn;
          this.nodeBtnAfterFillSign.active = isShowBtnReceive;
        }
        /**
         * 点击补签后的领取按钮触发，或者点击当前可领取触发
         */
        ;

        _proto.onBtnAfterFillSignClick = function onBtnAfterFillSignClick() {
          if (this.itemInfo.status === constant.SIGNIN_REWARD_STATUS.AFTER_FILL_SIGNIN || this.itemInfo.status === constant.SIGNIN_REWARD_STATUS.RECEIVABLE) {
            this._parent.receiveReward(this.itemInfo, false, this.markReceived.bind(this));
          }
        }
        /**
         * 标记为已领取
         */
        ;

        _proto.markReceived = function markReceived() {
          this.itemInfo.status = constant.SIGNIN_REWARD_STATUS.RECEIVED;
          this.setStatus(this.itemInfo.status); //记录车领取的时间

          if ((this.itemInfo.ID === 2 || this.itemInfo.ID === 7) && !this.isHadCar) {
            playerData.instance.updateDictGetCarTime(this.itemInfo.amount);
          } //添加已领取奖励的天数


          if (this.itemInfo.ID) {
            playerData.instance.updateSignInReceivedDays(this.itemInfo.ID);
            clientEvent.dispatchEvent('updateSignIn');
          }

          this.close();
        };

        _proto.close = function close() {
          uiManager.instance.shiftFromPopupSeq('common/showReward');
          var receiveStatus = playerData.instance.getSignInReceivedInfo();
          var isAllReceived = receiveStatus.isAllReceived;

          if (!isAllReceived) {
            uiManager.instance.pushToPopupSeq('signIn/signIn', 'signIn', {});
          } else {
            uiManager.instance.shiftFromPopupSeq("common/showReward");
          }
        }
        /**
         * 标记为补签后可以领取
         */
        ;

        _proto.markAfterFillSignIn = function markAfterFillSignIn() {
          this.itemInfo.status = constant.SIGNIN_REWARD_STATUS.AFTER_FILL_SIGNIN;
          this.setStatus(this.itemInfo.status);
          playerData.instance.updateSignInFillSignInDays(this.itemInfo.ID, false);
        }
        /**
         * 补签按钮
         */
        ;

        _proto.onBtnFillSignInClick = function onBtnFillSignInClick() {
          var _this2 = this;

          gameLogic.openReward(constant.SHARE_FUNCTION.FILL_SIGNIN, function (err) {
            if (!err) {
              _this2.markAfterFillSignIn();
            }
          });
        };

        return signInItem;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "sfBgBlue", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "sfYellow", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "spReward", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "sfGold", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "nodeTick", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "nodeBtnFillSign", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "nodeBtnAfterFillSign", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "lbDayIndex", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "nodeLight", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "lbValue", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/lodash.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class, _class2, _temp;

      cclegacy._RF.push({}, "8cbacDdVTBOgZQMyvQzOeAz", "lodash", undefined);

      var ccclass = _decorator.ccclass;
      var lodash = exports('lodash', (_dec = ccclass("lodash"), _dec(_class = (_temp = _class2 = /*#__PURE__*/function () {
        function lodash() {}
        /* class member could be defined like this */
        // dummy = '';


        lodash.find = function find(collection, predicate) {
          var result;

          if (!Array.isArray(collection)) {
            collection = this.toArray(collection);
          }

          result = collection.filter(predicate);

          if (result.length) {
            return result[0];
          }

          return undefined;
        };

        lodash.forEach = function forEach(collection, iteratee) {
          if (!Array.isArray(collection)) {
            var _array = this.toArrayKey(collection);

            _array.forEach(function (value, index, arr) {
              var key1 = value['key'];
              var value1 = value['value'];
              iteratee(value1, key1, collection);
            });
          } else {
            collection.forEach(iteratee);
          }
        };

        lodash.cloneDeep = function cloneDeep(sObj) {
          if (sObj === null || typeof sObj !== "object") {
            return sObj;
          }

          var s = {};

          if (sObj.constructor === Array) {
            s = [];
          }

          for (var i in sObj) {
            if (sObj.hasOwnProperty(i)) {
              s[i] = this.cloneDeep(sObj[i]);
            }
          }

          return s;
        };

        lodash.map = function map(collection, iteratee) {
          if (!Array.isArray(collection)) {
            collection = this.toArray(collection);
          }

          var arr = [];
          collection.forEach(function (value, index, array) {
            arr.push(iteratee(value, index, array));
          });
          return arr;
        };

        lodash.random = function random(min, max) {
          var r = Math.random();
          var rr = r * (max - min + 1) + min;
          return Math.floor(rr);
        };

        lodash.toArrayKey = function toArrayKey(srcObj) {
          var resultArr = []; // to array

          for (var _key in srcObj) {
            if (!srcObj.hasOwnProperty(_key)) {
              continue;
            }

            resultArr.push({
              key: _key,
              value: srcObj[_key]
            });
          }

          return resultArr;
        };

        lodash.toArray = function toArray(srcObj) {
          var resultArr = []; // to array

          for (var _key2 in srcObj) {
            if (!srcObj.hasOwnProperty(_key2)) {
              continue;
            }

            resultArr.push(srcObj[_key2]);
          }

          return resultArr;
        };

        lodash.filter = function filter(collection, iteratees) {
          if (!Array.isArray(collection)) {
            collection = this.toArray(collection);
          }

          return collection.filter(iteratees);
        };

        lodash.isEqual = function isEqual(x, y) {
          var in1 = x instanceof Object;
          var in2 = y instanceof Object;

          if (!in1 || !in2) {
            return x === y;
          }

          if (Object.keys(x).length !== Object.keys(y).length) {
            return false;
          }

          for (var p in x) {
            var a = x[p] instanceof Object;
            var b = y[p] instanceof Object;

            if (a && b) {
              return this.isEqual(x[p], y[p]);
            } else if (x[p] !== y[p]) {
              return false;
            }
          }

          return true;
        };

        lodash.pullAllWith = function pullAllWith(array, value, comparator) {
          value.forEach(function (item) {
            var res = array.filter(function (n) {
              return comparator(n, item);
            });
            res.forEach(function (item) {
              var index = array.indexOf(item);

              if (array.indexOf(item) !== -1) {
                array.splice(index, 1);
              }
            });
          });
          return array;
        };

        lodash.now = function now() {
          return Date.now();
        };

        lodash.pullAll = function pullAll(array, value) {
          value.forEach(function (item) {
            var index = array.indexOf(item);

            if (array.indexOf(item) !== -1) {
              array.splice(index, 1);
            }
          });
          return array;
        };

        lodash.forEachRight = function forEachRight(collection, iteratee) {
          if (!Array.isArray(collection)) {
            collection = this.toArray(collection);
          }

          for (var i = collection.length - 1; i >= 0; i--) {
            var ret = iteratee(collection[i]);
            if (!ret) break;
          }
        };

        lodash.startsWith = function startsWith(str, target, position) {
          str = str.substr(position);
          return str.startsWith(target);
        };

        lodash.endsWith = function endsWith(str, target, position) {
          str = str.substr(position);
          return str.endsWith(target);
        };

        lodash.remove = function remove(array, predicate) {
          var result = [];
          var indexes = [];
          array.forEach(function (item, index) {
            if (predicate(item)) {
              result.push(item);
              indexes.push(index);
            }
          });
          this.basePullAt(array, indexes);
          return result;
        };

        lodash.basePullAt = function basePullAt(array, indexes) {
          var length = array ? indexes.length : 0;
          var lastIndex = length - 1;
          var previous;

          while (length--) {
            var index = indexes[length];

            if (length === lastIndex || index !== previous) {
              previous = index;
              Array.prototype.splice.call(array, index, 1);
            }
          }

          return array;
        };

        lodash.findIndex = function findIndex(array, predicate, fromIndex) {
          array = array.slice(fromIndex);
          var i;

          if (typeof predicate === "function") {
            for (i = 0; i < array.length; i++) {
              if (predicate(array[i])) {
                return i;
              }
            }
          } else if (Array.isArray(predicate)) {
            for (i = 0; i < array.length; i++) {
              var key = predicate[0];
              var vaule = true;

              if (predicate.length > 1) {
                vaule = predicate[1];
              }

              if (array[i][key] === vaule) {
                return i;
              }
            }
          } else {
            for (i = 0; i < array.length; i++) {
              if (array[i] === predicate) {
                return i;
              }
            }
          }

          return -1;
        };

        lodash.concat = function concat() {
          var length = arguments.length;

          if (!length) {
            return [];
          }

          var array = arguments[0];
          var index = 1;

          while (index < length) {
            array = array.concat(arguments[index]);
            index++;
          }

          return array;
        };

        lodash.isNumber = function isNumber(value) {
          return typeof value === 'number';
        };

        lodash.indexOf = function indexOf(array, value, fromIndex) {
          array = array.slice(fromIndex);
          return array.indexOf(value);
        };

        lodash.join = function join(array, separator) {
          if (array === null) return '';
          var result = '';
          array.forEach(function (item) {
            result += item + separator;
          });
          return result.substr(0, result.length - 1);
        };

        lodash.split = function split(str, separator, limit) {
          return str.split(separator, limit);
        };

        lodash.max = function max(array) {
          if (array && array.length) {
            var result;

            for (var i = 0; i < array.length; i++) {
              if (i === 0) {
                result = array[0];
              } else if (result < array[i]) {
                result = array[i];
              }
            }

            return result;
          }

          return undefined;
        };

        lodash.drop = function drop(array, n) {
          var length = array === null ? 0 : array.length;

          if (!length) {
            return [];
          }

          return array.slice(n);
        };

        lodash.flattenDeep = function flattenDeep(arr) {
          return arr.reduce(function (prev, cur) {
            return prev.concat(
            /*Array.isArray(cur) ? this.flattenDeep(cur) :*/
            cur);
          });
        };

        lodash.uniq = function uniq(array) {
          var result = [];
          array.forEach(function (item) {
            if (result.indexOf(item) === -1) {
              result.push(item);
            }
          });
          return result;
        };

        lodash.isNaN = function isNaN(value) {
          // An `NaN` primitive is the only value that is not equal to itself.
          // Perform the `toStringTag` check first to avoid errors with some
          // ActiveX objects in IE.
          return this.isNumber(value) && value !== +value;
        };

        lodash.chunk = function chunk(array, size) {
          var length = array === null ? 0 : array.length;

          if (!length || size < 1) {
            return [];
          }

          var result = [];

          while (array.length > size) {
            result.push(array.slice(0, size));
            array = array.slice(size);
          }

          result.push(array);
          return result;
        };

        lodash.toFinite = function toFinite(value) {
          var INFINITY = 1 / 0;
          var MAX_INTEGER = 1.7976931348623157e+308;

          if (!value) {
            return value === 0 ? value : 0;
          }

          value = Number(value);

          if (value === INFINITY || value === -INFINITY) {
            var sign = value < 0 ? -1 : 1;
            return sign * MAX_INTEGER;
          }

          return value === value ? value : 0;
        };

        lodash.baseRange = function baseRange(start, end, step, fromRight) {
          var nativeMax = Math.max;
          var nativeCeil = Math.ceil;
          var index = -1,
              length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
              result = Array(length);

          while (length--) {
            result[fromRight ? length : ++index] = start;
            start += step;
          }

          return result;
        };

        lodash.isObject = function isObject(value) {
          var type = typeof value;
          return value !== null && (type === 'object' || type === 'function');
        };

        lodash.isLength = function isLength(value) {
          return typeof value === 'number' && value > -1 && value % 1 === 0 && value <= lodash.MAX_SAFE_INTEGER;
        };

        lodash.isArrayLike = function isArrayLike(value) {
          return value !== null && this.isLength(value.length)
          /*&& !isFunction(value)*/
          ;
        };

        lodash.eq = function eq(value, other) {
          return value === other || value !== value && other !== other;
        };

        lodash.isIndex = function isIndex(value, length) {
          var type = typeof value;
          length = length === null ? lodash.MAX_SAFE_INTEGER : length;
          var reIsUint = /^(?:0|[1-9]\d*)$/;
          return !!length && (type === 'number' || type !== 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 === 0 && value < length;
        };

        lodash.isIterateeCall = function isIterateeCall(value, index, object) {
          if (!this.isObject(object)) {
            return false;
          }

          var type = typeof index;

          if (type === 'number' ? this.isArrayLike(object) && this.isIndex(index, object.length) : type === 'string' && index in object) {
            return this.eq(object[index], value);
          }

          return false;
        };

        lodash.createRange = function createRange(fromRight) {
          var _this = this;

          return function (start, end, step) {
            if (step && typeof step !== 'number' && _this.isIterateeCall(start, end, step)) {
              end = step = undefined;
            } // Ensure the sign of `-0` is preserved.


            start = _this.toFinite(start);

            if (end === undefined) {
              end = start;
              start = 0;
            } else {
              end = _this.toFinite(end);
            }

            step = step === undefined ? start < end ? 1 : -1 : _this.toFinite(step);
            return _this.baseRange(start, end, step, fromRight);
          }.bind(this);
        };

        lodash.maxBy = function maxBy(array, predicate) {
          if (array && array.length) {
            var result = -1;
            var objResult = -1;

            for (var i = 0; i < array.length; i++) {
              if (i === 0) {
                result = predicate(array[0]);
                objResult = array[0];
              } else if (result < array[i]) {
                result = array[i];
                objResult = array[i];
              }
            }

            return objResult;
          }

          return undefined;
        };

        lodash.minBy = function minBy(array, predicate) {
          if (array && array.length) {
            var result = -1;
            var objResult = -1;

            for (var i = 0; i < array.length; i++) {
              if (i === 0) {
                result = predicate(array[0]);
                objResult = array[0];
              } else if (result > array[i]) {
                result = predicate(array[i]);
                objResult = array[i];
              }
            }

            return objResult;
          }

          return undefined;
        };

        lodash.sumBy = function sumBy(collection, predicate) {
          var sum = 0;

          for (var _key3 in collection) {
            sum += predicate(collection[_key3]);
          }

          return sum;
        };

        lodash.countBy = function countBy(collection) {
          var objRet = {};

          for (var _key4 in collection) {
            var _value = collection[_key4];

            if (objRet.hasOwnProperty(_value)) {
              objRet[_value] += 1;
            } else {
              objRet[_value] = 1;
            }
          }

          return objRet;
        };

        return lodash;
      }(), _defineProperty(_class2, "MAX_SAFE_INTEGER", 9007199254740991), _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/poolManager.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, _createClass, cclegacy, _decorator, instantiate, NodePool;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      instantiate = module.instantiate;
      NodePool = module.NodePool;
    }],
    execute: function () {
      var _dec, _class, _class2, _temp;

      cclegacy._RF.push({}, "907776q4iZNubarZf3Ut3A8", "poolManager", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var poolManager = exports('poolManager', (_dec = ccclass("poolManager"), _dec(_class = (_temp = _class2 = /*#__PURE__*/function () {
        function poolManager() {
          _defineProperty(this, "dictPool", {});

          _defineProperty(this, "dictPrefab", {});
        }

        var _proto = poolManager.prototype;
        /**
         * 根据预设从对象池中获取对应节点
         */

        _proto.getNode = function getNode(prefab, parent) {
          var name = prefab.data.name;
          this.dictPrefab[name] = prefab;
          var node;

          if (this.dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            var pool = this.dictPool[name];

            if (pool.size() > 0) {
              node = pool.get();
            } else {
              node = instantiate(prefab);
            }
          } else {
            //没有对应对象池，创建他！
            var _pool = new NodePool();

            this.dictPool[name] = _pool;
            node = instantiate(prefab);
          }

          node.parent = parent;
          return node;
        }
        /**
         * 将对应节点放回对象池中
         */
        ;

        _proto.putNode = function putNode(node) {
          var name = node.name;
          var pool = null;

          if (this.dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            pool = this.dictPool[name];
          } else {
            //没有对应对象池，创建他！
            pool = new NodePool();
            this.dictPool[name] = pool;
          }

          pool.put(node);
        }
        /**
         * 根据名称，清除对应对象池
         */
        ;

        _proto.clearPool = function clearPool(name) {
          if (this.dictPool.hasOwnProperty(name)) {
            var pool = this.dictPool[name];
            pool.clear();
          }
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }
        ;

        _createClass(poolManager, null, [{
          key: "instance",
          get: function get() {
            if (this._instance) {
              return this._instance;
            }

            this._instance = new poolManager();
            return this._instance;
          }
        }]);

        return poolManager;
      }(), _defineProperty(_class2, "_instance", void 0), _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/SpriteFrameSet.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _defineProperty, _initializerDefineProperty, cclegacy, _decorator, SpriteFrame;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _defineProperty = module.defineProperty;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      SpriteFrame = module.SpriteFrame;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "93cd23dxExEBLbD/xbMp1PN", "SpriteFrameSet", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var SpriteFrameSet = exports('default', (_dec = ccclass("SpriteFrameSet"), _dec2 = property({
        type: SpriteFrame
      }), _dec(_class = (_class2 = (_temp = function SpriteFrameSet() {
        _defineProperty(this, "name", 'SpriteFrameSet');

        _initializerDefineProperty(this, "language", _descriptor, this);

        _initializerDefineProperty(this, "spriteFrame", _descriptor2, this);
      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "language", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '';
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "spriteFrame", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/lotteryItem.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './resourceUtil.ts', './constant.ts', './localConfig.ts', './playerData.ts', './uiManager.ts', './LanguageData.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, SpriteFrame, Sprite, Label, Component, resourceUtil, constant, localConfig, playerData, uiManager, i18n;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      SpriteFrame = module.SpriteFrame;
      Sprite = module.Sprite;
      Label = module.Label;
      Component = module.Component;
    }, function (module) {
      resourceUtil = module.resourceUtil;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      localConfig = module.localConfig;
    }, function (module) {
      playerData = module.playerData;
    }, function (module) {
      uiManager = module.uiManager;
    }, function (module) {
      i18n = module.i18n;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "93fc8seXTpPJqvHF6Jlpios", "lotteryItem", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var lotteryItem = exports('lotteryItem', (_dec = ccclass("lotteryItem"), _dec2 = property(SpriteFrame), _dec3 = property(Sprite), _dec4 = property(Label), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(lotteryItem, _Component);

        function lotteryItem() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "imgGold", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spItem", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbValue", _descriptor3, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "carInfo", void 0);

          return _this;
        }

        var _proto = lotteryItem.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.show = function show(car) {
          this.carInfo = localConfig.instance.queryByID('car', car);
          resourceUtil.setCarIcon(this.carInfo.model, this.spItem, false, function () {});
        };

        _proto.showReward = function showReward(lottery) {
          console.log(this.carInfo.ID);

          if (!playerData.instance.hasCar(this.carInfo.ID)) {
            //该车还没有，可以直接追加
            //调用奖励界面加车
            var rewardInfo = {
              rewardType: constant.REWARD_TYPE.CAR,
              amount: 1,
              ID: this.carInfo.ID
            };
            uiManager.instance.showDialog('common/showReward', [rewardInfo, false, i18n.t('showReward.title'), function () {
              lottery.receiveCarTimes += 1;
            }]);
          } else {
            //没有加车,转换成金币
            var titleInfo = {
              rewardType: constant.REWARD_TYPE.GOLD,
              amount: constant.LOTTERY.EXCHANGE,
              ID: this.carInfo.ID
            };
            uiManager.instance.showDialog('common/showReward', [titleInfo, false, i18n.t('showReward.title'), function () {}, i18n.t("showReward.alreadyHadCar")]);
          }
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }
        ;

        return lotteryItem;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "imgGold", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "spItem", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lbValue", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/roadPoint.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './fightConstants.ts', './resourceUtil.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Enum, Node, Vec3, macro, Component, fightConstants, resourceUtil;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Enum = module.Enum;
      Node = module.Node;
      Vec3 = module.Vec3;
      macro = module.macro;
      Component = module.Component;
    }, function (module) {
      fightConstants = module.fightConstants;
    }, function (module) {
      resourceUtil = module.resourceUtil;
    }],
    execute: function () {
      exports({
        ROAD_MOVE_TYPE: void 0,
        ROAD_POINT_TYPE: void 0
      });

      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _temp;

      cclegacy._RF.push({}, "953fazcJb1LuJlDQlkFCkFG", "roadPoint", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var ROAD_POINT_TYPE;

      (function (ROAD_POINT_TYPE) {
        ROAD_POINT_TYPE[ROAD_POINT_TYPE["\u666E\u901A\u8282\u70B9"] = fightConstants.ROAD_POINT_TYPE.NORMAL] = "\u666E\u901A\u8282\u70B9";
        ROAD_POINT_TYPE[ROAD_POINT_TYPE["\u5F00\u59CB\u8282\u70B9"] = fightConstants.ROAD_POINT_TYPE.START] = "\u5F00\u59CB\u8282\u70B9";
        ROAD_POINT_TYPE[ROAD_POINT_TYPE["\u63A5\u5BA2\u8282\u70B9"] = fightConstants.ROAD_POINT_TYPE.GREETING] = "\u63A5\u5BA2\u8282\u70B9";
        ROAD_POINT_TYPE[ROAD_POINT_TYPE["\u9001\u5BA2\u8282\u70B9"] = fightConstants.ROAD_POINT_TYPE.PLATFORM] = "\u9001\u5BA2\u8282\u70B9";
        ROAD_POINT_TYPE[ROAD_POINT_TYPE["\u7ED3\u675F\u8282\u70B9"] = fightConstants.ROAD_POINT_TYPE.END] = "\u7ED3\u675F\u8282\u70B9";
        ROAD_POINT_TYPE[ROAD_POINT_TYPE["AI\u5F00\u59CB\u8282\u70B9"] = fightConstants.ROAD_POINT_TYPE.AI_START] = "AI\u5F00\u59CB\u8282\u70B9";
      })(ROAD_POINT_TYPE || (ROAD_POINT_TYPE = exports('ROAD_POINT_TYPE', {})));

      Enum(ROAD_POINT_TYPE);
      var ROAD_MOVE_TYPE;

      (function (ROAD_MOVE_TYPE) {
        ROAD_MOVE_TYPE[ROAD_MOVE_TYPE["\u76F4\u7EBF\u884C\u8D70"] = fightConstants.ROAD_MOVE_TYPE.LINE] = "\u76F4\u7EBF\u884C\u8D70";
        ROAD_MOVE_TYPE[ROAD_MOVE_TYPE["\u66F2\u7EBF\u884C\u8D70"] = fightConstants.ROAD_MOVE_TYPE.BEND] = "\u66F2\u7EBF\u884C\u8D70";
      })(ROAD_MOVE_TYPE || (ROAD_MOVE_TYPE = exports('ROAD_MOVE_TYPE', {})));

      Enum(ROAD_MOVE_TYPE);
      var roadPoint = exports('roadPoint', (_dec = ccclass("roadPoint"), _dec2 = property({
        displayName: '类型',
        type: ROAD_POINT_TYPE,
        displayOrder: 1
      }), _dec3 = property({
        displayName: '下一站',
        type: Node,
        displayOrder: 2
      }), _dec4 = property({
        displayName: '行走方式',
        type: ROAD_MOVE_TYPE,
        displayOrder: 3
      }), _dec5 = property({
        displayName: '顺时针',
        displayOrder: 4,
        visible: function visible() {
          return this.moveType === fightConstants.ROAD_MOVE_TYPE.BEND;
        }
      }), _dec6 = property({
        displayName: '顾客方向',
        displayOrder: 4,
        visible: function visible() {
          return this.type === fightConstants.ROAD_POINT_TYPE.GREETING || this.type === fightConstants.ROAD_POINT_TYPE.PLATFORM;
        }
      }), _dec7 = property({
        displayName: '延迟生成/秒',
        displayOrder: 5,
        visible: function visible() {
          return this.type === fightConstants.ROAD_POINT_TYPE.AI_START;
        }
      }), _dec8 = property({
        displayName: '生成频率/秒',
        displayOrder: 5,
        visible: function visible() {
          return this.type === fightConstants.ROAD_POINT_TYPE.AI_START;
        }
      }), _dec9 = property({
        displayName: '车辆行驶速度',
        displayOrder: 5,
        visible: function visible() {
          return this.type === fightConstants.ROAD_POINT_TYPE.AI_START;
        }
      }), _dec10 = property({
        displayName: '产生车辆(,分隔)',
        displayOrder: 5,
        visible: function visible() {
          return this.type === fightConstants.ROAD_POINT_TYPE.AI_START;
        }
      }), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(roadPoint, _Component);

        function roadPoint() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "type", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "next", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "moveType", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "clockwise", _descriptor4, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "direction", _descriptor5, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "delayTime", _descriptor6, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "genInterval", _descriptor7, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "carSpeed", _descriptor8, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "cars", _descriptor9, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "arrCars", []);

          _defineProperty(_assertThisInitialized(_this), "_generateCb", null);

          return _this;
        }

        var _proto = roadPoint.prototype;

        _proto.start = function start() {
          // Your initialization goes here.
          this.arrCars = this.cars.split(',');
        };

        _proto.startGenerateCar = function startGenerateCar(generateCb) {
          if (this.type !== fightConstants.ROAD_POINT_TYPE.AI_START) {
            return;
          }

          this._generateCb = generateCb;
          this.stopGenerateCar();
          this.scheduleOnce(this.delayStartGen, this.delayTime); //触发资源预加载

          resourceUtil.getCarsBatch(this.arrCars, function () {}, function () {});
        };

        _proto.delayStartGen = function delayStartGen() {
          this.scheduleGen(); //时间到了先生成，然后再过一段时间再生成

          this.schedule(this.scheduleGen, this.genInterval, macro.REPEAT_FOREVER);
        };

        _proto.scheduleGen = function scheduleGen() {
          //随机生成车辆
          var rand = Math.floor(Math.random() * this.arrCars.length);

          if (this._generateCb) {
            this._generateCb(this, this.arrCars[rand]);
          }
        };

        _proto.stopGenerateCar = function stopGenerateCar() {
          this.unschedule(this.delayStartGen);
          this.unschedule(this.scheduleGen);
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }
        ;

        return roadPoint;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return ROAD_POINT_TYPE.普通节点;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "next", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "moveType", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return ROAD_MOVE_TYPE.直线行走;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "clockwise", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "direction", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Vec3();
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "delayTime", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "genInterval", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "carSpeed", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.05;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "cars", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '201';
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/revive.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './clientEvent.ts', './constant.ts', './uiManager.ts', './gameLogic.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Sprite, Widget, Component, clientEvent, constant, uiManager, gameLogic;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Sprite = module.Sprite;
      Widget = module.Widget;
      Component = module.Component;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      uiManager = module.uiManager;
    }, function (module) {
      gameLogic = module.gameLogic;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "95f63L653dBgLBdIgYWzpHv", "revive", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var revive = exports('revive', (_dec = ccclass("revive"), _dec2 = property(Sprite), _dec3 = property(Sprite), _dec4 = property(Widget), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(revive, _Component);

        function revive() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "spCountDown", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spIcon", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "wgMenu", _descriptor3, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "closeCb", null);

          _defineProperty(_assertThisInitialized(_this), "countDownTime", 0);

          _defineProperty(_assertThisInitialized(_this), "currentTime", 0);

          _defineProperty(_assertThisInitialized(_this), "isCountDowning", false);

          return _this;
        }

        var _proto = revive.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.show = function show(closeCallback) {
          this.closeCb = closeCallback; //默认展示满额，倒计时下来最后为0

          this.countDownTime = 5;
          this.currentTime = 0;
          this.spCountDown.fillRange = 1;
          this.isCountDowning = true;
          gameLogic.updateRewardIcon(constant.SHARE_FUNCTION.RELIVE, this.spIcon);
        };

        _proto.onBtnReviveClick = function onBtnReviveClick() {
          var _this2 = this;

          this.isCountDowning = false;
          gameLogic.openReward(constant.SHARE_FUNCTION.RELIVE, function (err) {
            if (!err) {
              clientEvent.dispatchEvent('revive');
              uiManager.instance.hideDialog('fight/revive');
            } else {
              //失败继续倒计时
              _this2.isCountDowning = true;
            }
          });
        };

        _proto.onBtnSkipClick = function onBtnSkipClick() {
          this.isCountDowning = false;
          uiManager.instance.hideDialog('fight/revive');
          this.closeCb && this.closeCb();
        } // update (dt: number) {
        //     if (!this.isCountDowning) {
        //         return;
        //     }
        //     this.currentTime += dt;
        //     let spare = this.countDownTime - this.currentTime;
        //     if (spare <= 0) {
        //         spare = 0;
        //         //触发倒计时结束
        //         this.isCountDowning = false;
        //         this.onBtnSkipClick();
        //     }
        //     let percent = spare / this.countDownTime; // 展示百分比
        //     this.spCountDown.fillRange = percent;
        // }
        ;

        return revive;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "spCountDown", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "spIcon", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "wgMenu", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/blockInputEvent.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _inheritsLoose, cclegacy, _decorator, Node, Component;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "968ba6c9F9AupY/AbKjAj++", "blockInputEvent", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var blockInputEvent = exports('blockInputEvent', (_dec = ccclass("blockInputEvent"), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(blockInputEvent, _Component);

        function blockInputEvent() {
          return _Component.apply(this, arguments) || this;
        }

        var _proto = blockInputEvent.prototype;
        /* class member could be defined like this */
        // dummy = '';

        /* use `property` decorator if your want the member to be serializable */
        // @property
        // serializableDummy = 0;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.onEnable = function onEnable() {
          this.node.on(Node.EventType.TOUCH_START, this.stopPropagation, this);
          this.node.on(Node.EventType.TOUCH_END, this.stopPropagation, this);
          this.node.on(Node.EventType.TOUCH_MOVE, this.stopPropagation, this);
          this.node.on(Node.EventType.TOUCH_CANCEL, this.stopPropagation, this);
          this.node.on(Node.EventType.MOUSE_DOWN, this.stopPropagation, this);
          this.node.on(Node.EventType.MOUSE_ENTER, this.stopPropagation, this);
          this.node.on(Node.EventType.MOUSE_MOVE, this.stopPropagation, this);
          this.node.on(Node.EventType.MOUSE_LEAVE, this.stopPropagation, this);
          this.node.on(Node.EventType.MOUSE_UP, this.stopPropagation, this);
          this.node.on(Node.EventType.MOUSE_WHEEL, this.stopPropagation, this);
        };

        _proto.onDisable = function onDisable() {
          this.node.off(Node.EventType.TOUCH_START, this.stopPropagation, this);
          this.node.off(Node.EventType.TOUCH_END, this.stopPropagation, this);
          this.node.off(Node.EventType.TOUCH_MOVE, this.stopPropagation, this);
          this.node.off(Node.EventType.TOUCH_CANCEL, this.stopPropagation, this);
          this.node.off(Node.EventType.MOUSE_DOWN, this.stopPropagation, this);
          this.node.off(Node.EventType.MOUSE_ENTER, this.stopPropagation, this);
          this.node.off(Node.EventType.MOUSE_MOVE, this.stopPropagation, this);
          this.node.off(Node.EventType.MOUSE_LEAVE, this.stopPropagation, this);
          this.node.off(Node.EventType.MOUSE_UP, this.stopPropagation, this);
          this.node.off(Node.EventType.MOUSE_WHEEL, this.stopPropagation, this);
        };

        _proto.stopPropagation = function stopPropagation(event) {
          event.propagationImmediateStopped = true;
          event.propagationStopped = true;
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }
        ;

        return blockInputEvent;
      }(Component)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/playerData.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './configuration.ts', './constant.ts', './util.ts', './localConfig.ts'], function (exports) {
  'use strict';

  var _defineProperty, _inheritsLoose, _assertThisInitialized, _createClass, cclegacy, _decorator, Component, configuration, constant, util, localConfig;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
      _inheritsLoose = module.inheritsLoose;
      _assertThisInitialized = module.assertThisInitialized;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      configuration = module.configuration;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      util = module.util;
    }, function (module) {
      localConfig = module.localConfig;
    }],
    execute: function () {
      var _dec, _class, _class2, _temp;

      cclegacy._RF.push({}, "985d59n5DNIrIcY9mIscZXN", "playerData", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property; // {
      //     level: number,
      //     gold: number,
      //     diamond: number,
      //     realLevel: number,
      //     passCheckPoint: boolean,
      //     createDate: any,
      //     currentCar: number,
      //     cars: number[],
      //     onlineRewardTime: number,
      //     dictBuyTask: { [name: string]: any },
      //     signInInfo: { [name: string]: any },
      //     dictGetCarTime: { [name: string]: any }
      // };

      var playerData = exports('playerData', (_dec = ccclass("playerData"), _dec(_class = (_temp = _class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(playerData, _Component);

        function playerData() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _defineProperty(_assertThisInitialized(_this), "serverTime", 0);

          _defineProperty(_assertThisInitialized(_this), "localTime", 0);

          _defineProperty(_assertThisInitialized(_this), "showCar", 0);

          _defineProperty(_assertThisInitialized(_this), "isComeFromBalance", false);

          _defineProperty(_assertThisInitialized(_this), "userId", '');

          _defineProperty(_assertThisInitialized(_this), "playerInfo", {});

          _defineProperty(_assertThisInitialized(_this), "history", null);

          _defineProperty(_assertThisInitialized(_this), "settings", null);

          _defineProperty(_assertThisInitialized(_this), "isNewBee", false);

          _defineProperty(_assertThisInitialized(_this), "dataVersion", '');

          _defineProperty(_assertThisInitialized(_this), "signInInfo", null);

          return _this;
        }

        var _proto = playerData.prototype;

        _proto.loadGlobalCache = function loadGlobalCache() {
          var userId = configuration.instance.getUserId();

          if (userId) {
            this.userId = userId;
          }
        };

        _proto.loadFromCache = function loadFromCache() {
          //读取玩家基础数据
          this.playerInfo = this.loadDataByKey(constant.LOCAL_CACHE.PLAYER);

          if (this.playerInfo.currentCar) {
            this.showCar = this.playerInfo.currentCar;
          } else {
            this.showCar = constant.INITIAL_CAR;
          }

          this.history = this.loadDataByKey(constant.LOCAL_CACHE.HISTORY); // this.bag = this.loadDataByKey(constants.LOCAL_CACHE.BAG);

          this.settings = this.loadDataByKey(constant.LOCAL_CACHE.SETTINGS);
        };

        _proto.loadDataByKey = function loadDataByKey(keyName) {
          var ret = {};
          var str = configuration.instance.getConfigData(keyName);

          if (str) {
            try {
              ret = JSON.parse(str);
            } catch (e) {
              ret = {};
            }
          }

          return ret;
        };

        _proto.createPlayerInfo = function createPlayerInfo(loginData) {
          this.playerInfo.level = 1; //默认初始关卡

          this.playerInfo.realLevel = 1; //真正关卡

          this.playerInfo.passCheckPoint = false; //是否已经通过20关

          this.playerInfo.createDate = new Date(); //记录创建时间

          this.playerInfo.currentCar = constant.INITIAL_CAR; //初始车辆

          this.playerInfo.cars = [];
          this.playerInfo.cars.push(constant.INITIAL_CAR); //拥有的车辆

          this.playerInfo.dictBuyTask = {};
          this.showCar = this.playerInfo.currentCar;
          this.isNewBee = true; //区分新老玩家

          this.playerInfo.signInInfo = {}; //七日签到

          this.playerInfo.dictGetCarTime = {}; //获得车辆的时间

          if (loginData) {
            for (var key in loginData) {
              this.playerInfo[key] = loginData[key];
            }
          } // if (!this.playerInfo.avatarUrl) {
          //     //随机个头像给他
          // }
          // this.playerInfo.dictTask = this.createRandTask();
          // this.playerInfo.taskDate = new Date(); //任务创建时间


          this.savePlayerInfoToLocalCache();
        };

        _proto.saveAccount = function saveAccount(userId) {
          this.userId = userId;
          configuration.instance.setUserId(userId);
        }
        /**
         * 保存玩家数据
         */
        ;

        _proto.savePlayerInfoToLocalCache = function savePlayerInfoToLocalCache() {
          configuration.instance.setConfigData(constant.LOCAL_CACHE.PLAYER, JSON.stringify(this.playerInfo));
        }
        /**
         * 当数据同步完毕，即被覆盖的情况下，需要将数据写入到本地缓存，以免数据丢失
         */
        ;

        _proto.saveAll = function saveAll() {
          configuration.instance.setConfigDataWithoutSave(constant.LOCAL_CACHE.PLAYER, JSON.stringify(this.playerInfo));
          configuration.instance.setConfigDataWithoutSave(constant.LOCAL_CACHE.HISTORY, JSON.stringify(this.history));
          configuration.instance.setConfigDataWithoutSave(constant.LOCAL_CACHE.SETTINGS, JSON.stringify(this.settings)); // configuration.instance.setConfigDataWithoutSave(constant.LOCAL_CACHE.BAG, JSON.stringify(this.bag));

          configuration.instance.setConfigData(constant.LOCAL_CACHE.DATA_VERSION, this.dataVersion);
        }
        /**
         * 更新用户信息
         * 例如钻石，金币，道具
         * @param {String} key
         * @param {Number} value
         */
        ;

        _proto.updatePlayerInfo = function updatePlayerInfo(key, value) {
          var isChanged = false;

          if (this.playerInfo.hasOwnProperty(key)) {
            if (typeof value === 'number') {
              isChanged = true;
              this.playerInfo[key] += value;

              if (this.playerInfo[key] < 0) {
                this.playerInfo[key] = 0;
              } //return;

            } else if (typeof value === 'boolean' || typeof value === 'string') {
              isChanged = true;
              this.playerInfo[key] = value;
            }
          }

          if (isChanged) {
            //有修改就保存到localcache
            configuration.instance.setConfigData(constant.LOCAL_CACHE.PLAYER, JSON.stringify(this.playerInfo));
          }
        }
        /*********************** 七日签到 ***********************/

        /**
         * 更新签到领取日期，补签状态，如果超过7天则轮回
         */
        ;

        _proto.updateSignInCurrentDay = function updateSignInCurrentDay() {
          if (Object.keys(this.playerInfo.signInInfo).length === 0 || this.isNeedRecycleSignInInfo()) {
            this.createNewSignInInfo();
          } else {
            var offectDays = util.getDeltaDays(this.playerInfo.signInInfo.signInDate, Date.now()); //比较两个时间，为0则今天更新过

            if (offectDays === 0) {
              return;
            } //将昨天“补签后”但是没领取奖励重置为“补签”状态


            this.updateSignInFillSignInDays(0, true); //更新领取今日签到信息

            this.playerInfo.signInInfo.currentDay += offectDays; //当测试时间差异的时候将当前的时间设置为第一天

            if (this.playerInfo.signInInfo.currentDay <= 0) {
              this.createNewSignInInfo();
            }

            this.playerInfo.signInInfo.currentDay > constant.MAX_SIGNIN_DAY ? constant.MAX_SIGNIN_DAY : this.playerInfo.signInInfo.currentDay;
            this.playerInfo.signInInfo.signInDate = Date.now();
          }

          this.savePlayerInfoToLocalCache();
        }
        /**
         * 创建新的签到信息
         */
        ;

        _proto.createNewSignInInfo = function createNewSignInInfo() {
          if (!this.playerInfo.hasOwnProperty('signInInfo')) {
            this.playerInfo.signInInfo = {};
            this.playerInfo.dictGetCarTime = {};
          }

          var signInInfo = this.playerInfo.signInInfo; //创建时间

          signInInfo.createDate = Date.now(); //签到时间

          signInInfo.signInDate = Date.now(); //当前天数

          signInInfo.currentDay = 1; //已经领取天数

          signInInfo.receivedDays = []; //补签后可以领取的天数

          signInInfo.afterFillSignInDays = [];
          this.savePlayerInfoToLocalCache();
        }
        /**
        * 是否需要重新开始一个新的签到周期
        */
        ;

        _proto.isNeedRecycleSignInInfo = function isNeedRecycleSignInInfo() {
          if (!this.playerInfo.signInInfo) {
            this.createNewSignInInfo();
          }

          var isNeedRecycled = false;
          var diffTime = util.getDeltaDays(this.playerInfo.signInInfo.createDate, Date.now()); //当前日期与创建日期超过七天，1号7号相差6天，第8天进行更新

          if (diffTime >= constant.MAX_SIGNIN_DAY) {
            isNeedRecycled = true;
          }

          return isNeedRecycled;
        }
        /**
         * 更新领取奖励后已领取日期数组
         * @param {Number} day
        */
        ;

        _proto.updateSignInReceivedDays = function updateSignInReceivedDays(day) {
          var receivedDays = this.playerInfo.signInInfo.receivedDays;

          if (Array.isArray(receivedDays) && receivedDays.includes(day)) {
            return;
          }

          receivedDays.push(Number(day));
          this.savePlayerInfoToLocalCache();
        }
        /**
         * 更新补签后变为可领取的日期数组
         * @param {number} day
         * @param {boolean} isClear 是否清空昨天补签完后还未领取的数组
         */
        ;

        _proto.updateSignInFillSignInDays = function updateSignInFillSignInDays(day, isClear) {
          var afterFillSignInDays = this.playerInfo.signInInfo.afterFillSignInDays;

          if (!isClear) {
            if (Array.isArray(afterFillSignInDays) && afterFillSignInDays.includes(day)) {
              return;
            }

            afterFillSignInDays.push(Number(day));
          } else {
            afterFillSignInDays.length = 0;
          }

          this.savePlayerInfoToLocalCache();
        }
        /**
         * 返回“当天”还有“全部”的签到奖励领取情况
         * 用来判断“显示领取按钮”，“登陆自动显示签到界面”和“红点提示”
         * @returns {boolean, boolean} isAllReceived是否全部领取， isTodayReceived是否当天已领取
         */
        ;

        _proto.getSignInReceivedInfo = function getSignInReceivedInfo() {
          if (!this.playerInfo.signInInfo) {
            this.createNewSignInInfo();
          }

          var signInInfo = this.playerInfo.signInInfo;
          var isAllReceived = false;
          var isTodayReceived = false;

          if (signInInfo.receivedDays.length < signInInfo.currentDay) {
            isAllReceived = false;
          } else {
            isAllReceived = true;
          }

          if (signInInfo.receivedDays.includes(signInInfo.currentDay)) {
            isTodayReceived = true;
          } else {
            isTodayReceived = false;
          }

          return {
            isAllReceived: isAllReceived,
            isTodayReceived: isTodayReceived
          };
        }
        /**
         * 判断如果已有该车,且还在第一次得到车的周期内则显示“车，领取, 暂不领取”，否则为“金币，双倍领取，普通领取”
         *
         * @param {number} ID 车的ID
         * @returns
         * @memberof playerData
         */
        ;

        _proto.isHadCarAndDuringPeriod = function isHadCarAndDuringPeriod(ID) {
          var createDate = this.playerInfo.signInInfo.createDate;

          if (!this.playerInfo.dictGetCarTime) {
            this.playerInfo.dictGetCarTime = {};
          }

          var getCarDate = this.playerInfo.dictGetCarTime[ID];
          var isHadCar = this.playerInfo.cars.indexOf(ID) !== -1;
          return isHadCar && getCarDate && getCarDate < createDate;
        }
        /**
         * 更新汽车的领取信息
         * @param ID 车的ID
         */
        ;

        _proto.updateDictGetCarTime = function updateDictGetCarTime(ID) {
          if (!this.playerInfo.dictGetCarTime) {
            this.playerInfo.dictGetCarTime = {};
          }

          this.playerInfo.dictGetCarTime[ID] = this.playerInfo.signInInfo.createDate;
          configuration.instance.setConfigData(constant.LOCAL_CACHE.PLAYER, JSON.stringify(this.playerInfo));
        }
        /**********************************************/
        ;

        _proto.getLastOnlineRewardTime = function getLastOnlineRewardTime() {
          if (this.playerInfo.onlineRewardTime) {
            return this.playerInfo.onlineRewardTime;
          }

          this.playerInfo.onlineRewardTime = this.getCurrentTime();
          this.savePlayerInfoToLocalCache();
          return this.playerInfo.onlineRewardTime;
        }
        /**
         * 更新最后一次领取时间
         *
         * @param {number} elapsedTime 已经度过的时间,单位秒
         * @memberof playerData
         */
        ;

        _proto.updateLastOnlineRewardTime = function updateLastOnlineRewardTime(elapsedTime) {
          var time = this.getCurrentTime() - elapsedTime * 1000;
          this.playerInfo.onlineRewardTime = time;
          this.savePlayerInfoToLocalCache();
        }
        /**
         * 同步服务器时间
         */
        ;

        _proto.syncServerTime = function syncServerTime(serverTime) {
          this.serverTime = serverTime;
          this.localTime = Date.now();
        }
        /**
         * 获取当前时间
         */
        ;

        _proto.getCurrentTime = function getCurrentTime() {
          var diffTime = Date.now() - this.localTime;
          return this.serverTime + diffTime;
        }
        /**
         * 检查玩家是否拥有对应车辆
         *
         * @param {number} carID
         * @memberof playerData
         */
        ;

        _proto.hasCar = function hasCar(carID) {
          if (carID === constant.INITIAL_CAR) {
            return true;
          }

          if (!this.playerInfo.cars) {
            this.playerInfo.cars = [constant.INITIAL_CAR];
          }

          return this.playerInfo.cars.indexOf(carID) !== -1;
        };

        _proto.hasCarCanReceived = function hasCarCanReceived() {
          var arrCars = localConfig.instance.getCars();

          for (var idx = 0; idx < arrCars.length; idx++) {
            var carInfo = arrCars[idx];

            if (carInfo.type === constant.BUY_CAR_TYPE.GOLD || carInfo.type === constant.BUY_CAR_TYPE.SIGNIN) {
              continue;
            }

            if (this.hasCar(carInfo.ID)) {
              continue;
            }

            if (!this.playerInfo.dictBuyTask || !this.playerInfo.dictBuyTask.hasOwnProperty(carInfo.type)) {
              continue;
            }

            if (this.playerInfo.dictBuyTask[carInfo.type] >= carInfo.num) {
              return true;
            }
          }

          return false;
        };

        _proto.finishBuyTask = function finishBuyTask(type, value, isAdd) {
          if (!this.playerInfo.dictBuyTask) {
            this.playerInfo.dictBuyTask = {};
          }

          if (!this.playerInfo.dictBuyTask.hasOwnProperty(type) || !isAdd) {
            this.playerInfo.dictBuyTask[type] = value;
          } else {
            this.playerInfo.dictBuyTask[type] += value;
          }

          this.savePlayerInfoToLocalCache();
        }
        /**
         * 获取任务的进度
         *
         * @param {*} type
         * @memberof playerData
         */
        ;

        _proto.getBuyTypeProgress = function getBuyTypeProgress(type) {
          if (this.playerInfo.dictBuyTask && this.playerInfo.dictBuyTask.hasOwnProperty(type)) {
            return this.playerInfo.dictBuyTask[type];
          }

          return 0;
        }
        /**
         * 获取当前车辆
         *
         * @returns
         * @memberof playerData
         */
        ;

        _proto.getCurrentCar = function getCurrentCar() {
          if (!this.playerInfo.currentCar) {
            this.playerInfo.currentCar = constant.INITIAL_CAR;
          }

          return this.playerInfo.currentCar;
        }
        /**
         *
         * 使用某辆车
         * @param {*} carId
         * @returns
         * @memberof playerData
         */
        ;

        _proto.useCar = function useCar(carId) {
          if (!this.hasCar(carId)) {
            return false;
          }

          this.playerInfo.currentCar = carId;
          this.savePlayerInfoToLocalCache();
          this.showCar = this.playerInfo.currentCar;
          return true;
        };

        _proto.buyCar = function buyCar(carId) {
          if (this.playerInfo.cars.indexOf(carId) !== -1) {
            return true;
          }

          this.playerInfo.cars.push(carId);
          this.savePlayerInfoToLocalCache();
          return true;
        };

        _proto.clear = function clear() {
          this.playerInfo = {};
          this.settings = {};
          this.saveAll();
        }
        /*********************** 战斗相关 ***********************/
        //关卡完成
        ;

        _proto.passLevel = function passLevel(rewardMoney) {
          this.playerInfo.level++;
          this.playerInfo.gold += rewardMoney;
          console.log("###1 this.playerInfo.level", this.playerInfo.level, 'this.playerInfo.realLevel', this.playerInfo.realLevel); //标记已经通过20关了

          if (!this.playerInfo.passCheckPoint) {
            if (this.playerInfo.level >= constant.MAX_LEVEL) {
              this.playerInfo.realLevel = constant.MAX_LEVEL;
              this.playerInfo.level = constant.MAX_LEVEL;
              this.playerInfo.passCheckPoint = true;
              console.log("###2 this.playerInfo.level", this.playerInfo.level, 'this.playerInfo.realLevel', this.playerInfo.realLevel);
            } else {
              this.playerInfo.realLevel = this.playerInfo.level;
            }
          } else {
            this.playerInfo.realLevel = this.getRandLevel();
            console.log("###3 this.playerInfo.level", this.playerInfo.level, 'this.playerInfo.realLevel', this.playerInfo.realLevel);
          }

          this.savePlayerInfoToLocalCache();
        };

        _proto.getRandLevel = function getRandLevel() {
          //随机16-20关中的一个,但不跟现在的一样
          var level = -1;

          while (level === -1) {
            var randLevel = 16 + Math.floor(Math.random() * 5);

            if (randLevel !== this.playerInfo.realLevel) {
              level = randLevel;
            }
          }

          return level;
        };

        _createClass(playerData, null, [{
          key: "instance",
          get: function get() {
            if (this._instance) {
              return this._instance;
            }

            this._instance = new playerData();
            return this._instance;
          }
        }]);

        return playerData;
      }(Component), _defineProperty(_class2, "_instance", void 0), _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/GameRoot.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './audioManager.ts', './setting.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, AudioSource, assert, game, Component, audioManager, setting;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      AudioSource = module.AudioSource;
      assert = module.assert;
      game = module.game;
      Component = module.Component;
    }, function (module) {
      audioManager = module.audioManager;
    }, function (module) {
      setting = module.setting;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "98dcdQl8GhEYLJRG8ap+Eh+", "GameRoot", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var GameRoot = exports('GameRoot', (_dec = ccclass('GameRoot'), _dec2 = property(AudioSource), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(GameRoot, _Component);

        function GameRoot() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "_audioSource", _descriptor, _assertThisInitialized(_this));

          return _this;
        }

        var _proto = GameRoot.prototype;

        _proto.onLoad = function onLoad() {
          var audioSource = this.getComponent(AudioSource);
          assert(audioSource);
          this._audioSource = audioSource;
          game.addPersistRootNode(this.node); // init AudioManager

          audioManager.instance.init(this._audioSource);
        };

        _proto.onEnable = function onEnable() {
          // NOTE: 常驻节点在切场景时会暂停音乐，需要在 onEnable 继续播放
          // 之后需要在引擎侧解决这个问题
          audioManager.instance.playMusic(true);
          setting.checkState();
        };

        _proto.start = function start() {
          if ($global.cocosAnalytics) {
            $global.cocosAnalytics.enableDebug(true);
          }
        };

        return GameRoot;
      }(Component), _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_audioSource", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/loading.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './updateValueLabel.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Label, Vec3, Component, updateValueLabel;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
      Vec3 = module.Vec3;
      Component = module.Component;
    }, function (module) {
      updateValueLabel = module.updateValueLabel;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "99c5fx0klFHq52oGPdZL7Z5", "loading", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var loading = exports('loading', (_dec = ccclass("loading"), _dec2 = property(updateValueLabel), _dec3 = property(Label), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(loading, _Component);

        function loading() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "lbProgress", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbTips", _descriptor2, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "targetProgress", 0);

          _defineProperty(_assertThisInitialized(_this), "oriPos", new Vec3());

          return _this;
        }

        var _proto = loading.prototype;

        _proto.start = function start() {
          this.show(0);
        };

        _proto.show = function show(start) {
          if (start) {
            this.targetProgress = start;
          } else {
            this.targetProgress = 0;
          }

          this.lbProgress.playUpdateValue(this.targetProgress, this.targetProgress, 0);
          this.lbProgress.isPlaying = false;
          this.lbTips.string = '';
          this.oriPos.set(this.lbProgress.node.position);
        };

        _proto.updateProgress = function updateProgress(progress, tips) {
          this.targetProgress = progress;
          var curProgress = Number(this.lbProgress.label.string); //当前进度

          this.lbProgress.playUpdateValue(curProgress, this.targetProgress, (this.targetProgress - curProgress) / 20);

          if (tips) {
            this.lbTips.string = tips;
          }

          if (this.oriPos) {
            this.lbProgress.node.setPosition(new Vec3(this.oriPos.x - 10, this.oriPos.y, this.oriPos.z));
          }
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }
        ;

        return loading;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "lbProgress", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "lbTips", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/signIn.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './clientEvent.ts', './constant.ts', './util.ts', './localConfig.ts', './playerData.ts', './uiManager.ts', './gameLogic.ts', './LanguageData.ts', './signInItem.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Node, Sprite, SpriteFrame, Prefab, Button, instantiate, Component, clientEvent, constant, util, localConfig, playerData, uiManager, gameLogic, i18n, signInItem;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Sprite = module.Sprite;
      SpriteFrame = module.SpriteFrame;
      Prefab = module.Prefab;
      Button = module.Button;
      instantiate = module.instantiate;
      Component = module.Component;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      util = module.util;
    }, function (module) {
      localConfig = module.localConfig;
    }, function (module) {
      playerData = module.playerData;
    }, function (module) {
      uiManager = module.uiManager;
    }, function (module) {
      gameLogic = module.gameLogic;
    }, function (module) {
      i18n = module.i18n;
    }, function (module) {
      signInItem = module.signInItem;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _temp;

      cclegacy._RF.push({}, "9d016bBiB5J1prtR6VcBPd4", "signIn", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var signIn = exports('signIn', (_dec = ccclass("signIn"), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec8 = property(Sprite), _dec9 = property(Sprite), _dec10 = property(SpriteFrame), _dec11 = property(SpriteFrame), _dec12 = property(SpriteFrame), _dec13 = property(SpriteFrame), _dec14 = property(Node), _dec15 = property(Prefab), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(signIn, _Component);

        function signIn() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "ndBtnNormal", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "ndBtnDouble", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "ndBtnReceive", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "ndReceiveIconn", _descriptor4, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "ndBtnClose", _descriptor5, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "ndBtnNotYet", _descriptor6, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spDoubleBtnIcon", _descriptor7, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spReceiveBtnIcon", _descriptor8, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "sfBlue", _descriptor9, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "sfGray", _descriptor10, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "sfVideo", _descriptor11, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "sfShare", _descriptor12, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "arrNodeDay", _descriptor13, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "pbSignInItem", _descriptor14, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "currentDay", 0);

          _defineProperty(_assertThisInitialized(_this), "arrReceived", []);

          _defineProperty(_assertThisInitialized(_this), "arrAfterFillSignIn", []);

          _defineProperty(_assertThisInitialized(_this), "isTodayReceived", false);

          _defineProperty(_assertThisInitialized(_this), "isAllReceived", false);

          _defineProperty(_assertThisInitialized(_this), "arrSignInItemScript", []);

          _defineProperty(_assertThisInitialized(_this), "currentReward", void 0);

          _defineProperty(_assertThisInitialized(_this), "currentRewardType", void 0);

          _defineProperty(_assertThisInitialized(_this), "isHadCar", void 0);

          _defineProperty(_assertThisInitialized(_this), "createDate", void 0);

          _defineProperty(_assertThisInitialized(_this), "getCarDate", void 0);

          return _this;
        }

        var _proto = signIn.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.show = function show() {
          playerData.instance.updateSignInCurrentDay();
          var signInInfo = playerData.instance.playerInfo.signInInfo;
          this.currentDay = signInInfo.currentDay;
          this.arrReceived = signInInfo.receivedDays;
          this.arrAfterFillSignIn = signInInfo.afterFillSignInDays;
          gameLogic.updateRewardIcon(constant.SHARE_FUNCTION.SIGNIN, this.spDoubleBtnIcon);
          gameLogic.updateRewardIcon(constant.SHARE_FUNCTION.SIGNIN, this.spReceiveBtnIcon);
          this.showSignInInfo();
          this.setButtonStyle();
          this.ndReceiveIconn.active = true;
        }
        /**
         * 分为“双倍领取-普通领取-关闭”， “领取-暂不领取-关闭”两种形式,当天奖励为金币显示第一种，为车辆显示第二种
         */
        ;

        _proto.setButtonStyle = function setButtonStyle() {
          //如果今天领取完了就将双倍领取按钮或领取按钮置灰
          var receiveStatus = playerData.instance.getSignInReceivedInfo();
          this.isTodayReceived = receiveStatus.isTodayReceived;
          this.isAllReceived = receiveStatus.isAllReceived;
          this.ndBtnDouble.getComponent(Sprite).spriteFrame = this.isTodayReceived ? this.sfGray : this.sfBlue;
          this.ndBtnDouble.getComponent(Button).interactable = !this.isTodayReceived;
          this.ndBtnReceive.getComponent(Sprite).spriteFrame = this.isTodayReceived ? this.sfGray : this.sfBlue;
          this.ndBtnReceive.getComponent(Button).interactable = !this.isTodayReceived;
          var arrSignIn = localConfig.instance.getTableArr("signIn");
          this.currentReward = arrSignIn[this.currentDay - 1];
          this.currentRewardType = this.currentReward.rewardType;

          if (this.currentRewardType === constant.REWARD_TYPE.CAR) {
            if (playerData.instance.isHadCarAndDuringPeriod(this.currentReward.amount)) {
              this.ndBtnDouble.active = true;
              this.ndBtnReceive.active = false;
              this.ndBtnNormal.active = !this.isTodayReceived;
              this.ndBtnNotYet.active = false;
            } else {
              this.ndBtnDouble.active = false;
              this.ndBtnReceive.active = true;
              this.ndBtnNormal.active = false;
              this.ndBtnNotYet.active = !this.isTodayReceived;
            }
          } else {
            this.ndBtnDouble.active = true;
            this.ndBtnReceive.active = false;
            this.ndBtnNormal.active = !this.isTodayReceived;
            this.ndBtnNotYet.active = false;
          }
        };

        _proto.showSignInInfo = function showSignInInfo() {
          this.arrSignInItemScript = [];
          var arrSignIn = localConfig.instance.getTableArr("signIn");

          for (var idx = 0; idx < arrSignIn.length; idx++) {
            var day = arrSignIn[idx].ID;
            var isReceived = this.arrReceived.includes(day) ? true : false; //从签到数组中判断是否已经领取

            if (day <= this.currentDay) {
              //状态设置为已领取或者可领取
              arrSignIn[idx].status = isReceived ? constant.SIGNIN_REWARD_STATUS.RECEIVED : constant.SIGNIN_REWARD_STATUS.RECEIVABLE;

              if (arrSignIn[idx].status === constant.SIGNIN_REWARD_STATUS.RECEIVABLE && day < this.currentDay) {
                arrSignIn[idx].status = constant.SIGNIN_REWARD_STATUS.FILL_SIGNIN;

                if (this.arrAfterFillSignIn.includes(day)) {
                  arrSignIn[idx].status = constant.SIGNIN_REWARD_STATUS.AFTER_FILL_SIGNIN;
                }
              }
            } else {
              //不可领取
              arrSignIn[idx].status = constant.SIGNIN_REWARD_STATUS.UNRECEIVABLE;
            } // 确定布局后，设置位置


            var node = this.arrNodeDay[idx];
            var signInItemNode = null;

            if (!node.getChildByName('signInItem')) {
              signInItemNode = instantiate(this.pbSignInItem);
              node.addChild(signInItemNode);
            } else {
              signInItemNode = node.getChildByName('signInItem');
            }

            var signInItemScript = signInItemNode.getComponent(signInItem);
            signInItemScript.init(arrSignIn[idx], this);

            if (!this.arrSignInItemScript.includes(signInItemScript)) {
              this.arrSignInItemScript.push(signInItemScript);
            }
          }
        }
        /**
         * 领取奖励
         *
         * @param {object} itemInfo 单个奖励信息
         * @param {boolean} itemInfo 是否是双倍奖励
         * @param {function} callback 更新签到界面的UI
         */
        ;

        _proto.receiveReward = function receiveReward(itemInfo, isDouble, callback) {
          var day = itemInfo.ID; //大于可领奖天数点击图标不能领取

          if (this.currentDay < day) {
            return;
          }

          var title = i18n.t("showReward.signinReward");
          var targetItemInfo = util.clone(itemInfo);

          if (itemInfo.ID == 2 || itemInfo.ID == 7) {
            var targetCar = localConfig.instance.queryByID('car', itemInfo.amount);
            targetItemInfo.ID = targetCar.ID;
            var isHadCar = playerData.instance.playerInfo.cars.indexOf(targetCar.ID) !== -1;

            if (isHadCar) {
              targetItemInfo.rewardType = constant.REWARD_TYPE.GOLD;
              targetItemInfo.amount = itemInfo.ID == 2 ? constant.GOLD_REWARD.SECOND : constant.GOLD_REWARD.SEVENT;
            }
          }

          targetItemInfo.amount = isDouble ? targetItemInfo.amount *= 2 : targetItemInfo.amount;
          uiManager.instance.shiftFromPopupSeq('signIn/signIn'); // this.unschedule(this.showBtnSecondaryCallback);

          if (targetItemInfo.rewardType === constant.REWARD_TYPE.GOLD) {
            playerData.instance.updatePlayerInfo('gold', targetItemInfo.amount);
            gameLogic.showFlyReward(constant.REWARD_TYPE.GOLD, function () {
              clientEvent.dispatchEvent('updateGold');
            });
            callback && callback();
            return;
          }

          uiManager.instance.pushToPopupSeq('common/showReward', 'showReward', [targetItemInfo, false, title, callback]);
        }
        /**
         * 点击领取
         *
         * @param {boolean} isDouble
         * @memberof signIn
         */
        ;

        _proto.receiveClick = function receiveClick(isDouble) {
          var _this2 = this;

          var _loop = function _loop(j) {
            var element = _this2.arrSignInItemScript[j]; //只有今天的状态才存在RECEIVABLE

            if (element.itemInfo.status === constant.SIGNIN_REWARD_STATUS.RECEIVABLE) {
              element._parent.receiveReward(element.itemInfo, isDouble, function () {
                element.markReceived();
              });

              return "break";
            }
          };

          for (var j = 0; j < this.arrSignInItemScript.length; j++) {
            var _ret = _loop(j);

            if (_ret === "break") break;
          }
        }
        /**
         * 双倍领取
         */
        ;

        _proto.onBtnDoubleClick = function onBtnDoubleClick() {
          var _this3 = this;

          gameLogic.openReward(constant.SHARE_FUNCTION.SIGNIN, function (err) {
            if (!err) {
              _this3.receiveClick(true);
            }
          });
        }
        /**
         * 普通领取
         */
        ;

        _proto.onBtnNormalClick = function onBtnNormalClick() {
          this.receiveClick(false);
        }
        /**
         * 领取
         */
        ;

        _proto.onBtnReceiveClick = function onBtnReceiveClick() {
          var _this4 = this;

          gameLogic.openReward(constant.SHARE_FUNCTION.SIGNIN, function (err) {
            if (!err) {
              _this4.receiveClick(false);
            }
          });
        }
        /**
         * 暂不领取,关闭
         */
        ;

        _proto.onBtnCloseClick = function onBtnCloseClick() {
          uiManager.instance.shiftFromPopupSeq('signIn/signIn');
        };

        return signIn;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "ndBtnNormal", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "ndBtnDouble", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "ndBtnReceive", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "ndReceiveIconn", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "ndBtnClose", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "ndBtnNotYet", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "spDoubleBtnIcon", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "spReceiveBtnIcon", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "sfBlue", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "sfGray", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "sfVideo", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "sfShare", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "arrNodeDay", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "pbSignInItem", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/localConfig.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './resourceUtil.ts', './csvManager.ts'], function (exports) {
  'use strict';

  var _defineProperty, _createClass, cclegacy, _decorator, resourceUtil, csvManager;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      resourceUtil = module.resourceUtil;
    }, function (module) {
      csvManager = module.csvManager;
    }],
    execute: function () {
      var _dec, _class, _class2, _temp;

      cclegacy._RF.push({}, "acd0cVlaIhLurmAIUS/N+2B", "localConfig", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var localConfig = exports('localConfig', (_dec = ccclass("localConfig"), _dec(_class = (_temp = _class2 = /*#__PURE__*/function () {
        function localConfig() {
          _defineProperty(this, "csvManager", null);

          _defineProperty(this, "arrCars", []);

          _defineProperty(this, "_callback", null);

          _defineProperty(this, "_skills", {});

          _defineProperty(this, "currentLoad", 0);

          _defineProperty(this, "cntLoad", 0);

          _defineProperty(this, "servers", []);
        }

        var _proto = localConfig.prototype;

        _proto.loadConfig = function loadConfig(cb) {
          this._callback = cb;
          this.csvManager = new csvManager();
          this.loadCSV();
        };

        _proto.loadCSV = function loadCSV() {
          var _this = this; //新增数据表 请往该数组中添加....


          var arrTables = ['talk', 'car', 'signIn'];
          this.cntLoad = arrTables.length + 1; //+1主要是后续还有技能配置的加载，特殊处理
          //客户端加载

          arrTables.forEach(function (tableName, index, array) {
            resourceUtil.getData(tableName, function (err, content) {
              _this.csvManager.addTable(tableName, content);

              _this.tryToCallbackOnFinished();
            });
          }); //载入技能配置信息
          // resourceUtil.getData("skills", function (err, content) {
          //     _this._skills = JSON.parse(content);
          //     _this.tryToCallbackOnFinished();
          // });

          resourceUtil.getJsonData("servers", function (err, content) {
            _this.servers = content;

            _this.tryToCallbackOnFinished();
          });
        };

        _proto.queryOne = function queryOne(tableName, key, value) {
          return this.csvManager.queryOne(tableName, key, value);
        };

        _proto.queryByID = function queryByID(tableName, ID) {
          return this.csvManager.queryByID(tableName, ID);
        };

        _proto.getTable = function getTable(tableName) {
          return this.csvManager.getTable(tableName);
        };

        _proto.getTableArr = function getTableArr(tableName) {
          return this.csvManager.getTableArr(tableName);
        };

        _proto.getCars = function getCars() {
          if (this.arrCars.length > 0) {
            return this.arrCars;
          }

          var arr = localConfig.instance.getTableArr('car');
          this.arrCars = arr.sort(function (elementA, elementB) {
            return elementA.sort - elementB.sort;
          });
          return this.arrCars;
        } // 选出指定表里面所有有 key=>value 键值对的数据
        ;

        _proto.queryAll = function queryAll(tableName, key, value) {
          return this.csvManager.queryAll(tableName, key, value);
        } // 选出指定表里所有 key 的值在 values 数组中的数据，返回 Object，key 为 ID
        ;

        _proto.queryIn = function queryIn(tableName, key, values) {
          return this.csvManager.queryIn(tableName, key, values);
        } // 选出符合条件的数据。condition key 为表格的key，value 为值的数组。返回的object，key 为数据在表格的ID，value为具体数据
        ;

        _proto.queryByCondition = function queryByCondition(tableName, condition) {
          return this.csvManager.queryByCondition(tableName, condition);
        };

        _proto.tryToCallbackOnFinished = function tryToCallbackOnFinished() {
          if (this._callback) {
            this.currentLoad++;

            if (this.currentLoad >= this.cntLoad) {
              this._callback();
            }
          }
        };

        _proto.getCurrentServer = function getCurrentServer() {
          return this.servers[0];
        };

        _proto.getVersion = function getVersion() {
          var server = this.getCurrentServer();
          var version = server ? server.version : 'unknown';
          return version;
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }
        ;

        _createClass(localConfig, null, [{
          key: "instance",
          get: function get() {
            if (this._instance) {
              return this._instance;
            }

            this._instance = new localConfig();
            return this._instance;
          }
        }]);

        return localConfig;
      }(), _defineProperty(_class2, "_instance", void 0), _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/uiManager.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './resourceUtil.ts', './poolManager.ts', './tips.ts'], function (exports) {
  'use strict';

  var _defineProperty, _createClass, cclegacy, _decorator, isValid, find, resourceUtil, poolManager, tips;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      isValid = module.isValid;
      find = module.find;
    }, function (module) {
      resourceUtil = module.resourceUtil;
    }, function (module) {
      poolManager = module.poolManager;
    }, function (module) {
      tips = module.tips;
    }],
    execute: function () {
      var _dec, _class, _class2, _temp;

      cclegacy._RF.push({}, "ae98dhzQlZL2p1SbDgvNdoJ", "uiManager", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var SHOW_STR_INTERVAL_TIME = 800;
      var uiManager = exports('uiManager', (_dec = ccclass("uiManager"), _dec(_class = (_temp = _class2 = /*#__PURE__*/function () {
        function uiManager() {
          _defineProperty(this, "dictSharedPanel", {});

          _defineProperty(this, "dictLoading", {});

          _defineProperty(this, "arrPopupDialog", []);

          _defineProperty(this, "showTipsTime", 0);
        }

        var _proto = uiManager.prototype;
        /**
         * 显示单例界面
         * @param {String} panelPath
         * @param {Array} args
         * @param {Function} cb 回调函数，创建完毕后回调
         */

        _proto.showDialog = function showDialog(panelPath, args, cb) {
          var _this = this;

          if (this.dictLoading[panelPath]) {
            return;
          }

          var idxSplit = panelPath.lastIndexOf('/');
          var scriptName = panelPath.slice(idxSplit + 1);

          if (!args) {
            args = [];
          }

          if (this.dictSharedPanel.hasOwnProperty(panelPath)) {
            var panel = this.dictSharedPanel[panelPath];

            if (isValid(panel)) {
              panel.parent = find("Canvas");
              panel.active = true;
              var script = panel.getComponent(scriptName);

              if (script.show) {
                script.show.apply(script, args);
              }

              cb && cb(script);
              return;
            }
          }

          this.dictLoading[panelPath] = true;
          resourceUtil.createUI(panelPath, function (err, node) {
            //判断是否有可能在显示前已经被关掉了？
            var isCloseBeforeShow = false;

            if (!_this.dictLoading[panelPath]) {
              //已经被关掉
              isCloseBeforeShow = true;
            }

            _this.dictLoading[panelPath] = false;

            if (err) {
              console.error(err);
              return;
            } // node.zIndex = 100;


            _this.dictSharedPanel[panelPath] = node;
            var script = node.getComponent(scriptName);

            if (script.show) {
              script.show.apply(script, args);
            }

            cb && cb(script);

            if (isCloseBeforeShow) {
              //如果在显示前又被关闭，则直接触发关闭掉
              _this.hideDialog(panelPath);
            }
          });
        }
        /**
         * 隐藏单例界面
         * @param {String} panelPath
         * @param {fn} callback
         */
        ;

        _proto.hideDialog = function hideDialog(panelPath, callback) {
          if (this.dictSharedPanel.hasOwnProperty(panelPath)) {
            var panel = this.dictSharedPanel[panelPath];

            if (panel && isValid(panel)) {
              // let ani = panel.getComponent('animationUI');
              // if (ani) {
              //     ani.close(() => {
              //         panel.parent = null;
              //         if (callback && typeof callback === 'function') {
              //             callback();
              //         }
              //     });
              // } else {
              panel.parent = null;

              if (callback && typeof callback === 'function') {
                callback();
              } // }

            } else if (callback && typeof callback === 'function') {
              callback();
            }
          }

          this.dictLoading[panelPath] = false;
        }
        /**
         * 将弹窗加入弹出窗队列
         * @param {string} panelPath
         * @param {string} scriptName
         * @param {*} param
         */
        ;

        _proto.pushToPopupSeq = function pushToPopupSeq(panelPath, scriptName, param) {
          var popupDialog = {
            panelPath: panelPath,
            scriptName: scriptName,
            param: param,
            isShow: false
          };
          this.arrPopupDialog.push(popupDialog);
          this.checkPopupSeq();
        }
        /**
         * 将弹窗加入弹出窗队列
         * @param {number} index
         * @param {string} panelPath
         * @param {string} scriptName
         * @param {*} param
         */
        ;

        _proto.insertToPopupSeq = function insertToPopupSeq(index, panelPath, param) {
          var popupDialog = {
            panelPath: panelPath,
            param: param,
            isShow: false
          };
          this.arrPopupDialog.splice(index, 0, popupDialog); //this.checkPopupSeq();
        }
        /**
         * 将弹窗从弹出窗队列中移除
         * @param {string} panelPath
         */
        ;

        _proto.shiftFromPopupSeq = function shiftFromPopupSeq(panelPath) {
          var _this2 = this;

          this.hideDialog(panelPath, function () {
            if (_this2.arrPopupDialog[0] && _this2.arrPopupDialog[0].panelPath === panelPath) {
              _this2.arrPopupDialog.shift();

              _this2.checkPopupSeq();
            }
          });
        }
        /**
         * 检查当前是否需要弹窗
         */
        ;

        _proto.checkPopupSeq = function checkPopupSeq() {
          if (this.arrPopupDialog.length > 0) {
            var first = this.arrPopupDialog[0];

            if (!first.isShow) {
              this.showDialog(first.panelPath, first.param);
              this.arrPopupDialog[0].isShow = true;
            }
          }
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }

        /**
         * 显示提示
         * @param {String} content
         * @param {Function} cb
         */
        ;

        _proto.showTips = function showTips(content, cb) {
          var now = Date.now();

          if (now - this.showTipsTime < SHOW_STR_INTERVAL_TIME) {
            var spareTime = SHOW_STR_INTERVAL_TIME - (now - this.showTipsTime);
            var self = this;
            setTimeout(function (tipsLabel, callback) {
              self._showTipsAni(tipsLabel, callback);
            }.bind(this, content, cb), spareTime);
            this.showTipsTime = now + spareTime;
          } else {
            this._showTipsAni(content, cb);

            this.showTipsTime = now;
          }
        }
        /**
         * 内部函数
         * @param {String} content
         * @param {Function} cb
         */
        ;

        _proto._showTipsAni = function _showTipsAni(content, cb) {
          //todo 临时添加方案，后期需要将这些代码移到具体界面
          resourceUtil.getUIPrefabRes('common/tips', function (err, prefab) {
            if (err) {
              return;
            }

            var tipsNode = poolManager.instance.getNode(prefab, find("Canvas"));
            var tipScript = tipsNode.getComponent(tips);
            tipScript.show(content, cb);
          });
        };

        _createClass(uiManager, null, [{
          key: "instance",
          get: function get() {
            if (this._instance) {
              return this._instance;
            }

            this._instance = new uiManager();
            return this._instance;
          }
        }]);

        return uiManager;
      }(), _defineProperty(_class2, "_instance", void 0), _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/resourceUtil.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, _decorator, resources, error, Prefab, instantiate, find, SpriteFrame, isValid, assetManager, Texture2D;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      resources = module.resources;
      error = module.error;
      Prefab = module.Prefab;
      instantiate = module.instantiate;
      find = module.find;
      SpriteFrame = module.SpriteFrame;
      isValid = module.isValid;
      assetManager = module.assetManager;
      Texture2D = module.Texture2D;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "aebeeEGJRZGbK315QTzsoll", "resourceUtil", undefined);

      var ccclass = _decorator.ccclass;
      var resourceUtil = exports('resourceUtil', (_dec = ccclass("resourceUtil"), _dec(_class = /*#__PURE__*/function () {
        function resourceUtil() {}

        resourceUtil.loadRes = function loadRes(url, type, cb) {
          if (type) {
            resources.load(url, type, function (err, res) {
              if (err) {
                error(err.message || err);

                if (cb) {
                  cb(err, res);
                }

                return;
              }

              if (cb) {
                cb(err, res);
              }
            });
          } else {
            resources.load(url, function (err, res) {
              if (err) {
                error(err.message || err);

                if (cb) {
                  cb(err, res);
                }

                return;
              }

              if (cb) {
                cb(err, res);
              }
            });
          }
        };

        resourceUtil.getMap = function getMap(level, cb) {
          var levelStr = 'map'; //前面补0

          if (level >= 100) {
            levelStr += level;
          } else if (level >= 10) {
            levelStr += '0' + level;
          } else {
            levelStr += '00' + level;
          }

          this.loadRes("gamePackage/map/config/" + levelStr, null, function (err, txtAsset) {
            if (err) {
              cb(err, txtAsset);
              return;
            }

            var txt = txtAsset;
            var content = '';

            if (txt._file) {
              if (window['LZString']) {
                content = window['LZString'].decompressFromEncodedURIComponent(txt._file);
              }

              var objJson = JSON.parse(content);
              cb(null, objJson);
            } else if (txt.text) {
              if (window['LZString']) {
                content = window['LZString'].decompressFromEncodedURIComponent(txt.text);
              }

              var _objJson = JSON.parse(content);

              cb(null, _objJson);
            } else if (txt.json) {
              cb(null, txt.json);
            } else {
              var errObj = new Error('failed');
              cb(errObj, null);
            }
          });
        };

        resourceUtil.getMapObjs = function getMapObjs(type, arrName, progressCb, completeCb) {
          var arrUrls = [];

          for (var idx = 0; idx < arrName.length; idx++) {
            arrUrls.push("gamePackage/map/" + type + "/" + arrName[idx]);
          }

          resources.load(arrUrls, Prefab, progressCb, completeCb);
        };

        resourceUtil.getUIPrefabRes = function getUIPrefabRes(prefabPath, cb) {
          this.loadRes("prefab/ui/" + prefabPath, Prefab, cb);
        };

        resourceUtil.createUI = function createUI(path, cb, parent) {
          this.getUIPrefabRes(path, function (err, prefab) {
            if (err) return;
            var node = instantiate(prefab);
            node.setPosition(0, 0, 0);

            if (!parent) {
              parent = find("Canvas");
            }

            parent.addChild(node);

            if (cb) {
              cb(null, node);
            }
          });
        };

        resourceUtil.getCarsBatch = function getCarsBatch(arrName, progressCb, completeCb) {
          var arrUrls = [];

          for (var idx = 0; idx < arrName.length; idx++) {
            arrUrls.push("prefab/car/car" + arrName[idx]);
          }

          for (var i = 0; i < arrUrls.length; i++) {
            var url = arrUrls[i];

            if (!progressCb) {
              resources.load(url, Prefab, completeCb);
            } else {
              resources.load(url, Prefab, progressCb, completeCb);
            }
          }
        };

        resourceUtil.getUICar = function getUICar(name, cb) {
          this.loadRes("prefab/ui/car/uiCar" + name, Prefab, cb);
        };

        resourceUtil.getCar = function getCar(name, cb) {
          this.loadRes("prefab/car/car" + name, Prefab, cb);
        };

        resourceUtil.setCarIcon = function setCarIcon(name, sprite, isBlack, cb) {
          var path = "gamePackage/texture/car/car" + name;

          if (isBlack) {
            path += 'Black';
          }

          this.setSpriteFrame(path, sprite, cb);
        };

        resourceUtil.getJsonData = function getJsonData(fileName, cb) {
          resources.load("datas/" + fileName, function (err, content) {
            if (err) {
              error(err.message || err);
              return;
            }

            var txt = content;

            if (txt.json) {
              cb(err, txt.json);
            } else {
              var errObj = new Error('failed!!!');
              cb(errObj, null);
            }
          });
        };

        resourceUtil.getData = function getData(fileName, cb) {
          resources.load("datas/" + fileName, function (err, content) {
            if (err) {
              error(err.message || err);
              return;
            }

            var txt = content;
            var text = txt.text;

            if (!text) {
              resources.load(content.nativeUrl, function (err, content) {
                text = content;
                cb(err, text);
              });
              return;
            }

            cb(err, text);
          });
        };

        resourceUtil.setSpriteFrame = function setSpriteFrame(path, sprite, cb) {
          this.loadRes(path + '/spriteFrame', SpriteFrame, function (err, spriteFrame) {
            if (err) {
              console.error('set sprite frame failed! err:', path, err);
              cb(err, spriteFrame);
              return;
            }

            if (sprite && isValid(sprite)) {
              sprite.spriteFrame = spriteFrame;
              cb(null, spriteFrame);
            }
          });
        }
        /**
         * 根据英雄的文件名获取头像
         */
        ;

        resourceUtil.setRemoteImage = function setRemoteImage(url, sprite, cb) {
          if (!url || !url.startsWith('http')) {
            return;
          }

          var suffix = "png";
          assetManager.loadAny([{
            url: url,
            type: suffix
          }], null, function (err, image) {
            if (err) {
              console.error('set avatar failed! err:', url, err);
              cb(err, image);
              return;
            }

            var texture = new Texture2D();
            texture.image = image;
            var spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture;
            cb && cb(null, spriteFrame);
          });
        }
        /**
         * 设置更多游戏的游戏图标
         */
        ;

        resourceUtil.setGameIcon = function setGameIcon(game, sprite, cb) {
          if (game.startsWith('http')) {
            this.setRemoteImage(game, sprite, cb);
          } else {
            this.setSpriteFrame('gamePackage/textures/icons/games/' + game, sprite, cb);
          }
        }
        /**
         * 获取顾客预制体
         *
         * @static
         * @param {string} name
         * @param {Function} cb
         * @memberof resourceUtil
         */
        ;

        resourceUtil.getCustomer = function getCustomer(name, cb) {
          this.loadRes("gamePackage/map/customer/customer" + name, Prefab, cb);
        };

        resourceUtil.setCustomerIcon = function setCustomerIcon(name, sprite, cb) {
          var path = "gamePackage/texture/head/head" + name;
          this.setSpriteFrame(path, sprite, cb);
        };

        resourceUtil.getEffect = function getEffect(name, cb) {
          this.loadRes("prefab/effect/" + name, Prefab, cb);
        };

        return resourceUtil;
      }()) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/balance.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './clientEvent.ts', './audioManager.ts', './constant.ts', './util.ts', './playerData.ts', './uiManager.ts', './gameLogic.ts', './LanguageData.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Sprite, Label, Widget, Node, SpriteFrame, Component, clientEvent, audioManager, constant, util, playerData, uiManager, gameLogic, i18n;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Sprite = module.Sprite;
      Label = module.Label;
      Widget = module.Widget;
      Node = module.Node;
      SpriteFrame = module.SpriteFrame;
      Component = module.Component;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      audioManager = module.audioManager;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      util = module.util;
    }, function (module) {
      playerData = module.playerData;
    }, function (module) {
      uiManager = module.uiManager;
    }, function (module) {
      gameLogic = module.gameLogic;
    }, function (module) {
      i18n = module.i18n;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _temp;

      cclegacy._RF.push({}, "b6b06mpFMlIZqLpxXisU3Cu", "balance", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var balance = exports('balance', (_dec = ccclass("balance"), _dec2 = property(Sprite), _dec3 = property(Sprite), _dec4 = property({
        type: Label
      }), _dec5 = property({
        type: Label
      }), _dec6 = property(Widget), _dec7 = property({
        type: Node,
        displayName: "进度项"
      }), _dec8 = property(SpriteFrame), _dec9 = property(SpriteFrame), _dec10 = property(SpriteFrame), _dec11 = property(SpriteFrame), _dec12 = property(SpriteFrame), _dec13 = property(Label), _dec14 = property(Label), _dec15 = property(Label), _dec16 = property(Sprite), _dec17 = property(Node), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(balance, _Component);

        function balance() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "spStart", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spEnd", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbCurLevel", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbTargetLevel", _descriptor4, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "wgMenu", _descriptor5, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "progress", _descriptor6, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "imgLevelFinished", _descriptor7, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "imgLevelUnfinished", _descriptor8, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "imgProgressNoActive", _descriptor9, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "imgProgressActive", _descriptor10, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "imgProgressFinished", _descriptor11, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbTakeCount", _descriptor12, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbGetNormal", _descriptor13, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbGetMulti", _descriptor14, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spIcon", _descriptor15, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeDouble", _descriptor16, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "rewardMoney", 0);

          _defineProperty(_assertThisInitialized(_this), "isFinishLevel", false);

          _defineProperty(_assertThisInitialized(_this), "showBalanceTimes", 0);

          return _this;
        }

        var _proto = balance.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.show = function show(level, curProgress, isTakeOver, maxProgress, money, isFinishLevel) {
          this.showBalanceTimes++; //设置顶部关卡进度

          var start = curProgress;
          var end = isTakeOver ? start : start - 1;
          var len = this.progress.length;

          for (var idx = 0; idx < maxProgress; idx++) {
            if (maxProgress >= len) {
              break;
            }

            this.progress[idx].active = true;

            if (idx < end) {
              this.progress[idx].getComponent(Sprite).spriteFrame = this.imgProgressFinished;
            } else {
              this.progress[idx].getComponent(Sprite).spriteFrame = this.imgProgressNoActive;
            }
          }

          if (!isTakeOver) {
            this.progress[end].getComponent(Sprite).spriteFrame = this.imgProgressActive;
          }

          for (var _idx = maxProgress; _idx < this.progress.length; _idx++) {
            this.progress[_idx].active = false;
          }

          this.lbCurLevel.string = level.toString();
          this.lbTargetLevel.string = "" + (level + 1);
          this.isFinishLevel = isFinishLevel;
          this.spStart.spriteFrame = this.imgLevelFinished;

          if (isFinishLevel) {
            this.spEnd.spriteFrame = this.imgLevelFinished;
          } else {
            this.spEnd.spriteFrame = this.imgLevelUnfinished;
          } //设置完成了几个订单


          var take = end >= 0 ? end : 0;
          this.lbTakeCount.string = i18n.t("balance.你完成了%{value}个订单", {
            value: take
          }); //设置奖励多少

          this.rewardMoney = money;
          this.lbGetNormal.string = util.formatMoney(money);
          this.lbGetMulti.string = util.formatMoney(money * 3);

          if (isFinishLevel) {
            audioManager.instance.playSound(constant.AUDIO_SOUND.WIN);
          }

          gameLogic.updateRewardIcon(constant.SHARE_FUNCTION.BALANCE, this.spIcon); //有30%的概率不显示该按钮

          var percent = Math.floor(Math.random() * 100); //触发显示

          this.nodeDouble.active = percent < 30;
        };

        _proto.onBtnGetNormalClick = function onBtnGetNormalClick() {
          //普通领取
          this.rewardOver(this.rewardMoney);
        };

        _proto.onBtnGetMultiClick = function onBtnGetMultiClick() {
          var _this2 = this; //3倍领取


          gameLogic.openReward(constant.SHARE_FUNCTION.BALANCE, function (err) {
            if (!err) {
              _this2.rewardOver(_this2.rewardMoney * 3);
            }
          });
        };

        _proto.rewardOver = function rewardOver(rewardMoney) {
          //如果关卡是完成的，进入下一关
          //如果关卡是未完成的，还是保留同一关
          if (this.isFinishLevel) {
            //关卡完成了，进入下一关
            gameLogic.finishBuyTask(constant.BUY_CAR_TYPE.PASS_LEVEL, playerData.instance.playerInfo.level, false);
            playerData.instance.passLevel(rewardMoney);
          } else {
            playerData.instance.updatePlayerInfo('gold', rewardMoney);
          }

          if (rewardMoney > 0) {
            gameLogic.showFlyReward(constant.REWARD_TYPE.GOLD, function () {
              clientEvent.dispatchEvent('updateGold');
            });
          }

          uiManager.instance.hideDialog('fight/balance');

          if (playerData.instance.playerInfo.level > 0) {
            playerData.instance.isComeFromBalance = false;
            clientEvent.dispatchEvent('newLevel', this.isFinishLevel);
          } else {
            playerData.instance.isComeFromBalance = false;
            clientEvent.dispatchEvent('newLevel', this.isFinishLevel);
          }
        };

        return balance;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "spStart", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "spEnd", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lbCurLevel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "lbTargetLevel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "wgMenu", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "progress", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "imgLevelFinished", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "imgLevelUnfinished", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "imgProgressNoActive", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "imgProgressActive", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "imgProgressFinished", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "lbTakeCount", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "lbGetNormal", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "lbGetMulti", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "spIcon", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "nodeDouble", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/gameLogic.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './configuration.ts', './clientEvent.ts', './resourceUtil.ts', './constant.ts', './playerData.ts', './uiManager.ts', './flyReward.ts'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator, configuration, clientEvent, resourceUtil, constant, playerData, uiManager, flyReward;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      configuration = module.configuration;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      resourceUtil = module.resourceUtil;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      playerData = module.playerData;
    }, function (module) {
      uiManager = module.uiManager;
    }, function (module) {
      flyReward = module.flyReward;
    }],
    execute: function () {
      var _dec, _class, _class2, _temp;

      cclegacy._RF.push({}, "b6eeddtwEdPDYszSPn2rVjb", "gameLogic", undefined);

      var ccclass = _decorator.ccclass;
      var gameLogic = exports('gameLogic', (_dec = ccclass("gameLogic"), _dec(_class = (_temp = _class2 = /*#__PURE__*/function () {
        function gameLogic() {}
        /* class member could be defined like this */
        // dummy = '';


        gameLogic.addGold = function addGold(gold) {
          playerData.instance.updatePlayerInfo('gold', gold);
          clientEvent.dispatchEvent('updateGold');
        };

        gameLogic.useCar = function useCar(carId) {
          playerData.instance.useCar(carId);
          clientEvent.dispatchEvent('updateCar');
        };

        gameLogic.buyCar = function buyCar(carId) {
          playerData.instance.buyCar(carId);
          clientEvent.dispatchEvent('buyCar');
        };

        gameLogic.isVibrateOpen = function isVibrateOpen() {
          var isVibrateOpen = configuration.instance.getGlobalData('vibrate');

          if (isVibrateOpen === undefined || isVibrateOpen === null) {
            isVibrateOpen = true; //默认是打开的状态
          }

          return isVibrateOpen;
        };

        gameLogic.getOpenRewardType = function getOpenRewardType(funStr, callback, index) {
          callback(null, constant.OPEN_REWARD_TYPE.NULL);
        };

        gameLogic.checkIsByVideoAds = function checkIsByVideoAds() {
          return false;
        }
        /**
         * 根据功能设置图标对应展示
         *
         * @static
         * @param {string} funStr
         * @param {Sprite} spIcon
         * @param {Function} [callback]
         * @param {SpriteFrame} [imgAd]
         * @param {SpriteFrame} [imgShare]
         * @memberof gameLogic
         */
        ;

        gameLogic.updateRewardIcon = function updateRewardIcon(funStr, spIcon, callback, imgAd, imgShare) {
          var _this = this;

          this.getOpenRewardType(funStr, function (err, type) {
            switch (type) {
              case constant.OPEN_REWARD_TYPE.AD:
                spIcon.node.active = true;

                if (imgAd) {
                  spIcon.spriteFrame = imgAd;
                } else {
                  spIcon.spriteFrame = _this.imgAd;
                }

                break;

              case constant.OPEN_REWARD_TYPE.SHARE:
                spIcon.node.active = true;

                if (imgShare) {
                  spIcon.spriteFrame = imgShare;
                } else {
                  spIcon.spriteFrame = _this.imgShare;
                }

                break;

              case constant.OPEN_REWARD_TYPE.NULL:
                spIcon.node.active = false;
                break;
            }

            if (callback) {
              callback(err, type);
            }
          });
        };

        gameLogic.finishBuyTask = function finishBuyTask(type, value, isAdd) {
          playerData.instance.finishBuyTask(type, value, isAdd);
          clientEvent.dispatchEvent('updateBuyTask');
        };

        gameLogic.openReward = function openReward(funStr, callback) {
          callback && callback(null);
        }
        /**
         * 登陆成功后会回调该方法,类似于一个声明周期或者状态
         */
        ;

        gameLogic.afterLogin = function afterLogin() {
          if (!playerData.instance.isNewBee) {
            this.checkSignIn();
          }
        }
        /**
         * 如果今天还未签到则弹出
         */
        ;

        gameLogic.checkSignIn = function checkSignIn() {
          if (playerData.instance.playerInfo.level === 1) {
            //第一关未通关则不跳签到界面
            return;
          }

          playerData.instance.updateSignInCurrentDay();

          if (!playerData.instance.getSignInReceivedInfo().isTodayReceived) {
            uiManager.instance.pushToPopupSeq('signIn/signIn', 'signIn', {});
          }
        };

        gameLogic.showFlyReward = function showFlyReward(rewardType, callback) {
          resourceUtil.createUI('common/flyReward', function (err, node) {
            if (err) {
              if (callback) {
                callback();
              }

              return;
            }

            var reward = node.getComponent(flyReward); // reward.setInfo(rewardType === constant.REWARD_TYPE.GOLD);

            reward.setEndListener(callback);
          });
        };

        return gameLogic;
      }(), _defineProperty(_class2, "imgAd", null), _defineProperty(_class2, "imgShare", null), _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/en.ts", ['cc'], function () {
  'use strict';

  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c2ee7NzXEdG1Z3CXlfjoO8M", "en", undefined); //@ts-ignore


      if (!window.i18nConfig) window.i18nConfig = {};
      if (!window.i18nConfig.languages) window.i18nConfig.languages = {};
      window.i18nConfig.languages.en = {
        // "start": {
        //     "startGame": "Start"
        // },
        // "main": {
        //     "%{value}/s": "%{value}/s",
        //     "free": "free"
        // },
        // "signReward": {
        //     "你已经连续签到%{value}天，继续保持": "Sign in for %{value} days，keep on",
        //     "diamondsNum": "diamonds x2",
        // },
        // "button": {
        //     "normalReceive": "<u><color=#ffffff>Normal receive</color></u>",
        //     "receive": "Receive",
        //     "directCollection": "<u><color=#ffffff>Receive</color></u>",
        //     "doubleReceive": "Double",
        //     "noUpdate": "<u><color=#ffffff>No update</color></u>",
        //     "giveUpReward": "<u><color=#ffffff>Give up reward</color></u>"
        // }
        "main": {
          "dataLoading": "Data loading...",
          "dataLoadOver": "Data loading completed...",
          "loginSuccess": "Login success...",
          "gameResourceLoading": "Game Resource Loading...",
          "audioResourceLoading": "Audio Resource Loading...",
          "mappingResourceLoading": "Mapping resource loading...",
          "modelResourceLoading": "Model resource loading...",
          "entering": "Entering..."
        },
        "mainUI": {
          "start": "Click screen to start",
          "changeCar": "Change cars"
        },
        "shop": {
          "btnClose": "Close",
          "go": "Go",
          "acquired": "Acquired",
          "current": "Current",
          "receive": "Receive",
          "getGold": "Gold coins for watching AD"
        },
        "balance": {
          "你完成了%{value}个订单": "Complete %{value} order",
          "youEarnedIt": "You earned it",
          "clickReceive": "Click revive",
          "receiveImmediately": "Receive Now"
        },
        "carTask": {
          "初始车辆": "Initial vehicle",
          "分享获得": "Share gain",
          "签到获得": "Signin gain",
          "通过关卡获得": "Get through a checkpoint"
        },
        "signin": {
          "title": "Sign in on the 7th",
          "notYet": "Not yet",
          "normalReceive": "Normal receive",
          "receive": "Receive",
          "doubleReceive": "Double receive",
          "fillSignin": "Fill signin"
        },
        "fightManager": {
          "loadingMap": "Loading map...",
          "buildingCity": "Start building cities...",
          "cityLoadOver": "City loaded..."
        },
        "fightMap": {
          "trimTheGround": "The ground is being trimmed...",
          "pavingTheRoad": "Paving the way...",
          "plantingTree": "The trees are being planted...",
          "decorateHouse": "The house is being renovated...",
          "paintLandmarks": "The landmark is being painted..."
        },
        "online": {
          "close": "Close",
          "clickReceive": "Click receive",
          "dailyIncome": "Daily income is available"
        },
        "lottery": {
          "title": "Wheel of fortune",
          "free": "Free"
        },
        "talk": {
          "你好,请到街对面接我.": "Hello, please meet me across the street.",
          "停车!停车!": "Stop the car, please! Stop the car, please!",
          "去消费最高的地方.": "Go to the place where you spend the most.",
          "去附近的希尔顿酒店.": "Go to the nearby hilton hotel.",
          "司机快来!我老婆要生了!": "Driver, come on!  My wife is having a baby!",
          "大哥快点,我赶时间.": "Eldest brother hurry up, I'm in a hurry.",
          "师傅,5分钟内能到吗?": "Master, can you be there in 5 minutes?",
          "师傅,你是老司机嘛?": "Master, are you an old driver?",
          "师傅,你跑一天能赚多少?": "Master, how much do you earn per day?",
          "师傅快点,我要赶飞机.": "Master, hurry up, I have to catch the plane.",
          "师傅跟上那辆法拉利.": "Master, keep up with that Ferrari.",
          "带我去最近的银行.": "Take me to the nearest bank.",
          "帮我跟上前面那辆车!": "Help me keep up with the car in front!",
          "快去火车站,我赶车!": "Go to the railway station, I'll catch the bus!",
          "我在酒店大堂门口等你.": "I'll wait for you at the gate of the hotel lobby.",
          "要下雨了,你快来!": "It's going to rain, you come quickly!"
        },
        "showReward": {
          "title": "Reward",
          "normalReceive": "Normal receive",
          "ReceiveImmediately": " Receive Now",
          "doubleReceive": "Double receive",
          "alreadyHadCar": "You already own the vehicle and automatically convert it into the corresponding gold coin.",
          "buySuccessful": "Buy successful",
          "confrim": "Confrim",
          "signinReward": "Signin reward"
        },
        "revive": {
          "reviveImmediately": "Resurrection Now",
          "skip": "Skip",
          "tips": "It's a pity that we came close to the finish line.!",
          "continue": "Resurrection continues."
        },
        "clickBox": {
          "title": "Mysterious gift",
          "progress": "The faster you click, the more rewards you will receive.",
          "clickMe": "click me fast",
          "normalReceive": "Normal receive",
          "doubleReceive": "Double receive"
        },
        "trial": {
          "title": "Free trial",
          "tryItNow": "Try It Now",
          "giveUp": "Give up the trial and start the game."
        },
        "invinceible": {
          "title": "Invincible start",
          "confirm": "Confrim",
          "close": "Close"
        },
        "setting": {
          "title": "Setting",
          "version": "Version:",
          "close": "Close"
        }
      };

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/LocalizedLabel.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './LanguageData.ts'], function (exports) {
  'use strict';

  var _defineProperty, _applyDecoratedDescriptor, _inheritsLoose, _assertThisInitialized, _initializerDefineProperty, _createClass, cclegacy, _decorator, log, Label, error, Component, i18n;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _assertThisInitialized = module.assertThisInitialized;
      _initializerDefineProperty = module.initializerDefineProperty;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      log = module.log;
      Label = module.Label;
      error = module.error;
      Component = module.Component;
    }, function (module) {
      i18n = module.i18n;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor, _class3, _temp;

      cclegacy._RF.push({}, "c4c1axXN+NL4oYQEr2M4qn2", "LocalizedLabel", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var LocalizedLabel = exports('default', (_dec = ccclass("LocalizedLabel"), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(LocalizedLabel, _Component);

        function LocalizedLabel() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _defineProperty(_assertThisInitialized(_this), "_debouncedUpdateLabel", null);

          _defineProperty(_assertThisInitialized(_this), "label", null);

          _initializerDefineProperty(_assertThisInitialized(_this), "_dataID", _descriptor, _assertThisInitialized(_this));

          return _this;
        }

        var _proto = LocalizedLabel.prototype;

        _proto.onLoad = function onLoad() {
          if (!i18n.inst) {
            i18n.init();
          }

          log('dataID: ' + this.dataID + ' value: ' + i18n.t(this.dataID));
          this.fetchRender();
        };

        _proto.fetchRender = function fetchRender() {
          var label = this.getComponent(Label);

          if (label) {
            this.label = label;
            this.updateLabel();
            return;
          }
        };

        _proto.updateLabel = function updateLabel() {
          if (!this.label) {
            error('Failed to update localized label, label component is invalid!');
            return;
          }

          var localizedString = i18n.t(this.dataID, {});

          if (localizedString) {
            this.label.string = i18n.t(this.dataID, {});
          }
        };

        _proto.debounce = function debounce(func, wait, immediate) {
          var _arguments = arguments,
              _this2 = this;

          var timeout = -1;
          return function () {
            var args = _arguments;

            var later = function () {
              timeout = -1;
              if (!immediate) func.apply(_this2, args);
            }.bind(_this2);

            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(_this2, args);
          }.bind(this);
        };

        _createClass(LocalizedLabel, [{
          key: "dataID",
          get: function get() {
            return this._dataID;
          },
          set: function set(val) {
            if (this._dataID !== val) {
              this._dataID = val;
              {
                this.updateLabel();
              }
            }
          }
        }]);

        return LocalizedLabel;
      }(Component), _defineProperty(_class3, "editor", {
        executeInEditMode: true,
        menu: 'i18n/LocalizedLabel'
      }), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_dataID", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "";
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "dataID", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "dataID"), _class2.prototype)), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/main.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './configuration.ts', './localConfig.ts', './playerData.ts', './LanguageData.ts', './loading.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Label, assetManager, director, Component, configuration, localConfig, playerData, i18n, loading;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
      assetManager = module.assetManager;
      director = module.director;
      Component = module.Component;
    }, function (module) {
      configuration = module.configuration;
    }, function (module) {
      localConfig = module.localConfig;
    }, function (module) {
      playerData = module.playerData;
    }, function (module) {
      i18n = module.i18n;
    }, function (module) {
      loading = module.loading;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "c5aa7IsWr5A4blPeFPanXM/", "main", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property; // cc.gameSpace = {};
      // cc.gameSpace.TIME_SCALE = 1;
      // cc.gameSpace.isStop = false;
      // cc.gameSpace.isConfigLoadFinished = false;

      i18n.init('zh');
      var main = exports('main', (_dec = ccclass("main"), _dec2 = property(Label), _dec3 = property(loading), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(main, _Component);

        function main() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "lbVersion", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "loadingUI", _descriptor2, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "retryTimes", 0);

          _defineProperty(_assertThisInitialized(_this), "uid", '');

          _defineProperty(_assertThisInitialized(_this), "curProgress", 0);

          _defineProperty(_assertThisInitialized(_this), "isLoginFinished", false);

          _defineProperty(_assertThisInitialized(_this), "isSubPackageFinished", false);

          _defineProperty(_assertThisInitialized(_this), "isConfigLoaded", false);

          return _this;
        }

        var _proto = main.prototype;

        _proto.start = function start() {
          var _this2 = this; // profiler.hideStats();


          this.loadingUI.show(); //TODO 后续将由服务器提供时间

          playerData.instance.syncServerTime(Date.now()); // Your initialization goes here.

          this.curProgress = 5; //起始10%

          this.loadingUI.updateProgress(this.curProgress, i18n.t("main.dataLoading"));
          localConfig.instance.loadConfig(function () {
            // cc.gameSpace.isConfigLoadFinished = true;
            _this2.lbVersion.string = "Version. " + localConfig.instance.getVersion();
            _this2.isConfigLoaded = true;

            _this2.loadMainScene();
          });
          this.curProgress += 5;

          if (this.loadingUI) {
            this.loadingUI.updateProgress(this.curProgress, i18n.t("main.dataLoadOver"));
          }

          this.curProgress += 5; // this.loadingUI.updateProgress(this.curProgress, '登录中...');
          //其他环境下，直接开始加载资源

          this.curProgress += 15;
          this.loadingUI.updateProgress(this.curProgress, i18n.t("main.gameResourceLoading")); //普通用户登录

          playerData.instance.loadGlobalCache();

          if (!playerData.instance.userId) {
            //需要创建个账号
            this.uid = configuration.generateGuestAccount();
          } else {
            this.uid = playerData.instance.userId;
          }

          this.startLogin();
          this.downloadGameRes(function () {
            console.log('subpackage download finished!');
            _this2.isSubPackageFinished = true;

            _this2.loadMainScene();
          });
        };

        _proto.startLogin = function startLogin() {
          configuration.instance.setUserId(this.uid);
          playerData.instance.syncServerTime(Date.now());
          this.userLogin();
        };

        _proto.userLogin = function userLogin() {
          playerData.instance.loadFromCache();

          if (playerData.instance.playerInfo.createDate === undefined) {
            //表示没有创建过
            playerData.instance.createPlayerInfo();
          }

          console.log('login finished!');
          this.isLoginFinished = true;
          this.loadMainScene();
        };

        _proto.downloadGameRes = function downloadGameRes(cb) {
          //不用加载子包，直接+30
          this.curProgress += 15;
          this.loadingUI.updateProgress(this.curProgress);
          cb && cb();
        };

        _proto.showSubPackageError = function showSubPackageError() {};

        _proto.loadGameSubPackage = function loadGameSubPackage(cb) {
          var _this3 = this;

          this.loadingUI.updateProgress(this.curProgress, i18n.t("main.audioResourceLoading"));
          assetManager.loadBundle('resources', function (err) {
            _this3.curProgress += 5;

            _this3.loadingUI.updateProgress(_this3.curProgress, i18n.t("main.audioResourceLoading"));

            if (err) {
              _this3.showSubPackageError();

              return console.error(err);
            }

            assetManager.loadBundle('textures', function (err) {
              _this3.curProgress += 5;

              _this3.loadingUI.updateProgress(_this3.curProgress, i18n.t("main.mappingResourceLoading"));

              if (err) {
                _this3.showSubPackageError();

                return console.error(err);
              }

              assetManager.loadBundle('model', function (err) {
                _this3.curProgress += 5;

                _this3.loadingUI.updateProgress(_this3.curProgress, i18n.t("main.modelResourceLoading"));

                if (err) {
                  _this3.showSubPackageError();

                  return console.error(err);
                }

                cb && cb();
              });
            });
          });
        };

        _proto.loadMainScene = function loadMainScene() {
          var _this4 = this;

          if (!this.isConfigLoaded || !this.isLoginFinished || !this.isSubPackageFinished) {
            //配置，子包，登录，三项没有加载成功的话要等下一项
            return;
          }

          director.preloadScene('main', function (err) {
            _this4.curProgress += 5;

            _this4.loadingUI.updateProgress(_this4.curProgress, i18n.t("main.entering"));

            if (!err) {
              director.loadScene('main', function () {});
            }
          });
        };

        return main;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "lbVersion", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "loadingUI", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/effectManager.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './clientEvent.ts', './audioManager.ts', './constant.ts', './poolManager.ts', './carManager.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Prefab, Component, clientEvent, audioManager, constant, poolManager, carManager;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Prefab = module.Prefab;
      Component = module.Component;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      audioManager = module.audioManager;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      poolManager = module.poolManager;
    }, function (module) {
      carManager = module.carManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "cf371ivOc1Ae64t3ScAzqjv", "effectManager", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var effectManager = exports('effectManager', (_dec = ccclass("effectManager"), _dec2 = property({
        type: Prefab
      }), _dec3 = property({
        type: carManager
      }), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(effectManager, _Component);

        function effectManager() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "pfTailLine", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "carManager", _descriptor2, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "currentNode", null);

          return _this;
        }

        var _proto = effectManager.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.onEnable = function onEnable() {
          clientEvent.on('startBraking', this.onBrakingStart, this);
          clientEvent.on('endBraking', this.onBrakingEnd, this);
        };

        _proto.onDisable = function onDisable() {
          clientEvent.off('startBraking', this.onBrakingStart, this);
          clientEvent.off('endBraking', this.onBrakingEnd, this);
        };

        _proto.onBrakingStart = function onBrakingStart() {
          this.currentNode = poolManager.instance.getNode(this.pfTailLine, this.node);
          this.currentNode.setWorldPosition(this.carManager.mainCar.node.worldPosition);
          this.currentNode.eulerAngles = this.carManager.mainCar.node.eulerAngles;
          audioManager.instance.playSound(constant.AUDIO_SOUND.STOP);
        };

        _proto.onBrakingEnd = function onBrakingEnd() {
          var node = this.currentNode;
          this.currentNode = null;
          this.scheduleOnce(function () {
            if (node && node.isValid) {
              poolManager.instance.putNode(node);
            }
          }, 2);
        };

        _proto.update = function update(deltaTime) {
          // Your update function goes here.
          if (this.currentNode && this.carManager.mainCar) {
            this.currentNode.setWorldPosition(this.carManager.mainCar.node.worldPosition);
            this.currentNode.eulerAngles = this.carManager.mainCar.node.eulerAngles;
          }
        };

        _proto.reset = function reset() {
          if (this.currentNode) {
            poolManager.instance.putNode(this.currentNode);
            poolManager.instance.clearPool(this.currentNode.name);
            this.currentNode = null; //原有的都释放掉

            var arr = this.node.children.slice(0);

            for (var idx = 0; idx < arr.length; idx++) {
              var node = arr[idx];

              if (node && node.isValid) {
                node.destroy();
              }
            }
          }
        };

        return effectManager;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "pfTailLine", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "carManager", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/flyReward.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './clientEvent.ts', './flyRewardItem.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, SpriteFrame, Node, Animation, find, Vec3, Component, clientEvent, flyRewardItem;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      SpriteFrame = module.SpriteFrame;
      Node = module.Node;
      Animation = module.Animation;
      find = module.find;
      Vec3 = module.Vec3;
      Component = module.Component;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      flyRewardItem = module.flyRewardItem;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "d14d4EewSBFtIn6B/rRUvjM", "flyReward", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var MAX_REWARD_COUNT = 10;
      var flyReward = exports('flyReward', (_dec = ccclass("flyReward"), _dec2 = property(SpriteFrame), _dec3 = property(Node), _dec4 = property(Animation), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(flyReward, _Component);

        function flyReward() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "imgGold", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "ndRewardParent", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "aniBoom", _descriptor3, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "finishIdx", 0);

          _defineProperty(_assertThisInitialized(_this), "_callback", undefined);

          _defineProperty(_assertThisInitialized(_this), "isGoldOrDiamond", true);

          return _this;
        }

        var _proto = flyReward.prototype;

        _proto.start = function start() {
          // Your initialization goes here.
          this.aniBoom.play();
          this.createReward();
        };

        _proto.getTargetPos = function getTargetPos() {
          var nodeGold = find('Canvas/goldPos');

          if (!nodeGold) {
            this.node.destroy();

            if (this._callback) {
              this._callback();
            }

            return Vec3.ZERO;
          }

          return nodeGold.position;
        };

        _proto.createReward = function createReward() {
          var _this2 = this;

          var imgReward = this.imgGold; // if (!this.isGoldOrDiamond) {
          //     imgReward = this.imgDiamond;
          // }

          var targetPos = this.getTargetPos();

          for (var idx = 0; idx < MAX_REWARD_COUNT; idx++) {
            var rewardNode = new Node('flyRewardItem');
            var flyItem = rewardNode.addComponent(flyRewardItem);
            rewardNode.parent = this.ndRewardParent;
            flyItem.show(imgReward, targetPos, function (node) {
              _this2.onFlyOver(node);
            });
          }
        };

        _proto.setInfo = function setInfo(isGoldOrDiamond) {
          this.isGoldOrDiamond = isGoldOrDiamond;
        };

        _proto.onFlyOver = function onFlyOver(node) {
          if (this.isGoldOrDiamond) {
            clientEvent.dispatchEvent('receiveGold');
          } else {
            clientEvent.dispatchEvent('receiveDiamond');
          } // cc.gameSpace.audioManager.playSound('sell', false);


          node.active = false;
          this.finishIdx++;

          if (this.finishIdx === MAX_REWARD_COUNT) {
            if (this._callback) {
              this._callback();
            }

            this.node.destroy();
          }
        }
        /**
         * 设置播放回调
         * @param {Function} callback
         * @param {Object} target
         */
        ;

        _proto.setEndListener = function setEndListener(callback) {
          this._callback = callback;
        };

        return flyReward;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "imgGold", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "ndRewardParent", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "aniBoom", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/LanguageData.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './polyglot.min.ts'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, director, Polyglot;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
    }, function (module) {
      Polyglot = module.Polyglot;
    }],
    execute: function () {
      cclegacy._RF.push({}, "d6597NeRz5OuZ6kceJkHWc3", "LanguageData", undefined);

      var polyInst;

      if (!window.i18nConfig) {
        window.i18nConfig = {
          languages: {},
          curLang: ''
        };
      } // if (CC_EDITOR) {
      //     Editor.Profile.load('profile://project/i18n.json', (err, profile) => {
      //         window.i18nConfig.curLang = profile.data['default_language'];
      //         if (polyInst) {
      //             let data = loadLanguageData(window.i18nConfig.curLang) || {};
      //             initPolyglot(data);
      //         }
      //     });
      // }


      function loadLanguageData(language) {
        //@ts-ignore
        return window.i18nConfig.languages[language];
      }

      function initPolyglot(data) {
        if (data) {
          if (polyInst) {
            polyInst.replace(data);
          } else {
            polyInst = new Polyglot({
              phrases: data,
              allowMissing: true
            });
          }
        }
      } // module.exports = {


      var i18n = exports('i18n', /*#__PURE__*/function () {
        function i18n() {}
        /**
         * This method allow you to switch language during runtime, language argument should be the same as your data file name
         * such as when language is 'zh', it will load your 'zh.js' data source.
         * @method init
         * @param language - the language specific data file name, such as 'zh' to load 'zh.js'
         */


        i18n.init = function init(language) {
          if (!language || language === window.i18nConfig.curLang) {
            return;
          }

          var data = loadLanguageData(language) || {};
          window.i18nConfig.curLang = language;
          initPolyglot(data);
          this.inst = polyInst;
        }
        /**
         * this method takes a text key as input, and return the localized string
         * Please read https://github.com/airbnb/polyglot.js for details
         * @method t
         * @return {String} localized string
         * @example
         *
         * var myText = i18n.t('MY_TEXT_KEY');
         *
         * // if your data source is defined as
         * // {"hello_name": "Hello, %{name}"}
         * // you can use the following to interpolate the text
         * var greetingText = i18n.t('hello_name', {name: 'nantas'}); // Hello, nantas
         */
        ;

        i18n.t = function t(key, opt) {
          if (Object.keys(polyInst.phrases).length === 0) {
            var data = loadLanguageData(window.i18nConfig.curLang) || {};
            initPolyglot(data);
            console.warn('###防止出现parses数据丢失，重新替换数据');
          }

          if (polyInst) {
            return polyInst.t(key, opt);
          }
        } // inst: polyInst
        ;

        var _proto = i18n.prototype;

        _proto.updateSceneRenderers = function updateSceneRenderers() {
          // very costly iterations
          var rootNodes = director.getScene().children; // walk all nodes with localize label and update

          var allLocalizedLabels = [];

          for (var i = 0; i < rootNodes.length; ++i) {
            var labels = rootNodes[i].getComponentsInChildren('LocalizedLabel');
            Array.prototype.push.apply(allLocalizedLabels, labels);
          }

          for (var _i = 0; _i < allLocalizedLabels.length; ++_i) {
            var label = allLocalizedLabels[_i];
            if (!label.node.active) continue;
            label.updateLabel();
          } // walk all nodes with localize sprite and update


          var allLocalizedSprites = [];

          for (var _i2 = 0; _i2 < rootNodes.length; ++_i2) {
            var sprites = rootNodes[_i2].getComponentsInChildren('LocalizedSprite');

            Array.prototype.push.apply(allLocalizedSprites, sprites);
          }

          for (var _i3 = 0; _i3 < allLocalizedSprites.length; ++_i3) {
            var sprite = allLocalizedSprites[_i3];
            if (!sprite.node.active) continue;
            sprite.updateSprite(window.i18nConfig.curLang);
          }
        };

        return i18n;
      }());

      _defineProperty(i18n, "inst", null);

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/lottery.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './configuration.ts', './clientEvent.ts', './constant.ts', './localConfig.ts', './playerData.ts', './uiManager.ts', './gameLogic.ts', './lodash.ts', './lotteryItem.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, _createClass, cclegacy, _decorator, Node, Prefab, Button, Label, SpriteFrame, Sprite, instantiate, Color, Vec3, tween, Component, configuration, clientEvent, constant, localConfig, playerData, uiManager, gameLogic, lodash, lotteryItem;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Prefab = module.Prefab;
      Button = module.Button;
      Label = module.Label;
      SpriteFrame = module.SpriteFrame;
      Sprite = module.Sprite;
      instantiate = module.instantiate;
      Color = module.Color;
      Vec3 = module.Vec3;
      tween = module.tween;
      Component = module.Component;
    }, function (module) {
      configuration = module.configuration;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      localConfig = module.localConfig;
    }, function (module) {
      playerData = module.playerData;
    }, function (module) {
      uiManager = module.uiManager;
    }, function (module) {
      gameLogic = module.gameLogic;
    }, function (module) {
      lodash = module.lodash;
    }, function (module) {
      lotteryItem = module.lotteryItem;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _temp;

      cclegacy._RF.push({}, "d7ed7RMvvZIvbdJyWwfIGDy", "lottery", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var LOTTERY_PART = 6;
      var lottery = exports('lottery', (_dec = ccclass("lottery"), _dec2 = property(Node), _dec3 = property(Prefab), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Button), _dec7 = property(Button), _dec8 = property(Label), _dec9 = property(SpriteFrame), _dec10 = property(SpriteFrame), _dec11 = property(SpriteFrame), _dec12 = property(Sprite), _dec13 = property(Sprite), _dec14 = property(Sprite), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(lottery, _Component);

        function lottery() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "arrRewardNode", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "pfRewardItem", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeTurnable", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "ndBtnClose", _descriptor4, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "btnLottery", _descriptor5, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "btnAd", _descriptor6, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbMoney", _descriptor7, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "imgLotteryBtnDisable", _descriptor8, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "imgLotteryBtnEnable", _descriptor9, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "imgAdBtnEnable", _descriptor10, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spLotteryBtn", _descriptor11, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spAdIcon", _descriptor12, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spAdBtn", _descriptor13, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "arrRewardData", []);

          _defineProperty(_assertThisInitialized(_this), "arrLotteryItem", []);

          _defineProperty(_assertThisInitialized(_this), "arrProbability", []);

          _defineProperty(_assertThisInitialized(_this), "randValue", 0);

          _defineProperty(_assertThisInitialized(_this), "curRotation", null);

          _defineProperty(_assertThisInitialized(_this), "_receiveCarTimes", 0);

          return _this;
        }

        var _proto = lottery.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.onEnable = function onEnable() {
          clientEvent.on('buyCar', this.onBuyCar, this);
        };

        _proto.onDisable = function onDisable() {
          clientEvent.off('buyCar', this.onBuyCar, this);
        };

        _proto.onBuyCar = function onBuyCar() {
          this.initReward(); //更新下奖励界面
        };

        _proto.show = function show() {
          this.initReward();
          this.initInfo();
          this.btnAd.node.active = true;
        };

        _proto.initReward = function initReward() {
          var arrCars = localConfig.instance.getCars(); //获得所有车

          var arrLottery = [];
          arrCars.forEach(function (element) {
            if (!playerData.instance.hasCar(element.ID) && element.type === constant.BUY_CAR_TYPE.GOLD) {
              //未拥有的车辆，加入抽奖列表
              arrLottery.push(element.ID);
            }
          });

          if (arrLottery.length < 6) {
            //不足6辆，从已有的车辆中获得
            var arrHas = lodash.cloneDeep(playerData.instance.playerInfo.cars);

            while (arrLottery.length < 6) {
              //凑足6辆
              var rand = Math.floor(Math.random() * arrHas.length);
              var carId = arrHas[rand];
              var car = localConfig.instance.queryByID('car', carId);

              if (car.type === constant.BUY_CAR_TYPE.GOLD) {
                arrLottery.push(arrHas.splice(rand, 1)[0]);
              }
            }
          }

          this.arrRewardData = arrLottery;
          this.arrProbability = [];
          var start = 0;

          for (var idx = 0; idx < this.arrRewardNode.length; idx++) {
            var parentNode = this.arrRewardNode[idx];
            var rewardItem = this.arrLotteryItem[idx];

            if (!rewardItem) {
              rewardItem = instantiate(this.pfRewardItem);
              rewardItem.parent = parentNode;
              this.arrLotteryItem[idx] = rewardItem;
            }

            if (this.arrRewardData.length > idx) {
              var _car = this.arrRewardData[idx];
              var script = rewardItem.getComponent(lotteryItem);
              script.show(_car);
              var min = start;
              var max = start + 100 / LOTTERY_PART; //平均概率

              this.arrProbability.push({
                min: min,
                max: max,
                idx: idx
              });
              start = max;
            }
          }
        };

        _proto.initInfo = function initInfo() {
          this.lbMoney.string = '' + constant.LOTTERY.MONEY;
          this.checkButton();
        };

        _proto.checkButton = function checkButton() {
          var isFree = this.checkIsFree();
          this.btnAd.node.active = isFree;
          this.btnLottery.node.active = !isFree;

          if (isFree) {
            return;
          }

          if (playerData.instance.playerInfo.gold > constant.LOTTERY.MONEY) {
            this.lbMoney.color = new Color(163, 64, 27);
            this.lotteryBtnEnable = true;
            this.adBtnEnable = false;
          } else {
            this.lbMoney.color = Color.RED;
            this.lotteryBtnEnable = false;
            this.adBtnEnable = true;
          }

          gameLogic.updateRewardIcon(constant.SHARE_FUNCTION.LOTTERY, this.spAdIcon, function () {});
        };

        _proto.checkIsFree = function checkIsFree() {
          var signInInfo = playerData.instance.playerInfo.signInInfo;
          var currentDay = signInInfo.currentDay;
          var data = configuration.instance.getGlobalData('rewardDays');
          var isFree = data === undefined || parseInt(data) < currentDay ? true : false;
          return isFree;
        };

        _proto.getRandValue = function getRandValue() {
          var idxRand = -1;

          while (idxRand === -1) {
            var rand = Math.floor(Math.random() * 100);

            for (var idx = 0; idx < this.arrProbability.length; idx++) {
              var probability = this.arrProbability[idx];

              if (rand >= probability.min && rand < probability.max) {
                idxRand = probability.idx;
                break;
              }
            }
          }

          return idxRand;
        };

        _proto.onBtnStartClick = function onBtnStartClick() {
          //扣除对应金币
          gameLogic.addGold(-constant.LOTTERY.MONEY); //每抽一次扣一次

          this.startRun();
        };

        _proto.onBtnAdClick = function onBtnAdClick() {
          var _this2 = this;

          var data = configuration.instance.getGlobalData('rewardDays');
          configuration.instance.setGlobalData('rewardDays', "" + (!data ? 0 : parseInt(data) + 1));
          gameLogic.openReward(constant.SHARE_FUNCTION.LOTTERY, function (err) {
            if (!err) {
              _this2.startRun();
            }
          });
        };

        _proto.startRun = function startRun() {
          var _this3 = this;

          this.lotteryBtnEnable = false;
          this.adBtnEnable = false;
          this.ndBtnClose.getComponent(Button).interactable = false; //随机抽奖结果

          this.randValue = this.getRandValue(); //开始旋转
          //先开始第一轮，根据当前度数，将其旋转至360度

          var targetRotation = -360;
          var curRotation = this.nodeTurnable.eulerAngles.z % 360;
          this.nodeTurnable.eulerAngles = new Vec3(0, 0, curRotation);
          var offset = 360 - curRotation;
          var randTimes = 3 + Math.floor(Math.random() * 4);
          var rotate = targetRotation - randTimes * 360 + this.randValue * 60 + 30 - 360;
          this.curRotation = this.nodeTurnable.eulerAngles.clone();
          tween(this.curRotation) // .to(offset/360 + randTimes * 0.5, new Vec3(0, 0, rotate), { easing: 'Circular-Out'})
          .to(offset / 360 + randTimes * 0.5, new Vec3(0, 0, rotate), {
            easing: 'cubicOut'
          }).call(function () {
            _this3.curRotation = null;

            _this3.showReward();
          }).start(); // this.nodeTurnable.eulerAngles = new Vec3(0, 0, rotate);
        };

        _proto.showReward = function showReward() {
          this.ndBtnClose.getComponent(Button).interactable = true;
          var itemNode = this.arrLotteryItem[this.randValue];

          var _lottery = itemNode.getComponent(lotteryItem);

          _lottery.showReward(this);

          this.checkButton();
        };

        _proto.onBtnCloseClick = function onBtnCloseClick() {
          // cc.gameSpace.audioManager.playSound('click', false);
          uiManager.instance.hideDialog('lottery/lottery');
        };

        _proto.update = function update(deltaTime) {
          // Your update function goes here.
          if (this.curRotation) {
            this.nodeTurnable.eulerAngles = this.curRotation;
          }
        };

        _createClass(lottery, [{
          key: "receiveCarTimes",
          get: function get() {
            return this._receiveCarTimes;
          },
          set: //获取车的次数
          function set(num) {
            console.log("#####receiveCarTimes", num);
            this._receiveCarTimes = num;
          }
        }, {
          key: "lotteryBtnEnable",
          set: function set(value) {
            if (value) {
              this.btnLottery.interactable = true;
              this.spLotteryBtn.spriteFrame = this.imgLotteryBtnEnable;
            } else {
              this.btnLottery.interactable = false;
              this.spLotteryBtn.spriteFrame = this.imgLotteryBtnDisable;
            }
          }
        }, {
          key: "adBtnEnable",
          set: function set(value) {
            if (value) {
              this.btnAd.interactable = true;
              this.spAdBtn.spriteFrame = this.imgAdBtnEnable;
            } else {
              this.btnAd.interactable = false;
              this.spAdBtn.spriteFrame = this.imgLotteryBtnDisable;
            }
          }
        }]);

        return lottery;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "arrRewardNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "pfRewardItem", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "nodeTurnable", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "ndBtnClose", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "btnLottery", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "btnAd", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "lbMoney", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "imgLotteryBtnDisable", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "imgLotteryBtnEnable", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "imgAdBtnEnable", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "spLotteryBtn", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "spAdIcon", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "spAdBtn", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/fightCanvas.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './clientEvent.ts', './carManager.ts', './gameLogic.ts', './loading.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, SpriteFrame, Node, Component, clientEvent, carManager, gameLogic, loading;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      SpriteFrame = module.SpriteFrame;
      Node = module.Node;
      Component = module.Component;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      carManager = module.carManager;
    }, function (module) {
      gameLogic = module.gameLogic;
    }, function (module) {
      loading = module.loading;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

      cclegacy._RF.push({}, "daea1EBoy1Ms6PBdAupQWnn", "fightCanvas", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var fightCanvas = exports('fightCanvas', (_dec = ccclass("fightCanvas"), _dec2 = property(carManager), _dec3 = property(SpriteFrame), _dec4 = property(SpriteFrame), _dec5 = property(loading), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(fightCanvas, _Component);

        function fightCanvas() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "carManager", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "imgShare", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "imgVideo", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "loadingUI", _descriptor4, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "curProgress", 50);

          _defineProperty(_assertThisInitialized(_this), "isFirstLoad", true);

          _defineProperty(_assertThisInitialized(_this), "isTouching", false);

          return _this;
        }

        var _proto = fightCanvas.prototype; //是否正在点击中

        _proto.start = function start() {
          gameLogic.imgAd = this.imgVideo;
          gameLogic.imgShare = this.imgShare; //首次进来，起始50%（前面为登录加载）

          this.loadingUI.show(this.curProgress); // Your initialization goes here.

          this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        };

        _proto.onEnable = function onEnable() {
          clientEvent.on('updateLoading', this.updateLoadingProgress, this);
          clientEvent.on('showGuide', this.showGuide, this);
        };

        _proto.onDisable = function onDisable() {
          clientEvent.off('updateLoading', this.updateLoadingProgress, this);
          clientEvent.off('showGuide', this.showGuide, this);
        };

        _proto.onTouchStart = function onTouchStart() {
          this.isTouching = true;
          this.carManager.controlMainCar(true);
        };

        _proto.onTouchEnd = function onTouchEnd() {
          this.isTouching = false;
          this.carManager.controlMainCar(false);
        };

        _proto.showGuide = function showGuide(isShow) {
          var _this2 = this;

          if (isShow && this.isTouching) {
            //异步执行，使引导正常，因为
            this.scheduleOnce(function () {
              _this2.onTouchStart();
            }, 0);
          }
        };

        _proto.updateLoadingProgress = function updateLoadingProgress(progress, tips) {
          if (!this.isFirstLoad) {
            this.curProgress += progress;
          } else {
            this.curProgress += Math.floor(progress / 2); //首次加载是跟登录一块的，这样起始是50%
          }

          this.loadingUI.updateProgress(this.curProgress, tips);
        };

        _proto.loadNewLevel = function loadNewLevel() {
          this.loadingUI.node.active = true;
          this.curProgress = 0;
          this.isFirstLoad = false;
        };

        _proto.finishLoading = function finishLoading() {
          this.loadingUI.node.active = false;
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }
        ;

        return fightCanvas;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "carManager", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "imgShare", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "imgVideo", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "loadingUI", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/fightConstants.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "dbe36y+LwBGGIL8I87F3O+/", "fightConstants", undefined); // Learn cc.Class:
      //  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
      //  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
      // Learn Attribute:
      //  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
      //  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
      // Learn life-cycle callbacks:
      //  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
      //  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html


      var fightConstants = exports('fightConstants', function fightConstants() {});

      _defineProperty(fightConstants, "ROAD_POINT_TYPE", {
        NORMAL: 1,
        //普通节点
        START: 2,
        //开始节点
        GREETING: 3,
        //接客节点
        PLATFORM: 4,
        //送客节点（用于接客及送客）
        END: 5,
        //结束节点
        AI_START: 6 //机器人开始节点

      });

      _defineProperty(fightConstants, "ROAD_MOVE_TYPE", {
        LINE: 1,
        //直线行走
        BEND: 2 //曲线行走

      });

      _defineProperty(fightConstants, "CAR_GROUP", {
        NORMAL: 1,
        MAIN_CAR: 2,
        OTHER_CAR: 4
      });

      _defineProperty(fightConstants, "CUSTOMER_TALK_TIME", {
        INTO_THE_CAR: 1,
        //上车后
        NEW_ORDER: 2 //有新订单的时候

      });

      _defineProperty(fightConstants, "CLICK_BOX_REWARD", 300);

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/audioManager.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './configuration.ts', './resourceUtil.ts'], function (exports) {
  'use strict';

  var _createClass, _defineProperty, cclegacy, assert, AudioClip, warn, clamp01, configuration, resourceUtil;

  return {
    setters: [function (module) {
      _createClass = module.createClass;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      assert = module.assert;
      AudioClip = module.AudioClip;
      warn = module.warn;
      clamp01 = module.clamp01;
    }, function (module) {
      configuration = module.configuration;
    }, function (module) {
      resourceUtil = module.resourceUtil;
    }],
    execute: function () {
      cclegacy._RF.push({}, "e478cuMHJdIHa5fP3m5UZ7S", "audioManager", undefined);

      var audioManager = exports('audioManager', /*#__PURE__*/function () {
        function audioManager() {
          _defineProperty(this, "soundVolume", 1);
        }

        var _proto = audioManager.prototype; // init AudioManager in GameRoot.

        _proto.init = function init(audioSource) {
          this.soundVolume = this.getConfiguration(false) ? 1 : 0;
          audioManager._audioSource = audioSource;
        };

        _proto.getConfiguration = function getConfiguration(isMusic) {
          var state;

          if (isMusic) {
            state = configuration.instance.getGlobalData('music');
          } else {
            state = configuration.instance.getGlobalData('sound');
          } // console.log('Config for [' + (isMusic ? 'Music' : 'Sound') + '] is ' + state);


          return state === undefined || state === 'true' ? true : false;
        }
        /**
         * 播放音乐
         * @param {String} name 音乐名称可通过constants.AUDIO_MUSIC 获取
         * @param {Boolean} loop 是否循环播放
         */
        ;

        _proto.playMusic = function playMusic(loop) {
          var audioSource = audioManager._audioSource;
          assert(audioSource, 'AudioManager not inited!');
          audioSource.loop = loop;

          if (!audioSource.playing) {
            audioSource.play();
          }
        }
        /**
         * 播放音效
         * @param {String} name 音效名称可通过constants.AUDIO_SOUND 获取
         */
        ;

        _proto.playSound = function playSound(name) {
          var _this = this;

          var audioSource = audioManager._audioSource;
          assert(audioSource, 'AudioManager not inited!'); //音效一般是多个的，不会只有一个

          var path = 'gamePackage/audio/sound/'; // if (name !== 'click') {
          //     path = 'gamePackage/' + path; //微信特殊处理，除一开场的音乐，其余的放在子包里头
          // }

          resourceUtil.loadRes(path + name, AudioClip, function (err, clip) {
            if (err) {
              warn('load audioClip failed: ', err);
              return;
            } // NOTE: the second parameter is volume scale.


            audioSource.playOneShot(clip, audioSource.volume ? _this.soundVolume / audioSource.volume : 0);
          });
        };

        _proto.setMusicVolume = function setMusicVolume(flag) {
          var audioSource = audioManager._audioSource;
          assert(audioSource, 'AudioManager not inited!');
          flag = clamp01(flag);
          audioSource.volume = flag;
        };

        _proto.setSoundVolume = function setSoundVolume(flag) {
          this.soundVolume = flag;
        };

        _proto.openMusic = function openMusic() {
          this.setMusicVolume(0.8);
          configuration.instance.setGlobalData('music', 'true');
        };

        _proto.closeMusic = function closeMusic() {
          this.setMusicVolume(0);
          configuration.instance.setGlobalData('music', 'false');
        };

        _proto.openSound = function openSound() {
          this.setSoundVolume(1);
          configuration.instance.setGlobalData('sound', 'true');
        };

        _proto.closeSound = function closeSound() {
          this.setSoundVolume(0);
          configuration.instance.setGlobalData('sound', 'false');
        };

        _createClass(audioManager, null, [{
          key: "instance",
          get: function get() {
            if (this._instance) {
              return this._instance;
            }

            this._instance = new audioManager();
            return this._instance;
          }
        }]);

        return audioManager;
      }());

      _defineProperty(audioManager, "_instance", void 0);

      _defineProperty(audioManager, "_audioSource", void 0);

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/car.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './fightConstants.ts', './clientEvent.ts', './resourceUtil.ts', './audioManager.ts', './constant.ts', './poolManager.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _defineProperty, _assertThisInitialized, _initializerDefineProperty, _createClass, cclegacy, _decorator, Node, Vec3, ParticleSystem, RigidBody, Collider, ERigidBodyType, instantiate, Component, fightConstants, clientEvent, resourceUtil, audioManager, constant, poolManager;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _defineProperty = module.defineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _initializerDefineProperty = module.initializerDefineProperty;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Vec3 = module.Vec3;
      ParticleSystem = module.ParticleSystem;
      RigidBody = module.RigidBody;
      Collider = module.Collider;
      ERigidBodyType = module.ERigidBodyType;
      instantiate = module.instantiate;
      Component = module.Component;
    }, function (module) {
      fightConstants = module.fightConstants;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      resourceUtil = module.resourceUtil;
    }, function (module) {
      audioManager = module.audioManager;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      poolManager = module.poolManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "e6d4fVD3pxJ7Y1Khf8fRUoa", "car", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var TOOTING_COOL_TIME = 5; //5s后才会再次鸣笛

      var car = exports('car', (_dec = ccclass("car"), _dec2 = property({
        displayName: '最大移动速度'
      }), _dec3 = property({
        displayName: '最小移动速度'
      }), _dec4 = property(Node), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(car, _Component);

        function car() {
          var _this;

          _this = _Component.call(this) || this;

          _defineProperty(_assertThisInitialized(_this), "_isMoving", false);

          _initializerDefineProperty(_assertThisInitialized(_this), "maxSpeed", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "minSpeed", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeGas", _descriptor3, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "_minSpeed", -1);

          _defineProperty(_assertThisInitialized(_this), "_maxSpeed", -1);

          _defineProperty(_assertThisInitialized(_this), "manager", null);

          _defineProperty(_assertThisInitialized(_this), "isMain", false);

          _defineProperty(_assertThisInitialized(_this), "currentSpeed", 0);

          _defineProperty(_assertThisInitialized(_this), "accelerate", 2);

          _defineProperty(_assertThisInitialized(_this), "originRotation", 0);

          _defineProperty(_assertThisInitialized(_this), "targetRotation", 0);

          _defineProperty(_assertThisInitialized(_this), "curRoadPoint", null);

          _defineProperty(_assertThisInitialized(_this), "circleCenterPoint", new Vec3());

          _defineProperty(_assertThisInitialized(_this), "quarter", 0);

          _defineProperty(_assertThisInitialized(_this), "_nodeGasInst", null);

          _defineProperty(_assertThisInitialized(_this), "entry", null);

          _defineProperty(_assertThisInitialized(_this), "forward", new Vec3(0, 0, -1));

          _defineProperty(_assertThisInitialized(_this), "posTarget", new Vec3());

          _defineProperty(_assertThisInitialized(_this), "posSrc", new Vec3());

          _defineProperty(_assertThisInitialized(_this), "_callback", null);

          _defineProperty(_assertThisInitialized(_this), "isOver", false);

          _defineProperty(_assertThisInitialized(_this), "curProgress", 0);

          _defineProperty(_assertThisInitialized(_this), "maxProgress", 0);

          _defineProperty(_assertThisInitialized(_this), "hasCustomer", false);

          _defineProperty(_assertThisInitialized(_this), "lastPos", new Vec3());

          _defineProperty(_assertThisInitialized(_this), "lastRotation", new Vec3());

          _defineProperty(_assertThisInitialized(_this), "isBraking", false);

          _defineProperty(_assertThisInitialized(_this), "arrTyres", []);

          _defineProperty(_assertThisInitialized(_this), "curTyreRotation", 0);

          _defineProperty(_assertThisInitialized(_this), "nodeCarBackLight", null);

          _defineProperty(_assertThisInitialized(_this), "tootingCoolTime", 0);

          _defineProperty(_assertThisInitialized(_this), "isCarMoving", false);

          _defineProperty(_assertThisInitialized(_this), "nodeInvincible", null);

          _defineProperty(_assertThisInitialized(_this), "_isHosting", false);

          _defineProperty(_assertThisInitialized(_this), "_isInvincible", false);

          _defineProperty(_assertThisInitialized(_this), "invincibleRotation", 0);

          return _this;
        }

        var _proto = car.prototype;

        _proto.start = function start() {
          var _this2 = this; // Your initialization goes here.


          this._minSpeed = this.minSpeed;
          this._maxSpeed = this.maxSpeed;
          var tyre1 = this.node.getChildByPath('RootNode/tyre1');

          if (tyre1) {
            this.arrTyres = [tyre1, this.node.getChildByPath('RootNode/tyre2'), this.node.getChildByPath('RootNode/tyre3'), this.node.getChildByPath('RootNode/tyre4')];
            this.nodeCarBackLight = this.node.getChildByPath('RootNode/light1');
          } //异步加载尾气,不需要每个都去创建一个


          resourceUtil.getEffect('gas', function (err, prefab) {
            if (err) {
              return;
            }

            var gas = poolManager.instance.getNode(prefab, _this2.nodeGas);
            _this2._nodeGasInst = gas.getComponent(ParticleSystem);
            gas.setPosition(new Vec3(0, 0, 0));
          });
        }
        /**
         * 标记为主车
         */
        ;

        _proto.markMainCar = function markMainCar(isMain) {
          this.isMain = isMain;
          var rigidBody = this.node.getComponent(RigidBody);
          var collider = this.node.getComponent(Collider);
          collider.off("onCollisionEnter", this.onCollisionEnter, this);

          if (isMain) {
            rigidBody.setGroup(fightConstants.CAR_GROUP.MAIN_CAR);
            rigidBody.setMask(fightConstants.CAR_GROUP.OTHER_CAR);
            rigidBody.type = ERigidBodyType.KINEMATIC;
            collider.on("onCollisionEnter", this.onCollisionEnter, this);
          } else {
            rigidBody.setGroup(fightConstants.CAR_GROUP.OTHER_CAR);
            rigidBody.setMask(-1);
            rigidBody.type = ERigidBodyType.DYNAMIC;
          }
        };

        _proto.setEntry = function setEntry(entry) {
          this.entry = entry;
          this.reset();
        };

        _proto.onCollisionEnter = function onCollisionEnter(event) {
          var _this3 = this;

          if (!this.isMain) {
            return;
          }

          if (event.otherCollider.node.name === 'ground') {
            return;
          }

          var nodeEnemy = event.otherCollider.node;

          if (event.otherCollider.node === this.node) {
            nodeEnemy = event.selfCollider.node;
          }

          var _car = nodeEnemy.getComponent('car');

          if (!_car.isOver) {
            _car.isOver = true; //标准这辆车出车祸了

            var enemyRigidBody = nodeEnemy.getComponent(RigidBody);
            enemyRigidBody.useGravity = true;

            if (!this.isInvincible) {
              enemyRigidBody.applyForce(new Vec3(0, 1500, -3000), new Vec3(0, 0.5, 0));
            } else {
              enemyRigidBody.applyForce(new Vec3(0, 10000, -3000), new Vec3(0, 0.5, 0));
            }
          }

          if (this.isOver) {
            return;
          }

          audioManager.instance.playSound(constant.AUDIO_SOUND.CRASH);
          var rigidBody = this.node.getComponent(RigidBody);

          if (this.isInvincible) {
            this.lastPos = this.node.worldPosition;
            this.lastRotation = this.node.eulerAngles;
            rigidBody.enabled = false; //将物理引擎中的速度置为0

            this.scheduleOnce(function () {
              _this3.isInvincible = false;
              rigidBody.enabled = true; //修复无敌状态时撞到AI小车导致bug

              _this3.revive();

              _this3.currentSpeed = _this3._minSpeed;
            }, 0.1);
            this.scheduleOnce(function () {
              poolManager.instance.putNode(nodeEnemy);
            }, 0.3);
            return;
          } //发生碰撞，游戏结束，记录下最后的车辆信息


          this.lastPos = this.node.worldPosition;
          this.lastRotation = this.node.eulerAngles;
          this.isOver = true; // rigidBody.useGravity = true;

          rigidBody.setGroup(fightConstants.CAR_GROUP.MAIN_CAR);
          rigidBody.setMask(fightConstants.CAR_GROUP.OTHER_CAR | fightConstants.CAR_GROUP.NORMAL);
          clientEvent.dispatchEvent('gameOver', false);
        };

        _proto.updateBackLight = function updateBackLight() {
          if (this.nodeCarBackLight) {
            this.nodeCarBackLight.active = !this.isMoving || this.isHosting;
          }
        };

        _proto.startRunning = function startRunning() {
          if (this.isOver) {
            return;
          }

          this.isMoving = true;
          this.accelerate = 0.4;

          if (this._nodeGasInst) {
            this._nodeGasInst.play();
          }

          if (this.isBraking) {
            clientEvent.dispatchEvent('endBraking');
            this.isBraking = false;
          }
        };

        _proto.startWithMinSpeed = function startWithMinSpeed() {
          this.currentSpeed = this.minSpeed;
          this.stopRunning(true);

          if (this._nodeGasInst) {
            this._nodeGasInst.play();
          } // if (this.isMain) {
          //     this.isInvincible = true;
          // }

        };

        _proto.stopRunning = function stopRunning(isInit) {
          if (this.isOver) {
            return;
          }

          this.isMoving = false;
          this.accelerate = -0.15;

          if (!this.isBraking && !isInit) {
            clientEvent.dispatchEvent('startBraking');
            this.isBraking = true;
          }
        };

        _proto.stopImmediately = function stopImmediately() {
          this.isMoving = false;
          this.currentSpeed = 0;
        };

        _proto.setMoveOverListener = function setMoveOverListener(callback) {
          this._callback = callback;
        };

        _proto.resetPhysical = function resetPhysical() {
          this.isOver = false;

          if (this.isMain) {
            this.markMainCar(true);
          } //初始化物理引擎相关信息


          var rigidBody = this.node.getComponent(RigidBody);
          rigidBody.useGravity = false; //将物理引擎中的速度置为0

          rigidBody.sleep();
          rigidBody.wakeUp();
        };

        _proto.revive = function revive() {
          //复活
          this.resetPhysical();
          console.log("revive pos ", this.lastPos);
          var lastPos = new Vec3(this.lastPos.x, 0, this.lastPos.z);
          this.node.setWorldPosition(lastPos);
          this.node.eulerAngles = this.lastRotation;
          this.isMoving = false;
          this.currentSpeed = 0;
        };

        _proto.reset = function reset() {
          //获得对应路径，但目前我们只做了主路的，所以先用主路线,主路线默认索引为0
          this.resetPhysical();

          if (this.isMain) {
            this.curProgress = 0;
            this.hasCustomer = false;

            if (this._nodeGasInst) {
              this._nodeGasInst.stop();
            }

            this.isInvincible = false;
          }

          this.tootingCoolTime = 0;
          this.curRoadPoint = this.entry.getComponent('roadPoint');
          this.posSrc.set(this.entry.worldPosition);
          this.posTarget.set(this.curRoadPoint.next.worldPosition); //初始化位置

          this.node.setWorldPosition(this.entry.worldPosition); //初始化旋转角度

          if (this.posTarget.z !== this.posSrc.z) {
            if (this.posTarget.z < this.posSrc.z) {
              //向上
              this.node.eulerAngles = new Vec3(0, 360, 0);
            } else {
              //向下
              this.node.eulerAngles = new Vec3(0, 180, 0);
            }
          } else {
            if (this.posTarget.x > this.posSrc.x) {
              //向上
              this.node.eulerAngles = new Vec3(0, 270, 0);
            } else {
              //向下
              this.node.eulerAngles = new Vec3(0, 90, 0);
            }
          }

          this.originRotation = this.node.eulerAngles.y;
          this.targetRotation = this.originRotation;
          this.isMoving = false;
          this.isHosting = false;
          this.currentSpeed = 0;

          if (this._minSpeed > 0) {
            this.minSpeed = this._minSpeed;
            this.maxSpeed = this._maxSpeed;
          }
        }
        /**
         * 接客
         */
        ;

        _proto.greeting = function greeting() {
          var _this4 = this;

          this.isHosting = true;
          this.curProgress++;
          this.hasCustomer = true;
          clientEvent.dispatchEvent('greetingCustomer'); //随机个乘客给它

          this.manager.greeting(this.node.worldPosition, this.curRoadPoint.direction, function () {
            _this4.isMoving = false;
            _this4.currentSpeed = 0;
            _this4.isHosting = false;
            clientEvent.dispatchEvent('showGuide', true);
          });
        }
        /**
         * 送客
         */
        ;

        _proto.takeCustomer = function takeCustomer() {
          var _this5 = this;

          this.isHosting = true;
          this.hasCustomer = false;
          clientEvent.dispatchEvent('takeCustomer'); //送客

          this.manager.takeCustomer(this.node.worldPosition, this.curRoadPoint.direction, this.curProgress === this.maxProgress, function () {
            _this5.isMoving = false;
            _this5.currentSpeed = 0;
            _this5.isHosting = false;
            clientEvent.dispatchEvent('showGuide', true);
          });
        };

        _proto.arrivalPoint = function arrivalPoint() {
          this.node.setWorldPosition(this.posTarget);

          if (this.curRoadPoint.moveType === fightConstants.ROAD_MOVE_TYPE.BEND) {
            //如果是曲线，则需要将其旋转角度转正
            this.node.eulerAngles = new Vec3(0, this.targetRotation, 0);
          } //切换至下一个目标点


          this.posSrc.set(this.posTarget);
          this.posTarget.set(Vec3.ZERO);

          if (this.curRoadPoint.next) {
            this.curRoadPoint = this.curRoadPoint.next.getComponent('roadPoint'); //todo 切换新的点，看是否是接客或者下客

            if (this.isMain) {
              if (this.curRoadPoint.type === fightConstants.ROAD_POINT_TYPE.GREETING) {
                this.greeting();
              } else if (this.curRoadPoint.type === fightConstants.ROAD_POINT_TYPE.PLATFORM) {
                this.takeCustomer();
              } else if (this.curRoadPoint.type === fightConstants.ROAD_POINT_TYPE.END) {
                //结束点，触发下
                clientEvent.dispatchEvent('gameOver', true);
                this.moveAfterFinished();
              }
            }

            if (this.curRoadPoint.next) {
              this.posTarget.set(this.curRoadPoint.next.worldPosition);
            } else {
              //表示没有接下来的点，执行结束了
              this._callback && this._callback(this); //行走完后回调
            }

            this.originRotation = this.node.eulerAngles.y;
            this.targetRotation = this.originRotation;

            if (this.curRoadPoint.moveType === fightConstants.ROAD_MOVE_TYPE.BEND) {
              //属于转弯的
              //确定下半圆的中间点
              if (this.curRoadPoint.clockwise) {
                //顺时针 -90
                this.originRotation = this.originRotation <= 0 ? 360 + this.originRotation : this.originRotation;
                this.targetRotation = this.originRotation - 90; //顺时针旋转

                if (this.posTarget.x > this.posSrc.x && this.posTarget.z < this.posSrc.z || this.posTarget.x < this.posSrc.x && this.posTarget.z > this.posSrc.z) {
                  //第一区域与第三区域
                  this.circleCenterPoint = new Vec3(this.posTarget.x, 0, this.posSrc.z);
                } else {
                  this.circleCenterPoint = new Vec3(this.posSrc.x, 0, this.posTarget.z);
                }

                var r = Vec3.subtract(new Vec3(), this.circleCenterPoint, this.posSrc).length(); // this.circleCenterPoint.sub(this.posSrc).mag();

                this.quarter = 90 / (Math.PI * r / 2); //相当于1米需要旋转多少度
              } else {
                this.originRotation = this.originRotation >= 360 ? this.originRotation - 360 : this.originRotation;
                this.targetRotation = this.originRotation + 90; //逆时针旋转

                if (this.posTarget.x > this.posSrc.x && this.posTarget.z < this.posSrc.z || this.posTarget.x < this.posSrc.x && this.posTarget.z > this.posSrc.z) {
                  //第一区域与第三区域
                  this.circleCenterPoint = new Vec3(this.posSrc.x, 0, this.posTarget.z);
                } else {
                  this.circleCenterPoint = new Vec3(this.posTarget.x, 0, this.posSrc.z);
                }

                var _r = Vec3.subtract(new Vec3(), this.circleCenterPoint, this.posSrc).length();

                this.quarter = 90 / (Math.PI * _r / 2); //相当于1米需要旋转多少度
              } //将旋转角度重置为正常角度


              this.node.eulerAngles = new Vec3(0, this.originRotation, 0); // this.circleCenterPoint = Vec3(this.posTarget.x,
            }
          } else {
            this.curRoadPoint = null;
            this._callback && this._callback(this); //行走完后回调
          }
        };

        _proto.update = function update(deltaTime) {
          //无敌特效相关
          if (this.nodeInvincible) {
            this.invincibleRotation += deltaTime * 200; //每帧转动多少

            if (this.invincibleRotation > 360) {
              this.invincibleRotation -= 360;
            }

            this.nodeInvincible.eulerAngles = new Vec3(this.invincibleRotation, 0, 0);
          } //喇叭


          if (this.tootingCoolTime > 0) {
            this.tootingCoolTime = this.tootingCoolTime > deltaTime ? this.tootingCoolTime - deltaTime : 0;
          } //车辆移动相关


          if (!this.isMoving && this.currentSpeed < 0.01 || this.posTarget.equals(Vec3.ZERO) || this.isHosting || this.isOver) {
            this.isCarMoving = false;
            return;
          }

          this.isCarMoving = true;
          this.currentSpeed += this.accelerate * deltaTime;
          this.currentSpeed = this.currentSpeed > this.maxSpeed ? this.maxSpeed : this.currentSpeed;

          if (this.currentSpeed < this.minSpeed) {
            this.currentSpeed = this.minSpeed;

            if (this.isBraking) {
              clientEvent.dispatchEvent('endBraking');
              this.isBraking = false;
            }
          }

          if (this.arrTyres.length > 0) {
            this.curTyreRotation -= this.currentSpeed * 200;

            if (this.curTyreRotation < -360) {
              this.curTyreRotation += 360;
            }

            var rotation = new Vec3(this.curTyreRotation, 0);

            for (var idx = 0; idx < this.arrTyres.length; idx++) {
              var tyre = this.arrTyres[idx];
              tyre.eulerAngles = rotation;
            }
          }

          switch (this.curRoadPoint.moveType) {
            case fightConstants.ROAD_MOVE_TYPE.LINE:
              var offset = new Vec3();
              Vec3.subtract(offset, this.posTarget, this.node.worldPosition);
              offset.normalize();
              Vec3.multiplyScalar(offset, offset, this.currentSpeed);
              var pos = this.node.worldPosition;
              offset.add(pos);

              if (this.posTarget.z !== this.posSrc.z) {
                if (this.posTarget.z < this.posSrc.z) {
                  //向上
                  this.node.eulerAngles = new Vec3(0, 360, 0);

                  if (offset.z < this.posTarget.z) {
                    offset.z = this.posTarget.z;
                  }
                } else {
                  //向下
                  this.node.eulerAngles = new Vec3(0, 180, 0);

                  if (offset.z > this.posTarget.z) {
                    offset.z = this.posTarget.z;
                  }
                }
              } else {
                if (this.posTarget.x > this.posSrc.x) {
                  //向上
                  this.node.eulerAngles = new Vec3(0, 270, 0);

                  if (offset.x > this.posTarget.x) {
                    offset.x = this.posTarget.x;
                  }
                } else {
                  //向下
                  this.node.eulerAngles = new Vec3(0, 90, 0);

                  if (offset.x < this.posTarget.x) {
                    offset.x = this.posTarget.x;
                  }
                }
              } // this.node.eulerAngles = offset;


              this.node.setWorldPosition(offset);
              break;

            case fightConstants.ROAD_MOVE_TYPE.BEND:
              //进行圆角计算
              var offsetRotation = this.targetRotation - this.originRotation;
              var curRotation = this.node.eulerAngles.y < 0 ? 360 + this.node.eulerAngles.y : this.node.eulerAngles.y;

              if (this.node.eulerAngles.y > 360) {
                curRotation = this.node.eulerAngles.y - 360;
              }

              var percent = Math.abs((curRotation - this.originRotation) / offsetRotation);
              var nextRotation = offsetRotation * percent + this.currentSpeed * this.quarter * (this.targetRotation > this.originRotation ? 1 : -1);

              if (Math.abs(offsetRotation) < Math.abs(nextRotation)) {
                nextRotation = offsetRotation;
              }

              var target = this.originRotation + nextRotation;
              var posCur = Vec3.rotateY(new Vec3(), this.posSrc, this.circleCenterPoint, nextRotation * Math.PI / 180);
              this.node.setWorldPosition(posCur);
              this.node.eulerAngles = new Vec3(0, target, 0);
              break;
          }

          if (Vec3.subtract(new Vec3(), this.posTarget, this.node.worldPosition).lengthSqr() < 0.001) {
            //到达目标点
            this.arrivalPoint();
          }
        };

        _proto.moveAfterFinished = function moveAfterFinished() {
          this.isMoving = true;
          this.minSpeed = 0.2;
          this.maxSpeed = 0.2;
          this.startRunning();
        };

        _proto.tooting = function tooting() {
          if (this.tootingCoolTime > 0) {
            return;
          }

          this.tootingCoolTime = TOOTING_COOL_TIME; //设置为最大时间
          //随机个音效播放

          var audio = Math.floor(Math.random() * 2) === 1 ? constant.AUDIO_SOUND.TOOTING1 : constant.AUDIO_SOUND.TOOTING2;
          audioManager.instance.playSound(audio);
        };

        _createClass(car, [{
          key: "isMoving",
          get: function get() {
            return this._isMoving;
          },
          set: function set(value) {
            this._isMoving = value;
            this.updateBackLight();
          }
        }, {
          key: "isHosting",
          get: function get() {
            return this._isHosting;
          },
          set: //无敌特效
          //是否正在接客
          function set(value) {
            this._isHosting = value;
            this.updateBackLight();
          }
        }, {
          key: "isInvincible",
          get: function get() {
            return this._isInvincible;
          },
          set: function set(isShow) {
            var _this6 = this;

            this._isInvincible = isShow;

            if (isShow) {
              if (this.nodeInvincible) {
                //已经存在该特效
                this.nodeInvincible.active = true;
                return;
              } else {
                resourceUtil.getEffect('shield', function (err, prefab) {
                  if (err) {
                    console.error(err);
                    return;
                  }

                  _this6.nodeInvincible = instantiate(prefab);
                  _this6.nodeInvincible.parent = _this6.node;
                });
              }
            } else {
              if (this.nodeInvincible) {
                this.nodeInvincible.destroy();
                this.nodeInvincible = null;
              }
            }
          }
        }]);

        return car;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "maxSpeed", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "minSpeed", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "nodeGas", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/migrate-canvas.ts", ['cc'], function () {
  'use strict';

  var cclegacy, director, Director, Canvas, Camera, game;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
      Director = module.Director;
      Canvas = module.Canvas;
      Camera = module.Camera;
      game = module.game;
    }],
    execute: function () {
      cclegacy._RF.push({}, "e88543KyK5I1IU1Sy8u4Lzm", "migrate-canvas", undefined);

      var customLayerMask = 0x000fffff;
      var builtinLayerMask = 0xfff00000;
      director.on(Director.EVENT_AFTER_SCENE_LAUNCH, function () {
        var _director$getScene, _director$getScene2, _director$getScene3;

        var roots = (_director$getScene = director.getScene()) === null || _director$getScene === void 0 ? void 0 : _director$getScene.children;
        var allCanvases = (_director$getScene2 = director.getScene()) === null || _director$getScene2 === void 0 ? void 0 : _director$getScene2.getComponentsInChildren(Canvas);
        if (allCanvases.length <= 1) return;
        allCanvases = allCanvases.filter(function (x) {
          return !!x.cameraComponent;
        });
        var allCameras = (_director$getScene3 = director.getScene()) === null || _director$getScene3 === void 0 ? void 0 : _director$getScene3.getComponentsInChildren(Camera);
        var usedLayer = 0;
        allCameras.forEach(function (x) {
          return usedLayer |= x.visibility & customLayerMask;
        });
        var persistCanvas = [];

        for (var i = 0, l = roots.length; i < l; i++) {
          var root = roots[i];
          if (!game.isPersistRootNode(root)) continue;
          var canvases = root.getComponentsInChildren(Canvas);
          if (canvases.length === 0) continue;
          persistCanvas.push.apply(persistCanvas, canvases.filter(function (x) {
            return !!x.cameraComponent;
          }));
        }

        persistCanvas.forEach(function (val) {
          var isLayerCollided = allCanvases.find(function (x) {
            return x !== val && x.cameraComponent.visibility & val.cameraComponent.visibility & customLayerMask;
          });

          if (isLayerCollided) {
            var availableLayers = ~usedLayer;
            var lastAvailableLayer = availableLayers & ~(availableLayers - 1);
            val.cameraComponent.visibility = lastAvailableLayer | val.cameraComponent.visibility & builtinLayerMask;
            setChildrenLayer(val.node, lastAvailableLayer);
            usedLayer |= availableLayers;
          }
        });
      });

      function setChildrenLayer(node, layer) {
        for (var i = 0, l = node.children.length; i < l; i++) {
          node.children[i].layer = layer;
          setChildrenLayer(node.children[i], layer);
        }
      }

      var setParentEngine = $global.cc.Node.prototype.setParent;

      $global.cc.Node.prototype.setParent = function (value, keepWorldTransform) {
        setParentEngine.call(this, value, keepWorldTransform);
        if (!value) return; // find canvas

        var layer = getCanvasCameraLayer(this);

        if (layer) {
          this.layer = layer;
          setChildrenLayer(this, layer);
        }
      };

      function getCanvasCameraLayer(node) {
        var layer = null;
        var canvas = node.getComponent(Canvas);

        if (canvas && canvas.cameraComponent) {
          if (canvas.cameraComponent.visibility & canvas.node.layer) {
            layer = canvas.node.layer;
          } else {
            layer = canvas.cameraComponent.visibility & ~(canvas.cameraComponent.visibility - 1);
          }

          return layer;
        }

        if (node.parent) {
          layer = getCanvasCameraLayer(node.parent);
        }

        return layer;
      }

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/invincible.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './clientEvent.ts', './resourceUtil.ts', './constant.ts', './poolManager.ts', './localConfig.ts', './playerData.ts', './uiManager.ts', './gameLogic.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Node, Widget, Sprite, Component, clientEvent, resourceUtil, constant, poolManager, localConfig, playerData, uiManager, gameLogic;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Widget = module.Widget;
      Sprite = module.Sprite;
      Component = module.Component;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      resourceUtil = module.resourceUtil;
    }, function (module) {
      constant = module.constant;
    }, function (module) {
      poolManager = module.poolManager;
    }, function (module) {
      localConfig = module.localConfig;
    }, function (module) {
      playerData = module.playerData;
    }, function (module) {
      uiManager = module.uiManager;
    }, function (module) {
      gameLogic = module.gameLogic;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "ec04bogempOHrQhVVHVqSZV", "invincible", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var invincible = exports('invincible', (_dec = ccclass("invincible"), _dec2 = property(Node), _dec3 = property(Widget), _dec4 = property(Sprite), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(invincible, _Component);

        function invincible() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeCarParent", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "wgMenu", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spIcon", _descriptor3, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "_callback", undefined);

          _defineProperty(_assertThisInitialized(_this), "currentCar", null);

          return _this;
        }

        var _proto = invincible.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.show = function show(callback) {
          var _this2 = this;

          this._callback = callback;
          gameLogic.updateRewardIcon(constant.SHARE_FUNCTION.INVINCIBLE, this.spIcon, function (err, type) {});

          if (this.currentCar) {
            poolManager.instance.putNode(this.currentCar);
            this.currentCar = null;
          } //随机辆未拥有的车


          var carInfo = localConfig.instance.queryByID('car', playerData.instance.showCar.toString());
          resourceUtil.getUICar(carInfo.model, function (err, prefab) {
            if (err) {
              console.error(err, carInfo.model);
              return;
            }

            _this2.currentCar = poolManager.instance.getNode(prefab, _this2.nodeCarParent);
          });
        };

        _proto.onBtnCloseClick = function onBtnCloseClick() {
          uiManager.instance.hideDialog('main/invincible');
          this._callback && this._callback();
        };

        _proto.onBtnOKClick = function onBtnOKClick() {
          var _this3 = this;

          gameLogic.openReward(constant.SHARE_FUNCTION.INVINCIBLE, function (err, type) {
            if (err) return;
            clientEvent.dispatchEvent('showInvincible');

            _this3.onBtnCloseClick();
          });
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }
        ;

        return invincible;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "nodeCarParent", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "wgMenu", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "spIcon", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/btnAdapter.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './audioManager.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Button, Component, audioManager;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Button = module.Button;
      Component = module.Component;
    }, function (module) {
      audioManager = module.audioManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

      cclegacy._RF.push({}, "f130br9GwZGkJEkRGonhXxR", "btnAdapter", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property,
          menu = _decorator.menu,
          requireComponent = _decorator.requireComponent,
          disallowMultiple = _decorator.disallowMultiple;
      var btnAdapter = exports('btnAdapter', (_dec = ccclass("btnAdapter"), _dec2 = menu('自定义组件/btnAdapter'), _dec3 = requireComponent(Button), _dec4 = property({
        tooltip: '点击后是否播放点击音效'
      }), _dec5 = property({
        tooltip: '点击音效名'
      }), _dec6 = property({
        tooltip: '是否禁止快速二次点击'
      }), _dec7 = property({
        tooltip: '点击后多久才能再次点击,仅isPreventSecondClick为true生效'
      }), _dec(_class = _dec2(_class = _dec3(_class = disallowMultiple(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(btnAdapter, _Component);

        function btnAdapter() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "isPlaySound", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "clickSoundName", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "isPreventSecondClick", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "preventTime", _descriptor4, _assertThisInitialized(_this));

          return _this;
        }

        var _proto = btnAdapter.prototype;

        _proto.start = function start() {
          var _this2 = this;

          var button = this.node.getComponent(Button);
          this.node.on('click', function () {
            if (_this2.isPreventSecondClick) {
              button.interactable = false;

              _this2.scheduleOnce(function () {
                if (button.node) button.interactable = true;
              }, _this2.preventTime);
            } //


            if (_this2.isPlaySound) audioManager.instance.playSound(_this2.clickSoundName, false);
          });
        } // update (dt) {},
        ;

        return btnAdapter;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "isPlaySound", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "clickSoundName", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 'click';
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "isPreventSecondClick", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "preventTime", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      })), _class2)) || _class) || _class) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/util.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "f1bcdp9t1BPdo0rL87xRyba", "util", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var util = exports('util', (_dec = ccclass("util"), _dec(_class = /*#__PURE__*/function () {
        function util() {}
        /**
         * !#zh 拷贝object。
         */


        util.clone = function clone(sObj) {
          if (sObj === null || typeof sObj !== "object") {
            return sObj;
          }

          var s = {};

          if (sObj.constructor === Array) {
            s = [];
          }

          for (var i in sObj) {
            if (sObj.hasOwnProperty(i)) {
              s[i] = this.clone(sObj[i]);
            }
          }

          return s;
        }
        /**
         * 将object转化为数组。
         */
        ;

        util.objectToArray = function objectToArray(srcObj) {
          var resultArr = []; // to array

          for (var key in srcObj) {
            if (!srcObj.hasOwnProperty(key)) {
              continue;
            }

            resultArr.push(srcObj[key]);
          }

          return resultArr;
        }
        /**
         * !#zh 将数组转化为object。
         */
        ;

        util.arrayToObject = function arrayToObject(srcObj, objectKey) {
          var resultObj = {}; // to object

          for (var key in srcObj) {
            if (!srcObj.hasOwnProperty(key) || !srcObj[key][objectKey]) {
              continue;
            }

            resultObj[srcObj[key][objectKey]] = srcObj[key];
          }

          return resultObj;
        } // 根据权重,计算随机内容
        ;

        util.getWeightRandIndex = function getWeightRandIndex(weightArr, totalWeight) {
          var randWeight = Math.floor(Math.random() * totalWeight);
          var sum = 0;
          var weightIndex = 0;

          for (weightIndex; weightIndex < weightArr.length; weightIndex++) {
            sum += weightArr[weightIndex];

            if (randWeight < sum) {
              break;
            }
          }

          return weightIndex;
        }
        /**
         * 从n个数中获取m个随机数
         * @param {Number} n   总数
         * @param {Number} m    获取数
         * @returns {Array} array   获取数列
         */
        ;

        util.getRandomNFromM = function getRandomNFromM(n, m) {
          var array = [];
          var intRd = 0;
          var count = 0;

          while (count < m) {
            if (count >= n + 1) {
              break;
            }

            intRd = this.getRandomInt(0, n);
            var flag = 0;

            for (var i = 0; i < count; i++) {
              if (array[i] === intRd) {
                flag = 1;
                break;
              }
            }

            if (flag === 0) {
              array[count] = intRd;
              count++;
            }
          }

          return array;
        };

        util.getRandomInt = function getRandomInt(min, max) {
          var r = Math.random();
          var rr = r * (max - min + 1) + min;
          return Math.floor(rr);
        };

        util.getStringLength = function getStringLength(render) {
          var strArr = render;
          var len = 0;

          for (var i = 0, n = strArr.length; i < n; i++) {
            var val = strArr.charCodeAt(i);

            if (val <= 255) {
              len = len + 1;
            } else {
              len = len + 2;
            }
          }

          return Math.ceil(len / 2);
        }
        /**
         * 判断传入的参数是否为空的Object。数组或undefined会返回false
         * @param obj
         */
        ;

        util.isEmptyObject = function isEmptyObject(obj) {
          var result = true;

          if (obj && obj.constructor === Object) {
            for (var key in obj) {
              if (obj.hasOwnProperty(key)) {
                result = false;
                break;
              }
            }
          } else {
            result = false;
          }

          return result;
        };

        util.formatNum = function formatNum(num) {
          // 0 和负数均返回 NaN。特殊处理。
          if (num <= 0) {
            return '0';
          }

          var k = 1000;
          var sizes = ['', '', 'K', 'M', 'B'];
          var i = Math.round(Math.log(num) / Math.log(k));
          return parseInt((num / Math.pow(k, i - 1 < 0 ? 0 : i - 1)).toString(), 10) + sizes[i];
        }
        /**
         * 判断是否是新的一天
         * @param {Object|Number} dateValue 时间对象 todo MessageCenter 与 pve 相关的时间存储建议改为 Date 类型
         * @returns {boolean}
         */
        ;

        util.isNewDay = function isNewDay(dateValue) {
          // todo：是否需要判断时区？
          var oldDate = new Date(dateValue);
          var curDate = new Date();
          var oldYear = oldDate.getFullYear();
          var oldMonth = oldDate.getMonth();
          var oldDay = oldDate.getDate();
          var curYear = curDate.getFullYear();
          var curMonth = curDate.getMonth();
          var curDay = curDate.getDate();

          if (curYear > oldYear) {
            return true;
          } else {
            if (curMonth > oldMonth) {
              return true;
            } else {
              if (curDay > oldDay) {
                return true;
              }
            }
          }

          return false;
        };

        util.getPropertyCount = function getPropertyCount(o) {
          var n,
              count = 0;

          for (n in o) {
            if (o.hasOwnProperty(n)) {
              count++;
            }
          }

          return count;
        }
        /**
         * 返回一个差异化数组（将array中diff里的值去掉）
         * @param array
         * @param diff
         */
        ;

        util.difference = function difference(array, diff) {
          var result = [];

          if (array.constructor !== Array || diff.constructor !== Array) {
            return result;
          }

          var length = array.length;

          for (var i = 0; i < length; i++) {
            if (diff.indexOf(array[i]) === -1) {
              result.push(array[i]);
            }
          }

          return result;
        } // 模拟传msg的uuid
        ;

        util.simulationUUID = function simulationUUID() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
          }

          return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        };

        util.trim = function trim(str) {
          return str.replace(/(^\s*)|(\s*$)/g, "");
        }
        /**
         * 判断当前时间是否在有效时间内
         * @param {String|Number} start 起始时间。带有时区信息
         * @param {String|Number} end 结束时间。带有时区信息
         */
        ;

        util.isNowValid = function isNowValid(start, end) {
          var startTime = new Date(start);
          var endTime = new Date(end);
          var result = false;

          if (startTime.getDate() + '' !== 'NaN' && endTime.getDate() + '' !== 'NaN') {
            var curDate = new Date();
            result = curDate < endTime && curDate > startTime;
          }

          return result;
        };

        util.getDeltaDays = function getDeltaDays(start, end) {
          var startData = new Date(start);
          var endData = new Date(end);
          var startYear = startData.getFullYear();
          var startMonth = startData.getMonth() + 1;
          var startDate = startData.getDate();
          var endYear = endData.getFullYear();
          var endMonth = endData.getMonth() + 1;
          var endDate = endData.getDate();
          start = new Date(startYear + '/' + startMonth + '/' + startDate + ' GMT+0800').getTime();
          end = new Date(endYear + '/' + endMonth + '/' + endDate + ' GMT+0800').getTime();
          var deltaTime = end - start;
          return Math.floor(deltaTime / (24 * 60 * 60 * 1000));
        };

        util.getMin = function getMin(array) {
          var result = 0;

          if (array.constructor === Array) {
            var length = array.length;

            for (var i = 0; i < length; i++) {
              if (i === 0) {
                result = Number(array[0]);
              } else {
                result = result > Number(array[i]) ? Number(array[i]) : result;
              }
            }
          }

          return result;
        };

        util.formatTwoDigits = function formatTwoDigits(time) {
          return (Array(2).join('0') + time).slice(-2);
        };

        util.formatDate = function formatDate(date, fmt) {
          var o = {
            "M+": date.getMonth() + 1,
            //月份
            "d+": date.getDate(),
            //日
            "h+": date.getHours(),
            //小时
            "m+": date.getMinutes(),
            //分
            "s+": date.getSeconds(),
            //秒
            "q+": Math.floor((date.getMonth() + 3) / 3),
            //季度
            "S": date.getMilliseconds() //毫秒

          };
          if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));

          for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? "" + o[k] : ("00" + o[k]).substr(("" + o[k]).length));
          }

          return fmt;
        }
        /**
         * 获取格式化后的日期（不含小时分秒）
         */
        ;

        util.getDay = function getDay() {
          var date = new Date();
          return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        }
        /**
         * 格式化钱数，超过10000 转换位 10K   10000K 转换为 10M
         */
        ;

        util.formatMoney = function formatMoney(money) {
          var arrUnit = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'B', 'N', 'D'];
          var strValue = '';

          for (var idx = 0; idx < arrUnit.length; idx++) {
            if (money >= 10000) {
              money /= 1000;
            } else {
              strValue = Math.floor(money) + arrUnit[idx];
              break;
            }
          }

          if (strValue === '') {
            strValue = Math.floor(money) + 'U'; //超过最大值就加个U
          }

          return strValue;
        }
        /**
         * 根据剩余秒数格式化剩余时间 返回 HH:MM:SS
         * @param {Number} leftSec
         */
        ;

        util.formatTimeForSecond = function formatTimeForSecond(leftSec) {
          var timeStr = '';
          var sec = leftSec % 60;
          var leftMin = Math.floor(leftSec / 60);
          leftMin = leftMin < 0 ? 0 : leftMin;
          var hour = Math.floor(leftMin / 60);
          var min = leftMin % 60;

          if (hour > 0) {
            timeStr += hour > 9 ? hour.toString() : '0' + hour;
            timeStr += ':';
          }

          timeStr += min > 9 ? min.toString() : '0' + min;
          timeStr += ':';
          timeStr += sec > 9 ? sec.toString() : '0' + sec;
          return timeStr;
        }
        /**
         *  根据剩余毫秒数格式化剩余时间 返回 HH:MM:SS
         *
         * @param {Number} ms
         */
        ;

        util.formatTimeForMillisecond = function formatTimeForMillisecond(ms) {
          var second = Math.floor(ms / 1000 % 60);
          var minute = Math.floor(ms / 1000 / 60 % 60);
          var hour = Math.floor(ms / 1000 / 60 / 60);
          var strSecond = second < 10 ? '0' + second : second;
          var strMinute = minute < 10 ? '0' + minute : minute;
          var strHour = hour < 10 ? '0' + hour : hour;
          return strSecond + ":" + strMinute + ":" + strHour;
        }
        /**
         * TODO 需要将pako进行引入，目前已经去除了压缩算法的需要，如需要使用需引入库文件
         * 将字符串进行压缩
         * @param {String} str
         */
        ;

        util.zip = function zip(str) {
          var binaryString = $global.pako.gzip(encodeURIComponent(str), {
            to: 'string'
          }); // @ts-ignore

          return this.base64encode(binaryString);
        };

        util.rand = function rand(arr) {
          var arrClone = this.clone(arr); // 首先从最大的数开始遍历，之后递减

          for (var i = arrClone.length - 1; i >= 0; i--) {
            // 随机索引值randomIndex是从0-arrClone.length中随机抽取的
            var randomIndex = Math.floor(Math.random() * (i + 1)); // 下面三句相当于把从数组中随机抽取到的值与当前遍历的值互换位置

            var itemIndex = arrClone[randomIndex];
            arrClone[randomIndex] = arrClone[i];
            arrClone[i] = itemIndex;
          } // 每一次的遍历都相当于把从数组中随机抽取（不重复）的一个元素放到数组的最后面（索引顺序为：len-1,len-2,len-3......0）


          return arrClone;
        };

        return util;
      }()) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/fightManager.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './fightConstants.ts', './clientEvent.ts', './resourceUtil.ts', './playerData.ts', './carManager.ts', './uiManager.ts', './LanguageData.ts', './fightMap.ts', './customerManager.ts', './effectManager.ts', './fightCanvas.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Node, Collider, instantiate, Component, fightConstants, clientEvent, resourceUtil, playerData, carManager, uiManager, i18n, fightMap, customerManager, effectManager, fightCanvas;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Collider = module.Collider;
      instantiate = module.instantiate;
      Component = module.Component;
    }, function (module) {
      fightConstants = module.fightConstants;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      resourceUtil = module.resourceUtil;
    }, function (module) {
      playerData = module.playerData;
    }, function (module) {
      carManager = module.carManager;
    }, function (module) {
      uiManager = module.uiManager;
    }, function (module) {
      i18n = module.i18n;
    }, function (module) {
      fightMap = module.fightMap;
    }, function (module) {
      customerManager = module.customerManager;
    }, function (module) {
      effectManager = module.effectManager;
    }, function (module) {
      fightCanvas = module.fightCanvas;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp;

      cclegacy._RF.push({}, "f3d36qkNslPB4TIGcZlp8vd", "fightManager", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var fightManager = exports('fightManager', (_dec = ccclass("fightManager"), _dec2 = property(fightCanvas), _dec3 = property({
        type: fightMap
      }), _dec4 = property({
        type: customerManager
      }), _dec5 = property({
        type: carManager
      }), _dec6 = property({
        type: effectManager
      }), _dec7 = property({
        type: Node,
        displayName: '地面'
      }), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(fightManager, _Component);

        function fightManager() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "fightLoading", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "mapManager", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "customerManager", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "carManager", _descriptor4, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "effectManager", _descriptor5, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeGround", _descriptor6, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "isStart", false);

          _defineProperty(_assertThisInitialized(_this), "isOver", false);

          _defineProperty(_assertThisInitialized(_this), "isFinishedLevel", false);

          _defineProperty(_assertThisInitialized(_this), "money", 0);

          _defineProperty(_assertThisInitialized(_this), "curLevel", 0);

          _defineProperty(_assertThisInitialized(_this), "hasRevive", false);

          return _this;
        }

        var _proto = fightManager.prototype;

        _proto.start = function start() {
          var _this2 = this; // Your initialization goes here.


          this.initGround();
          this.loadMap(function () {
            _this2.initCar();

            _this2.loadCar();
          }); // this.initCar();
        };

        _proto.onEnable = function onEnable() {
          clientEvent.on('startGame', this.startGame, this);
          clientEvent.on('takeCustomer', this.onTakeCustomer, this);
          clientEvent.on('gameOver', this.gameOver, this);
          clientEvent.on('newLevel', this.newLevel, this);
          clientEvent.on('updateCar', this.updateMainCar, this);
          clientEvent.on('revive', this.revive, this);
        };

        _proto.onDisable = function onDisable() {
          clientEvent.off('startGame', this.startGame, this);
          clientEvent.off('takeCustomer', this.onTakeCustomer, this);
          clientEvent.off('gameOver', this.gameOver, this);
          clientEvent.off('newLevel', this.newLevel, this);
          clientEvent.off('updateCar', this.updateMainCar, this);
          clientEvent.off('revive', this.revive, this);
        };

        _proto.initGround = function initGround() {
          var collider = this.nodeGround.getComponent(Collider);
          collider.setGroup(fightConstants.CAR_GROUP.NORMAL);
          collider.setMask(-1);
        };

        _proto.loadMap = function loadMap(cb) {
          var _this3 = this; //地图载入


          var level = 1;

          if (playerData.instance.playerInfo) {
            console.log("###playerData.instance.playerInfo.realLevel;", playerData.instance.playerInfo.realLevel);

            if (playerData.instance.playerInfo.passCheckPoint) {
              level = playerData.instance.playerInfo.realLevel || level;
            } else {
              level = playerData.instance.playerInfo.level || level;
            }

            console.log("###level", level);
          }

          this.curLevel = level; // let level = 3;
          // level = 3;

          console.log("load level " + this.curLevel);
          var mapId = this.curLevel > 100 ? this.curLevel : this.curLevel + 100;
          clientEvent.dispatchEvent('updateLoading', 4, i18n.t('fightManager.loadingMap'));
          resourceUtil.getMap(mapId, function (err, res) {
            if (err) {
              console.error(err);
              return;
            }

            clientEvent.dispatchEvent('updateLoading', 10, i18n.t('fightManager.buildingCity'));

            _this3.mapManager.buildMap(res, function () {}, function () {
              clientEvent.dispatchEvent('updateLoading', 6, i18n.t('fightManager.cityLoadOver'));
              cb && cb();
            });
          });
        };

        _proto.initCar = function initCar() {
          this.carManager.init(this.mapManager, this.customerManager);
        };

        _proto.reset = function reset() {
          this.carManager.reset();
          this.customerManager.reset();
          this.effectManager.reset();
          this.isStart = false;
          this.isOver = false;
          this.isFinishedLevel = false;
          this.money = 0;
          this.hasRevive = false;
          this.loadCar();
        };

        _proto.loadCar = function loadCar() {
          var _this4 = this; //预加载使用的汽车,加载完毕后，关闭界面


          this.carManager.preloadAICar(function () {
            _this4.fightLoading.finishLoading(); //等进度条加载完后展示主界面


            _this4.showMainUI();
          });
        };

        _proto.startGame = function startGame() {
          if (this.isStart) {
            return;
          }

          this.isStart = true;
          this.carManager.startGame();
          this.showFightUI();
        };

        _proto.gameOver = function gameOver(isFinished) {
          if (this.isOver) {
            return;
          }

          this.isFinishedLevel = isFinished;
          this.isOver = true;
          this.carManager.gameOver();
          this.showBalanceUI();
        };

        _proto.onTakeCustomer = function onTakeCustomer() {
          var _this5 = this; //完成乘客接送，这时候要计算加到多少钱
          //公式 （30+关卡数/2）+ 10  取整


          var rand = Math.floor(30 + this.curLevel / 2 + Math.floor(Math.random() * 10));
          this.money += rand;
          clientEvent.dispatchEvent('makeMoney', rand); //显示获得金币的特效

          resourceUtil.getEffect('coin', function (err, prefab) {
            if (err) {
              console.error(err);
            }

            var node = instantiate(prefab);
            node.parent = _this5.node;

            if (_this5.carManager.mainCar) {
              node.setWorldPosition(_this5.carManager.mainCar.node.getWorldPosition());
            }

            _this5.scheduleOnce(function () {
              node.destroy();
            }, 2);
          });
        };

        _proto.showMainUI = function showMainUI() {
          //一开始加载主界面
          uiManager.instance.showDialog('main/mainUI');
        };

        _proto.showFightUI = function showFightUI() {
          uiManager.instance.hideDialog('main/mainUI');
          uiManager.instance.showDialog('fight/fightUI', [this]); //将自身当作参数传入
        };

        _proto.showBalanceUI = function showBalanceUI() {
          //level: number, curProgress: number, isTakeOver: boolean,  maxProgress: number, money: number, isFinishLevel:boolean
          var objProgress = this.carManager.getCurrentProgress();
          uiManager.instance.showDialog('fight/balance', [playerData.instance.playerInfo.level, objProgress.cur, objProgress.isOver, this.mapManager.levelProgressCnt, this.money, this.isFinishedLevel]);
        }
        /**
         * 重置关卡
         *
         * @param {boolean} isNewLevel 是否为新关卡
         * @memberof fightManager
         */
        ;

        _proto.newLevel = function newLevel(isNewLevel) {
          var _this6 = this; //重置关卡


          this.fightLoading.loadNewLevel();
          uiManager.instance.hideDialog('fight/fightUI');
          this.hasRevive = false;

          if (isNewLevel) {
            //要将原有地图移除，并引入新地图
            this.mapManager.recycle();
            this.loadMap(function () {
              //地图处理完毕，后续处理
              _this6.reset();
            });
          } else {
            this.reset();
          }
        };

        _proto.updateMainCar = function updateMainCar() {
          this.carManager.creatMainCar();
        };

        _proto.revive = function revive() {
          this.carManager.revive();
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }
        ;

        return fightManager;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "fightLoading", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "mapManager", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "customerManager", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "carManager", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "effectManager", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "nodeGround", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/fightUI.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './clientEvent.ts', './resourceUtil.ts', './localConfig.ts', './playerData.ts', './LanguageData.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Sprite, Label, Node, SpriteFrame, Animation, Component, clientEvent, resourceUtil, localConfig, playerData, i18n;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Sprite = module.Sprite;
      Label = module.Label;
      Node = module.Node;
      SpriteFrame = module.SpriteFrame;
      Animation = module.Animation;
      Component = module.Component;
    }, function (module) {
      clientEvent = module.clientEvent;
    }, function (module) {
      resourceUtil = module.resourceUtil;
    }, function (module) {
      localConfig = module.localConfig;
    }, function (module) {
      playerData = module.playerData;
    }, function (module) {
      i18n = module.i18n;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _temp;

      cclegacy._RF.push({}, "fb9b7V8bZND35IgNyATVMNv", "fightUI", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var fightUI = exports('fightUI', (_dec = ccclass("fightUI"), _dec2 = property(Sprite), _dec3 = property(Sprite), _dec4 = property({
        type: Label
      }), _dec5 = property({
        type: Label
      }), _dec6 = property({
        type: Node,
        displayName: "进度项"
      }), _dec7 = property(Node), _dec8 = property(Label), _dec9 = property(Label), _dec10 = property(Sprite), _dec11 = property(SpriteFrame), _dec12 = property(SpriteFrame), _dec13 = property(SpriteFrame), _dec14 = property(SpriteFrame), _dec15 = property(SpriteFrame), _dec16 = property(Animation), _dec17 = property(Node), _dec18 = property(Sprite), _dec19 = property(SpriteFrame), _dec20 = property(SpriteFrame), _dec21 = property(SpriteFrame), _dec22 = property(SpriteFrame), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(fightUI, _Component); // Property.
        // yourProperty = "some what";
        //是否展示showGuide动画


        function fightUI() {
          var _this;

          _this = _Component.call(this) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "spStart", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spEnd", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "curLevel", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "targetLevel", _descriptor4, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "progress", _descriptor5, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeTalk", _descriptor6, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbTalk", _descriptor7, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "lbMake", _descriptor8, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "spHead", _descriptor9, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "imgLevelFinished", _descriptor10, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "imgLevelUnfinished", _descriptor11, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "imgProgressNoActive", _descriptor12, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "imgProgressActive", _descriptor13, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "imgProgressFinished", _descriptor14, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "aniMakeMoney", _descriptor15, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "nodeGuide", _descriptor16, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "fightManager", null);

          _defineProperty(_assertThisInitialized(_this), "carManager", null);

          _initializerDefineProperty(_assertThisInitialized(_this), "spShowGuideTip", _descriptor17, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "img01", _descriptor18, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "img02", _descriptor19, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "img01En", _descriptor20, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "img02En", _descriptor21, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "isShowGuide", false);

          _defineProperty(_assertThisInitialized(_this), "showGuideTime", 0);

          return _this;
        }

        var _proto = fightUI.prototype;

        _proto.start = function start() {};

        _proto.onEnable = function onEnable() {
          clientEvent.on('greetingCustomer', this.updateCarProgress, this);
          clientEvent.on('takeCustomer', this.updateCarProgress, this);
          clientEvent.on('gameOver', this.updateCarProgress, this);
          clientEvent.on('showTalk', this.showCustomerTalk, this);
          clientEvent.on('makeMoney', this.onMakeMoney, this);
          clientEvent.on('showGuide', this.showGuide, this);
        };

        _proto.onDisable = function onDisable() {
          clientEvent.off('greetingCustomer', this.updateCarProgress, this);
          clientEvent.off('takeCustomer', this.updateCarProgress, this);
          clientEvent.off('gameOver', this.updateCarProgress, this);
          clientEvent.off('showTalk', this.showCustomerTalk, this);
          clientEvent.off('makeMoney', this.onMakeMoney, this);
          clientEvent.off('showGuide', this.showGuide, this);
        };

        _proto.onTouchStart = function onTouchStart() {
          this.nodeGuide.getComponent(Animation).stop();
          this.nodeGuide.active = false;
        };

        _proto.show = function show(manager) {
          this.fightManager = manager;
          this.carManager = this.fightManager.carManager;
          this.refreshUI();

          if (!this.carManager.mainCar.isMoving) {
            this.showGuide(true);
          }
        };

        _proto.showGuide = function showGuide(isShow) {
          this.nodeGuide.active = isShow;
          var ani = this.nodeGuide.getComponent(Animation);
          isShow ? ani.play() : ani.stop();

          if (isShow) {
            this.isShowGuide = true;
            this.showGuideTime = 0;
            ani.getState('showGuide').setTime(0);
          } else {
            this.isShowGuide = false;
            this.showGuideTime = 0;
          }
        };

        _proto.onBtnAgainClick = function onBtnAgainClick() {
          // this.fightManager.reset();
          clientEvent.dispatchEvent('newLevel', false);
        };

        _proto.onBtnChangeCameraRotation = function onBtnChangeCameraRotation() {
          this.carManager.changeCameraFollowRotation();
        };

        _proto.refreshUI = function refreshUI() {
          var maxProgress = this.fightManager.mapManager.levelProgressCnt; //总共有多少个乘客
          //设置总共有多少个节点

          for (var idx = 0; idx < maxProgress; idx++) {
            this.progress[idx].active = true;
            this.progress[idx].getComponent(Sprite).spriteFrame = this.imgProgressNoActive;
          }

          for (var _idx = maxProgress; _idx < this.progress.length; _idx++) {
            this.progress[_idx].active = false;
          }

          var level = playerData.instance.playerInfo ? playerData.instance.playerInfo.level : 1;
          this.curLevel.string = "" + level;
          this.targetLevel.string = "" + (level + 1);
          this.spStart.spriteFrame = this.imgLevelFinished;
          this.spEnd.spriteFrame = this.imgLevelUnfinished;
        };

        _proto.updateCarProgress = function updateCarProgress() {
          //刷新进度
          var objProgress = this.carManager.getCurrentProgress();
          var start = objProgress.cur;
          var end = objProgress.isOver ? start : start - 1;

          for (var idx = 0; idx < end; idx++) {
            this.progress[idx].getComponent(Sprite).spriteFrame = this.imgProgressFinished;
          }

          if (!objProgress.isOver) {
            this.progress[end].getComponent(Sprite).spriteFrame = this.imgProgressActive;
          }

          if (this.fightManager.isFinishedLevel) {
            this.spEnd.spriteFrame = this.imgLevelFinished;
          }
        }
        /**
         * 顾客上车后或者接到新订单时会有提示
         *
         * @param {string} customerId
         * @param {number} type
         * @memberof fightUI
         */
        ;

        _proto.showCustomerTalk = function showCustomerTalk(customerId, type) {
          var _this2 = this;

          var arrTalk = localConfig.instance.getTableArr('talk'); // Note:

          var arrFilter = [];
          arrTalk.forEach(function (element) {
            if (element.type === type) {
              arrFilter.push(element);
            }
          });
          var rand = Math.floor(Math.random() * arrFilter.length);
          var objRand = arrFilter[rand];
          this.lbTalk.string = i18n.t("talk." + objRand.content);
          resourceUtil.setCustomerIcon(customerId, this.spHead, function () {}); //显示3秒

          this.nodeTalk.active = true;
          this.nodeTalk.getComponent(Animation).play();
          this.scheduleOnce(function () {
            _this2.nodeTalk.active = false;
          }, 4);
        };

        _proto.onMakeMoney = function onMakeMoney(value) {
          var _this3 = this;

          this.aniMakeMoney.node.active = true;
          this.lbMake.string = "+" + value;
          this.aniMakeMoney.play();
          this.aniMakeMoney.once(Animation.EventType.FINISHED, function () {
            _this3.aniMakeMoney.node.active = false;
          }, this);
        };

        _proto.update = function update(deltaTime) {
          // Your update function goes here.
          if (this.isShowGuide) {
            if (Math.floor(this.showGuideTime) === 0) {
              if (window.i18nConfig.curLang === 'zh') {
                this.spShowGuideTip.spriteFrame = this.img01;
              } else if (window.i18nConfig.curLang === 'en') {
                this.spShowGuideTip.spriteFrame = this.img01En;
              }
            }

            this.showGuideTime += deltaTime;

            if (Math.floor(this.showGuideTime) === 1) {
              if (window.i18nConfig.curLang === 'zh') {
                this.spShowGuideTip.spriteFrame = this.img02;
              } else if (window.i18nConfig.curLang === 'en') {
                this.spShowGuideTip.spriteFrame = this.img02En;
              }
            } else if (Math.floor(this.showGuideTime) === 2) {
              if (window.i18nConfig.curLang === 'zh') {
                this.spShowGuideTip.spriteFrame = this.img01;
              } else if (window.i18nConfig.curLang === 'en') {
                this.spShowGuideTip.spriteFrame = this.img01En;
              }

              this.showGuideTime = 0;
            }
          }
        };

        return fightUI;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "spStart", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "spEnd", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "curLevel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "targetLevel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "progress", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "nodeTalk", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "lbTalk", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "lbMake", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "spHead", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "imgLevelFinished", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "imgLevelUnfinished", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "imgProgressNoActive", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "imgProgressActive", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "imgProgressFinished", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "aniMakeMoney", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "nodeGuide", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "spShowGuideTip", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "img01", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "img02", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "img01En", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "img02En", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/follow.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _defineProperty, cclegacy, _decorator, Node, Vec3, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Vec3 = module.Vec3;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "ff8ee6OQldPNLrgLpXROotm", "follow", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var follow = exports('follow', (_dec = ccclass("follow"), _dec2 = property({
        type: Node
      }), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(follow, _Component); // Property.
        // yourProperty = "some what";
        // Add `property` decorator if your want the property to be serializable.
        // @property
        // yourSerializableProperty = "some what";


        function follow() {
          var _this;

          _this = _Component.call(this) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "followTarget", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "isFollowRotation", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "offset", _descriptor3, _assertThisInitialized(_this));

          _defineProperty(_assertThisInitialized(_this), "moveSpeed", 3);

          _defineProperty(_assertThisInitialized(_this), "isPlayingStart", false);

          return _this;
        }

        var _proto = follow.prototype;

        _proto.start = function start() {// Your initialization goes here.
          // this.showStart();
        };

        _proto.showStart = function showStart() {//TODO 原先有个展示动画，现直接修改为玩家下
          // this.isPlayingStart = true;
          // this.scheduleOnce(()=>{
          //     this.isPlayingStart = false;
          // }, 1.5);
        };

        _proto.lateUpdate = function lateUpdate(deltaTime) {
          if (!this.followTarget) {
            return;
          }

          var posOrigin = this.node.worldPosition;

          if (!this.isPlayingStart) {
            var offset = this.offset;

            if (this.isFollowRotation) {
              offset = Vec3.transformQuat(new Vec3(), this.offset, this.followTarget.rotation);
            }

            var posTarget = new Vec3(this.followTarget.worldPosition.x + offset.x, this.followTarget.worldPosition.y + offset.y, this.followTarget.worldPosition.z + offset.z); // let dis = Vec3.subtract(new Vec3(), posOrigin, posTarget).length();

            this.node.setWorldPosition(posTarget);
            this.node.lookAt(this.followTarget.worldPosition, new Vec3(0, 1, 0));

            if (this.isFollowRotation) {
              var angle = new Vec3(this.node.eulerAngles);
              angle.y = this.followTarget.eulerAngles.y;
              this.node.eulerAngles = angle;
            }
          } else {
            var _posTarget = new Vec3(this.followTarget.worldPosition.x + this.offset.x, this.followTarget.worldPosition.y + this.offset.y, this.followTarget.worldPosition.z + this.offset.z);

            var dis = Vec3.subtract(new Vec3(), posOrigin, _posTarget).length();

            if (dis > 0.001) {
              Vec3.lerp(_posTarget, posOrigin, _posTarget, this.moveSpeed * deltaTime);
            }

            this.node.setWorldPosition(_posTarget);
            this.node.lookAt(this.followTarget.worldPosition, new Vec3(0, 1, 0));
          }
        };

        return follow;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "followTarget", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "isFollowRotation", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "offset", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Vec3();
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

$global.System.register("chunks:///_virtual/main", ['./configuration.ts', './fightConstants.ts', './oneToMultiListener.ts', './clientEvent.ts', './resourceUtil.ts', './audioManager.ts', './constant.ts', './poolManager.ts', './car.ts', './follow.ts', './roadPoint.ts', './util.ts', './csvManager.ts', './localConfig.ts', './playerData.ts', './carManager.ts', './eventListener.ts', './tips.ts', './uiManager.ts', './shopItem.ts', './shopPage.ts', './flyRewardItem.ts', './flyReward.ts', './gameLogic.ts', './polyglot.min.ts', './LanguageData.ts', './shop.ts', './fightMap.ts', './SpriteFrameSet.ts', './LocalizedSprite.ts', './online.ts', './zh.ts', './updateValueLabel.ts', './setting.ts', './customerManager.ts', './onlineDouble.ts', './trial.ts', './mainUI.ts', './showReward.ts', './clickBox.ts', './signInItem.ts', './lodash.ts', './lotteryItem.ts', './revive.ts', './blockInputEvent.ts', './GameRoot.ts', './loading.ts', './signIn.ts', './balance.ts', './en.ts', './LocalizedLabel.ts', './main.ts', './effectManager.ts', './lottery.ts', './fightCanvas.ts', './migrate-canvas.ts', './invincible.ts', './btnAdapter.ts', './fightManager.ts', './fightUI.ts'], function () {
  'use strict';

  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    $global.System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});