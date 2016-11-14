var app = angular.module('safe',['MainCtrl','ProfileCtrl','ngAnimate','ngRoute', 'ui.router','ui.bootstrap'])
    .config(function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state("home", {
                url: '/',
                templateUrl:'views/home.html',
                controller:'MainController'
            })
            .state("profile",{
                url: '/profile',
                templateUrl:'views/profile.html',
                controller:'ProfileController'
        });
        
        $urlRouterProvider.otherwise('/');
    });


