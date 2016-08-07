 var ReactDOM = require('react-dom');
 var React = require('react');
var Pubsub=require("pubsub-js");
var jq=require("jquery");
 var OfferWorkArea = React.createClass({
 	getInitialState() {
 	    return   { offers:[]}; 
 	},
  	componentDidMount() {
  	    jq.get("/admin/api/offers").done((data)=>{
  	    	console.log(data);
  	    	this.setState({offers:data})
  	    });  
  	},
  
 	render() {
 		 

 		return ( 
 		< div className="row"> 
 			<div className="col-md-12">
 				<OfferEditor    /> 	
 			</div>
 			<div className="col-md-12">
 				<OfferHome offers={this.state.offers}  />
 			</div>
 		 < /div>
 		 );
 	}
 });

 var OfferEditor = React.createClass({
 	getInitialState() {
	    return {
		 	          enrollBySchool:this.props.enrollBySchool ||"",
		 	          rank: this.props.rank||0,
		 	          title: this.props.title||"",
		 	          image:this.props.image ||""
		 	   }
	},
	 componentWillMount() {
	       this.pubsub_token=Pubsub.subscribe("offer.select",(topic,offer)=>{
	       	console.log(offer)
	       	this.setState(offer);
	       });
	 },
	 componentWillUnmount() {
	       Pubsub.unsubscribe(  this.pubsub_token);
	 }, 
	handleChange(e){
		var state={};
		state[e.target.dataset.prop]=e.target.value;
		this.setState(state)
	},
 
 	render() {
 		return (
 			<div className="row">
	 			<div className="col-md-5">
	 				<form className="form-horizontal ">
	 					  <div className="form-group">
	 					  	<label className=" control-label ">Title</label>
							  <input  className="form-control col-md-9" type="text" onChange={this.handleChange}   data-prop="title"  value={this.state.title}/>
						</div>	
						<div className="form-group">
						  	<label className=" control-label ">School </label>
							  <input  className="form-control col-md-9" type="text"  onChange={this.handleChange}  data-prop="enrollBySchool" value={this.state.enrollBySchool}/>
						</div>	
						<div className="form-group">
						 	 <label className=" control-label ">Rank</label>
							  <input  className="form-control col-md-9" type="number"  onChange={this.handleChange} data-prop="rank" value={this.state.rank} />
						</div>	
						<div className="form-group">
						    	<label className=" control-label ">Image</label>
							 <input  className="form-control col-md-9" type="text"  onChange={this.handleChange} data-prop="image" value={this.state.image}/>
						</div>	
					</form>
	 			</div>
	 			<div className="col-md-3">
	 				 
 				</div>
	 			<div className="col-md-3">
	 				<h3 className="text-center">Preview</h3>
	 				<Offer {...this.state}/>
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
 	onSelect(offerObj){
 		if(this.selected  ){
 			if(this.selected==offerObj){
 				this.selected=null;
 			}else{
 				this.selected.reset();
 				this.selected = offerObj;
 			}
 		}else{
 			this.selected = offerObj;
 		}
 	},
 	render() {
 		var offerTobeAdd=[];
 		var handler=this.onSelect;
		this.props.offers.forEach(function(offer){
			offerTobeAdd.push(<div key={offer.id} className="col-md-2"><Offer   {...offer}  onSelect={handler}/></div>);
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
const DEFAULT_OFFER={
		 	 enrollBySchool:"  School Name",
		 	 rank:0,
		 	 title:"i was luky !!! ",
		 	 image:"/static/images/schools/andalue.jpg"
		 };

/*
 event:  onSelect(Offer)

 subscribe: offer.select
 */
 var Offer = React.createClass({
 	getInitialState() {
 	    return {
 	        selected:false  
 	    };
 	}, 
 	// getDefaultProps() {
		//  return  DEFAULT_OFFER;
	 //  },
	  handleClick(){
	  	var offer={
	  		title:this.props.title,
	  		enrollBySchool:this.props.enrollBySchool,
			rank:this.props.rank,
			image:this.props.image
	  	};
	  	// notify others data
	  	Pubsub.publish("offer.select",offer);
	  	// change css
	  	var newState=!this.state.selected;
	  	this.setState( {selected:newState});
	  	//let owner contro
	  	newState&&this.props.onSelect&&this.props.onSelect(this);

	  },
	  reset(){
	  		this.setState( {selected:false});
	  },
 	render() {
 		var  attr ={textOverflow: "ellipsis", whiteSpace: "pre-wrap", overflow: "hidden"}; 
 		var style=this.state.selected?{backgroundColor:"#34ec06"}:{};
 		return ( 
 		<a href="#" className="btn btn-default truncate" className="thumbnail " style={style}  onClick={this.handleClick}>
			<img src={this.props.image} alt=""/>
			<strong className="text-left" style={attr}>{this.props.title}</strong><br/>
			<small className="text-left">录取院校：{this.props.enrollBySchool}</small><br/>
			<small className="text-left">综合排名第{this.props.rank}位</small>
		</a>);
 	}
 });
 

 
 
 ReactDOM.render(  <OfferWorkArea/>,
 	document.getElementById("reactContainer")
 );

  // document.write("sww")