angular.module('Utils', []).factory("Utils",function(){
    function Process(fn){
        this.fn = fn;
    }
    Process.prototype = {
        run: function(){
            var me = this;
            this._timeout = setTimeout(function(){
                if(me.fn()){
                    clearTimeout(me._timeout);
                    delete me._timeout;
                }else{
                    me.run();
                }
            },100);
        },
        isRunning: function(){
            return !!this._timeout;
        },
        reset: function(fn){
            var me = this;
            clearTimeout(me._timeout);
            delete me._timeout;
            this.fn = fn;
        }
    };
    return {
        getProcess: function (fn) {
            return new Process(fn);
        }
    }
});