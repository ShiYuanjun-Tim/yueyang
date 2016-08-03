 var ReactDOM = require('react-dom');

 var React = require('react');

 var OfferWorkArea = React.createClass({
 	render() {
 		return ( < div > OfferWorkArea < /div>);
 	}
 });

 var OfferEditor = React.createClass({
 	render() {
 		return ( < div > OfferEditor < /div>);
 	}
 });

 var OfferHome = React.createClass({
 	render() {
 		return ( < div > OfferHome < /div>);
 	}
 });

 var Offer = React.createClass({
 	render() {
 		var  attr ={textOverflow: "ellipsis", whiteSpace: "pre-wrap", overflow: "hidden"}; 
 		var enrollBy="fsdfsfs";
 		var rank=1;
 		return ( 
 		<a href="#" className="btn btn-default truncate" className="thumbnail">
			<img src="/static/images/schools/andalue.jpg" alt=""/>
			<strong className="text-left" style={attr}>title</strong><br/>
			<small className="text-left">录取院校：{enrollBy}</small><br/>
			<small className="text-left">综合排名第{rank}位</small>
		</a>);
 	}
 });


 
 ReactDOM.render(  <Offer/>,
 	document.getElementById("reactContainer")
 );

 // document.write("sww")