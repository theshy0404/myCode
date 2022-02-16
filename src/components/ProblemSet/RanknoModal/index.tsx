import React from 'react';
import styles from './styles.module.css';
import Hot from '../../../shared/images/public/hot.svg';
import Rankno from '../../../shared/images/public/rankno.svg';
import { Tag } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';

class CountModal extends React.Component<any, any>{
  render() {
    return (
      <div className={styles.wrap}>
        <div className={styles.title}>
          <img className={styles.icon} alt="" src={this.props.type === 'user' ? Rankno : Hot} />
          {this.props.type === 'user' ? '做题榜' : '热度榜'}
        </div>
        {this.props.listData.map((item: any, index: number) => {
          let type: number;
          if (item.rankno > 0) type = 1;
          else if (item.rankno < 0) type = -1;
          else type = 0;
          return (
            <div className={styles.item} key={index} onClick={()=>this.props.history.push('/index/problem/1')}>
              <div>{index + 1}&nbsp;&nbsp;{item.title}&nbsp;&nbsp;
                {(item.type && item.type === 'easy' && <Tag color="#2db7f5">简单</Tag>)}
                {(item.type && item.type === 'mid' && <Tag color="#87d068">中等</Tag>)}
                {(item.type && item.type === 'diffcult' && <Tag color="#f50">困难</Tag>)}</div>
              <div className={styles.rankno} data-type={type}>
                {type === 1 && <ArrowUpOutlined />}
                {type === -1 && <ArrowDownOutlined />}
                {type===0?'--':Math.abs(item.rankno)}</div>
            </div>
          )
        })}
      </div >
    )
  }
}


export default withRouter(CountModal);
