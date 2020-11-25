import React, { Component } from 'react';

class TextTools extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

  }

  handleClick(event) {
    this.props.handleClick(event);
  }

  render() {
    
    return (
      <div class="w-full mb-2 mt-2 flex flex-wrap">
        
        <div class="w-full ml-3 mt-2 mb-1">
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-white transition duration-200 hover:shadow-outline" handleClick={this.handleClick}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" >
            <path d="M832.8,561.3c-28.6-40.8-73.5-65.3-130.7-77.6c44.9-16.3,81.7-44.9,102.1-81.7c20.4-32.7,32.7-77.6,32.7-122.5c0-85.8-32.7-155.2-102.1-200.1C665.4,34.5,571.5,10,449,10H126.4v980H498c122.5,0,212.3-28.6,277.7-77.6c65.3-49,98-122.5,98-216.4C873.6,647,861.4,602.1,832.8,561.3z M351,185.6h93.9c53.1,0,89.8,12.3,118.4,28.6c28.6,16.3,40.8,49,40.8,89.8c0,36.7-12.3,65.3-40.8,85.7s-69.4,28.6-122.5,28.6H351V185.6z M608.2,785.8c-24.5,20.4-61.2,28.6-110.3,28.6H351v-245h147h8.2c49,0,85.7,12.3,106.2,32.7S645,655.2,645,696S632.7,765.4,608.2,785.8z"/>
            </svg>
          </button>
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-white transition duration-200 hover:shadow-outline" handleClick={this.handleClick}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000">
            <path d="M990,493.9v-49H575.8V154.6H718c46.2,0,62.1,30.2,62.1,68.7h48.4V76.6H171.4v146.7h48.4c0-44.6,14.5-68.7,57.8-68.7h146.6v290.3H10v49h414.2v279.4c0,53.5-22.2,76.6-86.6,76.6H323v73.5h349.6v-73.5h-13.7c-67.7,0-83.1-22.4-83.1-76.6V493.9H990z"/>
            </svg>
          </button>
          <button class="w-5 h-5 mx-2 border-solid border-2 bg-white transition duration-200 hover:shadow-outline" handleClick={this.handleClick}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000">
            
            <path d="M481.7,839.3c196.6-3.1,299.6-121.6,308.7-321.2V10h-72.6v508.1c-9.1,154.3-90.9,251.6-236.1,257.7c-139.2-6-220.7-103.4-235.8-257.7V10h-72.6v508.1C179.4,714.8,285.1,833.2,481.7,839.3z M100.7,917.4V990h798.5v-72.6H100.7z"/>
            </svg>
          </button>
        </div>
        <div class="w-full ml-3">
        </div>
      </div>
    );
  }
}

export default TextTools;
