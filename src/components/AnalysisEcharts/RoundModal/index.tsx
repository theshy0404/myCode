import * as eCharts from "echarts";
import { useEffect, useRef, } from "react";
import doRequest from '../../../interface/useRequests';

let myChart: any;

const RoundModal = (props: any) => {

    const roundRef = useRef(null as any);

    useEffect(() => {
        myChart = eCharts.init(roundRef.current);
        myChart.on('click', function (params: any) {
            console.log(params.name);
        });
        return () => {
            myChart.off('click', function (params: any) {
                console.log(params.name);
            });
        }
    }, []);

    const setRoundEcharts = async (type: any) => {
        const params = {
            url: '/problem/analysis/round', type: 'GET', needAuth: true,
            params: { type }
        };
        doRequest(params).then(res => {
            myChart.setOption(transOptions(res.data.countList));
        });
    }

    useEffect(() => {
        setRoundEcharts(props.activeType)
    }, [props.activeType]);

    return (
        <div ref={roundRef}
            style={{
                width: '100%',
                height: 300,
                margin: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        ></div>
    )
}

function transOptions(data: any) {
    const namesCount = [[], [], [],] as any;
    const nameList = [
        '未开始-简单',
        '已通过-简单',
        '未通过-简单',
        '未开始-中等',
        '已通过-中等',
        '未通过-中等',
        '未开始-困难',
        '已通过-困难',
        '未通过-困难',
    ];
    for (let i = 0; i < 3; i++) {
        namesCount[0].push({
            name: nameList[i],
            value: +data[i],
        })
    }
    for (let i = 3; i < 6; i++) {
        namesCount[1].push({
            name: nameList[i],
            value: +data[i],
        })
    }
    for (let i = 6; i < 9; i++) {
        namesCount[2].push({
            name: nameList[i],
            value: +data[i],
        })
    }
    let option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                selectedMode: 'single',
                radius: ['20%', '40%'],
                label: {
                    position: 'inner',
                    fontSize: 12
                },
                labelLine: {
                    show: false,
                },
                data: namesCount[0],
                itemStyle: {
                    color: (params: any) => {
                        const colorItem = ['#909399', '#ff7875', '#95de64',];
                        return colorItem[params.dataIndex]
                    }
                },
            },
            {
                name: 'Access From',
                type: 'pie',
                radius: ['45%', '60%'],
                label: {
                    position: 'inner',
                    fontSize: 12
                },
                data: namesCount[1],
                itemStyle: {
                    color: (params: any) => {
                        const colorItem = ['#909399', '#95de64', '#ff7875',];
                        return colorItem[params.dataIndex]
                    }
                },
            },
            {
                name: 'Access From',
                type: 'pie',
                radius: ['65%', '80%'],
                data: namesCount[2],
                itemStyle: {
                    color: (params: any) => {
                        const colorItem = ['#909399', '#95de64', '#ff7875',];
                        return colorItem[params.dataIndex]
                    }
                },
            }
        ]
    };
    return option;
}

export default RoundModal;