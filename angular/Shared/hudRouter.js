
/* For Authentication and UI-Router */
var hudRouter = angular.module('HUD-Router', ["ui.router"]); //

// hudRouter.factory('principal', ['$q', '$http', '$timeout', function ($q, $http, $timeout) {
//     var _identity = undefined,
//       _authenticated = false;
//     var sampleProfiles = [
//         {
//             email: "admin@pgao.com",
//             shortname: "admin",
//             type: "HP",
//             pass: "admin",
//             role: "Administrator"
//         },
//         {
//             email: "moadmin@pgao.com",
//             shortname: "moadmin",
//             type: "P&G",
//             pass: "moadmin",
//             role: "Manual Override Administrator"
//         },
//         {
//             email: "superadmin@pgao.com",
//             shortname: "superadmin",
//             type: "HP",
//             pass: "superadmin",
//             role: "Superadmin"
//         },
//         {
//             email: "aoadmin@pgao.com",
//             shortname: "aoadmin",
//             type: "P&G",
//             pass: "aoadmin",
//             role: "Always On Administrator"
//         },
//         {
//             email: "user@pgao.com",
//             shortname: "aoadmin",
//             type: "Other",
//             pass: "user",
//             role: "User"
//         }
//     ];
//     return {
//         GetProfile: function () {
//             if (_identity == null || _identity == undefined)
//                 return "Unauthorized";
//             else
//                 return _identity.profile;
//         },
//         isIdentityResolved: function () {
//             return angular.isDefined(_identity);
//         },
//         isAuthenticated: function () {
//             return _authenticated;
//         },
//         isInRole: function (role) {
//             if (!_authenticated || !_identity.roles) return false;
//             return _identity.roles.indexOf(role) != -1;
//         },
//         isInAnyRole: function (roles) {
//             if (!_authenticated || !_identity.roles) return false;

//             for (var i = 0; i < roles.length; i++) {
//                 if (this.isInRole(roles[i])) return true;
//             }

//             return false;
//         },
//         authenticate: function (identity) {
//             _identity = identity;
//             _authenticated = identity != null && identity != undefined;
//             // for this demo, we'll store the identity in localStorage. For you, it could be a cookie, sessionStorage, whatever
//             if (identity) localStorage.setItem("demo.identity", angular.toJson(identity));
//             else localStorage.removeItem("demo.identity");
//         },
//         identity: function (force) {
//             var deferred = $q.defer();

//             if (force === true) _identity = undefined;

//             // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
//             if (angular.isDefined(_identity)) {
//                 deferred.resolve(_identity);

//                 return deferred.promise;
//             }

//             // otherwise, retrieve the identity data from the server, update the identity object, and then resolve.
//             //                   $http.get('/svc/account/identity', { ignoreErrors: true })
//             //                        .success(function(data) {
//             //                            _identity = data;
//             //                            _authenticated = true;
//             //                            deferred.resolve(_identity);
//             //                        })
//             //                        .error(function () {
//             //                            _identity = null;
//             //                            _authenticated = false;
//             //                            deferred.resolve(_identity);
//             //                        });

//             // for the sake of the demo, we'll attempt to read the identity from localStorage. the example above might be a way if you use cookies or need to retrieve the latest identity from an api
//             // i put it in a timeout to illustrate deferred resolution
//             var self = this;
//             $timeout(function () {
//                 _identity = angular.fromJson(localStorage.getItem("demo.identity"));
//                 self.authenticate(_identity);
//                 deferred.resolve(_identity);
//             }, 1000);

//             return deferred.promise;
//         },
//         SignOut: function () {
//             principal.authenticate(null);
//             $state.go('dashboard');
//         },
//         Signin: function (username, password) {
//             //return $http.get("http://localhost:8080/bcpp/webservice/api.php?action=login&employee_id=" + username + "&pass=" + password)
//             //.then(function (response) {
//             //    return (response.data);
//             //});         
//             if (username == "admin" && password == "admin") {
//                 return sampleProfiles[0];
//             } else if (username == "moadmin" && password == "moadmin") {
//                 return sampleProfiles[1];
//             } else if (username == "superadmin" && password == "superadmin") {
//                 return sampleProfiles[2];
//             } else if (username == "aoadmin" && password == "aoadmin") {
//                 return sampleProfiles[3];
//             } else { return "Unauthorized"; }
//         },
//         ValidateUser: function (user) {
//             return $http({
//                 url: "../api/v1/user/login",
//                 method: 'POST',
//                 data: user
//             });
//         }
//     };
// }]);
// hudRouter.factory('authorization', ['$rootScope', '$state', 'principal', function ($rootScope, $state, principal) {
//     return {
//         authorize: function () {
//             return principal.identity()
//               .then(function () {
//                   var isAuthenticated = principal.isAuthenticated();
//                   try {
//                       if (angular.isDefined($rootScope.toState.data.roles)) {
//                           if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !principal.isInAnyRole($rootScope.toState.data.roles)) {
//                               if (isAuthenticated) $state.go('dashboard'); // user is signed in but not authorized for desired state
//                               else {
//                                   // user is not authenticated. stow the state they wanted before you
//                                   // send them to the signin state, so you can return them when you're done
//                                   $rootScope.returnToState = $rootScope.toState;
//                                   $rootScope.returnToStateParams = $rootScope.toStateParams;

//                                   // now, send them to the signin state so they can log in
//                                   $state.go('dashboard');
//                                   //console.log("unauthorized access");
//                               }
//                           }
//                       }
//                       else { //console.log("role undefined");
//                       }
//                   } catch (e) { //console.log(e); 
//                   }
//               });
//         }
//     };
// }]);
// hudRouter.run(['$rootScope', '$state', '$stateParams', 'authorization', 'principal', function ($rootScope, $state, $stateParams, authorization, principal) {
//     $rootScope.checkDataLoads = 0;
//     $rootScope.invalid = false;
//     $rootScope.Config = {
//         showSLT: true,
//         showSLS: true,
//         showSLA: false,
//         showEMS: true,
//         showResiliency: false
//     }
//     $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
//         $rootScope.toState = toState;
//         $rootScope.toStateParams = toStateParams;

//         if (principal.isIdentityResolved()) authorization.authorize();
//     });
//     $rootScope.SignOut = function () {
//         principal.authenticate(null);
//         $state.go('dashboard');
//     };
//     $rootScope.SignIn = function (username, password) {
//         $rootScope.invalid = false;
//         principal.Signin(username, password).then(function (data) {
//             if (data == "Unauthorized") { $rootScope.invalid = true; }
//             else {
//                 principal.authenticate(data);
//                 if (data.role == "Administrator") {
//                     $state.go("dashboard");//admin
//                     return sampleProfiles[0];
//                 } else if (data.role == "Manual Override Administrator") {
//                     $state.go("dashboard");//moadmin
//                     return sampleProfiles[1];
//                 } else if (data.role == "Superadmin") {
//                     $state.go("dashboard");//superadmin
//                     return sampleProfiles[2];
//                 } else if (data.role == "Always On Administrator") {
//                     $state.go("dashboard");//aoadmin
//                     return sampleProfiles[3];
//                 } else { $state.go("dashboard"); }
//             }
//         });
//     }
//     $rootScope.GetProfile = function () {
//         return principal.GetProfile();
//     }
// }]);


hudRouter.config(['$stateProvider', '$urlRouterProvider','USER_ROLES', function ($stateProvider, $urlRouterProvider,USER_ROLES) {
    $urlRouterProvider.otherwise('/');

            // data: {
            //     authorizedRoles: [USER_ROLES.admin]
            // }
    $stateProvider    
        .state('home', {
            name: 'home',
            parent: '',
            data: {
                authorizedRoles: [USER_ROLES.guest]
            },
            url: "/",
            templateUrl: "angular/Modules/Home/home.html",
            controller: "HomeController"
        })
        .state('latency', {
            name: 'latency',
            parent: '',
            params: { 
                id: null
            },
            data: {
                authorizedRoles: [USER_ROLES.guest]
            },
            url: "/latency/:name",
            templateUrl: "angular/Modules/Latency/latency.html",
            controller: "LatencyController"
        })
        .state('details', {
            name: 'details',
            parent: '',
            params: { 
                name: null
            },
            data: {
                authorizedRoles: [USER_ROLES.guest]
            },
            url: "/details/:name",
            templateUrl: "angular/Modules/Details/details.html",
            controller: "DetailsController"
        })

}]);
