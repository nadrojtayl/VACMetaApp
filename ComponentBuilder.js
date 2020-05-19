import React, { Component } from "react";
import { Button, Picker, Image, ScrollView, TouchableOpacity, StyleSheet, Text, View, TextInput, Dimensions } from "react-native";


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
global.inputs = {
  0:"This"
}

window = global;

function try_eval(input){
 
    try {
      var output =  eval(input);
      return output
    } catch(e){
      return input;
    }
}



window.appData = {};
global.updateAppData = function(name,val){
  window.appData[name] = val;
}

global.edit_mode = false;
global.drag_mode = false;
global.try_eval = function(input){
        try {
          var output =  eval(input);
          return output
        } catch(e){
          return undefined;

        }
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
    
    var copy = {};
    additionalStyle.forEach(function(obj,ind){
      Object.keys(obj).forEach(function(key){
        if(key !== undefined && key.indexOf("repeater") !== -1){
          copy[key.replace("repeater","")] = obj[key];
        }

      })
    })
  
 
    additionalStyle = copy;
    Object.keys(additionalStyle).forEach(function(key){
      if(typeof additionalStyle[key] === "string" && additionalStyle[key].indexOf('elem') !== -1){
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
     
          ref={component => this._element = component}
       
          style={[{ height: 40, borderColor: 'gray', borderWidth: 1}, additionalStyle]}
          maxLength = {5}
          key = {int}
          onPress = { function(){  eval('(' + that.props.clickfunction + ')()')   } }
          textTreeNode = {this.state.textTreeChildren[int]}
          selectable = {true}
        >{  additionalStyle.innerText === undefined ? elem:additionalStyle.innerText }</Text>

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

    if(name === "image"){
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
    var that = this;
    this.setState({page: pageName, 
      children:that.state.pages[pageName].children, 
      childrenAdditionalStyles: that.state.pages[pageName].childrenAdditionalStyles,
      clickfunctions: that.state.pages[pageName].clickfunctions })
  }



    render(){
      var that = this;

      if(!window.edit_mode){
        return (<View
      style = {that.props.style}
     
      >
        <ScrollView>
          <View >
          {that.props.data.map(function(elem,ind){
       
            return that.renderElement(that.props.type,ind,that.props.style, that.props.clickfunction, elem)
          }) }
          </View>
        </ScrollView>
        </View>
        )


      }
     
      return (<TouchableOpacity 
      style = {that.props.style}
      onPress = { function(){if(window.drag_mode){ that.setState({selectedElemToStyle:that.props.int});  return} if(window.edit_mode){  window.edit(that.props.int); return}  eval('(' + that.state.clickfunctions[that.props.int] + ')()'); if(that.state.clickfunctions[that.props.int].indexOf("appData") !== -1){ that.forceUpdate()}   } }

      >
        <ScrollView>
          {that.props.data.map(function(elem,ind){
            console.log("elem" + elem) 
      
          
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
      window.goTo = this.goTo.bind(this)
      window.saveToDatabase = this.saveToDatabase.bind(this);
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
        draggingObject: null,
        selectedElemToStyle:-1, 
        editmode:true, 
        color: "white",
        name: undefined,
        enteredName:"",
        ischildview: false,
        text_mode:false,
        database:{},
        pages:{
          FirstPage:{
            children:[],
            additionalStyle:{},
            childrenAdditionalStyles:[],
            clickfunctions:[],
            page:"FirstPage"
          }
        },
        page:"FirstPage",
        childrenAdditionalStyles:childrenAdditionalStyles}
    }

    async loadDatabase(){
       var that = this;
       var db_url = "https://streamedbooks.herokuapp.com/apps_data?app_name=" + this.state.name
     
       var database = {};
       var schema = fetch(db_url, {
                  method: 'GET',
                  headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                  }
        }).then(async function(res){ 

         res= await res.json();
 

          if(typeof res === "string"){
            res = JSON.parse(res);
          }

          res.forEach(function(datum){
         
            if(typeof datum.data === "string"){
               datum.data = JSON.parse(datum.data);
            }
            if(database[datum.data_type] === undefined){
               database[datum.data_type] = [datum]
            } else {
              database[datum.data_type].push(datum);
            }
          })

          window.database = database;
         
       
        
          that.setState({database:database})
        })

    }

    saveToDatabase(data_type,data){
      var that = this;
      var body = JSON.stringify({app_name:that.state.name,data_type:data_type,data:data})
      var db_url = 'https://streamedbooks.herokuapp.com/apps_data'
      var schema = fetch(db_url, {
                  method: 'POST',
                  body:body,
                  headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                  }
        }).then(async function(res){
          
          await that.loadDatabase.bind(that)();
          that.forceUpdate();
         
           
        })
    }

    


   renderElement(name,int, childrenAdditionalStyles, clickfunctions){
    var that = this;
    console.log(that.state.pages[that.state.page].childrenAdditionalStyles[int])
    
    int = parseInt(int)
    if(name === "text"){
  
      return (
        <Text
          className = "input_class"
          ref={component => this._element = component}
          defaultValue = "Heren"
          style={[{position:'absolute',top:0,left:0, width:"100%", backgroundColor:'white', borderColor: 'gray', borderWidth: 1}, that.state.pages[that.state.page].childrenAdditionalStyles[int]]}
          maxLength = {5}
          onPress = { function(){if(window.drag_mode){ that.setState({selectedElemToStyle:int});  return} if(window.edit_mode){ window.edit(int); return}  eval(that.state.pages[that.state.page].clickfunctions[int]); if(that.state.pages[that.state.page].clickfunctions[int].indexOf("appData") !== -1){ that.forceUpdate()}   } }
          key = {int}
          selectable = {true}
        >{  try_eval(that.state.pages[that.state.page].childrenAdditionalStyles[int].innerText) === undefined ? ("undefined"):  try_eval(that.state.pages[that.state.page].childrenAdditionalStyles[int].innerText) }</Text>

        )
    }

    if(name === "picker"){
      var options = that.state.pages[that.state.page].childrenAdditionalStyles[int]['options'] !== undefined ? that.state.pages[that.state.page].childrenAdditionalStyles[int]['options']:["example"];

      
      options = eval(options)
      options.forEach(function(option,ind){
        options[ind] = option.toString();
      })
    
      
   return(
      <Picker
        selectedValue={window.appData["input" + int]}
        style = {[{height:50,width:150}, that.state.pages[that.state.page].childrenAdditionalStyles[int]]}
        onValueChange = { function(value){  eval('(' + that.state.pages[that.state.page].clickfunctions[int] !== undefined ? that.state.pages[that.state.page].clickfunctions[int]:"function(){}" + ')()'); window.updateAppData(that.state.page + 'picker' + int, value);  if(that.state.pages[that.state.page].clickfunctions[int].indexOf("appData") !== -1){ that.forceUpdate()}   } }
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
      var options = that.state.pages[that.state.page].childrenAdditionalStyles[int]['options'] !== undefined ? that.state.pages[that.state.page].childrenAdditionalStyles[int]['options']:["example"];
      
      options = eval(options)

      return(
      <Multiplier
      style = {[{alignItems:'center'}, that.state.pages[that.state.page].childrenAdditionalStyles[int]]}
      type = {that.state.pages[that.state.page].childrenAdditionalStyles[int]["style:repeaterType"] === undefined ? ("text"): (that.state.pages[that.state.page].childrenAdditionalStyles[int]["style:repeaterType"]) }
      data = {options}
      int = {int}
      parent = {that}
      clickfunction = {that.state.pages[that.state.page].clickfunctions[int]}
      >
      </Multiplier>
      )
    }

    if(name === "image"){
      var uri = that.state.pages[that.state.page].childrenAdditionalStyles[int]['source'] !== undefined ? that.state.pages[that.state.page].childrenAdditionalStyles[int]['source']:"https://i.imgur.com/89iERyb.png";
      return(
        <TouchableOpacity
        onPress = { function(){ if(window.edit_mode){  window.edit(int); return}  eval(that.state.pages[that.state.page].clickfunctions[int]); if(that.state.pages[that.state.page].clickfunctions[int].indexOf("appData") !== -1){ that.forceUpdate()}   } }
        >
      <Image
        style={[{ width:"20%", height:"20%"}, that.state.pages[that.state.page].childrenAdditionalStyles[int]]}
        source = {{uri:uri}}
      >
      </Image>
      </TouchableOpacity>
      )
    }

    if(name === "input"){
     
      return(
      <TextInput
        style={[{position:'absolute',top:0,left:0, height: 40, borderColor: 'gray', borderWidth: 1}, that.state.pages[that.state.page].childrenAdditionalStyles[int]]}
        onChangeText={function(val){window.updateAppData(that.state.page + "input" + int,val); that.forceUpdate(); }}
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
          onPress = { function(){ if(window.drag_mode){ that.setState({selectedElemToStyle:int});  return} if(window.edit_mode){ window.edit(int); return}  eval(that.state.pages[that.state.page].clickfunctions[int]); if(that.state.pages[that.state.page].clickfunctions[int].indexOf("appData") !== -1){ that.forceUpdate()}   } }
          key = {int}
          style={[{position:'absolute',top:0,left:0, height: 40, title:'Test', borderColor: 'gray', borderWidth: 1}, that.state.pages[that.state.page].childrenAdditionalStyles[int]]}
        ><Text> { that.state.pages[that.state.page].childrenAdditionalStyles[int]['innerText'] === undefined ? ("undefined"):that.state.pages[that.state.page].childrenAdditionalStyles[int]['innerText'] }</Text> 
        </TouchableOpacity>
      )
    }

    if(name === "box"){
      return (
        <TouchableOpacity
          className = "input_class"
          ref={component => this._element = component}
          onPress = { function(){ if(window.drag_mode){ that.setState({selectedElemToStyle:int});  return} if(window.edit_mode){  window.edit(int); return}  eval('(' + that.state.pages[that.state.page].clickfunctions[int] + ')()'); if(that.state.pages[that.state.page].clickfunctions[int].indexOf("appData") !== -1){ that.forceUpdate()}   } }
          key = {int}
          style={[{zIndex:-100, position:'absolute',top:0,left:0, height: 40, width:"10%", title:'Test', borderColor: 'gray', borderWidth: 1}, that.state.childrenAdditionalStyles[int]]}
        > 
        </TouchableOpacity>

        )
    }

   
  }

  goTo(pageName){
    var that = this;
   
    try {
      that.setState({page:pageName})
    } catch(e){
      console.log(e)
    }
  }

  
  

  load(){
  
   
      var that = this;
      
       
      
      var db_url = "https://streamedbooks.herokuapp.com/apps?name=" + that.state.name;
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
              that.setState({name:undefined});
              return
            }

            var other_pages = {} 
            var firstpagechildren;
            var firstpagestyle;
            var clickfunctions;
            var pages = {};
            


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

              pages["FirstPage"].clickfunctions = res.clickfunctions;
              pages["FirstPage"].children = res.children;
              pages["FirstPage"].childrenAdditionalStyles = res.childrenA;
              
               window.appData = res.appdata;
               that.setState({pages:pages})
                this.setState({name:that.state.name},function(){
                  that.loadDatabase.bind(that)()
                })
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

              other_pages[page.page] = page;
            })

             
      
              window.appData = res[0].appdata;
           
              that.setState({pages: other_pages})
             
            
            

            } catch(e){
              console.log(e)
              console.log('couldnt load')
            }
           
          
        })
    }
    
    
  


    render(){
      var that = this;
      if(that.state.name === undefined){
        return (
        <View style = {[{height:"100%", width:"100%",  borderRadius:window.app_name === undefined ? 10:0, paddingTop:'5%', backgroundColor:that.state.color},this.state.additionalStyle]}>
        <Text style = {{marginTop: "40%", textAlign:'center', color:'darkblue', fontSize:"84px"}}>V</Text>
        <Text style = {{marginTop: "10%", textAlign:'center', color:'black'}}>Enter your app name</Text>
        <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={function(enteredName){that.setState({enteredName})}}
            value={that.state.enteredName}
          />
          <Button title = "Go" onPress = {function(){
            that.setState({name:that.state.enteredName},function(){
              that.load();
            })
          }}></Button>
        </View>
      )
    }
   

      return (
        <View style = {[{height:"100%", paddingTop:"10%", width:"100%", borderRadius:window.app_name === undefined ? 10:0, paddingTop:'5%', backgroundColor:that.state.color},this.state.additionalStyle]}>
        {
          that.state.pages[that.state.page].children.map(function(elem_name,index){
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



  renderElement(){
    
    var that = this;
    if(this.state.generatedElementType === "text"){
      return (
        <Text
          className = "input_class"
          ref={component => this._element = component}
          defaultValue = "Heren"
          style={[{ height: 40, borderColor: 'gray', borderWidth: 1},that.state.generatedElementStyleObject]}
          maxLength = {5}
          selectable = {true}
        >THIS IS THE TEST</Text>

        )
    }

    if(this.state.generatedElementType === "button"){
      return (
       <Button
          className = "input_class"
          ref={component => this._element = component}
          onPress = {function(){}}
          title = {that.state.buttonTitle === "" ? ("Button"):(this.state.buttonTitle)}
          style={[{ height: 40, borderColor: 'gray', borderWidth: 1},that.state.generatedElementStyleObject]}
        >THIS IS THE TEST</Button>
      )
    }
  }

  _handlePress() {
    
    // this._element.setNativeProps({ style:{backgroundColor:'red'} })
    this.setState({generatedElementStyleObject:{backgroundColor:'red'}})  
  }

  changePicker(name,ind){
    var that = this;

    var value = prompt("What value do you want to give " + name
      + "?")
   
    if(name.indexOf("style:") !== -1){
      name = name.replace("style:","")
      if(!isNaN(parseInt(value))){
        value = parseInt(value)
      }
      that.state.generatedElementStyleObject[name] = value
      

      this.setState({generatedElementStyleObject:that.state.generatedElementStyleObject})  
    } else {
      if(this.state.generatedElementType === "button"){
        if(name === "title"){
          this.setState({buttonTitle:value})
        }
        return
      }

      this._element.setNativeProps({ name:value })
    }
    
  }

  render() {
    var that = this;
    return (
      <View style = {{width:"100%", height:"100%"}}>
        <BuilderComponent ischildview = {false}></BuilderComponent>
      </View>
     )
  }
}

const styles = StyleSheet.create({
  app: {
    height:height,
    width:width,
    backgroundColor:"grey",
    marginTop:height*0.05,
    alignItems:'center'
  },
  logo: {
    height: 80
  },
  header: {
    padding: 20
  },
  link: {
    color: "#1B95E0"
  },
  code: {
    fontFamily: "monospace, monospace"
  }
});

export default FrontPage;
