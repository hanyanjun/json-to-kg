import React, { useEffect, useRef } from "react";
import { ALL_LABELS, ALL_RELS } from "./match";
const Neo4j =  require('neo4j-data');

export default function(){
    let neo4j = useRef(null);
    useEffect( async ()=>{
        neo4j.current = new Neo4j();
        neo4j.current.config({
            url : 'bolt://124.156.168.171:17687',
            username : 'neo4j',
            password : 'llps&789'
        });
        // let result =  await neo4j.current.runMatch(ALL_LABELS);
        // let labels = result.records.map(v=>{
        //     return {key : v._fields[0] , value : v._fields[0]}
        //   });
        //   console.log('all labels' , labels)
          let rels = await neo4j.current.runMatch(ALL_RELS);
          console.log('all data' , neo4j.current.dataDetail(rels.records))
    },[])
    


    return(
        <div>block123</div>
    )
}