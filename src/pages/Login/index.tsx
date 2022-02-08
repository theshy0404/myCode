import React from 'react';
import styles from './styles.module.css';
import '../../App.css';
import { inject, observer } from 'mobx-react';
import Logo from '../../shared/images/Login/code.svg';
import LoginModal from '../../components/LoginForm';
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
    const title = modal === 'login' ? 'Sign in to MyCode' : 'Register in to MyCode';
    const tip = modal === 'login' ? 'New to MyCode? ' : 'Have a MyCode account? ';
    const href = modal === 'login' ? 'Create an account. ' : 'To login.';
    return (
      <div className={styles.wrap}>
        <img className={styles.logo} alt="logo" src={Logo}></img>
        <h1 className={styles.title}>{title}</h1>
        {modal === 'login' ? <LoginModal /> : <RegisterModal />}
        <div className={styles.tip}>
          {tip}&nbsp;<span onClick={() => this.handleChangeMoal()} className={styles.href}>{href}</span>
        </div>
      </div>
    );
  }
}


export default Login;

