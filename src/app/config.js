'use strict';

angular.module('player', [
  'ui.router'
  ])
  .constant('YOUTUBE_EMBED', "https://www.youtube.com/embed/")
  .config(function($httpProvider, $stateProvider,$urlRouterProvider){    
    
    $urlRouterProvider.otherwise('/search');

    $stateProvider
      .state('search', {
        url:'/search',
        templateUrl: 'app/home/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      });
  });
