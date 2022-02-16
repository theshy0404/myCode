import React from 'react';
import styles from './styles.module.css';
import '../../App.css';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';

interface RegisterForm {
  username: string,
  password: string,
  email: string,
  confirmPassword: string,
  isWrongConfig?: boolean,
}

type TState = {
  registerInfo: RegisterForm,
}

@inject('AuthStore')
@observer
class Register extends React.Component<any, TState>{

  constructor(props: any) {
    super(props);
    this.state = {
      registerInfo: {
        email: '1318936142@qq.com',
        username: '1318936142',
        password: 'wsyghhz2000',
        confirmPassword: 'wsyghhz2000',
      },
    }
  }

  handleChangeRegisterValue(event: any, key: string): void {
    const registerInfo = { ...this.state.registerInfo, [key]: event.target.value }
    if (registerInfo.confirmPassword) {
      registerInfo.isWrongConfig = registerInfo.confirmPassword !== registerInfo.password ? false : true;
    }
    this.setState({
      registerInfo
    });
  }


  render() {
    const { registerInfo } = this.state;
    return (
      <div key="register" className={styles.Modal}>
        <div className={styles.form}>
          <div className={styles.formItem}>
            <div className={styles.label}>
              Username
            </div>
            <div className={styles.input}>
              <input onChange={e => this.handleChangeRegisterValue(e, 'username')} value={registerInfo.username} type="text"></input>
            </div>
          </div>
          <div className={styles.formItem}>
            <div className={styles.label}>
              Email address
            </div>
            <div className={styles.input}>
              <input onChange={e => this.handleChangeRegisterValue(e, 'email')} value={registerInfo.email} type="text"></input>
            </div>
          </div>
          <div className={styles.formItem}>
            <div className={styles.label}>
              Password
            </div>
            <div className={styles.input}>
              <input onChange={e => this.handleChangeRegisterValue(e, 'password')} value={registerInfo.password} type="password"></input>
            </div>
          </div>
          <div className={styles.formItem}>
            <div className={styles.label}>
              Confirm password
            </div>
            <div className={styles.input}>
              <input className={registerInfo.isWrongConfig === false ? styles.error : ''} onChange={e => this.handleChangeRegisterValue(e, 'confirmPassword')} value={registerInfo.confirmPassword} type="password"></input>
            </div>
          </div>
          <div className={styles.formItem}>
            <div className={styles.button}>Register in</div>
          </div>
        </div>
      </div>
    );
  }
}


export default withRouter(Register);

