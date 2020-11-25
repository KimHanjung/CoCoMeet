import React, { Component } from 'react';

const colors = [
  'red', 'orange', 'yellow', 'green', 'blue', 'cyan', 'lime', 'purple',
];

class ColorTools extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

  }
  handleClick = (event) => {
    //this.props.handleClick(event);
    this.props.sendColor(event.target.value, 'c');
    console.log("rxxcolor");
    console.log(event.target.value);
    
  }
  render() {
    return (
      <div class="w-full mb-2 mt-2 flex flex-wrap">
        
        <div class="w-full ml-3 mt-2 mb-1">
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-red transition duration-200 hover:shadow-outline" color={"red"} key={"red"} value={"red"} onClick={this.handleClick} />
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-orange transition duration-200 hover:shadow-outline" color={"orange"} key={"orange"} value={"orange"} onClick={this.handleClick} />
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-yellow transition duration-200 hover:shadow-outline" color={"yellow"} key={"yellow"} value={"yellow"} onClick={this.handleClick} />
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-green transition duration-200 hover:shadow-outline" color={"green"} key={"green"} value={"green"} onClick={this.handleClick} />
        </div>
        <div class="w-full ml-3">
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-blue transition duration-200 hover:shadow-outline" color={"blue"} key={"blue"} value={"blue"} onClick={this.handleClick} />
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-cyan transition duration-200 hover:shadow-outline" color={"cyan"} key={"cyan"} value={"cyan"} onClick={this.handleClick} />
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-lime transition duration-200 hover:shadow-outline" color={"lime"} key={"lime"} value={"lime"} onClick={this.handleClick} />
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-purple transition duration-200 hover:shadow-outline" color={"purple"} key={"purple"} value={"purple"} onClick={this.handleClick} />
        </div>
      </div>
    );
  }
}

export default ColorTools;
