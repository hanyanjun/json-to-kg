import React, {  useRef } from "react"
import D3Force from "../../libs/react-d3-force/src/D3Visualization/components/Graphs"
import Header from "./Header"
import  "./Home.scss"


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

    const onGeneral = ({nodes , relations})=>{
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
            <div className="graph">
                <D3Force  
                    ref={d3Force}
                    getStats={function(){}}
                    onItemMouseOver={function(){}}  
                    onEventListener = { function (){}}
                    onItemSelect={function(item){}}
                ></D3Force> 
            </div>
        </div>
    )
}