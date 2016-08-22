angular.module('service-team', ['service-team-internal','service-team-external']).directive("serviceTeam",function(){
    return {
        templateUrl: "app/html/service-team.template.html",
        restrict: 'E',
        controller: function($scope, $element,$timeout){

        }
    };
});