var Hangman = angular.module("Hangman", [
  'ngResource',
  'ngRoute',
  'HangmanControllers',
  'HangmanConfig.production',
  //'HangmanConfig.development',
  'HangmanServices',
]);

Hangman.config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
    when('/', {
      templateUrl: 'partials/games.html',
      controller: 'GamesIndexCtrl'
    }).
    when('/games/:id', {
      templateUrl: 'partials/game.html',
      controller: 'GameCtrl'
    }).
    when('/404', {
      templateUrl: 'partials/404.html',
    }).
    when('/500', {
      templateUrl: 'partials/500.html',
    }).
    otherwise({
      redirectTo: '/'
    });
  }
]);

Hangman.run(['$rootScope', '$document',
  function($rootScope, $document){
    var handleKeyDown = function(event){
      $rootScope.$apply(function(){
        switch(true){
          case ($rootScope.listen && event.which >= 65 && event.which <= 90):
            $rootScope.$broadcast('key.alphabet', event.which);
            break;
          default:
            break;
        };
      });
    };

    angular.element($document).bind('keydown', handleKeyDown);
    $rootScope.$on('destroy', function(){
      angular.element($document).unbind('keydown', handleKeyDown);
    });
  }
]);
