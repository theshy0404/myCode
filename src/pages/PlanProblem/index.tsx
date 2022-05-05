import React from 'react';
import styles from './styles.module.css';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Tag, Typography, Input, Menu, Dropdown, Skeleton, Space, message, Modal, Drawer, } from 'antd';
import { DownOutlined, } from '@ant-design/icons';
import JSCode from '../../components/VSCode/JSCode';
import PyCode from '../../components/VSCode/PyCode';
import doRequest from '../../interface/useRequests';
import { LANGUAGE, LANGUAGE_MAP, PROBLEM_RANK_MAP, } from '../../interface/Problem';
import SQLCode from '../../components/VSCode/SQLCode';
import Editor from 'for-editor';
import './styles.css';
import SubmitCard from '../../components/Problem/SubmitCard';
import Code from '../../components/Code';

const { Title, } = Typography;
const { TextArea } = Input;

const labelHashMap = {
  '001': '动态规划',
  '002': '深度优先遍历',
  '003': '广度优先遍历',
  '004': '回溯法',
  '005': '双指针',
  '006': '数组',
  '007': '哈希表',
  '008': '递归',
  '009': '字符串',
  '010': '滑动窗口',
  '011': '数学',
  '012': '正则',
}
let loading = false;

// const ExampleComment = (props: any) => {
//   const [isReply, handleChangeIsReply] = useState(false);
//   const [isShow, handleChangeShow] = useState(false);
//   return (
//     <Comment
//       actions={[<span onClick={() => { handleChangeShow(!isShow) }} key="comment-nested-expand-to">Expand</span>,
//       <span onClick={() => { handleChangeIsReply(!isReply) }} key="comment-nested-reply-to">Reply to</span>,
//       <Button type="primary" size="small" style={!isReply ? { display: 'none', float: 'right' } : {}} key="comment-nested-sumbit">Sumbit</Button>]}
//       author={<p >Han Solo</p>}
//       avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
//       content={
//         <>
//           <p>
//             We supply a series of design principles, practical patterns and high quality design
//             resources (Sketch and Axure).
//           </p>
//           {isReply && <TextArea style={{ width: '90%' }} rows={2} />}
//         </>
//       }
//     >
//       {isShow && props.children}
//     </Comment>
//   )
// };

@inject('AuthStore', 'SolutionStore')
@observer
class Problem extends React.Component<any, any>{

  constructor(props: any) {
    super(props);
    this.state = { noteLoading: false, isShowNoteTip: false, editnote: '', isShowCodeModal: false, showCode: '', result: { output: '', isError: false }, codeVisible: false, isShowSubmitModal: false, isShowSolutionModal: false, example: [], results: [], language: LANGUAGE.JAVASCRIPT, answer: '', sumbits: [], solutions: [], solutionLabels: [], selectSolutionLabels: [], input: '', output: '' };
    this.doRun = this.doRun.bind(this);
    this.doSubmit = this.doSubmit.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.handleChangeSolutionLabels = this.handleChangeSolutionLabels.bind(this);
    this.saveSolution = this.saveSolution.bind(this);
  }

  componentDidMount() {
    document.title = "题目详情";
    this.init();
  }

  init() {
    if (loading) return;
    let params = {};
    console.log(this.props.match.params);
    params = { ...params, url: '/problem?problemid=' + this.props.match.params.problemid };
    loading = true;
    doRequest(params)
      .then(result => {
        this.setState({ ...result.data[0], language: result.data[0].typeid === 3 ? 4 : 3, loading: false });
      })
      .catch(err => console.error(err))
      .finally(() => loading = false);
  }

  doRun(code: string, isSQL: boolean = false) {
    const language = this.state.language;
    if (language === LANGUAGE.JAVASCRIPT) {
      let params: any = {
        url: '/problem/runJS', needAuth: true, type: 'POST',
        params: {
          code, problemid: this.props.match.params.problemid
        }
      };
      doRequest(params)
        .then(res => this.setState({ result: res.data[0], codeVisible: true }))
        .catch(err => console.log(err));
    }
  }

  doSubmit(code: string, isSQL: boolean = false) {
    this.setState({ isShowSubmitModal: true });
    const language = this.state.language;
    let params: any = {
      url: '/plan/problem/submit', needAuth: true, type: 'POST',
      params: {
        code, problemid: this.props.match.params.problemid, language, planid: this.props.match.params.planid,
      }
    };
    doRequest(params)
      .then(res => this.setState({ submitInfo: res.data[0] }, () => console.log(res)))
      .catch(err => console.log(err));
  }

  renderCode() {
    if (+this.state.language === LANGUAGE.JAVASCRIPT) return <JSCode {...this.state} doSubmit={this.doSubmit} doRun={this.doRun} />;
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
        url: '/problem/submit', needAuth: true, type: 'GET', params: { problemid: this.props.match.params.problemid }
      }
      return doRequest(params)
        .then(result => this.setState({ submits: result.data }))
    }
    if (key === '3') {
      let params = {
        url: '/problem/solutions', type: 'GET', params: { problemid: this.props.match.params.problemid }
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
    if (value.filter(value => value.length === 1).length > 1) return message.warning('语言仅能选择一项哦')
    this.setState({ selectSolutionLabels: value })
  }

  handleResetSolutionLabels() {
    this.setState({ selectSolutionLabels: [] });
    let params = {
      url: '/problem/solutions', type: 'GET', params: { problemid: this.props.match.params.problemid }
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
        language, labels, problemid: this.props.match.params.problemid
      }
    }).then(result => this.setState({ solutions: result.data }, () => console.log(this.state.solutions)))
  }

  handleChangeSolutionModalShow() {
    this.setState({ isShowSolutionModal: !this.state.isShowSolutionModal });
  }

  handleChangeSubmitModalShow() {
    this.setState({ isShowSubmitModal: !this.state.isShowSubmitModal });
  }

  saveSolution() {
    this.props.SolutionStore.addSolution({ userid: this.props.AuthStore.userid, problemid: this.props.match.params.problemid })
      .then(() => message.success('已进入流程'))
      .catch(() => message.error('出错了'))
      .finally(() => this.setState({ isShowSolutionModal: false }));
  }

  showDrawer = () => {
    this.setState({
      codeVisible: true,
    });
  };

  onDrawerClose = () => {
    this.setState({
      codeVisible: false,
    });
  };

  showCodeModal(code: string) {
    this.changeShowCodeMode();
    this.setState({ showCode: code });
  }

  changeShowCodeMode() {
    this.setState({ isShowCodeModal: !this.state.isShowCodeModal })
  }

  changeNoteTipShow(id = '', note = '') {
    if (note !== '') {
      return this.setState({ isShowNoteTip: !this.state.isShowNoteTip, editnote: note, selectid: id })
    }
    this.setState({ isShowNoteTip: !this.state.isShowNoteTip })
  }

  saveNote() {
    this.setState({ noteLoading: true });
    let params = {
      url: '/problem/submit/note', type: 'POST', needAuth: true, params: {
        submitid: this.state.selectid,
        problemid: this.props.match.params.problemid,
        note: this.state.editnote
      }
    };
    doRequest(params)
      .then(() => {
        message.success('备注成功');
        let params = {
          url: '/problem/submit', needAuth: true, type: 'GET', params: { problemid: this.props.match.params.problemid }
        }
        doRequest(params)
          .then(result => this.setState({ submits: result.data }))
      })
      .finally(() => {
        this.setState({ noteLoading: false, editnote: '' });
        this.changeNoteTipShow();
      });
  }

  render() {
    const menu = (
      <Menu onClick={e => this.handleChangeLanguage(e)}>
        {/* <Menu.Item key={1} disabled>
          C
        </Menu.Item> */}
        <Menu.Item key={2} disabled>
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
    return (
      <div className={styles.wrap}>
        <Modal
          title={<>备注</>}
          visible={this.state.isShowNoteTip}
          onCancel={() => this.changeNoteTipShow()}
          cancelText="关闭"
          okText="确定"
          confirmLoading={this.state.noteLoading}
          onOk={() => this.saveNote()}
        >
          <TextArea placeholder="添加备注..." autoSize value={this.state.editnote} onChange={e => { this.setState({ editnote: e.target.value }) }} />
        </Modal>
        <Space direction="vertical" style={{ width: '100%', }}>
          {!this.state.loading ?
            <div className={styles.tab}>
              <Title level={3} style={{ fontWeight: '500px' }}>
                {this.state.title}
              </Title>
              <Space style={{ backgroundColor: '#fff', zIndex: '100', position: 'relative', padding: '10px', width: '100%' }}>
                <Tag>{PROBLEM_RANK_MAP[this.state.rankid]}</Tag>
                <Tag>{this.state.type}</Tag>
                {
                  typeof this.state.labels === 'string' && this.state.labels.split(',').map((item: any) => <Tag key={item}>{labelHashMap[item]}</Tag>)
                }
              </Space>
              <Editor style={{ border: 'none', height: '550px', boxShadow: 'none', marginTop: '-35px' }} preview value={this.state.msg} />
              {/* <Paragraph style={{ marginTop: '10px' }}>
                    {this.state.msg}
                  </Paragraph> */}
              {/* {
                    this.state.typeid === 3
                      ?
                      <Space size="large" direction="vertical" style={{ width: '90%' }}>
                        预期结果
                        <MyTable results={JSON.parse(this.state.example)} />
                        <Divider plain>共{JSON.parse(this.state.example).length}条数据</Divider>
                        {this.state.results.length > 0 &&
                          <>
                            查询结果
                            <MyTable results={this.state.results} />
                            <Divider plain></Divider>
                          </>
                        }
                      </Space>
                      : <Space direction="vertical" style={{ width: '50%' }}>
                        {
                          this.state.answer === '' ?
                            <>
                              输入<Input disabled value={this.state.input} />
                              预期输出<Input disabled value={this.state.output} />
                            </> :
                            <>
                              测试用例<Input disabled value={this.state.input} />
                              实际输出<TextArea style={{ color: '#f5222d' }} disabled value={this.state.answer} />
                              预期输出<Input disabled value={this.state.output} />
                            </>
                        }
                      </Space>
                  } */}
            </div> :
            <Skeleton />}
        </Space>
        <div className={styles.notebook}>
          <Dropdown overlay={menu}>
            <a href="/" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              {LANGUAGE_MAP[this.state.language]} <DownOutlined />
            </a>
          </Dropdown>
          {/* {this.renderCode()} */}
          <Code doSubmit={this.doSubmit} doRun={this.doRun} {...this.state} />
          <Drawer
            title="测试结果"
            placement="bottom"
            closable={false}
            onClose={this.onDrawerClose}
            visible={this.state.codeVisible}
            getContainer={false}
            style={{ position: 'absolute' }}
          >
            <Space direction="vertical" style={{ width: '100%', }}>
              测试用例<Input disabled value={this.state.input.split('\n')[0]} />
              预期输出<Input disabled value={this.state.output.split('\n')[0]} />
              实际输出<TextArea style={this.state.result.isError ? { color: '#f5222d' } : {}} disabled value={this.state.result.output || ''} />
            </Space>
          </Drawer>
        </div>
        <Modal
          title={<>提交结果</>}
          visible={this.state.isShowSubmitModal}
          onCancel={() => this.handleChangeSubmitModalShow()}
          cancelText="关闭"
          width={700}
          onOk={() => this.handleChangeSubmitModalShow()}
        >
          <SubmitCard details={this.state.submitInfo} />
        </Modal>
      </div>
    )
  }
}


export default withRouter(Problem);
