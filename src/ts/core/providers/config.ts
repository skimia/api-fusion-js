/// <reference path="../FusionCore.ts"/>


module Skimia.Fusion.Core.Providers{

    export class ConfigProvider extends Skimia.Angular.Service{

        static injectables = [];

        protected $deferred:any;
        protected config:Config;

        public init():void{
            this.$deferred = window.angular.injector(['ng']).get('$q').defer();

            this.config = new Config(this);
        }

        public getDeferredConfig(){
            return this.$deferred.promise;
        }
        public $get():Config{

            return this.config;
        }

        public fusionConfig(apiPath:string, tree:FusionTree, subType:string, version:string):void{

            this.config.setServicePath(apiPath);
            this.config.setFusionAccept(tree, subType, version);

        }

        public setFusionShield(shield:string){
            this.config.setFusionShield(shield);
        }

        public setAuthenticationMethod(method:string){
            this.config.AuthenticationMethod = method;
            if(method == 'http'){
                this.config.setFusionShield('sentinel');
            }else if(method == 'jwt'){
                this.config.setFusionShield('bearer');
            }

        }

        public writeDefaults(flags){

            this.config.setFlags(flags);


            this.$deferred.resolve(this.config);
        }



    }

    export class Config{
        protected provider;

        protected acceptHeader;
        protected shieldHeader;
        protected authenticationMethod;
        protected servicePath;
        protected flags;


        constructor(provider) {
            this.provider = provider;
            this.authenticationMethod = 'http';
        }

        public set Accept(value){
            this.acceptHeader = value;
        }

        public get Accept(){
            return this.acceptHeader;
        }

        public set Shield(value){
            this.shieldHeader = value;
        }

        public get Shield(){
            return this.shieldHeader ? this.shieldHeader : false;
        }

        public set AuthenticationMethod(value){
            this.authenticationMethod = value;
        }

        public get AuthenticationMethod(){
            return this.authenticationMethod;
        }

        public set ServicePath(value){
            this.servicePath = value;
        }
        public get ServicePath(){
            return this.servicePath;
        }

        public setFusionAccept(tree:FusionTree, subType:string, version:string){
            this.Accept = 'application/' + tree + '.' + subType + '.' + version + '+json';
        }

        public setFusionShield(shield:string){
            this.Shield = shield;
        }

        public setServicePath(path:string){
            this.ServicePath = path;
        }

        public set Flags(value){
            this.flags = value;
        }

        public get Flags(){
            return this.flags;
        }

        public setFlags(flags:any){
            this.Flags = flags;
        }
    }

    export enum ConfigWritable{
        None = 0,
        AngularHttp = 1 << 0,
        AngularResource = 1 << 1,
        AngularData = 1 << 2
    }

    export enum FusionTree{
        unregistered_x = <any>'x',
        personal_prs = <any>'prs',
        vendor_vnd = <any>'vnd'

    }

    module.module.run(function($sfcConfig,$http,$injector){


        if($sfcConfig.Flags & ConfigWritable.AngularHttp || $sfcConfig.Flags & ConfigWritable.AngularData){

            $http.defaults.headers.common = {
                Accept:$sfcConfig.Accept
            };
        }

        if($sfcConfig.Flags & ConfigWritable.AngularData){
            var DS =  $injector.get('DS');
            var defaultAdapter = DS.defaults.defaultAdapter;
            DS.adapters[defaultAdapter].defaults.basePath = $sfcConfig.ServicePath;

        }


    });
    module.bindProvider('$sfcConfig', ConfigProvider);

    module.module.config(['$httpProvider', function($httpProvider ){
        $httpProvider.interceptors.push(['$injector', ($injector) =>{
            var $sfcConfig = $injector.get('$sfcConfig');
            //var Auth = $injector.get('Auth');
            return {
                'request': function(config) {
                    if($sfcConfig.Shield){
                        config.headers['shield'] = $sfcConfig.Shield;

                        if($sfcConfig.AuthenticationMethod == 'jwt'){
                            var AuthToken = $injector.get('AuthToken');

                            if(AuthToken.Token){
                                config.headers['authorization'] = 'bearer ' + AuthToken.Token;
                            }
                        }
                    }
                    return config;

                }
            };
        }]);
    }]);
}








