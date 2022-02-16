import React from 'react';
import styles from './styles.module.css';
import { Button, Card, Col, Empty, Row, Space, Statistic, } from 'antd';
import { ArrowUpOutlined, } from '@ant-design/icons';
import Null from '../../../shared/images/state/Null.png'
import { withRouter } from 'react-router-dom';

class CountModal extends React.Component<any, any>{

  render() {
    return (
      <Card>
        {this.props.isLogin ? <Row>
          <Col span={12}>
            <Statistic
              title="进度统计"
              value={11}
              valueStyle={{ color: '#3f8600', }}
              prefix={<ArrowUpOutlined />}
              suffix="名"
            />
          </Col>
          <Col span={12}>
            <Space direction="vertical" size="small" style={{ width: '100%', }}>
              <div className={styles.count}>
                <div data-rankno="easy" className={styles.text}>简单</div>
                <div className={styles.number}>
                  <span className={styles.now}>1</span>/777
                </div>
              </div>
              <div className={styles.count}>
                <div data-rankno="mid" className={styles.text}>中等</div>
                <div className={styles.number}>
                  <span className={styles.now}>1</span>/777
                </div>
              </div>
              <div className={styles.count}>
                <div data-rankno="diffcult" className={styles.text}>困难</div>
                <div className={styles.number}>
                  <span className={styles.now}>1</span>/777
                </div>
              </div>
            </Space>
          </Col>
        </Row> : <Empty
          image={Null}
          imageStyle={{
            height: 60,
          }}
          description={
            <Button onClick={()=>this.props.history.push('/login')}>去登录</Button>
          }
        >
        </Empty>}
      </Card>
    )
  }
}


export default withRouter(CountModal);
