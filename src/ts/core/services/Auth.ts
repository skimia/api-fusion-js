/// <reference path="../FusionCore.ts"/>


module Skimia.Fusion.Core.Services{


    export class AuthService extends Skimia.Angular.Service{
        static injectables = ['$injector','$sfcConfig'];

        protected isConnected:boolean;
        protected user:any;
        protected basePath:any;

        get IsConnected():boolean{
            return this.isConnected;
        }

        get User():any{
            return this.user;
        }

        public init():void{

            var $http = this.services.$injector.get('$http');
            this.basePath = this.services.$sfcConfig.ServicePath;
            //TODO ajout de configurations pour ignorer ou non le module (application uniquement connéctée)
            $http.get(this.getPath('user'), {ignoreUnauthorized: true}).then((response)=> {
                this.isConnected = true;
                this.user = response.data.user;
            }, () => {
                this.isConnected = false;
            });


        }

        public getPath(subPath:string){
            if(!this.basePath){
                this.basePath = this.services.$sfcConfig.ServicePath;
            }
            return this.basePath + '/' + subPath;
        }

        //TODO return promise for better implementation
        public login(email:string, password:string, remember:boolean = false){

            var $http = this.services.$injector.get('$http');
            var authenticationMethod = this.services.$sfcConfig.AuthenticationMethod;
            var credentials = {
                email: email,
                password: password
            };

            //ajout du remember ou information(ce n'est pas géré avec les jwt
            if(remember && authenticationMethod == 'http')
                credentials['remember-me'] = remember;
            else if(remember && authenticationMethod == 'jwt')
                console.warn('la valeur remember=true n\'est pas utilisable avec la methode d\'authentification JWT')

            $http.post(this.getPath('login'), credentials)

                .then(
                (response)=>{
                    this.isConnected = true;

                    //en jwt le token est retrouné et il faut demander l'utilisateur
                    if(authenticationMethod == 'jwt'){
                        this.services.$injector.get('AuthToken').Token = response.data;
                        $http.get(this.getPath('user')).then((userResponse)=> {
                            this.user = userResponse.data.user;
                        });
                    }
                    //en http l'user est directement rendu
                    else if(authenticationMethod == 'http'){
                        this.user = response.data.user;
                    }
                }
            );

        }

        public logout(){
            this.isConnected = false;
            this.user = null;

            if(this.services.$sfcConfig.AuthenticationMethod == 'jwt')
                this.services.$injector.get('AuthToken').clearToken();
        }
    }

    export class AuthTokenService extends Skimia.Angular.Service{
        static injectables = ['$injector'];

        protected token;

        public init():void{
            this.services.$localService = this.services.$injector.get('localStorageService');

            this.token = this.services.$localService.get('fusion-jwt-token');

            if(this.token == null){
                this.token = false;
            }

        }

        get Token(){
            return this.token;
        }

        set Token(token){
            this.services.$localService.set('fusion-jwt-token', token);
            this.token = token;
        }

        public clearToken(){
            this.services.$localService.remove('fusion-jwt-token');
            this.token = false;
        }
    }

    module.bindService('Auth', AuthService);
    module.bindService('AuthToken', AuthTokenService);
}

