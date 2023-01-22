import React from 'react';
import styles from './styles.module.css';
import '../../App.css';
import { inject, observer } from 'mobx-react';
import Logo from '../../shared/images/Login/code.svg';
import LoginForm from '../../components/LoginForm';
import RegisterModal from '../../components/RegisterForm';


type TState = {
  modal: string,
}

@inject('AuthStore')
@observer
class Login extends React.Component<any, TState>{

  constructor(props: any) {
    super(props);
    this.state = {
      modal: 'login'
    }
  }

  componentDidMount() {
    const { AuthStore, history } = this.props;
    if (history && AuthStore.isLogin) {
      history.go(-1);
    }
  }

  handleChangeMoal(): void {
    this.setState({ modal: this.state.modal === 'login' ? 'register' : 'login' });
  }

  render() {
    const { modal } = this.state;
    const title = modal === 'login' ? '登录 MyCode' : '注册 MyCode';
    const tip = modal === 'login' ? '第一次来MyCode? ' : '已有账号? ';
    const href = modal === 'login' ? '创建账号 ' : '去登录';
    return (
      <div className={styles.wrap}>
        <img className={styles.logo} alt="logo" src={Logo}></img>
        <h1 className={styles.title}>{title}</h1>
        {modal === 'login' ? <LoginForm /> : <RegisterModal />}
        <div className={styles.tip}>
          {tip}&nbsp;<span onClick={() => this.handleChangeMoal()} className={styles.href}>{href}</span>
        </div>
      </div>
    );
  }
}


export default Login;

