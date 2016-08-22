angular.module('popover', []).directive("popover",function(){
    return {
        restrict: 'A',
        scope: {
            tipContent: "=",
            tipTitle:"="
        },
        controller: function($scope, $element,$compile){
            var tip
            var inited = false;
            function init(){
                var position = $element.offset();
                var left = position.left;
                var right = angular.element(document.body).width() - (position.left + $element.width());
                var placement;
                var arrowPos = {};
                var pos =  $element.position();
                var tipTemplate =
                    '<div class="popover fade">'+
                    '<div class="arrow"></div>'+
                    '<h3 class="popover-title">'+$scope.tipTitle+'</h3>'+
                    '<div class="popover-content">'+$scope.tipContent+'</div>'+
                    '</div>';
                tip = $compile(tipTemplate)($scope);
                tip.appendTo($element.parent());
                tip.show();
                var arrow = tip.find(".arrow");
                var delta = {
                    top: 0,
                    left: 0
                };
                if(Math.abs(left-right) < 150){
                    placement = "bottom";
                    delta.top = $element.outerHeight();
                    arrowPos.left = "50%";
                    delta.left = (($element.outerWidth() - tip.outerWidth()) / 2);
                }else if(left > right){
                    placement = "left";
                    arrowPos.top = "50%";
                    delta.left = -(tip.outerWidth());
                    delta.top = ($element.outerHeight() - tip.outerHeight())/2;
                }else{
                    placement = "right";
                    arrowPos.top = "50%";
                    delta.left = $element.outerWidth();
                    delta.top = ($element.outerHeight() - tip.outerHeight())/2;
                }
                tip.on("click",function(e){
                    e.stopPropagation();
                });
                tip.addClass(placement);
                tip.css({
                    top: (pos.top+delta.top)+'px',
                    left: (pos.left+delta.left)+'px'
                });
                arrow.css(arrowPos);
                inited = true;
            };
            var isShown = false;
            $element.on("click",function(e){
                if(!inited){
                    init();
                }
                tip.removeClass("out");
                tip.addClass("in");
                tip.show();
                e.stopPropagation();
            });
            $element.on("mouseover",function(){
                if(!inited){
                    init();
                }
                tip.removeClass("out");
                tip.addClass("in");
                tip.show();
            });
            $element.on("mouseleave",function(){
                tip.removeClass("in");
                tip.addClass("out");
                tip.hide();
            });
            $scope.$on("$destroy",function(){

            })
        }
    };
});

