angular.module('wooCommerceApp.services', [])

/*  ==== Categories Service ====
*   Return all categories
*/
.factory('CategoriesService', function($q, $http) {
    var getData = function() {
        var deferred = $q.defer();
        
        var request = generateRequest('GET', 'products/categories', false, false);
        $http.get(request, {timeout: config.timeout})
        .success(function(json){
            deferred.resolve(json);
        })
        .error(function(error){
            deferred.reject();
        })
        
        return deferred.promise;
    };
    
    return {
        getData: getData
    }
})

/*  ==== Shop Service ====
*   Return all products
*/
.factory('ShopService', function($q, $http) {
    var getData = function(page, categorie) {
        var deferred = $q.defer();
        
        if(categorie) {
            var request = generateRequest('GET', 'products', page, categorie);
            request = request + '&page='+page+'&filter[product_cat]='+encodeURIComponent(categorie);
            console.log(request);
        }
        else {
            var request = generateRequest('GET', 'products', page, false);
            request = request+'&page='+page;
        }
        $http.get(request, {timeout: config.timeout})
        .success(function(json, status, headers, config){
            //console.log(headers('Link'));
            deferred.resolve(json);
        })
        .error(function(error){
            deferred.reject();
        }) 
         
        
        return deferred.promise;
    };
    
    return {
        getData: getData
    }
})


/*  ==== Product Service ====
*   Return a product
*/
.factory('ProductService', function($q, $http) {
    var getData = function(id) {
        var deferred = $q.defer();
        
        var request = generateRequest('GET', 'products/'+id, false, false);
        $http.get(request, {timeout: config.timeout})
        .success(function(json){
            deferred.resolve(json);
        })
        .error(function(error){
            deferred.reject();
        })
        
        return deferred.promise;
    };
    
    return {
        getData: getData
    }
})

;