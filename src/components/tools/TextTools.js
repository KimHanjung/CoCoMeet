import React, { Component } from 'react';

class TextTools extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = (event) => {
    //this.props.handleClick(event);
    this.props.sendDeWe(event.target.value, 'w');
    console.log("rxxdecoweight");
    console.log(event.target.value);
    
  }
  render() {
    
    return (
      <div class="w-full mb-2 mt-2 flex flex-wrap">
        
        <div class="w-full ml-3 mt-2 mb-1">
          <button class="w-6 h-6 mx-2 mb-2 border-solid border-2 bg-white transition duration-200 hover:shadow-outline font-serif leading-none text-lg text-red" value={"normal"} onClick={this.handleClick}>-</button>
          <button class="w-6 h-6 mx-2 mb-2 border-solid border-2 bg-white transition duration-200 hover:shadow-outline font-serif leading-none text-lg font-extrabold" value={"bold"} onClick={this.handleClick}>B</button>
          <button class="w-6 h-6 mx-2 mb-2 border-solid border-2 bg-white transition duration-200 hover:shadow-outline font-serif leading-none text-lg line-through" value={"line-through"} onClick={this.handleClick}>T</button>
          <button class="w-6 h-6 mx-2 mb-2 border-solid border-2 bg-white transition duration-200 hover:shadow-outline font-serif leading-none text-lg underline" value={"underline"} onClick={this.handleClick}>U</button>
          <button class="w-6 h-6 mx-2 mb-2 border-solid border-2 bg-white transition duration-200 hover:shadow-outline font-serif leading-none text-lg italic" value={"italic"} onClick={this.handleClick}>I</button>
          
        </div>
        <div class="w-full ml-3">
        </div>
      </div>
    );
  }
}

export default TextTools;
