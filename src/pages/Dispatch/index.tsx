import React from 'react';
import styles from './styles.module.css';
import './styles.css';
import '../../App.css'
import { Avatar, Badge, Popover, Spin, } from 'antd';
import { DownOutlined, LoadingOutlined, } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import UserAvatar from '../../shared/images/public/user.png';
import MessageLogo from '../../shared/images/public/message.svg';
import { Redirect, Route, HashRouter as Router, Switch, withRouter } from 'react-router-dom';
import MessageModal from '../../components/MessageModal';
import { CSSTransition } from 'react-transition-group';
import UserMessageStore from '../../store/UserMessageStore';
import CAT_PNG from '../../shared/images/public/CAT.png';
import AuthStore from '../../store/AuthStore';

type TAvtive = 'problemset' | 'learn' | 'circle' | 'answer';
type TState = {
  showUserMenu: boolean,
  active: TAvtive,
}
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const ProblemSet = React.lazy(() => import('../ProblemSet'));
const Problem = React.lazy(() => import('../Problem'));
const Circle = React.lazy(() => import('../Circle'));
const Solution = React.lazy(() => import('../Solution'));
const CircleDetails = React.lazy(() => import('../CircleDetails'));
const CircleForums = React.lazy(() => import('../CircleForums'));
const Learn = React.lazy(() => import('../Learn'));
const PlanDetails = React.lazy(() => import('../PlanDetail'));
const PlanProblem = React.lazy(() => import('../PlanProblem'));
const Analysis = React.lazy(() => import('../Analysis'));
const Loading = () => <Spin indicator={antIcon} />

const Menu = (props: any) => {
  const menuItems = [
    { id: 1, title: '个人资料' },
    { id: 2, title: '做题记录' },
    { id: 3, title: '我的发帖' },
    { id: 4, title: '做题分析' },
  ]
  return (
    <div className={styles.menu}>
      {
        menuItems.map((item: any) => (
          <div key={item.id} className={styles.item}>{item.title}</div>
        ))
      }
      <div onClick={() => props.toLogin()} key={4} className={styles.item}>{props.AuthStore.isLogin ? '退出登录' : '去登录'}</div>
    </div>
  )
}

@inject('AuthStore')
@observer
class Main extends React.Component<any, TState> {
  constructor(props: any) {
    super(props);
    const pathname = this.props.history.location.pathname.replace('/index', '');
    this.state = { showUserMenu: false, active: pathname === '' ? 'problemset' : pathname.replace('/', ''), };
    this.handleChangeUserMenuShow = this.handleChangeUserMenuShow.bind(this);
  }

  componentDidMount() {
    document.title = "MyCode";
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      const pathname = nextProps.location.pathname.replace('/index', '');
      this.setState({ active: pathname === '' ? 'problemSet' : pathname.replace('/', '') })
    }
  }

  handleChangeUserMenuShow(): void {
    if (this.state.showUserMenu) this.setState({ showUserMenu: false });
  }

  handleChangeActive(active: TAvtive): void {
    this.setState({ active }, () => {
      this.props.history.push(`/index/${active}`);
    })
  }

  toLogin() {
    AuthStore.exitLogin();
    this.props.history.replace('/login');
  }

  render() {
    const navLists: Array<{ id: TAvtive, title: string }> = [
      { id: 'problemset', title: '题库' },
      { id: 'learn', title: '学习' },
      { id: 'circle', title: '讨论' },
    ];
    const { AuthStore } = this.props;
    return (
      <div className={styles.wrap} >
        {/* {showMessageModal && <MessageModal onClose={() => this.setState({ showMessageModal: false })} />} */}
        <CSSTransition
          in={UserMessageStore.isShowMessageModal}//为true进入显示组件（主要通过in属性来控制组件状态）
          classNames="card"//设置类名的前缀
          timeout={200}//设置过渡动画事件
          unmountOnExit={true}//消失动画结束后 + display:none
        >
          <MessageModal onClose={() => UserMessageStore.changeShowMessageModal()} />
        </CSSTransition>
        <div className={styles.header}>
          <div className={styles.navList}>
            <div className={styles.title}>MyCode🔥</div>
            {
              navLists.map((item: any) => (
                <div onClick={() => this.handleChangeActive(item.id)} data-active={item.id === this.state.active} key={item.id} className={styles.nav}>{item.title}</div>
              ))
            }
          </div>
          <div className={styles.action}>
            <Badge style={UserMessageStore.isShowNew ? {} : { display: 'none' }} dot>
              <img alt="message" onClick={() => UserMessageStore.changeShowMessageModal()} style={{ width: '36px', cursor: 'pointer' }} src={MessageLogo} />
            </Badge>
            {AuthStore.isLogin && <Avatar style={{ marginLeft: '20px' }} size={36} src={AuthStore.userid === '1318936142' ? UserAvatar : CAT_PNG}></Avatar>}
            <span className={styles.user}>
              <Popover placement="bottomRight" content={() => <Menu toLogin={() => this.toLogin()} AuthStore={this.props.AuthStore} />} trigger="hover">
                <div className={styles.user}>{AuthStore.isLogin ? AuthStore.username : '未登录'}<DownOutlined style={{ fontSize: '10px' }} /></div>
              </Popover>
            </span>
          </div>
        </div>
        <React.Suspense fallback={<Spin indicator={<Loading />} />}>
          <Router>
            <Switch>
              <Route exact path="/index/problemset"><ProblemSet /></Route>
              <Route exact path="/index/problem/:id"><Problem /></Route>
              <Route exact path="/index/solution/:id"><Solution /></Route>
              <Route exact path="/index/learn"><Learn /></Route>
              <Route exact path="/index/plan/:id"><PlanDetails /></Route>
              <Route exact path="/index/plan/problem/:planid/:problemid"><PlanProblem /></Route>
              <Route exact path="/index/circle"><Circle /></Route>
              <Route exact path="/index/circle/:id"><CircleDetails /></Route>
              <Route exact path="/index/forum/:id"><CircleForums /></Route>
              <Route exact path="/index/answer">问答</Route>
              <Route exact path="/index/analysis"><Analysis /></Route>
              <Route exact path="/index"><Redirect from="" to="/index/problemset" /></Route>
              <Route path="/index*"><Redirect from="" to="/index/error" /></Route>
            </Switch>
          </Router>
        </React.Suspense>
      </div>
    )
  }
}


export default withRouter(Main);
