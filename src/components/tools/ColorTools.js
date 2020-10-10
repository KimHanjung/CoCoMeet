import React, { Component } from 'react';

const colors = [
  'red', 'orange', 'yellow', 'green', 'blue', 'cyan', 'lime', 'purple',
];

const SelectedColor = props => {
  const style = {
    backgroundColor: props.color
  };

  return <div className="color-selected" style={style} />;
};

const Color = props => {
  const style = {
    backgroundColor: props.color
  };

  return <div className="color" style={style} onClick={props.handleClick} />;
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
      <div style={{ display: "flex", alignItems: "center" }}>
        <SelectedColor color={this.props.selectedColor} />
        <div className="color-panel">{colorItems}</div>
      </div>
    );
  }
}

export default ColorTools;
