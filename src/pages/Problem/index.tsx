import React, { useState } from 'react';
import styles from './styles.module.css';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tag, Typography, Comment, Avatar, Input, Button, Table, Menu, Dropdown, Skeleton, Space, Select, message, Modal, } from 'antd';
import { CheckCircleOutlined, CheckSquareOutlined, ClockCircleOutlined, CloseCircleOutlined, CloseSquareOutlined, DownOutlined, EditOutlined, ExclamationOutlined, MinusCircleOutlined, PlusOutlined, } from '@ant-design/icons';
import JSCode from '../../components/VSCode/JSCode';
import PyCode from '../../components/VSCode/PyCode';
import doRequest from '../../interface/useRequests';
import { LANGUAGE, LANGUAGE_MAP, PROBLEM_RANK_MAP, PROBLEM_STATUS, PROBLEM_STATUS_MAP } from '../../interface/Problem';
import ReplyComment from '../../components/Problem/ReplyComments'
import SQLCode from '../../components/VSCode/SQLCode';
import SolutionList from '../../components/Problem/SolutionList';
import SolutionModal from '../../components/Problem/SolutionModal';

const { Title, Paragraph, } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option, OptGroup } = Select;

let loading = false;

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
class Problem extends React.Component<any, any>{

  constructor(props: any) {
    super(props);
    this.state = { isShowSolutionModal: false, language: LANGUAGE.JAVASCRIPT, answer: '', sumbits: [], solutions: [], solutionLabels: [], selectSolutionLabels: [], };
    this.doRun = this.doRun.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.handleChangeSolutionLabels = this.handleChangeSolutionLabels.bind(this);
  }

  componentDidMount() {
    document.title = "题目详情";
    this.init();
  }

  init() {
    if (loading) return;
    let params = {};
    params = { ...params, url: '/problem?problemid=' + this.props.match.params.id };
    loading = true;
    doRequest(params)
      .then(result => this.setState({ ...result.data[0], language: 3, loading: false }))
      .catch(err => console.error(err))
      .finally(() => loading = false);
  }

  doRun(lines: Array<any>, isSQL: boolean = false) {
    let code = '';
    const func = this.state.func;
    const language = this.state.language;
    const input = this.state.input1;
    const output = this.state.output1;
    for (let line of lines) {
      code += line.code.replace('\t', '');
    }
    let params: any = {
      url: '/problem/run', needAuth: true, type: 'POST',
      params: {
        func, language, input, output, problemid: this.props.match.params.id, code
      }
    };
    doRequest(params).then(res => this.setState({ answer: res.data[0].data }))
      .catch(err => console.log(err))
  }

  renderCode() {
    if (+this.state.language === LANGUAGE.JAVASCRIPT) return <JSCode {...this.state} doRun={this.doRun} />;
    if (+this.state.language === LANGUAGE.PYTHON) return <PyCode  {...this.state} doRun={this.doRun} />;
    if (+this.state.language === LANGUAGE.MYSQL) return <SQLCode {...this.state} doRun={this.doRun} />;
    return <Skeleton />;
  }

  handleChangeLanguage(event: any) {
    const { key } = event;
    this.setState({ language: key });
  }

  onChangeTab(key: string) {
    if (key === '4') {
      let params = {
        url: '/problem/submits', needAuth: true, type: 'GET', params: { problemid: this.props.match.params.id }
      }
      return doRequest(params)
        .then(result => this.setState({ submits: result.data }))
    }
    if (key === '3') {
      let params = {
        url: '/problem/solution', type: 'GET', params: { problemid: this.props.match.params.id }
      }
      const getSolution = doRequest(params)
      params.url = '/solution/label';
      const getLabel = doRequest(params)
      Promise.all([getSolution, getLabel])
        .then(results =>
          this.setState({ solutions: results[0].data, solutionLabels: results[1].data }))
    }
  }

  handleChangeSolutionLabels(value: Array<any>) {
    if (value.filter(value => value < 10).length > 1) return message.warning('语言仅能选择一项哦')
    this.setState({ selectSolutionLabels: value })
  }

  handleResetSolutionLabels() {
    this.setState({ selectSolutionLabels: [] });
    let params = {
      url: '/problem/solution', type: 'GET', params: { problemid: this.props.match.params.id }
    }
    doRequest(params).then(result => this.setState({ solutions: result.data }))
  }

  handleSolutionLabelsSearch() {
    const language = this.state.selectSolutionLabels.filter((value: number) => value < 10)[0];
    let labels = '';
    this.state.selectSolutionLabels.filter((value: number) => value > 10)
      .forEach((value: number) => labels += (',' + value));
    doRequest({
      url: '/label/solution',
      type: 'GET',
      params: {
        language, labels, problemid: this.props.match.params.id
      }
    }).then(result => this.setState({ solutions: result.data }, () => console.log(this.state.solutions)))
  }

  handleChangeSolutionModalShow() {
    this.setState({ isShowSolutionModal: !this.state.isShowSolutionModal });
  }


  render() {
    const menu = (
      <Menu onClick={e => this.handleChangeLanguage(e)}>
        <Menu.Item key={1} disabled>
          C
        </Menu.Item>
        <Menu.Item key={2}>
          Python3
        </Menu.Item>
        <Menu.Item key={3}>
          JavaScript
        </Menu.Item>
        <Menu.Item key={4}>
          MySQL
        </Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: '提交时间',
        dataIndex: 'createtime',
        key: 'createtime',
      },
      {
        title: '语言',
        dataIndex: 'language',
        key: 'language',
        render: (item: any) => LANGUAGE_MAP[Number(item)]
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: string | number | null) => {
          const key = Number(status) || 0;
          switch (Number(key)) {
            case PROBLEM_STATUS.PASS:
              return <Tag key={key} icon={<CheckCircleOutlined />} color="success">{PROBLEM_STATUS_MAP[key]}</Tag>
            case PROBLEM_STATUS.WRONG:
              return <Tag key={key} icon={<ClockCircleOutlined />} color="processing">{PROBLEM_STATUS_MAP[key]}</Tag>
            case PROBLEM_STATUS.ERROR:
              return <Tag key={key} icon={<ExclamationOutlined />} color="error">{PROBLEM_STATUS_MAP[key]}</Tag>
            case PROBLEM_STATUS.NONE:
              return <Tag key={key} icon={<MinusCircleOutlined />} color="default">{PROBLEM_STATUS_MAP[key]}</Tag>
          }
        },
      },
    ];
    return (
      <div className={styles.wrap}>
        <Tabs onChange={this.onChangeTab} type="card" style={{ width: '50%' }}>
          <TabPane tab="题目介绍" key="1">
            <Space>
              {!this.state.loading ?
                <div className={styles.tab}>
                  <Title level={3} style={{ fontWeight: '500px' }}>
                    {this.state.title}
                  </Title>
                  <Space>
                    <Tag>{PROBLEM_RANK_MAP[this.state.rankid]}</Tag>
                    <Tag>{this.state.type}</Tag>
                    <Tag>{this.state.label}</Tag>
                  </Space>
                  <Paragraph >
                    {this.state.msg}
                  </Paragraph>
                  <Space direction="vertical" style={{ width: '50%' }}>
                    {this.state.answer === '' ? <>
                      输入<Input disabled value={this.state.input2} />
                      预期输出<Input disabled value={this.state.output2} />
                    </> :
                      <>测试用例<Input disabled value={this.state.input1} />
                        实际输出<TextArea style={{ color: '#f5222d' }} disabled value={this.state.answer} />
                        预期输出<Input disabled value={this.state.output1} />
                      </>}
                  </Space>
                </div> :
                <Skeleton />}
            </Space>
          </TabPane>
          <TabPane tab={"评论(" + this.state.replyCount + ")"} key="2">
            <div className={styles.tab}>
              <ReplyComment problemid={this.props.match.params.id} />
            </div>
          </TabPane>
          <TabPane tab={"题解"} key="3">
            <div className={styles.tab}>
              <div className={styles.solutionHeader}>
                <Select
                  mode="multiple"
                  size="small"
                  placeholder="选择标签"
                  value={this.state.selectSolutionLabels}
                  onChange={this.handleChangeSolutionLabels}
                  style={{ width: '85%' }}
                >
                  <OptGroup label="语言">
                    {this.state.solutionLabels.map((item: { value: any, label: string }) => {
                      if (item.value < 10)
                        return <Option key={item.value} value={item.value}>{LANGUAGE_MAP[item.value]}</Option>
                    })}
                  </OptGroup>
                  <OptGroup label="标签">
                    {this.state.solutionLabels.map((item: { value: any, label: string }) => {
                      if (item.value > 10)
                        return <Option key={item.value} value={item.value}>{item.label}</Option>
                    })}
                  </OptGroup>
                </Select>
                <Button onClick={() => this.handleSolutionLabelsSearch()} type="primary" size="small">搜索</Button>
                <Button onClick={() => this.handleResetSolutionLabels()} size="small">重置</Button>
              </div>
              <Modal
                title="增加题解"
                visible={this.state.isShowSolutionModal}
                onCancel={() => this.handleChangeSolutionModalShow()}
                cancelText="关闭"
                okText="发布题解"
                width={700}
              >
                <SolutionModal problemid={this.props.match.params.id} />
              </Modal>
              <Button onClick={() => this.handleChangeSolutionModalShow()} icon={<EditOutlined />} style={{ margin: '10px 0px', width: '100%' }} type="primary" >写题解</Button>
              <SolutionList problemid={this.props.match.params.id} solutions={this.state.solutions} />
            </div>
          </TabPane>
          <TabPane tab="提交记录" key="4">
            <div className={styles.tab}>
              <Table pagination={false} bordered style={{ boxShadow: '0px 4px 8px #f0f0f0' }} columns={columns} dataSource={this.state.submits} />
            </div>
          </TabPane>
        </Tabs>
        <div className={styles.notebook}>
          <Dropdown overlay={menu}>
            <a href="/" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              {LANGUAGE_MAP[this.state.language]} <DownOutlined />
            </a>
          </Dropdown>
          {this.renderCode()}
        </div>
      </div>
    )
  }
}


export default withRouter(Problem);
