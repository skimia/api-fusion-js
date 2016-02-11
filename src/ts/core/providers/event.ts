/// <reference path="../FusionCore.ts"/>


module Skimia.Fusion.Core.Providers{

    export class EventProvider extends Skimia.Angular.Service{

        static injectables = [];

        protected config:Event;

        public init():void{

            this.config = new Event(this);
        }


        public $get():Event{

            return this.config;
        }

        public injectDefaultsHandlers(){
            var handlers = [
                { code: 401, buffered:true,ignore:'ignoreUnauthorized',events:[
                    'sfc:unauthorized','sfc:auth:loginRequired'
                ],retries_events:[
                    'sfc:unauthorized-retried','sfc:auth:loginConfirmed'
                ],rejects_events:[
                    'sfc:unauthorized-rejected','sfc:auth:loginCancelled'
                ]},
                { code: 403, buffered:false,ignore:'ignoreForbidden',events:[
                    'sfc:forbidden','sfc:auth:forbidden'
                ]}

            ];
            //TODO: more handlers!
            angular.forEach(handlers,(value)=>{
                var eventHandler = new EventHandler();

                eventHandler.code = value.code.toString();
                eventHandler.buffered = value.buffered;
                eventHandler.events = value.events;
                eventHandler.ingore_config = value.ignore;
                if(eventHandler.buffered){
                    eventHandler.rejects_events = value.rejects_events;
                    eventHandler.retries_events = value.retries_events;
                }
                this.config.registerEventHandler(value.code.toString(),eventHandler);
            });

        }

    }

    export class Event{
        protected provider;


        protected handlers:Map<string,EventHandler> = new Map<string,EventHandler>();


        constructor(provider) {
            this.provider = provider;
        }

        public registerEventHandler(event:string, eventHandler:EventHandler){
            this.handlers.set(event,eventHandler);
        }

        public hasHandler(handler:string):boolean{
            return this.handlers.has(handler);
        }
        public get(handler:string):EventHandler{
            return this.handlers.get(handler);
        }
    }

    export class EventHandler{
        public buffered:boolean;
        public code:string;

        public events:string[];

        public retries_events:string[];
        public rejects_events:string[];

        public ingore_config:string;

    }

    export enum FailsEvents{

    }

    module.bindProvider('$sfcEvent', EventProvider);

    module.module.config(['$httpProvider', function($httpProvider ){
        $httpProvider.interceptors.push(['$rootScope', '$q', 'httpBuffer','$sfcEvent', ($rootScope, $q, httpBuffer,$sfcEvent:Event) =>{
            return {
                responseError: function(rejection) {
                    var config = rejection.config || {};
                    //TODO: ajouter une config dans le provider pour ajouter un header s'il existe handle sur sa valeur( dans toutes les responsesIntercept)
                    if($sfcEvent.hasHandler(rejection.status.toString())){
                        var handler = $sfcEvent.get(rejection.status.toString());
                        if(!config[handler.ingore_config]){
                            if(handler.buffered){
                                var deferred = $q.defer();

                                httpBuffer.append(config, deferred);
                                angular.forEach(handler.events,(value)=>{
                                    $rootScope.$broadcast(value, rejection);
                                });

                                return deferred.promise;

                            }else{
                                angular.forEach(handler.events,(value)=>{
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

    module.module.factory('httpBuffer', ['$injector', function($injector) {
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
            append: function(config, deferred) {
                buffer.push({
                    config: config,
                    deferred: deferred
                });
            },

            /**
             * Abandon or reject (if reason provided) all the buffered requests.
             */
            rejectAll: function(reason) {
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
            retryAll: function(updater) {
                for (var i = 0; i < buffer.length; ++i) {
                    retryHttpRequest(updater(buffer[i].config), buffer[i].deferred);
                }
                buffer = [];
            }
        };
    }]);
}








