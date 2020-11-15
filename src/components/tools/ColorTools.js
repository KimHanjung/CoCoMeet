import React, { Component } from 'react';

const colors = [
  'red', 'orange', 'yellow', 'green', 'blue', 'cyan', 'lime', 'purple',
];

const SelectedColor = props => {
  const style = {
    backgroundColor: props.color
  };

  return <div class="flex flex-wrap border-solid border-2 m-2 w-4 h-4 transition duration-200 hover:shadow-outline" style={style} />;
};

const Color = props => {
  const style = {
    backgroundColor: props.color
  };

  return <div class="border-solid border-2 p-2 w-4 h-4 transition duration-200 hover:shadow-outline" style={style} onClick={props.handleClick} />;
};

class ColorTools extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

  }

  handleClick(event) {
    this.props.handleClick(event);
  }

  render() {
    const colorItems = colors.map(color => (
      <Color color={color} key={color} handleClick={this.handleClick} />
    ));

    return (
      <div class="w-full mb-2 mt-2 flex flex-wrap">
        <div class="w-full ml-3">
          
          <button class="w-6 h-6 my-1 mx-3 border-solid border-2" color={this.props.selectedColor} />
          <label class="ml-1 mr-3 font-semibold text-lg">Now</label>       
        </div>
        <div class="w-full ml-3 mt-2 mb-1">
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-red transition duration-200 hover:shadow-outline" color={"red"} key={"red"} handleClick={this.handleClick} />
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-orange transition duration-200 hover:shadow-outline" color={"orange"} key={"orange"} handleClick={this.handleClick} />
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-yellow transition duration-200 hover:shadow-outline" color={"yellow"} key={"yellow"} handleClick={this.handleClick} />
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-green transition duration-200 hover:shadow-outline" color={"green"} key={"green"} handleClick={this.handleClick} />
        </div>
        <div class="w-full ml-3">
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-blue transition duration-200 hover:shadow-outline" color={"blue"} key={"blue"} handleClick={this.handleClick} />
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-cyan transition duration-200 hover:shadow-outline" color={"cyan"} key={"cyan"} handleClick={this.handleClick} />
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-lime transition duration-200 hover:shadow-outline" color={"lime"} key={"lime"} handleClick={this.handleClick} />
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-purple transition duration-200 hover:shadow-outline" color={"purple"} key={"purple"} handleClick={this.handleClick} />
        </div>
      </div>
    );
  }
}

export default ColorTools;
