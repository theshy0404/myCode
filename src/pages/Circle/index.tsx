import { DownOutlined, UpOutlined } from "@ant-design/icons";
import React from "react";
import { withRouter } from "react-router-dom";
import styles from './styles.module.css'

class Circle extends React.Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = { isExpanded: false };
    }

    handleChangeExpand() {
        this.setState({ isExpanded: !this.state.isExpanded });
    }

    render() {
        const navLists = [
            { id: 'solution', title: '题解模块', router: '' },
            { id: 'discussion', title: '话题讨论', router: 'discussion' },
            { id: 'reply', title: '问答', router: 'reply' },
        ];
        const { isExpanded } = this.state;
        return (
            <div className={styles.wrap}>
                <div className={styles.header}>
                    <div data-show={isExpanded} className={styles.content}>
                        {isExpanded &&
                            <input type="text" placeholder="请输入搜索关键词..."></input>
                        }
                    </div>
                    <div className={styles.footer}>
                        <div className={styles.tabs}>
                            {navLists.map(item => {
                                const isActive = this.props.history.location.pathname.replace('/index/circle', '') === item.router;
                                return (
                                    <div data-active={isActive} className={styles.tab}>{item.title}</div>
                                )
                            })}
                        </div>
                        <div className={styles.switch} onClick={() => this.handleChangeExpand()}>
                            {isExpanded ? <UpOutlined style={{ fontSize: '30px', color: '#57606a' }} /> : <DownOutlined style={{ fontSize: '30px', color: '#57606a' }} />}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Circle)