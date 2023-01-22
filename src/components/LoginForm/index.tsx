import React, { createRef } from 'react';
import styles from './styles.module.css';
import '../../App.css';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { message, } from 'antd';
import { RESPONSE_STSTUS } from '../../interface/response';
import { withRouter } from 'react-router';

interface LoginForm {
  username: string,
  password: string,
}

type TState = {
  loginInfo: LoginForm,
}

@inject('AuthStore')
@observer
class Login extends React.Component<any, TState>{
  passwordInput = createRef<HTMLInputElement>();

  constructor(props: any) {
    super(props);
    this.state = {
      loginInfo: {
        username: '足利上総三郎',
        password: 'wsyghhz2000',
      },
    }
    this.passwordInput = React.createRef();
  }

  componentDidMount() {
    this.passwordInput.current && this.passwordInput.current.focus();
  }

  handleChangeLoginValue(event: any, key: string): void {
    const loginInfo = { ...this.state.loginInfo, [key]: event.target.value }
    this.setState({
      loginInfo
    });
  }

  doLogin(): void {
    const { AuthStore, history } = this.props;
    const { username, password } = this.state.loginInfo;
    axios.get('http://127.0.0.1:5000/login', {
      params: {
        username, password
      }
    })
      .then(res => {
        const result = res.data[0];
        if (result.username && result.userid) {
          AuthStore.doLogin(result);
          if (AuthStore.isLogin) {
            message.success(`欢迎您,${result.username}`);
            AuthStore.afterLogin(() => history.push('/index'));
          }
        }
      })
      .catch(error => {
        const status = error.response.status + '';
        switch (status) {
          case RESPONSE_STSTUS['NOT_FOUND']:
            message.warning('用户名不存在');
            break;
          case RESPONSE_STSTUS['WRONG_PASSWORD']:
            message.error('密码错误');
            break;
          case RESPONSE_STSTUS['NETWORK_ERROR']:
            message.error('网络异常');
            break;
          default:
            message.error('未知错误');
        }
      })
  }

  render() {
    const { loginInfo } = this.state;
    return (
      <div key="login" className={styles.Modal}>
        <div className={styles.form}>
          <div className={styles.formItem}>
            <div className={styles.label}>
              用户名/用户账号
            </div>
            <div className={styles.input}>
              <input autoComplete="off" onChange={e => this.handleChangeLoginValue(e, 'username')} value={loginInfo.username} placeholder="like theshy0404..." type="text"></input>
            </div>
          </div>
          <div className={styles.formItem}>
            <div className={styles.label}>
              密码
              <div className={styles.passwordHref}>
                忘记密码?
              </div>
            </div>
            <div className={styles.input}>
              <input ref={this.passwordInput} autoComplete="off" onChange={e => this.handleChangeLoginValue(e, 'password')} value={loginInfo.password} placeholder="if you forgot,click rightTop..." type="password"></input>
            </div>
          </div>
          <div className={styles.formItem}>
            <div onClick={() => this.doLogin()} className={styles.button}>Sign in</div>
          </div>
        </div>
      </div>
    );
  }

}

export default withRouter(Login);

