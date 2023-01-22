import React from 'react';
import styles from './styles.module.css';
import '../../App.css'
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Button, Cascader, Dropdown, Form, Input, Menu, message, Modal, Pagination, Select, Space, Table, Tag, } from 'antd';
import { CheckCircleOutlined, DownOutlined, MinusCircleOutlined, RightOutlined, SearchOutlined, WarningOutlined } from '@ant-design/icons';
import doRequest from '../../interface/useRequests';
import { PROBLEM_RANK, PROBLEM_RANK_MAP, PROBLEM_STATUS, PROBLEM_STATUS_MAP, } from '../../interface/Problem';
import UPLOAD_PROBLEM from '../../shared/images/public/uploadProblem.png';
import Editor from 'for-editor';
import ROUND_PNG from '../../shared/images/public/ROUND.svg';

const { Option } = Select;

type TState = {
  setList: Array<any>,
  typeList: Array<any>,
  problemList: Array<any>,
  set: string,
  type?: string,
  status?: number,
  rank?: number,
  problemname?: string,
  labelList: Array<any>,
  selectLabels: Array<any>,
  isModalVisible: boolean,
  pageNo: number,
  total: number,
}

let loading: boolean = false;

@inject('AuthStore')
@observer
class ProblemSet extends React.Component<any, TState>{

  constructor(props: any) {
    super(props);
    this.state = {
      isModalVisible: false,
      total: 0,
      pageNo: 1,
      setList: [
        { name: '全部题目', src: 'all', type: '0' },
        { name: '数据结构', src: 'tree', type: 'B' },
        { name: '算法', src: 'func', type: 'A' },
        { name: '数据库', src: 'sql', type: 'C' },
      ],
      typeList: [],
      problemList: [],
      labelList: [],
      set: '0',
      selectLabels: [],
    };
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  async componentDidMount() {
    document.title = "MyCode-题库";
    this.init().then(result => {
      const { typeList, problemList, labelList, total, } = result;
      this.setState({ typeList, problemList, labelList, total });
    })
  }

  async init() {
    let problemList: Array<any> = [];
    let typeList: Array<any> = [];
    let labelList: Array<any> = [];
    let total: number = 0;
    await doRequest({
      url: '/problems', type: 'GET',
    }).then(res => [problemList, total] = [res.data[0].results, res.data[0].total]);
    await doRequest({
      url: '/problems/types', type: 'GET',
    }).then(res => typeList = res.data);
    await doRequest({
      url: '/problems/labels', type: 'GET',
    }).then(res => labelList = res.data);
    return Promise.resolve({ problemList, typeList, labelList, total, });
  }

  handleChangeSet(set: string) {
    if (loading) return message.warning('不用太急啦');
    loading = true;
    doRequest({ url: '/problems/types', params: { typeid: set } })
      .then(result => this.setState({ set, typeList: result.data }))
      .catch(error => console.log(error))
      .finally(() => loading = false);
  }

  handleChangeType(type: string) {
    if (type === this.state.type) return this.setState({ type: undefined }, () => this.doSearch());
    this.setState({ type }, () => this.doSearch());
  }

  handleChangeRank(rank: number) {
    this.setState({ rank }, () => this.doSearch());
  }

  handleChangeStatus(status: number) {
    this.setState({ status }, () => this.doSearch());
  }

  handleChangeName(name: string) {
    this.setState({ problemname: name });
  }

  handleChangeLabel(label: string) {
    const { selectLabels } = this.state;
    if (selectLabels.includes(label)) this.setState({ selectLabels: selectLabels.filter(item => item !== label) }, () => this.doSearch())
    else this.setState({ selectLabels: [...selectLabels, label] }, () => this.doSearch())
  }

  async doSearch(ispage = false) {
    if (loading) return message.warning('不用太急啦');
    loading = true;
    let params = {}
    const { set = undefined, problemname = undefined, rank = undefined, type = undefined, status = undefined, selectLabels, pageNo, total } = this.state;
    if (set) params = { ...params, type: set };
    if (problemname) params = { ...params, problemname };
    if (rank) params = { ...params, rank };
    if (selectLabels.length !== 0) params = { ...params, labels: selectLabels.join(',') };
    if (type) params = { ...params, type };
    if (status) params = { ...params, status };
    if (pageNo) params = { ...params, pageNo };
    doRequest({ url: '/problems', type: 'GET', params })
      .then(result => this.setState({ problemList: result.data[0].results, total: ispage ? total : result.data[0].total, }))
      .catch(error => console.error(error))
      .finally(() => loading = false)
  }

  doReset() {
    this.setState({
      set: '0',
      problemname: '',
      rank: undefined,
      type: undefined,
      status: undefined,
      selectLabels: [],
    }, () => this.doSearch());
  }

  onReadlyUpload() {
    this.setState({ isModalVisible: true });
  }

  handleOk() {
    this.setState({ isModalVisible: false });
  }

  handleCancel() {
    this.setState({ isModalVisible: false });
  }

  onPageChange(page: number) {
    this.setState({ pageNo: page }, () => this.doSearch(true));
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
              return <Tag key={key} icon={<WarningOutlined />} color="error">{PROBLEM_STATUS_MAP[key]}</Tag>
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
        title: '通过率',
        dataIndex: 'rate',
        key: 'rate',
        render: (type: string) => <span className={styles.text}>{type}</span>,
      },
      {
        title: '类别',
        dataIndex: 'type1',
        key: 'type1',
        render: (type: string, row: any) => <span className={styles.text}>{row.type1} —&gt; {row.type2}</span>,
      },
      // {
      //   title: '次类别',
      //   dataIndex: 'type2',
      //   key: 'type2',
      //   render: (type: string) => <span className={styles.text}>{type}</span>,
      // },
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
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const { setList, typeList, problemList, labelList, set, type, selectLabels, isModalVisible, total, pageNo, } = this.state;
    return (
      <div className={styles.wrap}>
        <Modal width={1200} title="我要上传题目" okText="提交" visible={isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <Form  {...layout}>
            <Form.Item label="类别" name="type">
              <Cascader
              />
            </Form.Item>
            <Form.Item label="题目名" name="title">
              <Input />
            </Form.Item>
            <Form.Item label="题目描述" name="msg">
              <Editor />
            </Form.Item>
            <Form.Item label="难度" name="rankid">
              <Select>
                <Option value={1}>简单</Option>
                <Option value={2}>中等</Option>
                <Option value={3}>困难</Option>
              </Select>
            </Form.Item>
            <Form.Item label="测试用例-输入" name="input">
              <Input.TextArea rows={5} />
            </Form.Item>
            <Form.Item label="测试用例-输出" name="output">
              <Input.TextArea rows={5} />
            </Form.Item>
            <Form.Item label="关联标签" name="labels">
              <Select mode="multiple">
                {labelList.map((item: any) => <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item label="函数名" name="func">
              <Input />
            </Form.Item>
            <Form.Item label="参数" name="arguements">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
        <div className={styles.content}>
          <Space direction="vertical" style={{ width: '100%', }}>
            {setList.length !== 0 && <div className={styles.setList}>
              {setList.map(item => {
                return (
                  <div data-active={item.type === set} className={styles.set} key={item.type} onClick={() => this.handleChangeSet(item.type)}>
                    <img className={styles.logo} alt={item.name} src={require(`../../shared/images/public/${item.src + (item.type === set ? 'White' : '')}.svg`).default} />
                    <div>{item.name}</div>
                  </div>
                )
              }
              )}
            </div>}
            {typeList.length !== 0 && <div className={styles.typeList}>
              {typeList.map(item => (
                <div onClick={() => this.handleChangeType(item.typeid)} data-active={item.typeid === type} className={styles.type} key={item.typeid}>
                  <div>{item.text}</div>
                </div>
              ))}
            </div>}
            <div className={styles.labelList}>
              {labelList.map(item => <div onClick={() => this.handleChangeLabel(item.labelid)} data-active={selectLabels.includes(item.labelid)} className={styles.label} key={item.labelid}>{item.text}</div>)}
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
                <Button type="primary" onClick={() => this.doSearch()}>搜索</Button>
                <Button onClick={() => this.doReset()}>重置</Button>
              </Space>
            </Space>
            <Table style={{ border: '1px solid #f0f0f0', boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.08)' }} pagination={false} columns={columns} dataSource={problemList} />
            {total > 0 && <Pagination onChange={page => this.onPageChange(page)} style={{ float: 'right' }} pageSize={8} current={pageNo} total={total} />}
          </Space>
        </div>
        <div className={styles.aside}>
          <div onClick={() => this.props.history.push('analysis')} className={styles.roundWrap}>
            <div className={styles.left}>
              <img alt="好嘛好嘛" src={ROUND_PNG} />
              <div className={styles.text}>学习情况分析</div>
            </div>
            <RightOutlined />
          </div>
          <p>分享我的好题目</p>
          <div onClick={() => this.onReadlyUpload()} className={styles.uploadModal}>
            <img alt="uploadModal" src={UPLOAD_PROBLEM} />
          </div>
        </div>
      </div>
    )
  }
}


export default withRouter(ProblemSet);
