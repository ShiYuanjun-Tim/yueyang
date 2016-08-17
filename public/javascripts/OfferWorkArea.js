var React = require('react');
var Pubsub=require("pubsub-js");
var jq=require("jquery");

const OPERATION={
	"INSERT":0,
	"DELETE":1,
	"UPDATE":3
}

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
  	editorDone(operation,offer){
  		var newList ;
  		switch(operation){
  			case OPERATION.INSERT:
  				newList= [offer,...this.state.offers];
  				break;
  			case OPERATION.DELETE:
  				var ind =this.state.offers.findIndex((ele)=>offer.id===ele.id);
  				newList = [...this.state.offers]; 
  				newList.splice(ind,1);
  				break;
  			case OPERATION.UPDATE:
  				var ind =this.state.offers.findIndex((ele)=>offer.id===ele.id);
  				newList = [...this.state.offers]; 
  				newList.splice(ind,1,offer);
  				break;
  		}
  		
  		this.setState({offers:newList})
  	},
 	render() {
 		 

 		return ( 
 		<div className="row"> 
 			<div className="col-md-12">
 				<OfferEditor  update={this.editorDone}   /> 	
 			</div>
 			<div className="col-md-12">
 				<OfferHome offers={this.state.offers}  />
 			</div>
 		 </div>
 		 );
 	}
 });

 var OfferEditor = React.createClass({
 	getInitialState() {
	    return {
		 	          enrollBySchool:this.props.enrollBySchool ||"",
		 	          rank: this.props.rank||0,
		 	          title: this.props.title||"",
		 	          image:this.props.image ||"",
		 	          id:null
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
	schoolChange(path){
		this.setState({image:path})
	},
 	update(){
 		jq.when( jq.post( "/admin/api/offer/update",this.state ) ).then( ( data, textStatus, jqXHR )=> {
		   this.props.update(OPERATION.UPDATE,data)
		});
 	},
 	remove(){
 		jq.when( jq.ajax( "/admin/api/offer/delete/"+this.state.id ) ).then( ( data, textStatus, jqXHR )=> {
		  console.log(data,"delete")
		  // the delete result is a array
 		  this.props.update(OPERATION.DELETE,data[0])
		});
 	},
 	insert(){
 		var {id,...data} = this.state;
 		jq.when( jq.post( "/admin/api/offer/new",data ) ).then(( data, textStatus, jqXHR )=>{
		   console.log(data,"insert");
		   this.props.update(OPERATION.INSERT,data)
		});
 	},

 	render() {
 		var margin={marginRight:25}
 		return (
 			<div className="row">
	 			<div className="col-md-6">
	 				<form className="form-horizontal ">
	 					  <div className="form-group">
	 					  	<label className=" control-label ">Title</label>
							  <input  className="form-control  " type="text" onChange={this.handleChange}   data-prop="title"  value={this.state.title}/>
						</div>	
						<div className="form-group">
						  	<label className=" control-label ">School </label>
							  <input  className="form-control  " type="text"  onChange={this.handleChange}  data-prop="enrollBySchool" value={this.state.enrollBySchool}/>
						</div>
						 
						<div className="form-group">
					 		 <label className=" control-label ">Rank</label>
							  <input   className="form-control  " type="number"  onChange={this.handleChange} data-prop="rank" value={this.state.rank} />
						</div>	 	
						<div className="form-group">
						    	<label className=" control-label "  >School</label>
							<SchoolSelect selected={this.state.image} onChange={this.schoolChange}/>
						</div>	 
					</form>
					 
					
					<div>
							<input className="btn btn-primary" type="button" value="New Offer" style={margin} onClick={this.insert}/> 
			 				<input className="btn btn-danger" type="button" value="Delete Offer" style={margin} onClick={this.remove}/> 
			 				<input className="btn btn-warning" type="button" value="Update Offer"  style={margin} onClick={this.update}/>
					</div>

				</div>

	 			<div className="col-md-2">
	 				
 				</div>
	 			<div className="col-md-3">
	 				<h3 className="text-center">Preview</h3>
	 				<Offer {...this.state}/>
 				</div>
 			 	
 			</div>
 			
 			);
 	}
 });
 

var SchoolSelect = React.createClass({
	imgs:[],
	getDefaultProps() {
		return {selected:"/img/case.jpg"};
	},
	componentDidMount() {
		  jq.get("/admin/api/schoolImgs").done((data)=>{
	  		console.log(data);
	  		this.imgs=data;
	  		
  		});  
	},

	onchange(e){

		this.props.onChange&&this.props.onChange(e.target.value);
	},
	render() {
		var options=[];
		this.imgs.forEach((img)=>{
			options.push(<option key={img.id} value={img.path}>{img.name}</option>)
		});
		return (
			 <select className="form-control" value={this.props.selected}  onChange={this.onchange}>
			 <option value="/img/case.jpg">Default</option>
			 {options}
			 </select>
		);
	}
});



 /* 
 	subscribe: offer.select -> let outside know one Offer is selected  
	subscribe: offer.noSelect -> no offer is slected pass the last one

 */
 var OfferHome = React.createClass({
 	getDefaultProps() {
 	    return {
 	          offers:[]
 	    };
 	},
 	onSelect(offerDom,data){
 		if(this.selected  ){
 			if(this.selected==offerDom){//unselected
 				this.selected=null;
 				Pubsub.publish("offer.noSelect",data);
 			}else{//change seleceted
 				this.selected.reset();
 				this.selected = offerDom;
 			}
 		}else{//new selected
 			this.selected = offerDom;
 		}
 		// notify others data
	  	this.selected!=null&&Pubsub.publish("offer.select",data);
 	},
 	render() {
 		var offerTobeAdd=[];
 		var handler=this.onSelect;
		this.props.offers.forEach(function(offer){
			offerTobeAdd.push(<div key={offer.id} className="col-md-2"><Offer {...offer }  onSelect={handler}/></div>);
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
		 	 image:"/img/case.jpg"
		 };

/*
 event:  onSelect(Offer)
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
	  	var offer=//this.props.offer;
	  	{
	  		title:this.props.title,
	  		enrollBySchool:this.props.enrollBySchool,
			rank:this.props.rank,
			image:this.props.image,
			id:this.props.id
	  	};
	  	// change css
	  	var newState=!this.state.selected;
	  	this.setState( {selected:newState});
	  	//let owner contro
	  	newState&&this.props.onSelect&&this.props.onSelect(this,offer);

	  },
	  reset(){
	  		this.setState( {selected:false});
	  },
 	render() {
 		var  attr ={textOverflow: "ellipsis", whiteSpace: "pre-wrap", overflow: "hidden"}; 
 		var style=this.state.selected?{backgroundColor:"#c3b3d9"}:{};
 		return ( 
 		<a href="#" className="btn btn-default truncate" className="thumbnail " style={style}  onClick={this.handleClick}>
			<img src={this.props.image} alt=""/>
			<strong className="text-left" style={attr}>{this.props.title}</strong><br/>
			<small className="text-left">录取院校：{this.props.enrollBySchool}</small><br/>
			<small className="text-left">综合排名第{this.props.rank}位</small>
		</a>);
 	}
 });
 

 module.exports=OfferWorkArea;

 