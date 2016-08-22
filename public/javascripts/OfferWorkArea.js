import React from "react";
import Pubsub from "pubsub-js";
import jq from "jquery";

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
  	    	//console.log(data);
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
	    return {		msg:"",
		 	          originalSchool:this.props.originalSchool ||"",
		 	          rank: this.props.rank||0,
		 	          major:this.props.major||"",
		 	          name: this.props.name||"",
		 	          schoolImage:this.props.schoolImage ||"",
		 	          id:null
		 	   }
	},
	 componentWillMount() {
	       this.selectToken=Pubsub.subscribe("offer.select",(topic,offer)=>{
	       	//console.log(offer)
	       	this.setState(offer);
	       }); 
	       this.noSelectToken=Pubsub.subscribe("offer.noSelect",(topic,offer)=>{
	       	//console.log(offer)
	       	this.resetForm();
	       });
	 },
	 componentWillUnmount() {
	       Pubsub.unsubscribe(  this.selectToken);
	       Pubsub.unsubscribe(  this.noSelectToken);
	 }, 
	 resetForm(){
	 	this.setState({
		 	          originalSchool:"",
		 	          rank:  0,
		 	          major: "",
		 	          name:  "",
		 	          schoolImage:"",
		 	          id:null
		 	   });
	 },
	handleChange(e){
		var state={};
		state[e.target.dataset.prop]=e.target.value;
		this.setState(state)
	},
	schoolChange(img){
		this.setState({schoolImage:img.path,originalSchool:img.name})
	},
 	update(){
 		if(!this.state.id){
 			this.info("Please selected a Offer ,before you  Update");
 			return;
 		}
 		jq.when( jq.post( "/admin/api/offer/update",this.state ) ).then( ( data, textStatus, jqXHR )=> {
		   this.props.update(OPERATION.UPDATE,data);
		});
 	},
 	remove(){
 		if(!this.state.id){
 			this.info("Please selected a Offer to delete");
 			return;
 		}
 		jq.when( jq.ajax( "/admin/api/offer/delete/"+this.state.id ) ).then( ( data, textStatus, jqXHR )=> {
		  //console.log(data,"delete")
		  // the delete result is a array
 		  this.props.update(OPERATION.DELETE,data[0])
 		   this.resetForm();
		});
 	},
 	insert(){
 		var {id,...data} = this.state;
 		jq.when( jq.post( "/admin/api/offer/new",data ) ).then(( data, textStatus, jqXHR )=>{
		   //console.log(data,"insert");
		   this.props.update(OPERATION.INSERT,data)
		});
 	},
 	info(msg){
 		this.timeoutFlag&&window.clearTimeout(this.timeoutFlag);
 		this.setState({msg:msg});
 		this.timeoutFlag = window.setTimeout(()=> {
 			this.setState({msg:""});
 			window.clearTimeout(this.timeoutFlag);
 		}, 3000);
 	},
 	render() {
 		var margin={marginRight:25}
 		return (
 			<div className="row">
	 			<div className="col-md-6">
	 				<p className="bg-info text-danger">{this.state.msg}</p>
	 				<form className="form-horizontal ">
	 					  <div className="form-group">
	 					  	<label className=" control-label ">Name</label>
							  <input  className="form-control  " type="text" onChange={this.handleChange}   data-prop="name"  value={this.state.name}/>
						</div>	
						{/*<div className="form-group">
						  	<label className=" control-label ">School </label>
							  <input  className="form-control  " type="text"  onChange={this.handleChange}  data-prop="originalSchool" value={this.state.originalSchool}/>
						</div>
						 
						<div className="form-group">
					 		 <label className=" control-label ">Rank</label>
							  <input   className="form-control  " type="number"  onChange={this.handleChange} data-prop="rank" value={this.state.rank} />
						</div>	 	*/}
						<div className="form-group">
							<label className=" control-label "  >School</label>
							<SchoolSelect selected={this.state.schoolImage} onChange={this.schoolChange}/>
						</div>	
						<div className="form-group">
							<label className=" control-label "  >Major</label>
							<input  className="form-control  " type="text"  onChange={this.handleChange} data-prop="major" value={this.state.major}/>
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
	  		//console.log(data);
	  		this.imgs=data;
	  		
  		});  
	},

	onchange(e){
		var id = e.target.selectedOptions[0].dataset.id;
		var img = this.imgs.find((ele)=>{
			return ele.id===id
		});
		this.props.onChange&&this.props.onChange(img);
	},
	render() {
		var options=[];
		this.imgs.forEach((img,index)=>{
			options.push(<option key={img.id} value={img.path} data-id={img.id}>{img.name}</option>)
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
		 	 originalSchool:"  School Name",
		 	 rank:0,
		 	 name:"i was luky !!! ",
		 	 major:"CODING",
		 	 schoolImage:"/img/case.jpg"
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
	  		name:this.props.name,
	  		originalSchool:this.props.originalSchool,
			rank:this.props.rank,
			major:this.props.major,
			schoolImage:this.props.schoolImage,
			id:this.props.id
	  	};
	  	// change css
	  	var newState=!this.state.selected;
	  	this.setState( {selected:newState});
	  	//let owner contro
	  	this.props.onSelect&&this.props.onSelect(this,offer);

	},
	reset(){
			this.setState( {selected:false});
	},
 	render() {
 		var  attr ={textOverflow: "ellipsis", whiteSpace: "pre-wrap", overflow: "hidden"}; 
 		var style=this.state.selected?{backgroundColor:"#c3b3d9"}:{};
 		return ( 
 		<a href="#" className="btn btn-default truncate" className="thumbnail " style={style}  onClick={this.handleClick}>
			<img src={this.props.schoolImage} alt=""/>
			<strong className="text-left" style={attr}>{this.props.name}</strong><br/>
			<small className="text-left">录取院校：{this.props.originalSchool}</small><br/>
			{/*<small className="text-left">综合排名第{this.props.rank}位</small>*/}
			<small className="text-left">录取专业 : {this.props.major}</small>
		</a>);
 	}
 });
 

 export default OfferWorkArea;