var app = angular
  .module('MyApp', [
    'ui.router'
  ])

.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) { 

        $urlRouterProvider.otherwise('/home');

        // States
        $stateProvider          
          // public
          .state('home', {
              url: "/home",
              templateUrl: 'tpl.html',
              data: { isPublic: true },
          })
          .state('public', {
              url: "/public",
              templateUrl: 'tpl.html',
              data: { isPublic: true },
          })
          // private
          .state('private', {
              url: "/private",
              templateUrl: 'tpl.html',
          })
          .state('private2', {
              url: "/private2",
              templateUrl: 'tpl.html',
          })
        //error
          .state('404', {
              url: '/404',
              templateUrl: '/Error/404.html'
           })
          // login
          .state('login', {
              url: "/login",
              templateUrl: 'tpl.html',
              data: { isPublic: true },
              controller: 'loginCtrl',
          })
    }
])
app.controller('loginCtrl', function ($scope, userService) {
    userService
      .getAuthObject()
      .then(function (user) { $scope.user = user });
})

app.run(['$rootScope', '$state', 'userService','$location','$window',
 function ($rootScope, $state, userService, $location, $window) {

     $rootScope.$on('$locationChangeSuccess', function () {
         debugger;
         //$window.location.href = 'Error/404.html';
         //alert('Pre:   ' + $rootScope.previousLocation);
         //alert('Actual:   ' + $rootScope.actualLocation);
         if ($rootScope.actualLocation == undefined) {
             $rootScope.actualLocation = $location.path();
             $rootScope.previousLocation = "";
         }
         if ($rootScope.actualLocation != undefined && $location.path() === $rootScope.previousLocation) {
             alert('Back button pressed.');
             $window.location.href = 'Error/404.html';
         }
     });

     $rootScope.$watch(function () { return $location.path() }, function (newLocation, oldLocation) {
         debugger;
             $rootScope.previousLocation = $rootScope.actualLocation;
             $rootScope.actualLocation = $location.path();
     });

     var windowElement = angular.element($window);
     windowElement.on('beforeunload', function (event) {
         //alert('refresh');
         //// do whatever you want in here before the page unloads.
         //// the following line of code will prevent reload or navigating away.
         //$rootScope.previousLocation = 'refresh';
         event.preventDefault();
         $state.go("404");
         //if ($state.current.controller === 'ReloadWarningController') {
         //    // Ask the user if he wants to reload
         //    return 'Are you sure you want to reload?'
         //} else {
         //    // Allow reload without any alert

         //}
     });

     $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        // if already authenticated...
        var isAuthenticated = userService.isAuthenticated();
        // any public action is allowed
        var isPublicAction = angular.isObject(toState.data)
                           && toState.data.isPublic === true;

        if (isPublicAction || isAuthenticated) {
          return;
        }

        // stop state change
        event.preventDefault();

        // async load user 
        userService
           .getAuthObject()
           .then(function (user) {

              var isAuthenticated = user.isAuthenticated === true;

              if (isAuthenticated) {
                // let's continue, use is allowed
                $state.go(toState, toParams)
                return;
              }

              // log on / sign in...
              $state.go("login");
           })
     });
 }])

.factory('userService', function ($timeout, $q) {

    var user = undefined;

    return {
        // async way how to load user from Serve
        getAuthObject: function () {
            var deferred = $q.defer();
            
            // later we can use this quick way -
            // - once user is already loaded
            if (user) {
                return $q.when(user);
            }

            // server fake call
            $timeout(function () {
                // server returned UN authenticated user
                user = {isAuthenticated: false };
                // here resolved after 500ms
                deferred.resolve(user)
            }, 500)

            return deferred.promise;
        },
        // sync, quick way how to check IS authenticated...
        isAuthenticated: function () {
            return user !== undefined
                && user.isAuthenticated;
        }
    };

})
app.run(
    ['$rootScope', '$state', '$stateParams',
      function ($rootScope, $state, $stateParams) {
          debugger;
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
      }
    ])