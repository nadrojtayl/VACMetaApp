import React, { Component } from "react";
import { Button, Picker, Switch,Image,ActivityIndicator, ScrollView, TouchableOpacity, StyleSheet, Text, View, TextInput, Dimensions } from "react-native";
import {WebView} from 'react-native-webview'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
global.inputs = {
  0:"This"
}

window = global;

function filter(arr,phrase){
  return arr.filter(function(elem){
    return elem.indexOf(phrase) !== -1;
  })
}

function clone(arr){
  return arr.slice();
}


function unwrap_dynamically(value,default_value){
  if(default_value === undefined){
    default_value = "undefined"
  }
  return try_eval(value) === undefined ? (default_value):  try_eval(value) 
}



function try_eval(input){
 
    try {
      var output =  eval(input);
      return output
    } catch(e){
      return input;
    }
}



window.appData = {};
appData = window.appData;
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
      if(key !== "onPress" && typeof additionalStyle[key] === "string" && (additionalStyle[key].indexOf('elem') !== -1  || additionalStyle[key].indexOf('width') !== -1 || additionalStyle[key].indexOf('height') !== -1 ) ){
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
         style={[{ height: 40, borderColor: 'gray', borderWidth: 1}, additionalStyle]}
          key = {int}
          onPress = { function(){  eval('(' + that.props.clickfunction + ')()')   } }
    >{  additionalStyle.innerText === undefined ? "example" :additionalStyle.innerText }</Text>

        )
    }


    if(name === "button"){

      return(
          <TouchableOpacity
         
         onPress = { function(){  eval('(' + that.prop.clickfunction + ')()')   } }
          key = {int}
          style={[{
             shadowOffset: { height: 1, width: 1 }, // IOS
            shadowOpacity: 1, // IOS
            shadowRadius: 1, //IOS
            backgroundColor: '#fff',
            elevation: 2, // Android
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor:'red', height: "25%", borderColor: 'gray', borderRadius:10, borderWidth: 1}, additionalStyle]}
        ><Text> { additionalStyle['innerText'] === undefined ? ("undefined"):additionalStyle['innerText']  }</Text> 
        </TouchableOpacity>
     
      )
    }

    if(name === "image"){
      return(
       <Image
          source = {{uri: additionalStyle['source'] === undefined ? ("https://i.imgur.com/89iERyb.png"):additionalStyle['source']}}
          key = {int}
          style={[{ height: 40, title:'Test', borderColor: 'gray', borderWidth: 1}, additionalStyle[int]]}
        ></Image>
     
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
        dbLinks:{},
        loaded:false,
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


    sendToDatabase(name,obj){
      var that = this;
      var arr = that.state.dbLinks[name].split("/");
      var id = arr[arr.length - 1]
      var url = "https://sheetsu.com/apis/v1.0db/" + id;
      console.log(url);
      var schema = fetch(url, {
                  method: 'POST',
                  body:JSON.stringify(obj),
                  headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                  }
        }).then(async function(res){
          console.log("SAVED");
          window[name].push(obj);
          that.forceUpdate();


        })
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
   
   

    int = parseInt(int)
    var additionalStyle = {};

    Object.keys(that.state.pages[this.state.page].childrenAdditionalStyles[int]).forEach(function(key){
      additionalStyle[key] = unwrap_dynamically(that.state.pages[that.state.page].childrenAdditionalStyles[int][key])
    })

    if(name === "map"){
      if(additionalStyle.uri === undefined){
        return(<TouchableOpacity
          onPress = {function(){}}
          key = {int}
          style={[{zIndex:-100, position:'absolute',top:0,left:0, height: "50%", width:"50%", backgroundColor:'red', title:'Test', borderColor: 'gray', borderWidth: 1, alignItems:'center',textAlign:'center'}, additionalStyle]}
        >
          <Text>Your map uri is not set.</Text>
        </TouchableOpacity>)
      }

      return (
        <View style={[{position:'absolute',top:0,left:0, width:"100%", height:"50%", color:'black',  borderColor: 'gray', borderWidth: 1}, additionalStyle]} >
          <WebView
            source={{
              uri: additionalStyle.uri
            }} 
          />
        </View>

        )
    }

    if(name === "switch"){

      return (
        <Switch
          
          style={[{position:'absolute',top:0,left:0, width:"100%", color:'black',  borderColor: 'gray', borderWidth: 1}, additionalStyle]} 
          onValueChange={function(val){window.updateAppData(that.state.page + "switch" + int,val); that.forceUpdate(); eval(that.state.pages[that.state.page].clickfunctions[int]); if(that.state.pages[that.state.page].clickfunctions[int].indexOf("appData") !== -1){ that.forceUpdate(); window.updateAppData(); }    }}
          value={window.appData[that.state.page + "switch" + int]}
          key = {int}
        ></Switch>

        )
    }


    if(name === "text"){
  
      return (
        <Text
          style={[{position:'absolute',top:0,left:0, width:"100%", backgroundColor:'white', borderColor: 'gray', borderWidth: 1}, additionalStyle]}
          onPress = { function(){if(window.drag_mode){ that.setState({selectedElemToStyle:int});  return} if(window.edit_mode){ window.edit(int); return}  eval(that.state.pages[that.state.page].clickfunctions[int]); if(that.state.pages[that.state.page].clickfunctions[int].indexOf("appData") !== -1){ that.forceUpdate()}   } }
          key = {int}
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
        style = {[{height:50,width:150}, additionalStyle]}
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
      style = {[{height:"60%", alignItems:'center'}, additionalStyle, {height:"60%", alignItems:'center'}]}
      type = {that.state.pages[that.state.page].childrenAdditionalStyles[int]["repeaterType"] === undefined ? ("text"): (that.state.pages[that.state.page].childrenAdditionalStyles[int]["repeaterType"]) }
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
            style={[{ width:"50%", height:"50%"}, additionalStyle]}
            source = {{uri:uri}}
          >
          </Image>
      </TouchableOpacity>
      )
    }

    if(name === "input"){
     
      return(
      <TextInput
        style={[{position:'absolute',top:0,left:0, height: 40, width:"50%", borderColor: 'gray', borderWidth: 1}, additionalStyle]}
        onChangeText={function(val){window.updateAppData(that.state.page + "input" + int,val); that.forceUpdate();  eval(that.state.pages[that.state.page].clickfunctions[int]); if(that.state.pages[that.state.page].clickfunctions[int].indexOf("appData") !== -1){ that.forceUpdate()} }}
        value={window.appData["input" + int]}
      />
      )
    }

    if(name === "button"){
      return(
       <TouchableOpacity
         
          onPress = { function(){ eval(that.state.pages[that.state.page].clickfunctions[int]); if(that.state.pages[that.state.page].clickfunctions[int].indexOf("appData") !== -1){ that.forceUpdate()}   } }
          key = {int}
          style={[{
             shadowOffset: { height: 1, width: 1 }, // IOS
            shadowOpacity: 1, // IOS
            shadowRadius: 1, //IOS
            backgroundColor: '#fff',
            elevation: 2, // Android
            height: 50,
            width: 100,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            borderRadius:15, borderWidth: 1,
            position:'absolute',top:0,left:0, height: "7%", title:'Test', borderColor: 'gray', borderWidth: 1}, additionalStyle]}
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
          style={[{zIndex:-100, position:'absolute',top:0,left:0, height: 40, width:"10%", title:'Test', borderColor: 'gray', borderWidth: 1},additionalStyle]}
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

  connectToDatabase(db_link,name){

      var that = this;
      that.state.dbLinks[name] = db_link;
      var schema = fetch(db_link, {
                  method: 'GET',
                  headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                  }
        }).then(async function(res){
          res = await res.json();
          window[name] = res;
          that.forceUpdate();
          that.setState({dbLinks:that.state.dbLinks, loaded:true})
        })
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
         
            console.log(res);
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
            if(res[0].databases){
               var databases = JSON.parse(res[0].databases);
            } else {
                var databases = {};
            }
          
            var loaded = (Object.keys(databases).length === 0);
            Object.keys(databases).forEach(function(db_name){
              that.connectToDatabase.bind(that)(databases[db_name],db_name);
            })


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
              page.childrenAdditionalStyles.forEach(function(styleobj){
                Object.keys(styleobj).forEach(function(key){
                  if(key === "fontFamily" && typeof styleobj[key] === "number"){
                    delete styleobj["fontFamily"]
                  }

                  if(key === "top"){
                    styleobj[key] = (styleobj[key]/590 * height)
                  }

                  if(key === "left"){
                    styleobj[key] = (styleobj[key]/394 * width)
                  }

                })
              })
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
              console.log(databases);
              that.setState({pages: other_pages, loaded:loaded, dbLinks:databases, color: res.color})

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
          <Button title = "Test the App" onPress = {function(){
            that.setState({name:that.state.enteredName},function(){
              that.load();
            })
          }}></Button>
        </View>
      )
    }

    if(!that.state.loaded){
      return (
        <View style = {[{height:"100%", paddingTop:"10%", width:"100%", alignItems:'center', justifyContent:'center', borderRadius:window.app_name === undefined ? 10:0, paddingTop:'5%', backgroundColor:that.state.color},this.state.additionalStyle]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
        )
    }
   

      return (
        <View style = {[{height:"100%", marginTop:"10%", width:"100%", borderRadius:window.app_name === undefined ? 10:0, paddingTop:'5%', backgroundColor:that.state.color},this.state.additionalStyle]}>
        {
          that.state.pages[that.state.page].children.map(function(elem_name,index){
            console.log(elem_name);
            console.log(that.state.pages[that.state.page].childrenAdditionalStyles[index].innerText)
          if(elem_name === "text" && (that.state.pages[that.state.page].childrenAdditionalStyles[index].innerText === "" || that.state.pages[that.state.page].childrenAdditionalStyles[index].innerText === undefined || that.state.pages[that.state.page].childrenAdditionalStyles[index].innerText === null) ){
            return
          }
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
