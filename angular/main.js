/* MAIN MODULE */
var app = angular.module('MainApplication', ['hud-Auth','ngSanitize', 'ngAnimate', 'ngMaterial', 'jQueryScrollbar', 'HUD-Router', 'HUD-ContentManager', 'HUD-Factory', 'HUD-Directives', 'ang-drag-drop']);
app.controller('MainController', function ($rootScope,$scope, $state, $interval, $mdDialog, $mdSidenav, DataFactory,Auth,AUTH_EVENTS,USER_ROLES) {
	$scope.mainstate = $state;

	$scope.date = new Date(); 


	$scope.ChangeState = function (state) {
		$state.go(state);
		console.log($scope.mainstate);
	}          

    function showLoginDialog($event) {
      var passcode="pass";
        Auth.login(passcode, function() {
              $scope.wrong = false;
              // console.log($scope.mainstate.current.name);
            // $state.go($scope.mainstate.current.name);
          }, function(err) {
              $scope.wrong = true;
            $scope.error = true;
          });


      //  var parentEl = angular.element(document.body);
      //  $mdDialog.show({
      //    parent: parentEl,
      //    targetEvent: $event,
      //    templateUrl:'angular/Modules/Home/login.html',
      //    locals: {
      //    },
      //    controller: DialogController
      // });
      // function DialogController($scope, $mdDialog) {

      //    $scope.login = function(passcode){
      //     Auth.login(passcode, function() {
      //       $mdDialog.hide();
      //         $scope.wrong = false;

      //       $state.go('home');
      //     }, function(err) {
      //         $scope.wrong = true;
      //       $scope.error = true;
      //     });
      //   }
      // }
   
    }
    var setCurrentUser = function(){
      $scope.auth = 'loginSuccess';
      $scope.isLoggedIn = 'true';
      $scope.currentUser = $rootScope.currentUser;  
    }
    $scope.currentUser = null;
	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = Auth.isAuthorized;

	//listen to events of unsuccessful logins, to run the login dialog
	$rootScope.$on(AUTH_EVENTS.notAuthorized, showLoginDialog);
	$rootScope.$on(AUTH_EVENTS.notAuthenticated, showLoginDialog);
	$rootScope.$on(AUTH_EVENTS.sessionTimeout, showLoginDialog);
	$rootScope.$on(AUTH_EVENTS.logoutSuccess, showLoginDialog);
	$rootScope.$on(AUTH_EVENTS.loginSuccess, setCurrentUser);
})
