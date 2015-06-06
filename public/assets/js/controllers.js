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
          console.log(data);
          $location.path('/games/' + data.id);
        },
        function(error){
          console.log(error);
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
      );
    };

    $scope.initializeData();
    Hangman.query(function(data){ $scope.games = data; });
  }
]);

HangmanControllers.controller('GameCtrl', ['$scope', '$route', '$routeParams', '$location', 'Hangman',
  function($scope, $route, $routeParams, $location, Hangman){
    $scope.initializeData = function(){
      $scope.characters = 'abcdefghijklmnopqrstuvwxyz';
      $scope.game = {};
      $scope.notice = null;
      $scope.errors = null;
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
      $scope.notice = null;
      $scope.errors = null;
      Hangman.post({ id: $routeParams.id }, { char: character },
        function(data){
          console.log(data);
          $scope.game = data;
          $scope.notice = data.notice;
        },
        function(error){
          console.log(error);
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
      );
    };

    $scope.initializeData();
    Hangman.get({ id: $routeParams.id },
      function(data){
        $scope.game = data;
        $scope.notice = data.notice;
      },
      function(error){
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
    );

    ////Handle Keypress
    //$scope.$on('key.escape', function(event){ $scope.redirectToParentGallery(); });
    //$scope.$on('key.up', function(event){ $scope.goToFirstImage(); });
    //$scope.$on('key.left', function(event){ $scope.goToPreviousImage(); });
    //$scope.$on('key.right', function(event){ $scope.goToNextImage(); });
    //$scope.$on('key.down', function(event){ $scope.goToLastImage(); });

    //// Watch variables
    //$scope.$watch("currentAngle", function(value){
    //  $scope.transformStyle = "rotate(" + $scope.currentAngle + "deg)";
    //  $scope.setSlideHeightPadding();
    //  $scope.setRotatedWidth();
    //});
    //$scope.$watch("currentIndex", function(value){ $scope.currentAngle = 0; $scope.setLeftOffset(); });
    //$scope.$watch("circular", function(value){ Settings.setValue('circular', value); });
    //$scope.$watch("quality", function(value){ Settings.setValue('quality', value); });

    //// Monitor window resize
    //jQuery(window).on('resize.doResize', function(){
    //  $scope.$apply(function(){
    //    var current_image = jQuery('.current-img');
    //    current_image.hide();
    //    $scope.setSlideHeightPadding();
    //    $scope.setRotatedWidth();
    //    $scope.setLeftOffset();
    //    current_image.show();
    //  })
    //});
    //$scope.$on("$destroy", function(){ jQuery(window).off('resize.doResize'); });

    //// Change URL without reloading controller
    //$scope.$on("$locationChangeSuccess", function(event){ if ($route.current.$$route.controller == 'SlideshowCtrl'){ $route.current = $scope.lastRoute; } });

    //$scope.initializeData();
    //Gallery.getObject({ operation: 'parent', id: $scope.gallery_id }, function(data){ $scope.parent_id = data.parent_id; });
    //Gallery.getCollection({ operation: 'photos', id: $scope.gallery_id }, $scope.appendToImages)
    //if (typeof(Settings.getValue('quality')) !== "undefined"){
    //  $scope.circular = Settings.getValue('circular');
    //  $scope.quality = Settings.getValue('quality');
    //}
  }
]);
