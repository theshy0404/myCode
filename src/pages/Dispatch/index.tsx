import React from 'react';
import styles from './styles.module.css';
import '../../App.css'
import Logo from '../../shared/images/public/code.svg';
import { Avatar, Badge } from 'antd';
import { BellOutlined, BookOutlined, ContactsOutlined, FileDoneOutlined, LoginOutlined, SettingOutlined, SolutionOutlined, SoundOutlined, StarOutlined, TranslationOutlined, UserOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import UserAvatar from '../../shared/images/public/user.png';
import { withRouter } from 'react-router-dom';

@inject('AuthStore')
@observer
class Login extends React.Component<any, any>{
  constructor(props: any) {
    super(props);
    this.state = { showUserMenu: false };
    this.handleChangeUserMenuShow=this.handleChangeUserMenuShow.bind(this);
  }

  handleChangeUserMenuShow(): void {
    if (this.state.showUserMenu) this.setState({ showUserMenu: false });
  }

  render() {
    const navLists = ['题库', '测试', '讨论'];
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
            <div className={styles.logo}><img src={Logo} alt="Logo" /><div>MyCode</div></div>
            <div className={styles.nav}>
              {navLists.map((item, index) => <div data-active={index === 0} className={styles.navtion} key={index}>{item}</div>)}
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
      </div>
    )
  }
}


export default withRouter(Login);
