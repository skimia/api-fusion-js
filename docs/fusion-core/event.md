# HTTP Event interceptor

l'intercepteur d'events est basé sur le même modèle qu'[angular-http-auth](https://github.com/witoldsz/angular-http-auth)

Il permet d'handle des codes d'erreur http et les "broadcast" sur la `$rootScope`

Http events handlers:

```js
var handlers = [
                { 
                    //code http 
                    code: 401, 
                    buffered:true, //event type buffered
                    ignore:'ignoreUnauthorized',//config ignore handler
                    events:[
                        'sfc:unauthorized','sfc:auth:loginRequired'
                    ],
                    retries_events:[
                        'sfc:unauthorized-retried','sfc:auth:loginConfirmed'
                    ],
                    rejects_events:[
                        'sfc:unauthorized-rejected','sfc:auth:loginCancelled'
                    ]
                },
                { 
                    code: 403, 
                    buffered:false,
                    ignore:'ignoreForbidden',
                    events:[
                        'sfc:forbidden','sfc:auth:forbidden'
                    ]
                }

            ];
```

## Utilisation classique

### Type d'event `buffered:true`

```js
//appel serveur pouvant échouer (manque d'authentification)
$http(...).then(function(response) { do-something-with-response });
```
lorsque qu'une réponse serveur porte le code d'un handler buffered il capture la requette et broadcast les events

Exemple pour le code 401:

```
[
    'sfc:unauthorized',
    'sfc:auth:loginRequired'
]
```

dans ce cas précis l'application doit intercepter ce ou ces events pour afficher un formulaire de connexion

lorsque que l'application determine que l'authentification est OK broadcast un des `retries_events` exemple : `sfc:auth:loginConfirmed`

la requette initiale est réessayée et lorsque une reponse correcte est finalement retournée le `function(response) { do-something-with-response }` est executé

lorsque l'authentification n'est pas possible (plusieurs essais infructueux par exemple) nous pouvons broadcast un des `rejects_events` exemple : `sfc:auth:loginCancelled` afin de rejeter toute les requettes en attente

### Type d'event `buffered:false`

identique dans le fonctionnement que les events `buffered:true` sauf que il est impossible de réessayer les requettes échouées il permet uniquement de pouvoir transmettre un event lorsque qu'un requette échoue