import React from 'react';
import styles from './styles.module.css';
import '../../App.css'
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Button, Dropdown, Input, Menu, Space, Table } from 'antd';
import { DownOutlined, ReloadOutlined } from '@ant-design/icons';
import CountModal from '../../components/ProblemSet/CountModal';
import RanknoModal from '../../components/ProblemSet/RanknoModal';

const { Search } = Input;
@inject('AuthStore')
@observer
class ProblemSet extends React.Component<any, any>{

  componentDidMount(){
    document.title="MyCode-题库";
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item key="1">
          1st menu item
        </Menu.Item>
        <Menu.Item key="2">
          2nd menu item
        </Menu.Item>
        <Menu.Item key="3">
          3rd menu item
        </Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Chinese Score',
        dataIndex: 'chinese',
        sorter: {
          compare: (a: { chinese: number; }, b: { chinese: number; }) => a.chinese - b.chinese,
          multiple: 3,
        },
      },
      {
        title: 'Math Score',
        dataIndex: 'math',
        sorter: {
          compare: (a: { math: number; }, b: { math: number; }) => a.math - b.math,
          multiple: 2,
        },
      },
      {
        title: 'English Score',
        dataIndex: 'english',
        sorter: {
          compare: (a: { english: number; }, b: { english: number; }) => a.english - b.english,
          multiple: 1,
        },
      },
    ];

    const data = [
      {
        key: '1',
        name: '题目',
        chinese: 98,
        math: 60,
        english: 70,
      },
      {
        key: '2',
        name: '题解数',
        chinese: 98,
        math: 66,
        english: 89,
      },
    ];
    const setList = [
      { name: '全部题目', src: 'all' },
      { name: '数据结构', src: 'tree' },
      { name: '算法', src: 'func' },
      { name: '数据库', src: 'sql' },
    ];
    const labelList = [
      '数组', '字符串', '哈希表', '双指针', '动态规划', '递归', '树', '深度优先搜寻', '广度优先搜寻', '滑动窗口', '栈', '队列', '随机算法', '贪心算法', '排序', '搜索', '查询'
    ]
    const problemList = [
      { title: '快速排序', type: 'easy', rankno: 1 },
      { title: '翻转字符串', type: 'easy', rankno: 1 },
      { title: '基数排序', type: 'mid', rankno: -1 },
      { title: '红黑树', type: 'diffcult', rankno: -1 },
    ]
    const userList = [
      { title: 'theshy0404', rankno: 11 },
      { title: 'theshy0404', rankno: -1 },
      { title: 'theshy0404', rankno: 0 },
    ]
    return (
      <div className={styles.wrap}>
        <div className={styles.content}>
          <Space direction="vertical" size="middle" style={{ width: '100%', }}>
            <div className={styles.setList}>
              {setList.map((item, index) => {
                return (
                  <div data-active={index === 0} className={styles.set} key={index}>
                    <img className={styles.logo} alt={item.name} src={require(`../../shared/images/public/${item.src + (index === 0 ? 'White' : '')}.svg`).default} />
                    <div>{item.name}</div>
                  </div>
                )
              }
              )}
            </div>
            <div className={styles.labelList}>
              {labelList.map((item, index) => (
                <div data-active={index === 0} className={styles.label} key={index}>
                  <div>{item}</div>
                </div>
              ))}
            </div>
            <Space size="middle" style={{ width: '100%', position: 'relative' }}>
              <Dropdown.Button overlay={menu} icon={<DownOutlined />}>
                状态
              </Dropdown.Button>
              <Dropdown.Button overlay={menu} icon={<DownOutlined />}>
                难度
              </Dropdown.Button>
              <Search placeholder="input search text" style={{ width: 200 }} />
              <Button style={{ position: 'absolute', right: '10px', top: '0px' }} icon={<ReloadOutlined />}>重置</Button>
            </Space>
            <Table style={{ marginRight: '10px' }} columns={columns} dataSource={data} />
          </Space>
        </div>
        <div className={styles.aside}>
          <CountModal isLogin={this.props.AuthStore.isLogin} />
          <RanknoModal type="problem" listData={problemList} />
          <RanknoModal type="user" listData={userList} />
        </div>
      </div>
    )
  }
}


export default withRouter(ProblemSet);
