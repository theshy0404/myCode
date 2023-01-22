import * as eCharts from "echarts";
import { useEffect, useRef, } from "react";
import doRequest from '../../../interface/useRequests';

let myChart: any;

const AvgModal = (props: any) => {

    const AvgRef = useRef(null as any);

    useEffect(() => {
        myChart = eCharts.init(AvgRef.current);
        myChart.on('click', function (params: any) {
            console.log(params.name);
        });
        return () => {
            myChart.off('click', function (params: any) {
                console.log(params.name);
            });
        }
    }, []);

    const setAvgEcharts = async (type: any) => {
        let data: any[] = [];
        const params = {
            url: '/problem/analysis/avg', type: 'GET', needAuth: true,
            params: { type }
        }
        await doRequest(params)
            .then(res => data = res.data.rateList);
        const option = {
            title: {
                text: '提交通过率对比',
                align: 'center',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
            },
            legend: {},
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis: {
                type: 'value',
                max: 1,
                minInterval: 0.1,
            },
            xAxis: {
                type: 'category',
                data: ['简单', '中等', '困难',]
            },
            series: [
                {
                    name: '我的',
                    type: 'bar',
                    data: data[0],
                    itemStyle: {
                        normal: {
                            color: '#40a9ff',
                        }
                    },
                },
                {
                    name: '整体',
                    type: 'bar',
                    data: data[1],
                    itemStyle: {
                        normal: {
                            color: '#C9C9C9',
                        }
                    },
                }
            ]
        };
        myChart.setOption(option);
    }


    useEffect(() => {
        setAvgEcharts(props.activeType)
    }, [props.activeType]);

    return (
        <div ref={AvgRef}
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


export default AvgModal;