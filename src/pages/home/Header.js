
import React, { useRef, useState } from "react";
import { DatePicker , Row , Col , Select , Button, message} from 'antd';
import moment from "moment";
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import { UploadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const { Option } = Select;

const Header = (props)=> {
    const [time , setTime] = useState([]);  //时间筛选
    const [hasPro , setHasPro] = useState([]); //包含的项目
    const [hasFound , setHasFound] = useState([]); //包含的投资人
    const [allPro , setAllPro] = useState([]); //所有的项目
    const [allFound , setAllFound] = useState([]); //所有的found
    const jsonData = useRef(null);

    const toGeneralGraph = ()=> {
        // 过滤时间
        let json = jsonData.current;
        if(json && json.length){
             let data = json.filter(item => {
                let {date = '',  found = [],    project = ''} = item;
                let t = true;
                let p = hasPro.length ?  hasPro.includes(project) : true;
                found = found.filter(fName =>hasFound.length ? hasFound.includes(fName) : true);
                let f = found.length > 0;
                if( time.length && ( date < time[0] || date> time[1])){
                    t = false
                };
                return t && p && f;
             });
            //  根据过滤后的数据生成 节点和 关系图
             let nodes = [] , relations = [] , nodesMap = {};
             for (const item of data) {
                let {date , description , found ,  id ,  project , round} = item;
                if(!nodesMap[project]){
                    nodesMap[project] = { 
                        id : project ,  
                        properties : { list : [] , type : 'project' , project , name : project }
                    }
                }
                nodesMap[project].properties.list.push({
                    id ,
                    date ,
                    found,
                    description,
                    round,
                })
                 for (const foundItem of found) {
                     if(!nodesMap[foundItem]){
                        nodesMap[foundItem] = { 
                            id : foundItem , 
                            properties : { list : [] , type : 'found' , project , name : foundItem}
                        }
                     }
                     nodesMap[project].properties.list.push({
                         id ,
                         date ,
                         project
                     })
                 }
             };
             for (const key in nodesMap) {
                 if (Object.hasOwnProperty.call(nodesMap, key)) {
                     const nodeItem = nodesMap[key];
                     nodes.push(nodeItem);
                     let id = nodeItem.id;
                     let {type ,  project} = nodeItem.properties;
                     if(type === 'found'){
                         relations.push({
                             id : `${id}-${project}`,
                             startNodeId : id,
                             endNodeId : project,
                             type : 'found to project',
                             properties : {
                                 name : `${id}->${project}`
                             }
                         })
                     }       
                 }
             }
             props.onGeneral && props.onGeneral({nodes , relations})

        }else{
            message.error('请先上传json数据');
        }
    }

    const onChangeTime = (value)=> {
        if(value.length){
            setTime([
                moment(new Date(value[0])).format('YYYY.HH.DD'),
                moment(new Date(value[1])).format('YYYY.HH.DD')
            ])
        }else{
            setTime([])
        }
    }

    // 选择包含的项目
    const onChangeSelectPro = (value)=>{
        setHasPro(value);
    }

    // 选择包含的投资人
    const onChangeSelectFound = (value) => {
        setHasFound(value)
    }

    const onChangeFile = (event)=> {
        var selectedFile = event.target.files[0];//获取读取的File对象
        let {type } = selectedFile;
        if(type  !== 'application/json'){
            message.error('不支持此文件格式!');
            return;
        }
        var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
         reader.readAsText(selectedFile);//读取文件的内容
         reader.onload = function(){
             toHandleJson(JSON.parse(this.result));
         };
         
    }

    const toHandleJson = (json)=>{
        // 生成节点和关系
        let allProject = []  , allFound = [];
        for (const item of json) {
            let {date , description , found ,  id ,  project = '' , round = 0} = item || {};
            allProject.push({
                id : `${id}_${project}`,
                name : project,
                properties : {id , description , date , round }
            });
            allFound = [...new Set([...allFound , ...found])];   
        }
        setAllPro(allProject);
        setAllFound(allFound);
        setHasFound([]);
        setHasPro([allProject[0].name]);
        jsonData.current = json;
    }
    
    return(
        <Row style={{padding : '20px'}}>
            <Col span={4}>
                <Button icon={<UploadOutlined />} className="input-button">
                Upload JSON
                 <input type="file" onChange={onChangeFile} />
                </Button>
            </Col>
            <Col span={4}>
                <RangePicker  locale={zhCN} onChange={onChangeTime}/>
            </Col>
            <Col span={12}>
            <Select
                mode="multiple"
                style={{ width: '40%'  , marginLeft : 10}}
                placeholder="选择项目"
                value={hasPro}
                onChange={onChangeSelectPro}
                optionLabelProp="label"
            >
                {
                    allPro.map(item => (
                        <Option value={item.name} label={item.name} key={item.id}>
                        <div className="demo-option-label-item">
                            {item.name}
                        </div>
                        </Option>
                    ))
                }
            </Select>
            <Select
                mode="multiple"
                style={{ width: '40%' , marginLeft : 15}}
                placeholder="选择投资人"
                value={hasFound}
                onChange={onChangeSelectFound}
                optionLabelProp="label"
            >
                {
                    allFound.map((item,index) => (
                        <Option value={item} label={item} key={`${item}-${index}`}>
                        <div className="demo-option-label-item">
                            {item}
                        </div>
                        </Option>
                    ))
                }
            </Select>
            </Col>
            <Col span="2" offset="1">
                <Button type="primary" onClick={toGeneralGraph}>生成图谱</Button>
            </Col>
        </Row>
    )
}

export default React.memo(Header , ()=> true)