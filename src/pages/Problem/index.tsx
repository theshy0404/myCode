import React, { useState } from 'react';
import styles from './styles.module.css';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tag, Typography, Comment, Avatar, Input, Button, Table, Menu, Dropdown, } from 'antd';
import { DownOutlined, } from '@ant-design/icons';
import JSCode from '../../components/VSCode/JSCode';
import PyCode from '../../components/VSCode/PyCode';

const { Title, Paragraph, } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

type TState = {
  language: 'javascript' | 'mysql' | 'python3' | 'c';
}

const ExampleComment = (props: any) => {
  const [isReply, handleChangeIsReply] = useState(false);
  const [isShow, handleChangeShow] = useState(false);
  return (
    <Comment
      actions={[<span onClick={() => { handleChangeShow(!isShow) }} key="comment-nested-expand-to">Expand</span>,
      <span onClick={() => { handleChangeIsReply(!isReply) }} key="comment-nested-reply-to">Reply to</span>,
      <Button type="primary" size="small" style={!isReply ? { display: 'none', float: 'right' } : {}} key="comment-nested-sumbit">Sumbit</Button>]}
      author={<p >Han Solo</p>}
      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
      content={
        <>
          <p>
            We supply a series of design principles, practical patterns and high quality design
            resources (Sketch and Axure).
          </p>
          {isReply && <TextArea style={{ width: '90%' }} rows={2} />}
        </>
      }
    >
      {isShow && props.children}
    </Comment>
  )
};

@inject('AuthStore')
@observer
class Problem extends React.Component<any, TState>{

  constructor(props: any) {
    super(props);
    this.state = { language: 'javascript', };
  }

  componentDidMount() {
    document.title = "题目详情";
  }

  get renderCode() {
    switch (this.state.language) {
      case 'javascript':
        return <JSCode />;
      case 'python3':
        return <PyCode />;
    }
  }

  handleChangeLanguage(event: any) {
    const { key } = event;
    if (['javascript', 'python3', 'c', 'mysql'].includes(key)) this.setState({ language: key });
  }

  render() {
    const menu = (
      <Menu onClick={e => this.handleChangeLanguage(e)}>
        <Menu.Item key="c" disabled>
          C
        </Menu.Item>
        <Menu.Item key="python3">
          Python3
        </Menu.Item>
        <Menu.Item key="javascript">
          JavaScript
        </Menu.Item>
        <Menu.Item key="mysql" disabled>
          MySQL
        </Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined) => <p>{text}</p>,
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      },
    ];

    const data = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      },
    ];
    return (
      <div className={styles.wrap}>
        <Tabs type="card" style={{ width: '50%' }}>
          <TabPane tab="题目介绍" key="1">
            <div className={styles.tab}>
              <Title level={3} style={{ fontWeight: '500px' }}>13.翻转字符串    <Tag color="#2db7f5">简单</Tag></Title>
              <Paragraph >
                Ant Design, a design language for background applications, is refined by Ant UED Team. Ant
                Design, a design language for background applications, is refined by Ant UED Team. Ant
                Design, a design language for background applications, is refined by Ant UED Team. Ant
                Design, a design language for background applications, is refined by Ant UED Team. Ant
                Design, a design language for background applications, is refined by Ant UED Team. Ant
                Design, a design language for background applications, is refined by Ant UED Team.
              </Paragraph>
            </div>
          </TabPane>
          <TabPane tab="评论(122)" key="2">
            <div className={styles.tab}>
              <ExampleComment>
                <ExampleComment>
                  <ExampleComment />
                  <ExampleComment />
                </ExampleComment>
              </ExampleComment>
              <ExampleComment>
                <ExampleComment>
                  <ExampleComment />
                  <ExampleComment />
                </ExampleComment>
              </ExampleComment>
            </div>
          </TabPane>
          <TabPane tab="题解(12)" key="3">
            <div className={styles.tab}>
              <ExampleComment>
                <ExampleComment>
                  <ExampleComment />
                  <ExampleComment />
                </ExampleComment>
              </ExampleComment>
            </div>
          </TabPane>
          <TabPane tab="提交记录" key="4">
            <div className={styles.tab}>
              <Table pagination={false} bordered style={{ boxShadow: '0px 4px 8px #f0f0f0' }} columns={columns} dataSource={data} />
            </div>
          </TabPane>
        </Tabs>
        <div className={styles.notebook}>
          <Dropdown overlay={menu}>
            <a href="/" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              {this.state.language} <DownOutlined />
            </a>
          </Dropdown>
          {this.renderCode}
        </div>
      </div>
    )
  }
}


export default withRouter(Problem);
