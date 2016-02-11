/// <reference path="angular.d.ts"/>
/// <reference path="lib.d.ts"/>
var Skimia;
(function (Skimia) {
    var Angular;
    (function (Angular) {
        /**
         * Angular Module
         */
        var Module = (function () {
            /**
             * Constructor
             * @param name
             * @param requires
             * @param configFn
             */
            function Module(name, requires, configFn) {
                if (requires === void 0) { requires = []; }
                if (configFn === void 0) { configFn = function () { }; }
                /**
                 *
                 * @type {null}
                 */
                this.module = null;
                this.module = angular.module(name, requires, configFn);
            }
            /**
             * Bind a Service class to angular module
             * @param name Service name
             * @param service Service class
             */
            Module.prototype.bindService = function (name, service) {
                service.$inject = service.injectables;
                this.module.service(name, service);
            };
            /**
             * Bind a Service class to angular module
             * @param name Service name
             * @param service Service class
             */
            Module.prototype.bindProvider = function (name, service) {
                service.$inject = service.injectables;
                this.module.provider(name, service);
            };
            /**
             * Bind a filter
             */
            Module.prototype.bindFilter = function () {
                //TODO
            };
            /**
             *
             * @param component
             */
            Module.prototype.bindComponent = function (component) {
                var config = new component();
                var directiveFactory = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    var isDef = angular.isDefined;
                    var directive = {};
                    //Directive config
                    if (isDef(config.restrict)) {
                        directive['restrict'] = config.restrict;
                    }
                    if (isDef(config.priority)) {
                        directive['priority'] = config.priority;
                    }
                    //View config
                    if (isDef(config.view)) {
                        if (isDef(config.view.templateCache)) {
                            var $templateCache = angular.element(document.body).injector().get('$templateCache');
                            directive['template'] = $templateCache.get(config.view.templateCache);
                        }
                        else if (isDef(config.view.templateUrl)) {
                            directive['templateUrl'] = config.view.templateUrl;
                        }
                        else if (isDef(config.view.template)) {
                            directive['template'] = config.view.template;
                        }
                        if (isDef(config.view.transclude)) {
                            directive['transclude'] = config.view.transclude;
                        }
                        if (isDef(config.view.replace)) {
                            directive['replace'] = config.view.replace;
                        }
                    }
                    //Manager & Bindings
                    if (isDef(config.manager)) {
                        if (config.manager.class.injectables.length > 0) {
                            directive['controller'] = config.manager.class.injectables.concat(config.manager.class);
                        }
                        else {
                            directive['controller'] = config.manager.class;
                        }
                        directive['controllerAs'] = config.manager.alias;
                        if (isDef(config.manager.isolated) && config.manager.isolated) {
                            directive['scope'] = {};
                        }
                        else {
                            directive['scope'] = true;
                        }
                        if (isDef(config.manager.bindings)) {
                            directive['bindToController'] = config.manager.bindings;
                        }
                    }
                    //Compile
                    if (isDef(config.compile)) {
                        directive['compile'] = config.compile;
                    }
                    else if (isDef(config.link)) {
                        directive['link'] = config.link;
                    }
                    return directive;
                };
                this.module.directive(config.selector, directiveFactory);
            };
            return Module;
        })();
        Angular.Module = Module;
        /**
         * Service
         */
        var Service = (function () {
            function Service() {
                var _this = this;
                var injectables = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    injectables[_i - 0] = arguments[_i];
                }
                this.services = {};
                angular.forEach(injectables, function (injectable, index) {
                    _this.services[_this.constructor['injectables'][index]] = injectable;
                });
                this.init();
            }
            Service.prototype.init = function () {
            };
            return Service;
        })();
        Angular.Service = Service;
        /**
         * Manager
         */
        var Manager = (function () {
            function Manager() {
                var _this = this;
                var injectables = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    injectables[_i - 0] = arguments[_i];
                }
                this.services = {};
                angular.forEach(injectables, function (injectable, index) {
                    _this.services[_this.constructor['injectables'][index]] = injectable;
                });
                this.init();
            }
            Manager.prototype.init = function () {
            };
            Manager.injectables = [];
            return Manager;
        })();
        Angular.Manager = Manager;
        /**
         * Component
         */
        var Component = (function () {
            function Component() {
            }
            return Component;
        })();
        Angular.Component = Component;
    })(Angular = Skimia.Angular || (Skimia.Angular = {}));
})(Skimia || (Skimia = {}));
/// <reference path="../vendors/framework.ts"/>
var Skimia;
(function (Skimia) {
    var Fusion;
    (function (Fusion) {
        var Core;
        (function (Core) {
            Core.module = new Skimia.Angular.Module('fusion.core', []);
        })(Core = Fusion.Core || (Fusion.Core = {}));
    })(Fusion = Skimia.Fusion || (Skimia.Fusion = {}));
})(Skimia || (Skimia = {}));
/// <reference path="../FusionCore.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Skimia;
(function (Skimia) {
    var Fusion;
    (function (Fusion) {
        var Core;
        (function (Core) {
            var Providers;
            (function (Providers) {
                var ConfigProvider = (function (_super) {
                    __extends(ConfigProvider, _super);
                    function ConfigProvider() {
                        _super.apply(this, arguments);
                    }
                    ConfigProvider.prototype.init = function () {
                        this.$deferred = window.angular.injector(['ng']).get('$q').defer();
                        this.config = new Config(this);
                    };
                    ConfigProvider.prototype.getDeferredConfig = function () {
                        return this.$deferred.promise;
                    };
                    ConfigProvider.prototype.$get = function () {
                        return this.config;
                    };
                    ConfigProvider.prototype.fusionConfig = function (apiPath, tree, subType, version) {
                        this.config.setServicePath(apiPath);
                        this.config.setFusionAccept(tree, subType, version);
                    };
                    ConfigProvider.prototype.setFusionShield = function (shield) {
                        this.config.setFusionShield(shield);
                    };
                    ConfigProvider.prototype.setAuthenticationMethod = function (method) {
                        this.config.AuthenticationMethod = method;
                        if (method == 'http') {
                            this.config.setFusionShield('sentinel');
                        }
                        else if (method == 'jwt') {
                            this.config.setFusionShield('bearer');
                        }
                    };
                    ConfigProvider.prototype.writeDefaults = function (flags) {
                        this.config.setFlags(flags);
                        this.$deferred.resolve(this.config);
                    };
                    ConfigProvider.injectables = [];
                    return ConfigProvider;
                })(Skimia.Angular.Service);
                Providers.ConfigProvider = ConfigProvider;
                var Config = (function () {
                    function Config(provider) {
                        this.provider = provider;
                        this.authenticationMethod = 'http';
                    }
                    Object.defineProperty(Config.prototype, "Accept", {
                        get: function () {
                            return this.acceptHeader;
                        },
                        set: function (value) {
                            this.acceptHeader = value;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Config.prototype, "Shield", {
                        get: function () {
                            return this.shieldHeader ? this.shieldHeader : false;
                        },
                        set: function (value) {
                            this.shieldHeader = value;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Config.prototype, "AuthenticationMethod", {
                        get: function () {
                            return this.authenticationMethod;
                        },
                        set: function (value) {
                            this.authenticationMethod = value;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Config.prototype, "ServicePath", {
                        get: function () {
                            return this.servicePath;
                        },
                        set: function (value) {
                            this.servicePath = value;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Config.prototype.setFusionAccept = function (tree, subType, version) {
                        this.Accept = 'application/' + tree + '.' + subType + '.' + version + '+json';
                    };
                    Config.prototype.setFusionShield = function (shield) {
                        this.Shield = shield;
                    };
                    Config.prototype.setServicePath = function (path) {
                        this.ServicePath = path;
                    };
                    Object.defineProperty(Config.prototype, "Flags", {
                        get: function () {
                            return this.flags;
                        },
                        set: function (value) {
                            this.flags = value;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Config.prototype.setFlags = function (flags) {
                        this.Flags = flags;
                    };
                    return Config;
                })();
                Providers.Config = Config;
                (function (ConfigWritable) {
                    ConfigWritable[ConfigWritable["None"] = 0] = "None";
                    ConfigWritable[ConfigWritable["AngularHttp"] = 1] = "AngularHttp";
                    ConfigWritable[ConfigWritable["AngularResource"] = 2] = "AngularResource";
                    ConfigWritable[ConfigWritable["AngularData"] = 4] = "AngularData";
                })(Providers.ConfigWritable || (Providers.ConfigWritable = {}));
                var ConfigWritable = Providers.ConfigWritable;
                (function (FusionTree) {
                    FusionTree[FusionTree["unregistered_x"] = 'x'] = "unregistered_x";
                    FusionTree[FusionTree["personal_prs"] = 'prs'] = "personal_prs";
                    FusionTree[FusionTree["vendor_vnd"] = 'vnd'] = "vendor_vnd";
                })(Providers.FusionTree || (Providers.FusionTree = {}));
                var FusionTree = Providers.FusionTree;
                Core.module.module.run(function ($sfcConfig, $http, $injector) {
                    if ($sfcConfig.Flags & ConfigWritable.AngularHttp || $sfcConfig.Flags & ConfigWritable.AngularData) {
                        $http.defaults.headers.common = {
                            Accept: $sfcConfig.Accept
                        };
                    }
                    if ($sfcConfig.Flags & ConfigWritable.AngularData) {
                        var DS = $injector.get('DS');
                        var defaultAdapter = DS.defaults.defaultAdapter;
                        DS.adapters[defaultAdapter].defaults.basePath = $sfcConfig.ServicePath;
                    }
                });
                Core.module.bindProvider('$sfcConfig', ConfigProvider);
                Core.module.module.config(['$httpProvider', function ($httpProvider) {
                        $httpProvider.interceptors.push(['$injector', function ($injector) {
                                var $sfcConfig = $injector.get('$sfcConfig');
                                //var Auth = $injector.get('Auth');
                                return {
                                    'request': function (config) {
                                        if ($sfcConfig.Shield) {
                                            config.headers['shield'] = $sfcConfig.Shield;
                                            if ($sfcConfig.AuthenticationMethod == 'jwt') {
                                                var AuthToken = $injector.get('AuthToken');
                                                if (AuthToken.Token) {
                                                    config.headers['authorization'] = 'bearer ' + AuthToken.Token;
                                                }
                                            }
                                        }
                                        return config;
                                    }
                                };
                            }]);
                    }]);
            })(Providers = Core.Providers || (Core.Providers = {}));
        })(Core = Fusion.Core || (Fusion.Core = {}));
    })(Fusion = Skimia.Fusion || (Skimia.Fusion = {}));
})(Skimia || (Skimia = {}));
/// <reference path="../FusionCore.ts"/>
var Skimia;
(function (Skimia) {
    var Fusion;
    (function (Fusion) {
        var Core;
        (function (Core) {
            var Providers;
            (function (Providers) {
                var EventProvider = (function (_super) {
                    __extends(EventProvider, _super);
                    function EventProvider() {
                        _super.apply(this, arguments);
                    }
                    EventProvider.prototype.init = function () {
                        this.config = new Event(this);
                    };
                    EventProvider.prototype.$get = function () {
                        return this.config;
                    };
                    EventProvider.prototype.injectDefaultsHandlers = function () {
                        var _this = this;
                        var handlers = [
                            { code: 401, buffered: true, ignore: 'ignoreUnauthorized', events: [
                                    'sfc:unauthorized', 'sfc:auth:loginRequired'
                                ], retries_events: [
                                    'sfc:unauthorized-retried', 'sfc:auth:loginConfirmed'
                                ], rejects_events: [
                                    'sfc:unauthorized-rejected', 'sfc:auth:loginCancelled'
                                ] },
                            { code: 403, buffered: false, ignore: 'ignoreForbidden', events: [
                                    'sfc:forbidden', 'sfc:auth:forbidden'
                                ] }
                        ];
                        //TODO: more handlers!
                        angular.forEach(handlers, function (value) {
                            var eventHandler = new EventHandler();
                            eventHandler.code = value.code.toString();
                            eventHandler.buffered = value.buffered;
                            eventHandler.events = value.events;
                            eventHandler.ingore_config = value.ignore;
                            if (eventHandler.buffered) {
                                eventHandler.rejects_events = value.rejects_events;
                                eventHandler.retries_events = value.retries_events;
                            }
                            _this.config.registerEventHandler(value.code.toString(), eventHandler);
                        });
                    };
                    EventProvider.injectables = [];
                    return EventProvider;
                })(Skimia.Angular.Service);
                Providers.EventProvider = EventProvider;
                var Event = (function () {
                    function Event(provider) {
                        this.handlers = new Map();
                        this.provider = provider;
                    }
                    Event.prototype.registerEventHandler = function (event, eventHandler) {
                        this.handlers.set(event, eventHandler);
                    };
                    Event.prototype.hasHandler = function (handler) {
                        return this.handlers.has(handler);
                    };
                    Event.prototype.get = function (handler) {
                        return this.handlers.get(handler);
                    };
                    return Event;
                })();
                Providers.Event = Event;
                var EventHandler = (function () {
                    function EventHandler() {
                    }
                    return EventHandler;
                })();
                Providers.EventHandler = EventHandler;
                (function (FailsEvents) {
                })(Providers.FailsEvents || (Providers.FailsEvents = {}));
                var FailsEvents = Providers.FailsEvents;
                Core.module.bindProvider('$sfcEvent', EventProvider);
                Core.module.module.config(['$httpProvider', function ($httpProvider) {
                        $httpProvider.interceptors.push(['$rootScope', '$q', 'httpBuffer', '$sfcEvent', function ($rootScope, $q, httpBuffer, $sfcEvent) {
                                return {
                                    responseError: function (rejection) {
                                        var config = rejection.config || {};
                                        //TODO: ajouter une config dans le provider pour ajouter un header s'il existe handle sur sa valeur( dans toutes les responsesIntercept)
                                        if ($sfcEvent.hasHandler(rejection.status.toString())) {
                                            var handler = $sfcEvent.get(rejection.status.toString());
                                            if (!config[handler.ingore_config]) {
                                                if (handler.buffered) {
                                                    var deferred = $q.defer();
                                                    httpBuffer.append(config, deferred);
                                                    angular.forEach(handler.events, function (value) {
                                                        $rootScope.$broadcast(value, rejection);
                                                    });
                                                    return deferred.promise;
                                                }
                                                else {
                                                    angular.forEach(handler.events, function (value) {
                                                        $rootScope.$broadcast(value, rejection);
                                                    });
                                                }
                                            }
                                            return $q.reject(rejection);
                                        }
                                    }
                                };
                            }]);
                    }]);
                Core.module.module.factory('httpBuffer', ['$injector', function ($injector) {
                        /** Holds all the requests, so they can be re-requested in future. */
                        var buffer = [];
                        /** Service initialized later because of circular dependency problem. */
                        var $http;
                        function retryHttpRequest(config, deferred) {
                            function successCallback(response) {
                                deferred.resolve(response);
                            }
                            function errorCallback(response) {
                                deferred.reject(response);
                            }
                            $http = $http || $injector.get('$http');
                            $http(config).then(successCallback, errorCallback);
                        }
                        return {
                            /**
                             * Appends HTTP request configuration object with deferred response attached to buffer.
                             */
                            append: function (config, deferred) {
                                buffer.push({
                                    config: config,
                                    deferred: deferred
                                });
                            },
                            /**
                             * Abandon or reject (if reason provided) all the buffered requests.
                             */
                            rejectAll: function (reason) {
                                if (reason) {
                                    for (var i = 0; i < buffer.length; ++i) {
                                        buffer[i].deferred.reject(reason);
                                    }
                                }
                                buffer = [];
                            },
                            /**
                             * Retries all the buffered requests clears the buffer.
                             */
                            retryAll: function (updater) {
                                for (var i = 0; i < buffer.length; ++i) {
                                    retryHttpRequest(updater(buffer[i].config), buffer[i].deferred);
                                }
                                buffer = [];
                            }
                        };
                    }]);
            })(Providers = Core.Providers || (Core.Providers = {}));
        })(Core = Fusion.Core || (Fusion.Core = {}));
    })(Fusion = Skimia.Fusion || (Skimia.Fusion = {}));
})(Skimia || (Skimia = {}));
/// <reference path="../FusionCore.ts"/>
var Skimia;
(function (Skimia) {
    var Fusion;
    (function (Fusion) {
        var Core;
        (function (Core) {
            var Services;
            (function (Services) {
                var AuthService = (function (_super) {
                    __extends(AuthService, _super);
                    function AuthService() {
                        _super.apply(this, arguments);
                    }
                    Object.defineProperty(AuthService.prototype, "IsConnected", {
                        get: function () {
                            return this.isConnected;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(AuthService.prototype, "User", {
                        get: function () {
                            return this.user;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    AuthService.prototype.init = function () {
                        var _this = this;
                        var $http = this.services.$injector.get('$http');
                        this.basePath = this.services.$sfcConfig.ServicePath;
                        //TODO ajout de configurations pour ignorer ou non le module (application uniquement connéctée)
                        $http.get(this.getPath('user'), { ignoreUnauthorized: true }).then(function (response) {
                            _this.isConnected = true;
                            _this.user = response.data.user;
                        }, function () {
                            _this.isConnected = false;
                        });
                    };
                    AuthService.prototype.getPath = function (subPath) {
                        if (!this.basePath) {
                            this.basePath = this.services.$sfcConfig.ServicePath;
                        }
                        return this.basePath + '/' + subPath;
                    };
                    //TODO return promise for better implementation
                    AuthService.prototype.login = function (email, password, remember) {
                        var _this = this;
                        if (remember === void 0) { remember = false; }
                        var $http = this.services.$injector.get('$http');
                        var authenticationMethod = this.services.$sfcConfig.AuthenticationMethod;
                        var credentials = {
                            email: email,
                            password: password
                        };
                        //ajout du remember ou information(ce n'est pas géré avec les jwt
                        if (remember && authenticationMethod == 'http')
                            credentials['remember-me'] = remember;
                        else if (remember && authenticationMethod == 'jwt')
                            console.warn('la valeur remember=true n\'est pas utilisable avec la methode d\'authentification JWT');
                        $http.post(this.getPath('login'), credentials)
                            .then(function (response) {
                            _this.isConnected = true;
                            //en jwt le token est retrouné et il faut demander l'utilisateur
                            if (authenticationMethod == 'jwt') {
                                _this.services.$injector.get('AuthToken').Token = response.data;
                                $http.get(_this.getPath('user')).then(function (userResponse) {
                                    _this.user = userResponse.data.user;
                                });
                            }
                            else if (authenticationMethod == 'http') {
                                _this.user = response.data.user;
                            }
                        });
                    };
                    AuthService.prototype.logout = function () {
                        this.isConnected = false;
                        this.user = null;
                        if (this.services.$sfcConfig.AuthenticationMethod == 'jwt')
                            this.services.$injector.get('AuthToken').clearToken();
                    };
                    AuthService.injectables = ['$injector', '$sfcConfig'];
                    return AuthService;
                })(Skimia.Angular.Service);
                Services.AuthService = AuthService;
                var AuthTokenService = (function (_super) {
                    __extends(AuthTokenService, _super);
                    function AuthTokenService() {
                        _super.apply(this, arguments);
                    }
                    AuthTokenService.prototype.init = function () {
                        this.services.$localService = this.services.$injector.get('localStorageService');
                        this.token = this.services.$localService.get('fusion-jwt-token');
                        if (this.token == null) {
                            this.token = false;
                        }
                    };
                    Object.defineProperty(AuthTokenService.prototype, "Token", {
                        get: function () {
                            return this.token;
                        },
                        set: function (token) {
                            this.services.$localService.set('fusion-jwt-token', token);
                            this.token = token;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    AuthTokenService.prototype.clearToken = function () {
                        this.services.$localService.remove('fusion-jwt-token');
                        this.token = false;
                    };
                    AuthTokenService.injectables = ['$injector'];
                    return AuthTokenService;
                })(Skimia.Angular.Service);
                Services.AuthTokenService = AuthTokenService;
                Core.module.bindService('Auth', AuthService);
                Core.module.bindService('AuthToken', AuthTokenService);
            })(Services = Core.Services || (Core.Services = {}));
        })(Core = Fusion.Core || (Fusion.Core = {}));
    })(Fusion = Skimia.Fusion || (Skimia.Fusion = {}));
})(Skimia || (Skimia = {}));
