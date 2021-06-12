import React, { useEffect, useRef } from "react"
import D3Force from "../../libs/react-d3-force/src/D3Visualization/components/Graphs"
import Header from "./Header"



export default function(){

    const d3Force = useRef(null);

    useEffect(()=>{
        // d3Force.current.initGraph({
        //     nodes : [
        //         {
        //             id: '1',
        //             labels: ['school'],
        //             properties: {
        //                 name : 'node 1'
        //             }
        //         },
        //         {
        //             id: '2',
        //             labels: ['school'],
        //             properties: {
        //                 name : 'node 2'
        //             }
        //         },
        //         {
        //             id: '3',
        //             labels: ['school'],
        //             properties: {
        //                 name : 'node 3'
        //             }
        //         },
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
        //         {
        //             id : '4',
        //             startNodeId : '1',
        //             endNodeId : '3',
        //             type : 'rel2',
        //             properties : {
        //                 name : '关系1'
        //             }
        //         },
        //     ]
        // })
    },[])

    return(
        <div>
            <Header></Header>
                <D3Force  ref={d3Force}
                        getStats={function(){

                        }}
                        onItemMouseOver={function(){
                        }}  
                        onEventListener = { function (){}}
                        onItemSelect={function(item){
                            console.log(item);
                        }}
                ></D3Force> 
        </div>
    )
}