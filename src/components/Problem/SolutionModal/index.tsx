import { CheckOutlined, PlusSquareOutlined } from '@ant-design/icons';
import {Input, message, Popover, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import doRequest from '../../../interface/useRequests';
import { LANGUAGE_MAP } from '../../../interface/Problem';
import Editor from 'for-editor';
import { inject, observer } from 'mobx-react';

const { Search } = Input;

const SelectLabels = (props: any) => {
    const [selectLanguageLabels, changeSelectLanguageLabels] = useState([] as any[]);
    const [selectSolutionLabels, changeSelectSolutionLabels] = useState([] as any[]);
    const onClickLanguageTag = (value: any) => {
        if (selectLanguageLabels.includes(value)) {
            changeSelectLanguageLabels([]);
        }
        else {
            if (selectLanguageLabels.length > 0) return message.warning('语言标签只能选择一个哦');
            else changeSelectLanguageLabels([value])
        }
    }
    const onClickSolutionTag = (value: any) => {
        if (selectSolutionLabels.includes(value)) {
            changeSelectSolutionLabels(selectSolutionLabels.filter(item => item !== value));
        }
        else {
            changeSelectSolutionLabels([...selectSolutionLabels, value])
        }
    }
    useEffect(() => {
        props.changeSelectLabels([...selectLanguageLabels, ...selectSolutionLabels]);
    },[selectLanguageLabels, selectSolutionLabels]);  // eslint-disable-line

    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <Search size="small" placeholder="搜索标签" enterButton />
            </div>
            <div className={styles.footer}>
                {props.languageLabels.map((item: any) => (
                    <div data-select={selectLanguageLabels.includes(item)} onClick={() => onClickLanguageTag(item)} key={item.value} className={styles.item}>
                        <div className={styles.icon}>{selectLanguageLabels.includes(item) && <CheckOutlined />}</div>
                        <div>{LANGUAGE_MAP[item.value]}</div>
                    </div>
                ))}
                {props.solutionLabels.map((item: any) => (
                    <div data-select={selectSolutionLabels.includes(item)} onClick={() => onClickSolutionTag(item)} key={item.value} className={styles.item}>
                        <div className={styles.icon}>{selectSolutionLabels.includes(item) && <CheckOutlined />}</div>
                        <div> {item.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const SolutionModal = (props: any) => {
    const [languageLabels, changeLanguageLabels] = useState([] as any[]);
    const [solutionLabels, changeSolutionLabels] = useState([] as any[]);
    useEffect(() => {
        let params = {
            url: '/solution/label', type: 'GET'
        }
        doRequest(params).then(result => {
            changeLanguageLabels(result.data.filter((item: any) => item.value < 10))
            changeSolutionLabels(result.data.filter((item: any) => item.value > 10))
        })

    }, [])
    const handleEditorChange = (value: any) => {
        props.SolutionStore.setContent(value);
    }
    const changeTitle = (value: string) => {
        props.SolutionStore.setTitle(value);
    }
    return (
        <div className={styles.wrap}>
            <Space direction="vertical" style={{ width: '100%', }}>
                <Input onChange={e => changeTitle(e.target.value)} value={props.SolutionStore.title} style={{ fontSize: '20px' }} placeholder="请输入标题" bordered={false} />
                <div className={styles.tags}>
                    <Popover placement="bottomLeft"
                        content={<SelectLabels languageLabels={languageLabels} solutionLabels={solutionLabels} changeSelectLabels={(labels: any[]) => props.SolutionStore.setLabels(labels)} />}
                        trigger="click">
                        <div className={styles.addTag}><PlusSquareOutlined className={styles.tagIcon} /> 获取标签</div>
                    </Popover>
                    {props.SolutionStore.labels.length === 0 ? <div className={styles.tagMsg}>添加编程语言、方法、知识点等标签</div> :
                        <>
                            {props.SolutionStore.labels.map((item: { value: number; label: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                                <div key={index} className={styles.tag}>{item.value < 10 ? LANGUAGE_MAP[item.value] : item.label}</div>
                            ))}
                        </>}
                </div>
                <Editor style={{ border: 'none', boxShadow: 'none', width: '100%', height: '300px' }} value={props.SolutionStore.content} onChange={handleEditorChange} />
            </Space>
        </div>
    )
}

export default inject('SolutionStore')(observer(SolutionModal));