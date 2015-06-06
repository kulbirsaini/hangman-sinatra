var Hangman = angular.module("Hangman", [
  'ngResource',
  'ngRoute',
  'HangmanControllers',
  'HangmanConfig.development',
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
