angular.module('wooCommerceApp.controllers', [])

.controller('AppCtrl', function($scope, $ionicLoading, $ionicModal, $ionicPopup, $ionicSlideBoxDelegate, $ionicScrollDelegate, $http, $cordovaNetwork, toastr, CategoriesService) {
  
  /* Load configuration from config.js */
  $scope.appTitle = config.title;
  $scope.views = {
    homePage: config.views.homePage,
    cart: config.views.cart
  };
  $scope.empty = config.messages.empty;
  $scope.empty_cart = config.messages.empty_cart;
  $scope.empty_shop = config.messages.empty_shop;
  $scope.sale_text = config.messages.sale_text;
  /* End load configuration */
  
  /* Check internet connection */  
  document.addEventListener("deviceready", function () {
    var online = $cordovaNetwork.isOnline()
    if(!online) {
      $scope.notification(config.messages.no_internet);
    }
  }, false);
  /* End check internet connection */
  
    $http.get(config.api.link)
    .then(function(data) {
      $scope.currency = data.data.store.meta.currency_format;
    });
  
  $scope.cartItems = [];
  $scope.cartLength = 0;
  $scope.cartTotal = 0.00;
  
  /* Loading Screen */
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="spiral"></ion-spinner>'
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide();
  };
  /* End Loading Screen */
  
  
  /* Menu Elements */
  $scope.isShown = function(menuTree) {
    return $scope.shownItems === menuTree;
  }
  $scope.toggleMenu = function(menuTree) {
    if($scope.isShown(menuTree)) $scope.shownItems = null;
    else $scope.shownItems = menuTree;
  }
  var categories_tree = [];
    var children_categories = [];
    var parent_categories = [];
    $scope.showLoading();
    CategoriesService.getData()
    .then(function(data) {
      for(i=0; i<data.product_categories.length; i++) {
        if(data.product_categories[i].parent <= 0) parent_categories.push(data.product_categories[i]);
        else children_categories.push(data.product_categories[i]);
      }
      for(i=0; i<parent_categories.length; i++) {
        var children_of_this = [];
        var tree_object;
        for(j=0; j<children_categories.length; j++) {
          if(children_categories[j].parent == parent_categories[i].id) children_of_this.push(children_categories[j]);
        }
        tree_object = {
          name: parent_categories[i].name,
          children: children_of_this
        };
        categories_tree.push(tree_object);
      }
      $scope.main_categories = parent_categories;
      $scope.menu_categories = categories_tree;
      $scope.hideLoading();
    }, function(error) {
      $scope.notification(config.messages.server);
    });
  /* End Menu Elements */
  
  /* Custom Notification */
  $scope.notification = function(message) {
    $ionicLoading.show({ template: message, noBackdrop: true});
  }
  /* End Custom Notification */
  
  /* Image Gallery Popup */
  $scope.zoomMin = 1;
  $ionicModal.fromTemplateUrl('templates/gallery.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.gallery = modal;
      });
    $scope.showGallery = function(images, index) {
      $ionicSlideBoxDelegate.slide(index,0);
      $scope.galleryImages = images;
        $scope.gallery.show();
      };

    $scope.closeGallery = function() {
        $scope.gallery.hide();
    };
    $scope.updateSlideStatus = function(slide) {
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
      if (zoomFactor == $scope.zoomMin) {
        $ionicSlideBoxDelegate.enableSlide(true);
      } else {
        $ionicSlideBoxDelegate.enableSlide(false);
      }
    };
  /* End image gallery popup */
   
  /* Cart Page */
  $ionicModal.fromTemplateUrl('templates/cart.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.cartModal = modal;
  });
  $scope.openCart = function() {
    $scope.cartModal.show();
  };
  $scope.closeCart = function() {
    $scope.cartModal.hide();
  };
  
  $scope.addToCart = function(product) {
    $scope.showLoading();
    var exists = false;
    for(i=0; i<$scope.cartItems.length; i++) {
      if($scope.cartItems[i].id == product.id) {
        exists = true;
        break;
      }
    }
    if(!exists) {
      $scope.cartItems.push(product);
      $scope.cartLength++;
      var total = (parseFloat(product.price)+parseFloat($scope.cartTotal)).toFixed(2);
      $scope.cartTotal = total;
      toastr.success(config.messages.added_cart);
    }
    else {
        toastr.warning(config.messages.exists_cart);       
    }
    $scope.hideLoading();
  }
  
  $scope.removeFromCart = function(product) {
    var confirmPopup = $ionicPopup.confirm({
       title: 'Remove from cart',
       template: 'Are you sure you want to remove '+product.title+'?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         for(i=0; i<$scope.cartItems.length; i++) {
           if($scope.cartItems[i].id == product.id) {
             $scope.cartItems.splice(i,1);
             $scope.cartLength = $scope.cartLength-1;
             $scope.cartTotal = (parseFloat($scope.cartTotal)-parseFloat(product.price)).toFixed(2);
           }
         }
       }
     });
  }
  
  $scope.emptyCart = function() {
    
    var confirmPopup = $ionicPopup.confirm({
       title: 'Empty cart',
       template: 'Are you sure you want to empty your cary?'
     });
     confirmPopup.then(function(res) {
       if(res) {
          $scope.cartItems = [];
          $scope.cartLength = 0;
          $scope.cartTotal = 0.00;
       }
     });
  }
  
  $scope.checkout = function() {
    var link = config.checkout+'?add-to-cart=';
    var ids = [];
    for(i=0; i<$scope.cartItems.length; i++) {
      ids.push($scope.cartItems[i].id);
    }
    link = link+ids.toString();
    var ref = cordova.InAppBrowser.open(link, '_blank', 'location=yes');
  }
  /* End Cart Page */

  /* Custom Functions */

  /*
  * Make products price = 23.00 if it's 23
  */
  $scope.changePrice = function(product) {
    if (product.price % 1 == 0) product.price = product.price+'.00';
  }

  /*
  * Check if cart items length overflow
  */
  $scope.isOverflow = function(number) {
    if(number > 9) return 'cart-number-small';
    return '';
  }

  /* End Custom Functions */
})


.controller('HomeCtrl', function($scope, $rootScope, $ionicHistory, CategoriesService) {    
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
    });
    
})

.controller('ShopCtrl', function($scope, $stateParams, ShopService) {
  var page = 1;
  $scope.hasMoreProducts = true;
  $scope.showLoading();
  $scope.categorie = $stateParams.categorie;
  var parent_categorie = $stateParams.parent;
  ShopService.getData(1, $stateParams.categorie)
  .then(function(data) {
    $scope.products = data.products;
    $scope.hideLoading();
  }, function(error) {
    $scope.notification(config.messages.server);
  });

  /* Load More Products */
  $scope.loadMorProducts = function() {
    page++;
    ShopService.getData(page, $stateParams.categorie)
    .then(function(data) {
      if(data.products.length > 0) {
        for(i=0; i<data.products.length; i++) {
          $scope.products.push(data.products[i]);
        }
      }
      else $scope.hasMoreProducts = false;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }, function(error) {
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });    
  }

  /* Refresh Products List */
  $scope.refreshProducts = function() {
    page = 1;
    $scope.hasMoreProducts = true;
    ShopService.getData(1, $stateParams.categorie)
    .then(function(data) {
      $scope.products = data.products;
      $scope.$broadcast('scroll.refreshComplete');
    }, function(error) {
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

})


.controller('ProductCtrl', function($scope, $stateParams, $ionicSlideBoxDelegate, ProductService) {
  var product_id = $stateParams.id;
  $scope.finishedLoading = false;
  $scope.showLoading();
    ProductService.getData(product_id)
    .then(function(data) {
      $scope.product = data.product;
      $scope.changePrice($scope.product);
      if($scope.product.on_sale) {
        if ($scope.product.regular_price % 1 == 0) $scope.product.regular_price = $scope.product.regular_price+'.00';
      }
      $scope.finishedLoading = true;
      $scope.hideLoading();
      $ionicSlideBoxDelegate.update();
    }, function(error) {
      $scope.notification(config.messages.server);
    });
      
     $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
       $ionicSlideBoxDelegate.update();
    });
})

.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
})
;