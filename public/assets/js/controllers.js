var HangmanControllers = angular.module("HangmanControllers", []);

HangmanControllers.controller('GamesIndexCtrl', ['$scope', '$location', 'Hangman',
  function($scope, $location, Hangman){
    $scope.initializeData = function(){
      $scope.games = [];
      $scope.notice = null;
      $scope.errors = null;
    };

    $scope.createGame = function(){
      Hangman.post({}, {},
        function(data){
          $location.path('/games/' + data.id);
        },
        function(error){
          if (error.status === 422){
            $scope.notice = error.data.notice;
            $scope.errors = error.data.errors;
          }
          else if (error.status === 404){
            $location.path('/404');
          }
          else if (error.status >= 500){
            $location.path('/500');
          }
        }
      ).$promise.catch(function(response){
        if (response.status === 0){
          $scope.notice = 'Request Timed Out';
        }
      });
    };

    $scope.initializeData();
    Hangman.query(function(data){ $scope.games = data; })
    .$promise.catch(function(response){
      if (response.status === 0){
        $scope.notice = 'Request Timed Out';
      }
    });
  }
]);

HangmanControllers.controller('GameCtrl', ['$scope', '$route', '$routeParams', '$location', '$rootScope', 'Hangman',
  function($scope, $route, $routeParams, $location, $rootScope, Hangman){
    $scope.initializeData = function(){
      $scope.characters = 'abcdefghijklmnopqrstuvwxyz';
      $scope.game = {};
      $scope.notice = null;
      $scope.errors = null;
      $scope.isMakingGuess = true;
      $rootScope.listen = false;
    };

    $scope.isGameBusy = function(){
      if ($scope.game && $scope.game.status === 'busy'){ return true; }
      return false;
    };

    $scope.isGameFailed = function(){
      if ($scope.game && $scope.game.status === 'failed'){ return true; }
      return false;
    };

    $scope.isGameSuccess = function(){
      if ($scope.game && $scope.game.status === 'success'){ return true; }
      return false;
    };

    $scope.isCharGuessed = function(character){
      if ($scope.game && $scope.game.guessed_chars && $scope.game.guessed_chars.indexOf(character) > -1){ return true; }
      return false;
    };

    $scope.isButtonDisabled = function(character){
      if (!$scope.game || !$scope.isGameBusy() || $scope.isCharGuessed(character)) { return true; }
      return false;
    };

    $scope.getButtonTypeForChar = function(character){
      if (!$scope.isButtonDisabled(character)){ return 'primary'; }
      if ($scope.game && $scope.game.word && $scope.game.word.indexOf(character) > -1){ return 'success'; }
      return 'danger';
    };

    $scope.makeGuess = function(character){
      $scope.isMakingGuess = true;
      $rootScope.listen = false;
      $scope.notice = null;
      $scope.errors = null;
      Hangman.post({ id: $routeParams.id }, { char: character },
        function(data){
          $scope.game = data;
          $scope.notice = data.notice;
          $rootScope.listen = true;
          $scope.isMakingGuess = false;
        },
        function(error){
          $rootScope.listen = true;
          $scope.isMakingGuess = false;
          if (error.status === 422){
            $scope.notice = error.data.notice;
            $scope.errors = error.data.errors;
          }
          else if (error.status === 404){
            $location.path('/404');
          }
          else if (error.status >= 500){
            $location.path('/500');
          }
        }
      ).$promise.catch(function(response){
        if (response.status === 0){
          $scope.notice = 'Request Timed Out';
        }
      });
    };

    $scope.setGame = function(){
      Hangman.get({ id: $routeParams.id },
        function(data){
          $scope.game = data;
          $scope.notice = data.notice;
          $rootScope.listen = true;
          $scope.isMakingGuess = false;
        },
        function(error){
          $rootScope.listen = true;
          $scope.isMakingGuess = false;
          if (error.status === 422){
            $scope.notice = error.data.notice;
            $scope.errors = error.data.errors;
          }
          if (error.status === 404){
            $location.path('/404');
          }
          else if (error.status >= 500){
            $location.path('/500');
          }
        }
      ).$promise.catch(function(response){
        if (response.status === 0){
          $scope.notice = 'Request Timed Out';
        }
      });
    };

    $scope.$on('key.alphabet',
      function(event, keyCode){
        if ($scope.isGameBusy()){
          $scope.makeGuess(String.fromCharCode(keyCode).toLowerCase());
          event.preventDefault();
        }
      }
    );

    $scope.initializeData();
    $scope.setGame();
  }
]);
