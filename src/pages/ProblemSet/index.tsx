import React from 'react';
import styles from './styles.module.css';
import '../../App.css'
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Button, Dropdown, Input, Menu, message, Space, Table, Tag, } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, DownOutlined, MinusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import CountModal from '../../components/ProblemSet/CountModal';
import RanknoModal from '../../components/ProblemSet/RanknoModal';
import doRequest from '../../interface/useRequests';
import { PROBLEM_RANK, PROBLEM_RANK_MAP, PROBLEM_STATUS, PROBLEM_STATUS_MAP, PROBLEM_TYPE_MAP } from '../../interface/Problem';

type TState = {
  setList: Array<any>,
  labelList: Array<any>,
  problemList: Array<any>,
  set: number,
  label?: number,
  status?: number,
  rank?: number,
  problemname?: string,
}

let loading: boolean = false;

@inject('AuthStore')
@observer
class ProblemSet extends React.Component<any, TState>{

  constructor(props: any) {
    super(props);
    this.state = {
      setList: [
        { name: '全部题目', src: 'all', type: 0 },
        { name: '数据结构', src: 'tree', type: 1 },
        { name: '算法', src: 'func', type: 2 },
        { name: '数据库', src: 'sql', type: 3 },
      ],
      labelList: [],
      problemList: [],
      set: 0,
    }
  }

  async componentDidMount() {
    document.title = "MyCode-题库";
    this.init().then(result => {
      const { labelList, problemList } = result;
      this.setState({ labelList, problemList }, () => console.log(this.state));
    })
  }

  async init() {
    let problemList: Array<any> = [];
    let labelList: Array<any> = [];
    await doRequest({
      url: '/problems', type: 'GET',
    }).then(res => problemList = res.data);
    await doRequest({
      url: '/problems/labels', type: 'GET',
    }).then(res => labelList = res.data);
    return Promise.resolve({ problemList, labelList });
  }

  handleChangeSet(set: number) {
    if (loading) return message.warning('不用太急啦');
    loading = true;
    doRequest({ url: '/problems/labels', params: { typeid: set } })
      .then(result => this.setState({ set, labelList: result.data }))
      .catch(error => console.log(error))
      .finally(() => loading = false);
  }

  handleChangeLabel(label: number) {
    if (label === this.state.label) return this.setState({ label: undefined }, () => this.doSearch(false));
    this.setState({ label }, () => this.doSearch(false));
  }

  handleChangeRank(rank: number) {
    this.setState({ rank }, () => this.doSearch(false));
  }

  handleChangeStatus(status: number) {
    this.setState({ status }, () => this.doSearch(false));
  }

  handleChangeName(name: string) {
    this.setState({ problemname: name });
  }

  async doSearch(isall: boolean = true) {
    if (loading) return message.warning('不用太急啦');
    loading = true;
    let params = {}
    const { set = undefined, problemname = undefined, rank = undefined, label = undefined, status = undefined } = this.state;
    if (set) {
      params = { ...params, type: set };
    }
    if (problemname) {
      params = { ...params, problemname };
    }
    if (rank) {
      params = { ...params, rank };
    }
    if (label) {
      params = { ...params, label };
    }
    if (status) {
      params = { ...params, status }
    }
    if (!isall) {
      params = { ...params, problemid: 0 }
    }
    doRequest({ url: '/problems', type: 'GET', params })
      .then(result => this.setState({ problemList: result.data }))
      .catch(error => console.error(error))
      .finally(() => loading = false)
  }

  render() {
    const columns = [
      {
        title: '状态',
        key: 'status',
        width: 50,
        dataIndex: 'status',
        render: (status: string | number | null) => {
          const key = Number(status) || 0;
          switch (Number(key)) {
            case PROBLEM_STATUS.PASS:
              return <Tag key={key} icon={<CheckCircleOutlined />} color="success">{PROBLEM_STATUS_MAP[key]}</Tag>
            case PROBLEM_STATUS.WRONG:
              return <Tag key={key} icon={<ClockCircleOutlined />} color="processing">{PROBLEM_STATUS_MAP[key]}</Tag>
            default:
              return <Tag key={key} icon={<MinusCircleOutlined />} color="default">{PROBLEM_STATUS_MAP[key]}</Tag>
          }
        },
      },
      {
        title: '题目名称',
        dataIndex: 'title',
        key: 'title',
        render: (name: string, item: any) => <Button onClick={() => this.props.history.push(`/index/problem/${item.problemid}`)} type="link">{name}</Button>,
      },
      {
        title: '题解数',
        dataIndex: 'solutionCount',
        key: 'solutionCount',
      },
      {
        title: '回复数',
        dataIndex: 'replyCount',
        key: 'replyCount',
      },
      {
        title: '类别',
        dataIndex: 'type',
        key: 'type',
        render: (type: string) => <span className={styles.text} data-color={type}>{PROBLEM_TYPE_MAP[Number(type)]}</span>,
      },
      {
        title: '难度',
        dataIndex: 'rankid',
        key: 'rankid',
        render: (rankid: string) => <span className={styles.text} data-color={rankid}>{PROBLEM_RANK_MAP[Number(rankid)]}</span>,
      },
    ];
    const rankno: Array<string> = [];
    for (const key in PROBLEM_RANK) {
      if (parseInt(key)) {
        rankno.push(key);
      }
    }
    const statusMenu = (
      <Menu>
        {rankno.map(item => (
          <Menu.Item key={item} onClick={() => this.handleChangeStatus(+item)}>
            {PROBLEM_STATUS_MAP[item]}
          </Menu.Item>
        ))}
      </Menu>
    );
    const rankMenu = (
      <Menu>
        {rankno.map(item => (
          <Menu.Item key={item} onClick={() => this.handleChangeRank(+item)}>
            {PROBLEM_RANK_MAP[item]}
          </Menu.Item>
        ))}
      </Menu>
    );
    const { setList, labelList, problemList, set, label, } = this.state;
    const problemRankList = [
      { title: '快速排序', type: 'easy', rankno: 1 },
      { title: '翻转字符串', type: 'easy', rankno: 1 },
      { title: '基数排序', type: 'mid', rankno: -1 },
      { title: '红黑树', type: 'diffcult', rankno: -1 },
    ]
    const userRankList = [
      { title: 'theshy0404', rankno: 11 },
      { title: 'theshy0404', rankno: -1 },
      { title: 'theshy0404', rankno: 0 },
    ]
    return (
      <div className={styles.wrap}>
        <div className={styles.content}>
          <Space direction="vertical" size="middle" style={{ width: '100%', }}>
            <div className={styles.setList}>
              {setList.map(item => {
                return (
                  <div data-active={item.type === set} className={styles.set} key={item.type} onClick={() => this.handleChangeSet(item.type)}>
                    <img className={styles.logo} alt={item.name} src={require(`../../shared/images/public/${item.src + (item.type === set ? 'White' : '')}.svg`).default} />
                    <div>{item.name}</div>
                  </div>
                )
              }
              )}
            </div>
            <div className={styles.labelList}>
              {labelList.map(item => (
                <div onClick={() => this.handleChangeLabel(item.labelid)} data-active={item.labelid === label} className={styles.label} key={item.labelid}>
                  <div>{item.text}</div>
                </div>
              ))}
            </div>
            <Space size="middle" style={{ width: '100%', position: 'relative' }}>
              <Dropdown overlay={statusMenu}>
                <a href="" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  {this.state.status ? PROBLEM_STATUS_MAP[this.state.status] : '状态'} <DownOutlined />
                </a>
              </Dropdown>
              <Dropdown overlay={rankMenu}>
                <a href="" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  {this.state.rank ? PROBLEM_RANK_MAP[this.state.rank] : '难度'} <DownOutlined />
                </a>
              </Dropdown>
              <Input onChange={e => this.handleChangeName(e.target.value)} placeholder="请输入题目名" prefix={<SearchOutlined />} />
              <Space>
                <Button type="primary" onClick={() => this.doSearch(false)}>搜索</Button>
                <Button>重置</Button>
              </Space>
            </Space>
            <Table columns={columns} dataSource={problemList} />
          </Space>
        </div>
        <div className={styles.aside}>
          <CountModal isLogin={this.props.AuthStore.isLogin} />
          <RanknoModal type="problem" listData={problemRankList} />
          <RanknoModal type="user" listData={userRankList} />
        </div>
      </div>
    )
  }
}


export default withRouter(ProblemSet);
