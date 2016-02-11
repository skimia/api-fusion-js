# Getting started with Fusion Core

- Include `angular-fusion-core.js` (or `angular-fusion-core.min.js`) from the [dist](https://github.com/skimia/angular-fusion-core/tree/master/dist) directory in your `index.html`,
- add `'fusion.core'` to your main module's list of dependencies

When you're done, your setup should look similar to the following:

```html
<!doctype html>
<html ng-app="myApp">
<head>

</head>
<body>
    ...
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular.min.js"></script>
    <script src="js/angular-fusion-core.min.js"></script>
    ...
    <script>
        var myApp = angular.module('myApp', ['fusion.core']);

    </script>
    ...
</body>
</html>
```

##Configuration

###fusionConfig
You must configure fusion for link the module to your fusion API

```js
myApp.config(function ($sfcConfigProvider) {
  $sfcConfigProvider
    .fusionConfig(
            'http://localhost/skimia.dev/skimia-os2/public/skimia.api.svc', //full url to your API service
            Skimia.Fusion.Core.Providers.FusionTree.unregistered_x, //configure your api tree (respect server configuration)
            'skimia', //configure your api vendor (respect server configuration)
            'v1' //configure your api version (respect server configuration)
        );
});
```

###setAuthenticationMethod
You must configure fusion authentication method according your server configuration

applicables values: `http` or `jwt` according to http authentication method (cookie) or JSONWebTokens

```js
myApp.config(function ($sfcConfigProvider) {
  $sfcConfigProvider
    .setAuthenticationMethod('jwt');
});
```
> Note: to use jwt you must install the required module for this [angular-local-storage](https://github.com/grevory/angular-local-storage)


###writeDefaults
Choose the network services updated to use directly the configuration of the api without making request by hands

```js
myApp.config(function ($sfcConfigProvider) {
  $sfcConfigProvider
    .writeDefaults(
             Skimia.Fusion.Core.Providers.ConfigWritable.AngularHttp |
             Skimia.Fusion.Core.Providers.ConfigWritable.AngularResource |
             Skimia.Fusion.Core.Providers.ConfigWritable.AngularData
         );
});
```

###EventService
if you wants to use the automatic error detection & broadcast on network (more info in the Event doc section)

```js
myApp.config(function ($sfcEventProvider) {
  $sfcEventProvider.injectDefaultsHandlers();
});
```

###Full Example

```js
myApp.config(function ($sfcConfigProvider, $sfcEventProvider) {
  $sfcConfigProvider.fusionConfig(
          'http://localhost/skimia.dev/skimia-os2/public/skimia.api.svc',
          Skimia.Fusion.Core.Providers.FusionTree.unregistered_x,
          'skimia',
          'v1'
      );
  $sfcConfigProvider.setAuthenticationMethod('jwt');
  
  $sfcConfigProvider.writeDefaults(
          Skimia.Fusion.Core.Providers.ConfigWritable.AngularHttp |
          Skimia.Fusion.Core.Providers.ConfigWritable.AngularResource |
          Skimia.Fusion.Core.Providers.ConfigWritable.AngularData
      );
  
  $sfcEventProvider.injectDefaultsHandlers();
  

});
```
