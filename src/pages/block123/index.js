import React, { useEffect, useRef } from "react";
const Neo4j =  require('neo4j-data');

export default function(){
    let neo4j = useRef(null);
    useEffect(()=>{
        neo4j.current = new Neo4j();
        neo4j.current.config({
            url : 'bolt://124.156.168.171:7687',
            username : 'neo4j',
            password : 'llps&789'
        });
        neo4j.current.runMatch('call db.labels()').then(res=>{
            console.log('call db.labels()' , res);
        })
    },[])


    return(
        <div>block123</div>
    )
}