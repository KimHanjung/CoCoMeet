import React from 'react';

function Header(props) {
    const headerStyle = {
        backgroundColor: 'black',
        color: 'aqua',
        fontSize: 24, // 기본 단위 px
        padding: '1rem' // 다른 단위 사용 시 문자열로 설정
      }
  return <div style={headerStyle}>{props.name}</div>
}

export default Header;