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
    //console.log("rxxcolor");
    //console.log(event.target.value);
    
  }
  render() {
    return (
      <div class="w-full mb-2 mt-2 flex flex-wrap">
        
        <div class="w-full ml-3 mt-2 mb-1">
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-red transition duration-200 hover:shadow-outline" color={"#E9BDB3"} key={"#E9BDB3"} value={"#E9BDB3"} onClick={this.handleClick} />
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-orange transition duration-200 hover:shadow-outline" color={"#FFD8B0"} key={"#FFD8B0"} value={"#FFD8B0"} onClick={this.handleClick} />
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-yellow transition duration-200 hover:shadow-outline" color={"#FFF1B9"} key={"#FFF1B9"} value={"#FFF1B9"} onClick={this.handleClick} />
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-green transition duration-200 hover:shadow-outline" color={"#BBDBBF"} key={"#BBDBBF"} value={"#BBDBBF"} onClick={this.handleClick} />
        </div>
        <div class="w-full ml-3">
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-lime transition duration-200 hover:shadow-outline" color={"#59C9B8"} key={"#59C9B8"} value={"#59C9B8"} onClick={this.handleClick} />
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-blue transition duration-200 hover:shadow-outline" color={"#87A8C2"} key={"#87A8C2"} value={"#87A8C2"} onClick={this.handleClick} />
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-purple transition duration-200 hover:shadow-outline" color={"#B3B6E9"} key={"#B3B6E9"} value={"#B3B6E9"} onClick={this.handleClick} />
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-blacky transition duration-200 hover:shadow-outline" color={"#848993"} key={"#848993"} value={"#848993"} onClick={this.handleClick} />
        </div>
      </div>
    );
  }
}

export default ColorTools;
