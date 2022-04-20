import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import { Input, Skeleton, Tag } from 'antd';
import { PROBLEM_STATUS, PROBLEM_STATUS_MAP } from '../../../interface/Problem';
import styles from './styles.module.css';
const SubmitCard = (props: any) => {
    if (typeof props.details === 'undefined') return (
        <div className={styles.submitInfo}>
            <Skeleton active paragraph={{ rows: 2 }} />
        </div>
    )
    if (props.details.status === PROBLEM_STATUS.WRONG){
        return (
            <div className={styles.submitInfo}>
            <div className={styles.text}>
                执行结果:<Tag icon={<CloseCircleOutlined />} color="error" style={{ marginLeft: '5px' }}>{PROBLEM_STATUS_MAP[props.details.status]}</Tag>
            </div>
            <div className={styles.text}>
                通过测试用例:<span className={styles.keyWord}>{props.details.except} / {props.details.sum}</span>
                <span className={styles.keyWord}></span>
            </div>
            <div className={styles.text}>
                出错用例:
                <Input disabled value={props.details.input} />
            </div>
            <div className={styles.text}>
                应当输出:
                <Input disabled value={props.details.output} />
            </div>
            <div className={styles.text}>
                您的输出:
                <Input style={{color:'red'}} disabled value={props.details.result} />
            </div>
        </div>
        )
    }
    return (
        <div className={styles.submitInfo}>
            <div className={styles.text}>
                执行结果: <Tag icon={<CheckCircleOutlined />} color="success" style={{ marginLeft: '5px' }}>{PROBLEM_STATUS_MAP[props.details.status]}</Tag>
            </div>
            <div className={styles.text}>
                通过测试用例:<span className={styles.keyWord}>{props.details.except} / {props.details.sum}</span>
                <span className={styles.keyWord}></span>
            </div>
            <div className={styles.button}><EditOutlined style={{ marginRight: '3px' }} />写题解,分享你的解题思路</div>
        </div>
    )
}
export default SubmitCard;