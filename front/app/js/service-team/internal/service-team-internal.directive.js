angular.module('service-team-internal', []).directive("serviceTeamInternal",function(Service){
    return {
        templateUrl: "app/html/service-team-internal.template.html",
        restrict: 'E',
        controller: function($scope, $element,$timeout){
            Service.getServiceTeamInternal(function(data){
                $scope.datas = data.data;
            });
        }
    };
});

