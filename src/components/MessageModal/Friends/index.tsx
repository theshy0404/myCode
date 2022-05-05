import { Avatar } from 'antd';
import styles from './styles.module.css';
import UserAvatar from '../../../shared/images/public/user.png';

const Friends = (props: any) => {
    return (
        <div className={styles.wrap}>
            <div className={styles.aside}>
                {new Array(4).fill(0).map((item, index) => (
                    <div key={index} className={styles.friendCard}>
                        <Avatar shape="square" size={48} src={UserAvatar}></Avatar>
                        <div className={styles.description}>
                            <div className={styles.username}>足利上総三郎</div>
                            <div className={styles.msg}>正四位下左兵卫督镇守府将军</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.center}></div>
        </div>
    )
}

export default Friends;