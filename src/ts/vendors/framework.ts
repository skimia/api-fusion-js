/// <reference path="angular.d.ts"/>
/// <reference path="lib.d.ts"/>

module Skimia.Angular{

    /**
     * Angular Module
     */
    export class Module{

        /**
         *
         * @type {null}
         */
        module:ng.IModule = null;

        /**
         * Constructor
         * @param name
         * @param requires
         * @param configFn
         */
        constructor(name:string, requires:string[] = [], configFn:Function = () => {}){
            this.module = angular.module(name, requires, configFn);
        }

        /**
         * Bind a Service class to angular module
         * @param name Service name
         * @param service Service class
         */
        bindService(name:string, service:IServiceBuilder):void {
            service.$inject = service.injectables;

            this.module.service(name, service as Function);
        }

        /**
         * Bind a Service class to angular module
         * @param name Service name
         * @param service Service class
         */
        bindProvider(name:string, service:IServiceBuilder):void {
            service.$inject = service.injectables;

            this.module.provider(name, service as ng.IServiceProviderFactory);
        }
        /**
         * Bind a filter
         */
        bindFilter(){
            //TODO
        }

        /**
         *
         * @param component
         */
        bindComponent(component:typeof Component):void {
            var config:IComponent = new component();

            var directiveFactory = (...args):ng.IDirective => {
                var isDef = angular.isDefined;
                var directive = {};

                //Directive config
                if(isDef(config.restrict)){
                    directive['restrict'] = config.restrict;
                }

                if(isDef(config.priority)){
                    directive['priority'] = config.priority;
                }

                //View config
                if(isDef(config.view)){
                    if(isDef(config.view.templateCache)){
                        var $templateCache = angular.element(document.body).injector().get('$templateCache');
                        directive['template'] = $templateCache.get(config.view.templateCache);
                    }
                    else if(isDef(config.view.templateUrl)){
                        directive['templateUrl'] = config.view.templateUrl;
                    }
                    else if(isDef(config.view.template)){
                        directive['template'] = config.view.template;
                    }

                    if(isDef(config.view.transclude)){
                        directive['transclude'] = config.view.transclude;
                    }

                    if(isDef(config.view.replace)){
                        directive['replace'] = config.view.replace;
                    }
                }

                //Manager & Bindings
                if(isDef(config.manager)){
                    if(config.manager.class.injectables.length > 0){
                        directive['controller'] = config.manager.class.injectables.concat(config.manager.class);
                    }
                    else{
                        directive['controller'] = config.manager.class;
                    }

                    directive['controllerAs'] = config.manager.alias;

                    if(isDef(config.manager.isolated) && config.manager.isolated){
                        directive['scope'] = {};
                    }
                    else{
                        directive['scope'] = true;
                    }

                    if(isDef(config.manager.bindings)){
                        directive['bindToController'] = config.manager.bindings;
                    }
                }

                //Compile
                if(isDef(config.compile)){
                    directive['compile'] = config.compile;
                }
                else if(isDef(config.link)){
                    directive['link'] = config.link;
                }

                return directive;
            }

            this.module.directive(config.selector, directiveFactory);
        }
    }

    /**
     * IService
     */
    export interface IService extends Function{
        services?:any;
        $inject?:any;
        constructor:Function;
        init?():void;
    }


    /**
     * IServiceBuilder
     */
    export interface IServiceBuilder extends IService{
        injectables:string[];
    }

    /**
     * Service
     */
    export class Service implements IServiceBuilder{
        static injectables:string[];
        services:any = {};

        constructor(...injectables:string[]){
            angular.forEach(injectables, (injectable, index) => {
                this.services[this.constructor['injectables'][index]] = injectable;
            });

            this.init();
        }

        init():void {

        }
    }

    /**
     * IManager
     */
    export interface IManager{
        services:any;
        init():void;

    }
    export interface IManagerBuilder extends IManager{
        injectables:any[];
    }

    /**
     * Manager
     */
    export class Manager implements IManager{
        static injectables:any[] = [];
        services:any = {};

        constructor(...injectables:string[]){
            angular.forEach(injectables, (injectable, index) => {
                this.services[this.constructor['injectables'][index]] = injectable;
            });

            this.init();
        }

        init():void {

        }
    }

    /**
     * IComponent
     */
    export interface IComponent{
        selector?:string;
        manager?:{
            class?:typeof Manager;
            alias?:string;
            isolated?:boolean;
            bindings?:{};
            require?:string|string[]; //TODO
        };
        restrict?:string;
        priority?:string;

        view?:{
            template?:string;
            templateUrl?:string;
            templateCache?:string;
            transclude?:boolean;
            replace?:boolean;
        };

        compile?:(tElement, attrs, transclude) => void;
        link?:($scope, $element, $attrs) => void;
    }

    /**
     * Component
     */
    export class Component implements IComponent{

    }

}