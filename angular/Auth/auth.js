'use strict';
var hudAuth = angular.module('hud-Auth', []); //
hudAuth.constant('USER_ROLES', {
    all : '*',
    admin : 'admin',
    editor : 'editor',
    guest : 'guest'
});
hudAuth.constant('AUTH_EVENTS', {
    loginSuccess : 'auth-login-success',
    loginFailed : 'auth-login-failed',
    logoutSuccess : 'auth-logout-success',
    sessionTimeout : 'auth-session-timeout',
    notAuthenticated : 'auth-not-authenticated',
    notAuthorized : 'auth-not-authorized',
    guestSuccess : 'guest-success'
})
hudAuth.service('Session', function () {
  this.create = function (sessionId, userId, userRole) {
    this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
    this.userRole = null;
  };
});

hudAuth.factory('Auth', [ '$http', '$rootScope', '$window', 'Session', 'AUTH_EVENTS', 
function($http, $rootScope, $window, Session, AUTH_EVENTS) {
	var authService = {};
	
	
	//the login function
	authService.login = function(user, success, error) {
		
		//this is my dummy technique, normally here the 
		//user is returned with his data from the db
		
			var loginData = {userid:1,userRole:"guest"}
			//insert your custom login function here 
			if(user == "pass"){
				//set the browser session, to avoid relogin on refresh
				$window.sessionStorage["userInfo"] = JSON.stringify(loginData);
				$window.localStorage['userInfo'] = JSON.stringify(loginData);
				//delete password not to be seen clientside 
				delete loginData.password;
				
				//update current user into the Session service or $rootScope.currentUser
				//whatever you prefer
				// Session.create(loginData);

				Session.create(0, loginData.userid, loginData.userRole);
				//or
				$rootScope.currentUser = loginData;
				
				//fire event of successful login
				$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
				//run success function
				success(loginData);
			} else{
				console.log('login fail');
				//OR ELSE
				//unsuccessful login, fire login failed event for 
				//the according functions to run
				$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
				error();
			}
		
	};

	//check if the user is authenticated
	authService.isAuthenticated = function () {
    return !!Session.userId;
  };
 
	
	//check if the user is authorized to access the next route
	//this function can be also used on element level
	//e.g. <p ng-if="isAuthorized(authorizedRoles)">show this only to admins</p>
	
  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
  };
  authService.isGuestUser = function () {
    return Session.userRole == 'guest';
  };
 
	//log out the user and broadcast the logoutSuccess event
	authService.logout = function(){
		Session.destroy();
		$window.sessionStorage.removeItem("userInfo");
		$window.localStorage.removeItem("userInfo");
		$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
	}

	return authService;
} ]);

hudAuth.run(function($window,Session,$location,$rootScope, $state, Auth, AUTH_EVENTS) {
	
	//before each state change, check if the user is logged in
	//and authorized to move onto the next state
	$rootScope.$on('$stateChangeStart', function (event, next) {
	    var authorizedRoles = next.data.authorizedRoles;
	    if (!Auth.isAuthorized(authorizedRoles)) {
	    	// user is not logged in - but set GUEST

	       if (!Auth.isAuthenticated()) {
	      	console.log(Session);
	        // user is not allowed
	        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
		  	console.log('not authenticated');
	      	// event.preventDefault();
	      } 

	      else {
	        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
	      	// event.preventDefault();
	      }
	    }
	  });
	
	/* To show current active state on menu */
	$rootScope.getClass = function(path) {
		if ($state.current.name == path) {
			return "active";
		} else {
			return "";
		}
	}
	
	$rootScope.logout = function(){
		Auth.logout();
	};

});
hudAuth.factory('AuthInterceptor', [ '$rootScope', '$q', 'Session', 'AUTH_EVENTS',
function($rootScope, $q, Session, AUTH_EVENTS) {
	return {
		responseError : function(response) {
			$rootScope.$broadcast({
				401 : AUTH_EVENTS.notAuthenticated,
				403 : AUTH_EVENTS.notAuthorized,
				419 : AUTH_EVENTS.sessionTimeout,
				440 : AUTH_EVENTS.sessionTimeout
			}[response.status], response);
			return $q.reject(response);
		}
	};
} ]);