import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from './styles.module.css';
import { Space, Table, Tag, TreeSelect } from "antd";
import doRequest from '../../interface/useRequests';
import { PROBLEM_RANK_MAP, PROBLEM_STATUS, PROBLEM_STATUS_MAP } from "../../interface/Problem";
import { CheckCircleOutlined, MinusCircleOutlined, WarningOutlined } from "@ant-design/icons";

const RoundEcharts = React.lazy(() => import('../../components/AnalysisEcharts/RoundModal'));
const AvgEcharts = React.lazy(() => import('../../components/AnalysisEcharts/AvgModal'));

const Analysis = () => {

    const [activeType, changeActive] = useState('all');
    const [treeData, setTreeData] = useState([] as any[]);
    const [problemList, setProblemList] = useState([] as any[]);

    const getRankColor = useCallback((rank: number) => {
        if (rank === 1) return '#67C23A';
        if (rank === 2) return '#E6A23C';
        return '#F56C6C';
    }, []);

    const rankList = useMemo(() => {
        const result = [] as any[];
        for (let key in PROBLEM_STATUS) {
            if (!!parseInt(key) || key === '0') {
                result.push({
                    value: key,
                    text: PROBLEM_STATUS_MAP[key],
                })
            }
        }
        return result;
    }, []);

    const columns = [
        {
            title: '最近提交时间',
            dataIndex: 'time',
            key: 'time',
            // sorter: (a: any, b: any) => new Date(a).getTime() - new Date(b).getTime(),
            render: (time: any) => <>{transTime(time)}</>
        },
        {
            title: '题目名',
            dataIndex: 'problemname',
            key: 'problemname',
            render: (name: any) => <div className={styles.title}># {name}</div>
        },
        {
            title: '题目难度',
            dataIndex: 'rankid',
            key: 'rankid',
            sorter: (a: any, b: any) => b.rankid - a.rankid,
            render: (rank: any) => <div style={{ color: getRankColor(rank) }}>{PROBLEM_RANK_MAP[rank]}</div>
        },
        {
            title: '提交次数',
            dataIndex: 'count',
            key: 'count',
            sorter: (a: any, b: any) => a - b,
            render: (count: any) => <>{count + '次'}</>
        },
        {
            title: '题目状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: string | number | null) => {
                const key = Number(status) || 0;
                switch (Number(key)) {
                    case PROBLEM_STATUS.PASS:
                        return <Tag key={key} icon={<CheckCircleOutlined />} color="success">{PROBLEM_STATUS_MAP[key]}</Tag>
                    case PROBLEM_STATUS.WRONG:
                        return <Tag key={key} icon={<WarningOutlined />} color="error">{PROBLEM_STATUS_MAP[key]}</Tag>
                    default:
                        return <Tag key={key} icon={<MinusCircleOutlined />} color="default">{PROBLEM_STATUS_MAP[key]}</Tag>
                }
            },
            filters: rankList,
            onFilter: (value: any, record: any) => record.status === value,
        },
    ];

    useEffect(() => {
        doRequest({
            url: '/problem/analysis/type', type: 'GET',
        }).then(results => {
            setTreeData(transTree(JSON.parse(results.data.treeData)));
        });
    }, []);

    useEffect(() => {
        doRequest({
            url: '/problem/analysis/problems', type: 'GET', needAuth: true,
            params: { type: activeType }
        }).then(results => {
            setProblemList(JSON.parse(results.data.problemList));
        });
    }, [activeType]);

    const onChange = (value: string) => {
        changeActive(value);
    };

    return (
        <div className={styles.wrap}>
            <div className={styles.panel}>
                <Space size="large">
                    <TreeSelect
                        style={{ width: '300px' }}
                        value={activeType}
                        dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
                        treeData={treeData}
                        placeholder="Please select"
                        treeDefaultExpandAll
                        onChange={onChange}
                    />
                    {/* <div className={styles.button}>获取学习报告</div> */}
                </Space>
                <Table style={{ marginTop: 15 }} bordered columns={columns} dataSource={problemList} size="small" />
            </div>
            <div className={styles.aside}>
                <RoundEcharts activeType={activeType} />
                <AvgEcharts activeType={activeType} />
            </div>
        </div>
    );
}

function transTree(list: any[]) {
    const results: any[] = [];
    for (let item of list) {
        if (!item.parentid) results.push({
            title: item.title,
            value: item.value,
            children: [],
        })
        else {
            results.find(type => type.value === item.parentid).children.push({
                title: item.title,
                value: item.value,
            })
        }
    }
    return results;
}

function transTime(time: any) {
    if (!time) return '未开始';
    time = new Date(time).getTime();
    const nowTime = new Date().getTime();
    const count = nowTime - time;
    if (count < 1000 * 60 * 60 * 24) {
        return Math.floor(count / (1000 * 60 * 60)) + '小时前';
    }
    if (count < 1000 * 60 * 60 * 24 * 7) {
        return Math.floor(count / (1000 * 60 * 60 * 24)) + '天前';
    }
    if (count < 1000 * 60 * 60 * 24 * 30) {
        return Math.floor(count / (1000 * 60 * 60 * 24 * 7)) + '周前';
    }
    if (count < 1000 * 60 * 60 * 24 * 30 * 365) {
        return Math.floor(count / (1000 * 60 * 60 * 24 * 7 * 30)) + '月前';
    }
    return Math.floor(count / (1000 * 60 * 60 * 24 * 7 * 30 * 365)) + '年前';
}

export default Analysis;
