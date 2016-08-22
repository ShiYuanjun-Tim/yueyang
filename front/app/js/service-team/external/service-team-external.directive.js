angular.module('service-team-external', []).directive("serviceTeamExternal",function(Service){
    return {
        templateUrl: "app/html/service-team-external.template.html",
        restrict: 'E',
        controller: function($scope, $element,$timeout){
            Service.getServiceTeamExternal(function(data){
                $scope.positions = data.data;
                $timeout(function(){
                    var radius = $element.find("img").width()/2;
                    $scope.radius = radius;
                    var lines = data.lines;
                    var svg = d3.select($element.find("svg")[0]);
                    svg.selectAll("line")
                        .data(lines)
                        .enter()
                        .append("line")
                        .attr("x1",function(d,i){
                            var d = find(d.p1);
                            return d.x;
                        })
                        .attr("y1",function(d,i){
                            var d = find(d.p1);
                            return d.y;
                        }).attr("x2",function(d,i){
                            var d = find(d.p2);
                            return d.x;
                        })
                        .attr("y2",function(d,i){
                            var d = find(d.p2);
                            return d.y;
                        })
                        .style("stroke","#fc7856")
                        .style("stroke-width",2);
                },100);
                function find(id){
                    var ret;
                    $scope.positions.forEach(function(p){
                        if(p.id === id){
                            ret = p;
                            return false;
                        }
                    });
                    return ret;
                }
            });
            /* $scope.test = function(){
             var imgs = $element.find("img");
             var arr = [];
             imgs.each(function(){
             var p = angular.element(this).position();
             console.debug('"x"'+': '+(p.left)+','+'"y"'+':'+ (p.top)+'');
             });
             };
             var start = {};
             var drag = d3.behavior.drag().on("drag", dragmove);
             function dragmove(d) {
             var p = angular.element(this).position();
             d3.select(this)
             .style("left", (p.left+d3.event.dx)+"px")
             .style("top", (p.top+d3.event.dy)+"px");
             }
             setTimeout(function(){
             d3.selectAll("img").call(drag);
             },100);;*/
        }
    };
});
