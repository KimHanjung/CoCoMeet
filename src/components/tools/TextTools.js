import React, { Component } from 'react';

class TextTools extends Component {
  constructor(props) {
    super(props);
    this.handleClickD = this.handleClickD.bind(this);
    this.handleClickW = this. handleClickW.bind(this);
  }
  handleClickD = (event) => {
    //this.props.handleClick(event);
    let anyvalue = event.target.value
    if(anyvalue === "normal"){
      anyvalue = "none"
    }
    this.props.sendDeco(anyvalue, 'd');
    
    console.log("rxxdecodeco");
    console.log(event.target.value);
    
  }
  handleClickW = (event) => {
    //this.props.handleClick(event);
    this.props.sendWeight(event.target.value, 'w');
    console.log("rxxdecoweight");
    console.log(event.target.value);
    
  }
  render() {
    
    return (
      <div class="w-full mb-2 mt-2 flex flex-wrap">
        
        <div class="w-full ml-3 mt-2 mb-1 flex">
          <div class="w-1/4">
            <button class="w-6 h-6 mx-1 border-solid border-2 bg-white transition duration-200 hover:shadow-outline font-serif leading-none text-lg text-red" value={"normal"} onClick={(e)=>{this.handleClickW(e); this.handleClickD(e)}}>-</button>
          </div>
          <div class="w-1/4">
            <button class="w-6 h-6 mx-1 border-solid border-2 bg-white transition duration-200 hover:shadow-outline font-serif leading-none text-lg font-extrabold" value={"bold"} onClick={this.handleClickW}>B</button>
          </div>  
          <div class="w-1/4">
            <button class="w-6 h-6 mx-1 border-solid border-2 bg-white transition duration-200 hover:shadow-outline font-serif leading-none text-lg underline" value={"underline"} onClick={this.handleClickD}>U</button>
          </div>  
          <div class="w-1/4">
            <button class="w-6 h-6 mx-1 border-solid border-2 bg-white transition duration-200 hover:shadow-outline font-serif leading-none text-lg line-through" value={"line-through"} onClick={this.handleClickD}>T</button>
          </div>
        </div>
        <div class="w-full ml-3">
        </div>
      </div>
    );
  }
}

export default TextTools;
