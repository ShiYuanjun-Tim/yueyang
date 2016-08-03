 var ReactDOM = require('react-dom');
 var React = require('react');

 var OfferWorkArea = React.createClass({
 	render() {
 		var offers=[{
		 	          title:"i Test  ",    
		 	    },{
		 	          rank:1,
		 	          title:"iAMAZIING ",
		 	    }];
 		return ( 
 		< div > 
 			<OfferEditor/>
 			<OfferHome offers={offers}/>
 		 < /div>
 		 );
 	}
 });

 var OfferEditor = React.createClass({
 	render() {
 		return (
 			<form>
			  <input type="text" placeholder="The School Name..." />
			   
			</form>
 			);
 	}
 });

 var OfferHome = React.createClass({
 	getDefaultProps() {
 	    return {
 	          offers:[]
 	    };
 	},

 	render() {
 		var offerTobeAdd=[];
		this.props.offers.forEach(function(offer){
			offerTobeAdd.push(<Offer  {...offer}/>);
		});		
 		return ( 
 			< div > 
 				<h3> All Offers List :</h3>
 			 	{offerTobeAdd}
 			 < /div>
 			 );
 	}
 });

 var Offer = React.createClass({
 	getDefaultProps() {
		 return {
		 	 enrollBySchool:"The School Name",
		 	 rank:0,
		 	 title:"i was luky to enter this school ",
		 	 image:"/static/images/schools/andalue.jpg"
		 };
	  },
 	render() {
 		var  attr ={textOverflow: "ellipsis", whiteSpace: "pre-wrap", overflow: "hidden"}; 
 		var enrollBy="fsdfsfs";
 		var rank=1;
 		return ( 
 		<a href="#" className="btn btn-default truncate" className="thumbnail">
			<img src={this.props.image} alt=""/>
			<strong className="text-left" style={attr}>{this.props.title}</strong><br/>
			<small className="text-left">录取院校：{this.props.enrollBySchool}</small><br/>
			<small className="text-left">综合排名第{this.props.rank}位</small>
		</a>);
 	}
 });


var aOffer={
		 	          enrollBySchool:"The School Name",
		 	          rank:0,
		 	          title:"i was luky to enter this school ",
		 	          image:"/static/images/schools/andalue.jpg"
		 	    }
 
 ReactDOM.render(  <OfferWorkArea/>,
 	document.getElementById("reactContainer")
 );

  // document.write("sww")