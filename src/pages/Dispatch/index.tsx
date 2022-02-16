import React from 'react';
import styles from './styles.module.css';
import '../../App.css'
import Logo from '../../shared/images/public/code.svg';
import { Avatar, Badge, Popover, } from 'antd';
import { BellOutlined, BookOutlined, ContactsOutlined, FileDoneOutlined, LoginOutlined, SettingOutlined, SolutionOutlined, SoundOutlined, StarOutlined, TranslationOutlined, UserOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import UserAvatar from '../../shared/images/public/user.png';
import { Redirect, Route, HashRouter as Router, Switch, withRouter } from 'react-router-dom';
import asyncComponent from '../../interface/useComponents/asyncComponent';

type TAvtive = 'problemset' | 'test' | 'circle';
type TState = {
  showUserMenu: boolean,
  active: TAvtive,
}

const ProblemSet = asyncComponent(() => import('../ProblemSet'));
const Problem = asyncComponent(() => import('../Problem'));
const Circle = asyncComponent(() => import('../Circle'));

@inject('AuthStore')
@observer
class Main extends React.Component<any, TState> {
  constructor(props: any) {
    super(props);
    const pathname = this.props.history.location.pathname.replace('/index', '');
    this.state = { showUserMenu: false, active: pathname === '' ? 'problemset' : pathname.replace('/', '') };
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
      const { history } = this.props;
      if (active === 'problemset') history.push('/index/problemset');
      if (active === 'test') history.push('/index/test');
      if (active === 'circle') history.push('/index/circle');
    })
  }

  render() {
    const navLists: Array<{ id: TAvtive, title: string }> = [
      { id: 'problemset', title: '题库' },
      { id: 'test', title: '测试' },
      { id: 'circle', title: '讨论' },
    ];
    const { AuthStore, history } = this.props;
    const userMenu = [
      { id: 1, icon: <StarOutlined />, msg: '我的收藏夹' },
      { id: 2, icon: <BookOutlined />, msg: '我的笔记' },
      { id: 3, icon: <SolutionOutlined />, msg: '我的题解' },
      { id: 4, icon: <FileDoneOutlined />, msg: '我的做题记录' },
      { id: 5, icon: <SoundOutlined />, msg: '我的讨论' },
      { id: 6, icon: <ContactsOutlined />, msg: '个人资料' },
      { id: 7, icon: <LoginOutlined />, msg: '退出登录' },
    ];
    return (
      <div className={styles.wrap} onClick={this.handleChangeUserMenuShow}>
        <header className={styles.header}>
          <div className={styles.selection}>
            <Popover placement="bottomLeft" title="MyCode" content="一起敲代码吧" trigger="hover">
              <div className={styles.logo}><img src={Logo} alt="Logo" /><div>MyCode</div></div>
            </Popover>
            <div className={styles.nav}>
              {navLists.map(item => <div onClick={() => this.handleChangeActive(item.id)} data-active={item.id === this.state.active} className={styles.navtion} key={item.id}>{item.title}</div>)}
            </div>
          </div>
          <div className={styles.user}>
            <div> <TranslationOutlined className={styles.icon} /></div>
            <div>
              <Badge dot>
                <BellOutlined className={styles.icon} />
              </Badge>
            </div>
            <div onClick={() => { this.setState({ showUserMenu: true }) }} className={styles.user}>
              {AuthStore.isLogin ? <Avatar size={28} src={UserAvatar} /> : <Avatar size={28} icon={<UserOutlined />} />}
              {this.state.showUserMenu && <div className={styles.userModal}>
                <div className={styles.userHeader}>
                  <div className={styles.userName}><UserOutlined style={{ fontSize: '16px', marginRight: '5px' }} />{AuthStore.isLogin ? AuthStore.username : '未登录'}</div>
                  {AuthStore.isLogin ? <SettingOutlined style={{ fontSize: '16px' }} /> :
                    <div onClick={() => history.push('/login')} className={styles.loginButton}>立即登录</div>}
                </div>
                <div className={styles.userContent}>
                  {userMenu.map((item, index) => (
                    <div data-active={index === 0} key={item.id} className={styles.item}>{item.icon}{item.msg}</div>
                  ))}
                </div>
              </div>}
            </div>
          </div>
        </header>
        <Router>
          <Switch>
            <Route exact path="/index/problemset"><ProblemSet /></Route>
            <Route exact path="/index/problem/:id"><Problem /></Route>
            <Route exact path="/index/test"><h1>敬请期待</h1></Route>
            <Route exact path="/index/circle"><Circle /></Route>
            <Route exact path="/index"><Redirect from="" to="/index/problemset" /></Route>
            <Route path="/index*"><Redirect from="" to="/error" /></Route>
          </Switch>
        </Router>
      </div>
    )
  }
}


export default withRouter(Main);
