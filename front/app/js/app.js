angular.module('app', [
    'pascalprecht.translate',
    'introduction',
    'office',
    'service-flow',
    'service-team',
    'succeed-case',
    'popover',
    'Utils',
    'Service'
]).config(function ($translateProvider) {
    var lang = window.localStorage.lang || 'en';
    $translateProvider.preferredLanguage(lang);
    $translateProvider.useStaticFilesLoader({
        prefix: '/i18n/',
        suffix: '.json'
    });
}).controller("MainCtrl",function($scope,$window){
    $scope.navTo = function(target){
        var targetEle = angular.element(target);
        var top = targetEle.offset().top;
        $window.scrollTo(0,top-angular.element("nav").height());
    };
    $scope.isCurrent = function(target){
        var scrollTop = window.scrollY + window.screen.height/2 - 100;
        var navHeight = 70;
        if(target){
            var targetEle = angular.element(target);
            var top = targetEle.offset().top;
            var h = height(targetEle);
            if(scrollTop >= top - navHeight && scrollTop <= top + h - navHeight){
                return true;
            }
        }
    };

    function height(targetEle){
        var children = targetEle.children();
        var h = 0;
        for(var i= 0,len=children.length;i<len;i++){
            var _h = children.eq(i).outerHeight();
            if(!_h){
                _h = children.eq(i).children().outerHeight();
            }
            h+=_h;
        }
        return h;
    }
    angular.element(document).on("mousewheel",function(){
        $scope.$apply();
    });
});