angular.module('wooCommerceApp', ['ionic', 'wooCommerceApp.controllers', 'wooCommerceApp.services', 'ngCordova', 'toastr'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    
    if (window.StatusBar) {
      //StatusBar.styleDefault();
      Statusbar.styleHex('#34495e');
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, toastrConfig) {
  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  .state('app.shop', {
    url: '/shop/:parent/:categorie',
    params: { 
      parent: ''
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/shop.html',
        controller: 'ShopCtrl'
      }
    }
  })
  .state('app.product', {
    url: '/product/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/product.html',
        controller: 'ProductCtrl'
      }
    }
  })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
  
    angular.extend(toastrConfig, {
      allowHtml: true,
      maxOpened: 1,
      preventOpenDuplicates: false,
      positionClass: 'toast-bottom-center',
      timeOut: 2500,
      extendedTimeOut: 2500,
      toastClass: 'toast'
    });
  
});
