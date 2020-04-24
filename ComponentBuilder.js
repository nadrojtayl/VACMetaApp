import React, { Component } from "react";
import { Button, Picker, Image, ScrollView, TouchableOpacity, StyleSheet, Text, View, TextInput, Dimensions } from "react-native";


const window = {};
global.inputs = {
  0:"This"
}



  class Multiplier extends Component{
    constructor(props){
      super(props);
      this.state = {
        childrenAdditionalStyles: [],
        clickfunctions: [],
        textTreeChildren:[]
      }
    }

  renderElement(name,int, additionalStyle, clickfunctions,elem){
    var that = this;
    console.log(additionalStyle)
    
    var copy = {};
    additionalStyle.forEach(function(obj,ind){
      // console.log(obj);
      Object.keys(obj).forEach(function(key){
        console.log(key)
        if(key !== undefined && key.indexOf("repeater") !== -1){
          copy[key.replace("repeater","")] = obj[key];
        }

      })
    })
  
 
    additionalStyle = copy;
    Object.keys(additionalStyle).forEach(function(key){
      if(additionalStyle[key].indexOf('elem') !== -1){
        additionalStyle[key] = eval(additionalStyle[key])
      }
    })



    var innerText = additionalStyle.innerText;

     try {
     var evaled = eval(innerText)
     innerText= evaled;
    } catch(e){

    }



    int = parseInt(int)
    if(name === "text"){
  

      return (
        <Text
          className = "input_class"
          ref={component => this._element = component}
          defaultValue = "Heren"
          style={[{ height: 40, borderColor: 'gray', borderWidth: 1}, additionalStyle]}
          maxLength = {5}
          key = {int}
          onPress = { function(){  eval('(' + that.props.clickfunction + ')()')   } }
          textTreeNode = {this.state.textTreeChildren[int]}
          selectable = {true}
        >{  additionalStyle.innerText === undefined ? ("undefined"):additionalStyle.innerText }</Text>

        )
    }


    if(name === "button"){
      return(
       <Button
          className = "input_class"
          ref={component => this._element = component}
          onPress = { function(){  eval('(' + that.prop.clickfunction + ')()')   } }
          title = {additionalStyle['title'] === undefined ? ("undefined"):additionalStyle['title']}
          key = {int}
          textTreeNode = {this.state.textTreeChildren[int]}
          style={[{ height: 40, title:'Test', borderColor: 'gray', borderWidth: 1}, additionalStyle[int]]}
        >{ additionalStyle['innerText'] === undefined ? ("undefined"):additionalStyle['innerText'] }</Button>
      )
    }


    
  }

  goTo(pageName){
    this.setState({page:pageName, 
      children:this.state.pages[pageName].children, 
      childrenAdditionalStyles: this.state.pages[pageName].childrenAdditionalStyles,
      clickfunctions: this.state.pages[pageName].clickfunctions })
  }

  changePicker(name,ind){
    var that = this;

    var value = prompt("What value do you want to give " + name
      + "?")
    console.log(name);
    console.log("HEREN");
    console.log(that.state.selectedElemToStyle)
    if(name.indexOf("style:") !== -1){
      name = name.replace("style:","")
      if(!isNaN(parseInt(value))){
        value = parseInt(value)
      }
      

      if(parseInt(that.state.selectedElemToStyle) === -1){
        that.state.additionalStyle[name] = value
        this.setState({additionalStyle:that.state.additionalStyle})  

      } else {
        console.log("HERE2")
        this.state.childrenAdditionalStyles[that.state.selectedElemToStyle][name] = value
        console.log(this.state.childrenAdditionalStyles)
        this.setState({childrenAdditionalStyles:that.state.childrenAdditionalStyles})  
      }
      return

      
    } else {

      if(name === "onPress"){
       
        that.state.clickfunctions[that.state.selectedElemToStyle] = value;
        that.setState({clickfunctions:that.state.clickfunctions})
        return
      }

      this._element.setNativeProps({ name:value })
    }
    
  }

    render(){
      var that = this;
     
      return (<TouchableOpacity 
      style = {that.props.style}
      onPress = { function(){if(window.drag_mode){ that.setState({selectedElemToStyle:that.props.int});  return} if(window.edit_mode){ console.log("IND" + that.props.int); window.edit(that.props.int); return}  eval('(' + that.state.clickfunctions[that.props.int] + ')()'); if(that.state.clickfunctions[that.props.int].indexOf("appData") !== -1){ that.forceUpdate()}   } }

      >
        <ScrollView>
          {that.props.data.map(function(elem,ind){
          
            return that.renderElement(that.props.type,ind,that.props.style, that.props.clickfunction, elem)
          }) }
        </ScrollView>
        </TouchableOpacity>
        )
    }

  }


  class BuilderComponent extends Component {
    constructor(props){
      super(props);
      window.FrontPage = this;
      if(this.props.ischildview){
        var children = this.props.children
        var childrenAdditionalStyles = this.props.childrenAdditionalStyles
        var clickfunctions = this.props.clickfunctions
      } else {
        var children = []
        var childrenAdditionalStyles = []
        var clickfunctions = []
      }

      this.state = { 
        textTreeNode: this.props.textTreeNode === undefined ? window.dom_tree_head: this.props.textTreeNode, 
        textTreeChildren:[],
        children:children, 
        draggingObject: null,
        selectedElemToStyle:-1, 
        editmode:true, 
        additionalStyle:{},
        clickfunctions: clickfunctions,
        name: undefined,
        ischildview: false,
        pages:{
          FirstPage:{
            children:[],
            additionalStyle:{},
            childrenAdditionalStyles:[],
            clickfunctions:[]
          }
        },
        page:"FirstPage",
        childrenAdditionalStyles:childrenAdditionalStyles}
    }



   update(element,attribute,value){
    console.log("UPDATING")
    var that = this;
    var obj = {};

    that.state.children.forEach(function(child,ind){
      if(obj[child] === undefined){
        obj[child] = 0
      } else {
        obj[child] = obj[child] + 1;
      }

      console.log(child + obj[child]);

      if((child + obj[child]) === element){
        that.state.childrenAdditionalStyles[ind][attribute] = value;
        that.setState({childrenAdditionalStyles:that.state.childrenAdditionalStyles})
      }

    })

   }

   renderElement(name,int, childrenAdditionalStyles, clickfunctions){

    var that = this;
    
    int = parseInt(int)
    if(name === "text"){
      // alert("Added")
      console.log("TEXTEN");
      console.log(that.state.childrenAdditionalStyles[int])
      return (
        <Text
          className = "input_class"
          ref={component => this._element = component}
          defaultValue = "Heren"
          style={[{position:'absolute',top:0,left:0, width:"100%", backgroundColor:'white', borderColor: 'gray', borderWidth: 1}, that.state.childrenAdditionalStyles[int]]}
          maxLength = {5}
          onPress = { function(){if(window.drag_mode){console.log("CLICKED" + int); that.setState({selectedElemToStyle:int});  return} if(window.edit_mode){ console.log("IND" + int); window.edit(int); return}  eval('(' + that.state.clickfunctions[int] + ')()'); if(that.state.clickfunctions[int].indexOf("appData") !== -1){ that.forceUpdate()}   } }
          key = {int}
          textTreeNode = {this.state.textTreeChildren[int]}
          selectable = {true}
        >{  window.try_eval(that.state.childrenAdditionalStyles[int].innerText) === undefined ? ("undefined"):  window.try_eval(that.state.childrenAdditionalStyles[int].innerText) }</Text>

        )
    }

    if(name === "picker"){
      var options = that.state.childrenAdditionalStyles[int]['options'] !== undefined ? that.state.childrenAdditionalStyles[int]['options']:[];
      options = eval(options)
   
      return(
      <Picker
        selectedValue={window.appData["input" + int]}
        style = {[{height:50,width:150}, that.state.childrenAdditionalStyles[int]]}
        onValueChange = { function(value){ if(window.edit_mode){ console.log("IND" + int); window.edit(int); return}  eval('(' + that.state.clickfunctions[int] + ')()'); window.updateAppData('picker' + int, value);  if(that.state.clickfunctions[int].indexOf("appData") !== -1){ that.forceUpdate()}   } }
      >
        <Picker.Item label={"Select"} value={"Select"} />
        <Picker.Item label={"Option1"} value={"Option1"} />
        {options.map(function(option){
          return (<Picker.Item label={option} value={option} />)
        })}
      </Picker>



      )
    }

    if(name === "repeater"){
      var options = that.state.childrenAdditionalStyles[int]['options'] !== undefined ? that.state.childrenAdditionalStyles[int]['options']:["example"];
      options = eval(options)

      return(
      <Multiplier
      style = {[{alignItems:'center'}, that.state.childrenAdditionalStyles[int]]}
      type = {that.state.childrenAdditionalStyles[int]["style:repeaterType"] === undefined ? ("text"): (that.state.childrenAdditionalStyles[int]["style:repeaterType"]) }
      data = {options}
      int = {int}
      parent = {that}
      clickfunction = {that.state.clickfunctions[int]}
      >
      </Multiplier>
      )
    }

    if(name === "image"){
      var uri = that.state.childrenAdditionalStyles[int]['source'] !== undefined ? that.state.childrenAdditionalStyles[int]['source']:"https://i.imgur.com/89iERyb.png";
      return(
        <TouchableOpacity
        onPress = { function(){ if(window.edit_mode){ console.log("IND" + int); window.edit(int); return}  eval('(' + that.state.clickfunctions[int] + ')()'); if(that.state.clickfunctions[int].indexOf("appData") !== -1){ that.forceUpdate()}   } }
        >
      <Image
        style={[{ width:"50%", height:"50%"}, that.state.childrenAdditionalStyles[int]]}
        source = {{uri:uri}}
      >
      </Image>
      </TouchableOpacity>
      )
    }

    if(name === "input"){
     
      return(
      <TextInput
        style={[{position:'absolute',top:0,left:0, height: 40, borderColor: 'gray', borderWidth: 1}, that.state.childrenAdditionalStyles[int]]}
        onChangeText={function(val){window.updateAppData("input" + int,val); that.setState({children:that.state.children})}}
        value={window.appData["input" + int]}
        onFocus = {function(){ if(window.drag_mode){that.setState({selectedElemToStyle:int})} if(window.edit_mode){window.edit(int)}  } }
      />
      )
    }

    if(name === "button"){
      return(
       <TouchableOpacity
          className = "input_class"
          ref={component => this._element = component}
          onPress = { function(){ if(window.drag_mode){ that.setState({selectedElemToStyle:int});  return} if(window.edit_mode){ console.log("IND" + int); window.edit(int); return}  eval('(' + that.state.clickfunctions[int] + ')()'); if(that.state.clickfunctions[int].indexOf("appData") !== -1){ that.forceUpdate()}   } }
          key = {int}
          textTreeNode = {this.state.textTreeChildren[int]}
          style={[{position:'absolute',top:0,left:0, height: 40, title:'Test', borderColor: 'gray', borderWidth: 1}, that.state.childrenAdditionalStyles[int]]}
        ><Text> { that.state.childrenAdditionalStyles[int]['innerText'] === undefined ? ("undefined"):that.state.childrenAdditionalStyles[int]['innerText'] }</Text> 
        </TouchableOpacity>
      )
    }

    if(name === "box"){
      return (
        <TouchableOpacity
          className = "input_class"
          ref={component => this._element = component}
          onPress = { function(){ if(window.drag_mode){ that.setState({selectedElemToStyle:int});  return} if(window.edit_mode){ console.log("IND" + int); window.edit(int); return}  eval('(' + that.state.clickfunctions[int] + ')()'); if(that.state.clickfunctions[int].indexOf("appData") !== -1){ that.forceUpdate()}   } }
          key = {int}
          textTreeNode = {this.state.textTreeChildren[int]}
          style={[{zIndex:-100, position:'absolute',top:0,left:0, height: 40, width:"10%", title:'Test', borderColor: 'gray', borderWidth: 1}, that.state.childrenAdditionalStyles[int]]}
        > 
        </TouchableOpacity>

        )
    }

  }

  goTo(pageName){
    // console.
    this.setState({page:pageName, 
      children:this.state.pages[pageName].children, 
      childrenAdditionalStyles: this.state.pages[pageName].childrenAdditionalStyles,
      clickfunctions: this.state.pages[pageName].clickfunctions })
  }

  



  componentDidMount(){
    console.log(this.props)
    if(!this.props.ischildview){
      this.load();
    }
    
  }

  load(){
    
    if(this.state.name === undefined){
     
     var name = "six";    
      this.setState({name})
      var db_url = "https://streamedbooks.herokuapp.com/apps?name=" + name;
      var that = this;
       var schema = fetch(db_url, {
                  method: 'GET',
                  headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                  }
        }).then(async function(res){ 
          try {
          
            res= await res.json();
            
            if(res.length === 0){
              alert("Couldn't find your app. Please refresh the page")
              that.load();
              return
            }

            var other_pages = {} 
            var firstpagechildren;
            var firstpagestyle;
            var clickfunctions;
            


            if(res.forEach === undefined){
              if(typeof res.app_styles === "string"){
                res.childrenAdditionalStyles = JSON.parse(res.app_styles)
              }

              if(typeof res.appdata === "string"){
              
                res.appdata = JSON.parse(res.appdata);
              
              }
           

               if(typeof res.app_children === "string"){
                res.children = JSON.parse(res.app_children)
              }

              if(typeof res.clickfunctions === "string"){
                res.clickfunctions = JSON.parse(res.clickfunctions)
              }
            
               that.setState({childrenAdditionalStyles: res.childrenAdditionalStyles, clickfunctions: res.clickfunctions, children: res.children })
              return
            }

            res.forEach(function(page){


            if(typeof page.app_styles === "string"){
              page.childrenAdditionalStyles = JSON.parse(page.app_styles)
            }

            if(typeof page.clickfunctions === "string"){
                page.clickfunctions = JSON.parse(page.clickfunctions)
              }

             if(typeof page.app_children === "string"){
              page.children = JSON.parse(page.app_children)
            }

             if(typeof page.appdata === "string"){
              page.appdata = JSON.parse(page.appdata)
            }

              if(page.page === "FirstPage"){
                firstpagechildren = page.children
                firstpagestyle = page.childrenAdditionalStyles
                clickfunctions = page.clickfunctions;
                
                other_pages[page.page] = page;
               // that.setState({childrenAdditionalStyles: page.childrenAdditionalStyles, children: page.children })
              } else {
                other_pages[page.page] = page;
              } 

            })

             
      
            
              
              that.setState({pages: other_pages, clickfunctions: clickfunctions, childrenAdditionalStyles: firstpagestyle, children: firstpagechildren })
             
            
            

            } catch(e){
              
            }
           
          
        })
    }
    
    
  }





    render(){
      var that = this;
      // console.log("PAGE IS " + this.state.page);
      console.log("RERENDERED")
      // console.log(this.state.children)


      return (
        <View style = {[{height:"100%", width:"100%", paddingTop:'5%', backgroundColor:"#784423"},this.state.additionalStyle]}>
        {
          that.state.children.map(function(elem_name,index){
            return that.renderElement(elem_name, index)
          })
        }
        </View>

        )
      
    }
  }



class FrontPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {generatedElementStyleObject:{}, generatedElementType:"text", buttonTitle:""}
  }

  render() {
    var that = this;
    return (
      <View style = {{width:"100%",height:"100%"}}>

        <BuilderComponent ischildview = {false}></BuilderComponent>
      </View>
     )
  }
}


export default FrontPage;
