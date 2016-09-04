angular.module('Service', []).factory("Service",function($http){
    var host = "data/";
    return {
        getServiceFlow: function(success){
            $http( {
                url: host + "service-flow.json",
                method: "GET"
            }).success(function(data,header,config,status){
                success(data);
            })
        },
        getOfficeImgs: function(success){
            $http( {
                url: host + "office-imgs.json",
                method: "GET"
            }).success(function(data,header,config,status){
                success(data);
            })
        },
        getServiceTeamExternal: function (success) {
            $http( {
                url: host + "service-team-external.json",
                method: "GET"
            }).success(function(data,header,config,status){
                success(data);
            })
        },
        getServiceTeamInternal: function (success) {
            $http( {
                url: host + "service-team-internal.json",
                method: "GET"
            }).success(function(data,header,config,status){
                success(data);
            })
        },
        getOffers: function(success){
            $http( {
                url:   "/apis/api/offers",
                method: "GET"
            }).success(function(data,header,config,status){
                success(data);
            })
        }
    }
});