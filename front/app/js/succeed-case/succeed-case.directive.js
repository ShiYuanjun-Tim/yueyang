(function(){
    return angular.module('succeed-case', []).directive("succeedCase",function(Service){
        return {
            templateUrl: "app/html/succeed-case.template.html",
            restrict: 'E',
            controller: function($scope, $element,$timeout){
                Service.getOffers(function(data){
                    console.log(data);
                    var MINQTY = 10;
                    var arr = [];
                    var datas = data.data;
                    datas.forEach(function(item){
                        var student = {
                            name: item.name,
                            scores: item.scores
                        };
                        item.schools.forEach(function(school){
                            arr.push(angular.extend({},student,{school: school}));
                        });
                    });

                    // var datas=data;
                    //  datas.forEach(function(item){
                    //     item.school = {
                    //         "name":  item.originalSchool,
                    //           "imgUrl": item.schoolImage,
                    //           "major": item.major
                    //     }
                    //         arr.push(item);
                    //     }
                        
                    // });


                    if(arr.lenggth <= MINQTY){
                        $scope.offersArr = [arr];
                    }else{
                        $scope.offersArr = [arr.slice(0,6),arr.slice(6,arr.length)];
                    }
                    $timeout(function(){
                        $element.find(".flipster").flipster({
                            style: 'carousel',
                            start: 0
                        });
                    },100);
                });
            }
        };
    });
})()

