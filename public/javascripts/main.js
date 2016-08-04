 var ReactDOM = require('react-dom');
 var React = require('react');

 var OfferWorkArea = React.createClass({
 	render() {
 		var offers=[{
		 	          title:"i Test  ",    
		 	    },{
		 	          rank:1,
		 	          title:"iAMAZIING ",
		 	    },{
		 	          title:"i Test 1 ",    
		 	    },{
		 	          title:"i Test 2 ",    
		 	    },{
		 	          title:"i Test3  ",    
		 	    }];
		  

 		return ( 
 		< div className="row"> 
 			<div className="col-md-12">
 				<OfferEditor/>	
 			</div>
 			<div className="col-md-12">
 				<OfferHome offers={offers}/>
 			</div>
 		 < /div>
 		 );
 	}
 });

 var OfferEditor = React.createClass({
 	render() {
 		return (
 			<div className="row">
	 			<div className="col-md-8">
	 				<form>
					  <input type="text" placeholder="The School Name..." /><br/>
					  <input type="text" placeholder="The School Name..." /><br/>
					  <input type="text" placeholder="The School Name..." /><br/>
					  <input type="text" placeholder="The School Name..." />
				</form>
	 			</div>
	 			<div className="col-md-3">
	 				<StatefulOffer/>
 				</div>
 			 	
 			</div>
 			
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
			offerTobeAdd.push(<div className="col-md-2"><Offer  {...offer}/></div>);
		});		
 		return ( 
 			< div className="row"> 
 				<h3> All Offers List :</h3>
 			 	{offerTobeAdd}
 			 < /div>
 			 );
 	}
 });

/*this is a static Offer without state, all input data is from props (refer to getDefaultProps) */
const DEFAULT_PROP={
		 	 enrollBySchool:"The School Name",
		 	 rank:0,
		 	 title:"i was luky to enter this school ",
		 	 image:"/static/images/schools/andalue.jpg"
		 };

 var Offer = React.createClass({
 	getDefaultProps() {
		 return DEFAULT_PROP;
	  },
 	render() {
 		var  attr ={textOverflow: "ellipsis", whiteSpace: "pre-wrap", overflow: "hidden"}; 
 		return ( 
 		<a href="#" className="btn btn-default truncate" className="thumbnail">
			<img src={this.props.image} alt=""/>
			<strong className="text-left" style={attr}>{this.props.title}</strong><br/>
			<small className="text-left">录取院校：{this.props.enrollBySchool}</small><br/>
			<small className="text-left">综合排名第{this.props.rank}位</small>
		</a>);
 	}
 });

var  StatefulOffer  = React.createClass({
	getInitialState() {
	    return {
		 	          enrollBySchool:this.props.enrollBySchool ,
		 	          rank: this.props.rank,
		 	          title: this.props.title,
		 	          image:this.props.image 
		 	   }
	},
	render() {
		return (
			<Offer  {...this.state}/>
		);
	}
});

 
 
 ReactDOM.render(  <OfferWorkArea/>,
 	document.getElementById("reactContainer")
 );

  // document.write("sww")