
import React, { useEffect, useRef, useState } from "react";
import {  Row, Col, Button, message } from 'antd';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import { UploadOutlined } from '@ant-design/icons';
import _ from "lodash"
import * as echarts from 'echarts';
import moment from "moment"
import "./Time.scss"
import {generalId} from "../../utils"
// var ecConfig = require("echarts/config");

const Header = (props) => {
    const jsonData = useRef(null);
    const resultData = useRef(null)
    const nameMap = useRef({});
    const idMap = useRef({})
    const zoom = useRef({
        start : 0,
        end : 20
    })
    const myChart = useRef(null)
    const [range , setRange] = useState([])


    useEffect(()=>{
        initChart();
    },[])


    const initChart = () => {
        // 生成datazoom  并添加datazoom缩放事件
        var chartDom = document.getElementById('time-wrap');
        myChart.current = echarts.init(chartDom);
        myChart.current.on('datazoom', (params)=> {
            let {start , end} = params;
            zoom.current.start = start;
            zoom.current.end = end;
            filterData().then(_=>{
                // 过滤出数据之后进行渲染
                toRenderGraph()
            }).catch(_=>{
                console.log('跳过渲染')
            })
        });
    }

    const initChartLine = ()=> {
       let option = {
         xAxis: {
           type: 'time',
           boundaryGap: false,
           show : false,
         },
         yAxis : {
             show : false
         },
        //  yAxis: {
        //    type: 'value',
        //    boundaryGap: [0, '100%']
        //  },
         dataZoom: [
           {
             type: 'inside',
             start: zoom.current.start,
             end: zoom.current.end
           },
           {
             start: 5,
             end: 20
           }
         ],
         series: [
           {
             name: 'Fake Data',
             type: 'line',
             smooth: true,
             symbol: 'none',
             data: resultData.current.chartData,
             lineStyle : {
                 color : 'rgba(0,0,0,0)'
             }
           }
         ]
       };
      myChart.current.setOption(option);
    }
    const onChangeFile = (event) => {
        var selectedFile = event.target.files[0];//获取读取的File对象
        let { type } = selectedFile;
        if (type !== 'application/json') {
            message.error('不支持此文件格式!');
            return;
        }
        var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
        reader.readAsText(selectedFile);//读取文件的内容
        reader.onload = function () {
            toHandleJson(JSON.parse(this.result));
        };

    }

    const resetData = () => {
        jsonData.current = {};
        resultData.current = {};
        nameMap.current = {};
        idMap.current = {};
        zoom.current = {
            start : 0,
            end : 20
        }
    }

    const toHandleJson = (json) => {
        // 重置所有数据
        resetData()
        // 生成节点和关系
        let times  = Object.keys(json);
        let obj = {};
        let min = 0 , max = 0
        jsonData.current = json;
        for (let index = 0; index < times.length; index++) {
            const date = times[index];
            let timestamp = Date.parse(new Date(date));
            obj[timestamp] = {
                ...toGeneralNodeRel(json[date])
            }
            if(min === 0 || min > timestamp){
                min = timestamp
            }
            if(max === 0 || max < timestamp){
                max = timestamp
            }
        }
        // 依据最大值 最小值 生成时间戳 
        let {times : timeLine ,chartData} = toGeneralTimeLine(min,max)
        resultData.current = {
            min ,
            max ,
            chartData,
            timeLine,
            graph : obj,
            nodes : [],
            rels : []
        }
        setRange([
            moment(new Date(min)).format("YYYY/MM/DD"),
            moment(new Date(max)).format("YYYY/MM/DD"),
        ])
        // 生成时间轴数据
        initChartLine()
        // 根据当前zoom start 和 end 生成数据
        filterData().then(_=>{
            // 过滤出数据之后进行渲染
            toRenderGraph()
        }).catch(_=>{
            console.log('跳过渲染!')
        })
    }

    const  filterData = () => {
        return new Promise((resolve,reject)=> {
            let {start , end } = zoom.current
            // 截取在该时间段内的数据
            let {graph , timeLine} = resultData.current;
            let len  = timeLine.length - 1
            start = Math.floor(len * (start / 100))
            end = Math.floor(len * (end / 100))
            start = timeLine[start];
            end = timeLine[end];
            let nodes = [] , rels = [] , times = [];
            Object.keys(graph).forEach(time => {
                if(Number(time) >= start && Number(time) <= end){
                    nodes = nodes.concat(graph[time].nodes)
                    rels = rels.concat(graph[time].rels)
                    times.push(time)
                }
            })
            // 如果时间和上次的一样就不触发重新渲染
            let {times : t} = resultData.current;
            // 如果节点中不含目标节点  那么就手动插入一个目标节点
            if(!nodes.some(item => item.id === rels[0].endNodeId)){
                nodes.push(idMap.current[rels[0].endNodeId])
            }
            resultData.current.nodes = nodes;
            resultData.current.rels = rels;
            if(!t || t.join(',') !== times.join(',')){
                resultData.current.times = times
                resolve(true);
            }
            reject(false)
        })
    }

    const toRenderGraph = () => {
        // 过滤时间
        let json = Object.keys(jsonData.current);
        if (json && json.length) {
            let {nodes , rels : relations} = _.cloneDeep(resultData.current);
            props.onGeneral && props.onGeneral({ nodes, relations })

        } else {
            message.error('请先上传json数据');
        }
    }

    // 依据source target 生成节点关系数据
    const toGeneralNodeRel = ({source , target })=> {
        let nodes = [] , rels = [] , id = generalId();
        let s = {} , t = {} , rel = {}
        let nMap = nameMap.current;
        let iMap = idMap.current
        if(source){
            if(!nMap[source]){
                s = {
                    id : generalId(),
                    labels : ['school'],
                    properties : {
                        name : source
                    }
                }
                iMap[s.id] = s;
                nodes.push(s)
                nMap[source] = {
                    id : s.id,
                    name : source,
                    origin : true,
                    num : 1
                }
            }else{
                nMap[source].num  = ++nMap[source].num
            }
        }
        if(target){
            if(!nMap[target]){
                t = {
                    id : generalId(),
                    labels : ['school'],
                    properties : {
                        name : target
                    }
                }
                iMap[t.id] = t;
                nodes.push(t)
                nMap[target] = {
                    id : t.id,
                    name : target,
                    origin : false,
                    num : 1
                }
            }else{
                nMap[target].num  = ++nMap[target].num
            }
        }
        if(source && target){
            rel = {
                id ,
                startNodeId : nMap[source].id,
                endNodeId : nMap[target].id,
                type : 'rel',
                properties : {
                    name : `${source} -> ${target}`
                }
            }
            iMap[rel.id] = rel;
            rels.push(rel)
        }
        nameMap.current = nMap
        idMap.current = iMap
        return {nodes , rels}
    }

    const toGeneralTimeLine = (min , max) => {
        let d = 24 * 60 * 60 * 1000;
        let arr = [[min,0]];
        let times = [min]
        const time = (min , d , max) => {
            let next = min + d
            if(next < max){
                arr.push([min,0])
                times.push(next)
                time(next,d,max)
            }
        }
        time(min, d , max)
        return {
            times , 
            chartData : arr
        }
    }
    return (
        <Row style={{ padding: '20px' }} >
            <Col span={2}>
                <Button icon={<UploadOutlined />} className="input-button">
                    Upload JSON
                 <input type="file" onChange={onChangeFile} />
                </Button>
            </Col>
            <Col span="9" offset="1">
                <div id="time-wrap"></div>
            </Col>
            <Col span="6" offset="1">
                {
                    range.length ? <span className="text">
                        {range[0]} ~ {range[1]}
                    </span> : null
                }
            </Col>

        </Row>
    )
}

export default React.memo(Header, () => true)