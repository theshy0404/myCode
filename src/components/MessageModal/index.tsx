import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import styles from './styles.module.css';
import LOGO from '../../shared/images/public/codeWhite.svg';
import { CloseOutlined, HomeOutlined, MessageOutlined, TeamOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd';

const Message = React.lazy(() => import('./Message'));
const Friends = React.lazy(() => import('./Friends'));
const Circle = React.lazy(() => import('./Circle'));

type TActive = 'message' | 'friends' | 'circle';

const MessageModal = (props: any) => {
    const [active, changeActive] = useState('message' as TActive);
    const [title, setTitle] = useState('My Message');

    const roundColorList = useMemo(() => {
        return ['#F56C6C', '#E6A23C', '#67C23A']
    }, []);

    const MessageLoading = useCallback(() => {
        return (
            <div className={styles.content}>
                <div className={styles.aside}>
                    <Skeleton active title={false} paragraph={{ rows: 2 }} />
                    {
                        new Array(5).fill(0).map((item, index) => <Skeleton active key={index} avatar paragraph={{ rows: 1 }} />)
                    }
                </div>
                <div className={styles.center}>
                    <Skeleton active paragraph={{ rows: 14 }} />
                </div>
            </div>
        )
    }, []);

    const renderContent = () => {
        if (active === 'message') {
            return (
                <Suspense fallback={<MessageLoading />}>
                    <Message />
                </Suspense>
            )
        };
        if (active === 'friends') {
            return (
                <Suspense fallback={<MessageLoading />}>
                    <Friends />
                </Suspense>
            )
        };
        if (active === 'circle') {
            return (
                <Suspense fallback={<MessageLoading />}>
                    <Circle />
                </Suspense>
            )
        };
    }; // eslint-disable-line

    useEffect(() => {
        setTitle('My ' + active.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase()));
    }, [active]);

    const onClose = useCallback(() => props.onClose(), []); // eslint-disable-line

    return (
        <div className={styles.wrap}>
            <div className={styles.aside}>
                <div className={styles.roundWrap}>
                    {roundColorList.map((color, index) => <div key={index} style={{ backgroundColor: color }} className={styles.round}></div>)}
                </div>
                <img style={{ width: '30px', margin: '10px auto' }} src={LOGO} alt="code" />
                <div onClick={() => changeActive('message')} data-active={active === 'message'} style={{ marginTop: '25px' }} className={styles.menuItem}>
                    <MessageOutlined style={{ color: '#C0C4CC', fontSize: '20px' }} />
                </div>
                <div onClick={() => changeActive('friends')} data-active={active === 'friends'} className={styles.menuItem}>
                    <TeamOutlined style={{ color: '#C0C4CC', fontSize: '20px' }} />
                </div>
                <div onClick={() => changeActive('circle')} data-active={active === 'circle'} className={styles.menuItem}>
                    <HomeOutlined style={{ color: '#C0C4CC', fontSize: '20px' }} />
                </div>
            </div>
            <div className={styles.main}>
                <div className={styles.header}>
                    <div className={styles.title}>{title}</div>
                    <CloseOutlined onClick={onClose} />
                </div>
                <div style={{ height: '550px' }}>
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}

export default MessageModal;