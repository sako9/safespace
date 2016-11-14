angular.module('UserService', []).factory('User', ['$http', function($http) {
    return {
        get : function(){
            return $http.get('/api/users')
        },
        create : function(data){
            return $http.post('/api/user', data);
        },
        delete: function(id){
            return $http.delete('/api/user/' + id);
        },
        login: function(data){
            return $http.post('/api/login', data);
        }
    }
}]);