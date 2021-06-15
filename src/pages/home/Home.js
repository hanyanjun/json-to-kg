import React, {  useRef, useState } from "react"
import D3Force from "../../libs/react-d3-force/src/D3Visualization/components/Graphs"
import Header from "./Header"
import Drawer from "./Drawer"
import  "./Home.scss"
import { Empty } from 'antd';


        // d3Force.current.initGraph({
        //     nodes : [
        //         {
        //             id: '1',
        //             labels: ['school'],
        //             properties: {
        //                 name : 'node 1'
        //             }
        //         }
        //     ],
        //     relationships : [
        //         {
        //             id : '3',
        //             startNodeId : '1',
        //             endNodeId : '2',
        //             type : 'rel1',
        //             properties : {
        //                 name : '关系1'
        //             }
        //         },
        //     ]
        // })

export default function(){
    const d3Force = useRef(null);
    const isFirst = useRef(null);
    const [show,setShow] = useState(false);
    const [node , setNode] = useState({});
    const [num , setNum] = useState(0);

    const onItemSelect = (item)=> {
        if(item.type === 'node'){
            setShow(true);
            setNode(item.item)
        }
    }

    const onClose = ()=> {
        setShow(false)
    }

    const onGeneral = ({nodes , relations})=>{
        setNum(nodes.length);
        if(!isFirst.current){
            d3Force.current.initGraph({
                nodes,
                relationships : relations
            });
            isFirst.current = true;
        }else{
            d3Force.current.resetGraph({
                nodes,
                relationships : relations
            });
        }
    }
    return(
        <div>
            <Header onGeneral={onGeneral}></Header>
            <Drawer  visible={show} onClose={onClose} info={node}/>
            <div className="graph">
                {num === 0 && (
                    <div className="empty">
                        <Empty  image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}
                <D3Force  
                    ref={d3Force}
                    getStats={function(){}}
                    onItemMouseOver={function(){}}  
                    onEventListener = { function (){}}
                    onItemSelect={onItemSelect}
                ></D3Force> 
            </div>
        </div>
    )
}