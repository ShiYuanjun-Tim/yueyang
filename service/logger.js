var bunyan = require('bunyan');
var env = require('get-env')({
	  dev:["dev","development"],
	  prod: ['prod', 'production']
});

var option={
        name:'yueyang', 
};

if("prod"==env){
	option["streams"] = [
	       	{
		      level: 'info',
		      path: 'prod.log'  // log ERROR and above to a file
		    }
	        ];
 
}else{
	option.stream=process.stdout,
        	option.level='debug'
}
/*
 log has following methods

        log.trace('this one does not emit');
        log.debug('hi on debug');   // console.log
        log.info('hi on info');     // console.info
        log.warn('hi on warn');     // console.warn
        log.error('hi on error');   // console.error
*/
var log=bunyan.createLogger(option);

module.exports=log