angular.module('introduction', []).directive("introduction",function(Service){
    return {
        templateUrl: "app/html/introduction.template.html",
        restrict: 'E',
        controller: function($scope, $element,$timeout){

        }
    };
});

