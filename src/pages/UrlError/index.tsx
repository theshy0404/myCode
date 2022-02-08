import React from 'react';
// import styles from './App.module.css';
import '../../App.css'
import { Empty, } from 'antd';
import Null from '../../shared/images/state/Null.png'

class UrlError extends React.Component<any, any>{

  render() {
    return (
      <Empty
        image={Null}
        imageStyle={{
          height: 500,
        }}
        description={
          <h1 style={{color: '#00000040'}}>404 Not Found</h1>
        }
      >
      </Empty>
    )
  }
}


export default UrlError;
