import React, { useRef, useState } from "react"
import D3Force from "../../libs/react-d3-force/src/D3Visualization/components/Graphs"
import { Empty } from 'antd';
import Header from "./Header"
import "./Time.scss"

export default function () {


    const [num, setNum] = useState(0);
    const d3Force = useRef(null);
    const isFirst = useRef(null);


    // 生成图谱函数
    const   onGeneral = ({ nodes, relations }) => {
        setNum(nodes.length);

        console.log('传入数据',nodes , relations);
        
        if (!isFirst.current) {
            d3Force.current.initGraph({
                nodes,
                relationships: relations
            });
            isFirst.current = true;
        } else {
            d3Force.current.resetGraph({
                nodes,
                relationships: relations
            });
        }
    }
    return (
        <div>
            <Header onGeneral={onGeneral}></Header>
            <div className="graph">
                {num === 0 && (
                    <div className="empty">
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}
                <D3Force
                    ref={d3Force}
                    getStats={function () { }}
                    onItemMouseOver={function () { }}
                    onEventListener={function () { }}
                    onItemSelect={function(){}}
                ></D3Force>
            </div>
        </div>
    )
}