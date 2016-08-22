angular.module('service-flow', []).directive("serviceFlow",function(Service){
    return {
        templateUrl: "app/html/service-flow.template.html",
        restrict: 'E',
        controller: function($scope, $element,$timeout){
            var CONFIG = {
                MARGIN_TOP: 10,
                MARGIN_BOTTOM: 10,
                POLYGON_WIDTH: 280,
                POLYGON_HEIGHT: 60,
                ARROW_LENGTH: 50,
                ARROW_HEIGHT: 12
            };
            var svg = d3.select($element.find("svg")[0]);
            var total_width = $element.find("svg").width();
            var ploygon_start_x = (total_width - CONFIG.POLYGON_WIDTH)/2;
            var current_y = CONFIG.MARGIN_TOP;
            Service.getServiceFlow(function(data){
                var flows = data.data;
                flows.forEach(function(f,index){
                    var flowsDatas = [[ploygon_start_x,current_y],
                        [ploygon_start_x+CONFIG.POLYGON_WIDTH,current_y],
                        [ploygon_start_x+CONFIG.POLYGON_WIDTH,current_y+CONFIG.POLYGON_HEIGHT],
                        [ploygon_start_x,current_y+CONFIG.POLYGON_HEIGHT]];
                    var polygon = d3.geom.polygon(flowsDatas);
                    svg.append("path").datum(polygon)
                        .attr("d",function(d){
                            return "M"+ d.join(" L")+"Z";
                        })
                        .attr("fill","none")
                        .attr("stroke","#666")
                        .attr("stroke-width","2");
                    var textEle = angular.element("<div class='text-wrapper'>"+ f.text+"</div>");
                    $element.find("svg").parent().append(textEle);
                    textEle.width(CONFIG.POLYGON_WIDTH);
                    textEle.height(CONFIG.POLYGON_HEIGHT);
                    textEle.css("left",ploygon_start_x+"px");
                    textEle.css("top",current_y+"px");
                    textEle.css("line-height",CONFIG.POLYGON_HEIGHT+"px");
                    if(index === flows.length-1){
                        return;
                    }
                    svg.append("line")
                        .attr("x1",total_width/2)
                        .attr("y1",current_y+CONFIG.POLYGON_HEIGHT)
                        .attr("x2",total_width/2)
                        .attr("y2",current_y+CONFIG.POLYGON_HEIGHT+CONFIG.ARROW_LENGTH-CONFIG.ARROW_HEIGHT/2-2)
                        .attr("marker-end","url(#arrow)")
                        .style("stroke","#666")
                        .style("stroke-width",2);
                    current_y = current_y + CONFIG.POLYGON_HEIGHT + CONFIG.ARROW_LENGTH;
                });
                svg.attr("height",current_y+CONFIG.MARGIN_BOTTOM+CONFIG.POLYGON_HEIGHT);
            });
        }
    };
});