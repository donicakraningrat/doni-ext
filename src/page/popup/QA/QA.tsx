import { useEffect, useState } from "react";
import TextArea from "../../components/TextArea";
import TreeViewJson from "../../components/TreeViewJson";
import TextBox from "../../components/TextBox";
import "./qa.css"
import useLocalStorage from "../../hooks/useLocalStorage";

export default function QA() {
    const [tcParam, setTcParam] = useLocalStorage<string>("TcParam", "{}");
    const [tcOutput,setTcOutput] = useState("");

    function h_generateTC() {
        try {
            let _tcParam = JSON.parse(tcParam);
            const out = recTestcase(_tcParam);
            let outStr:string[] = [];
            for(const s of out){
                outStr.push(JSON.stringify(s));
            }
            setTcOutput(`[\n${outStr.join(",\n")}\n]`);
        } catch (error) {
            alert(error);
        }
    }

    return (
        <>
            <div className="qa-div">
                <div>
                    <TextArea id="qa_param" value={tcParam} onChange={e => setTcParam(e.target.value)} />
                    <button id="generateTC" onClick={h_generateTC}>generate</button>
                </div><div>
                    <TextArea id="qa_tcOutput" value={tcOutput} onChange={e => setTcOutput} />
                </div>
            </div>
        </>
    );
}


function recTestcase(params:Record<string,any>,ix:number=0){
    let paramNames:string[] = Object.keys(params);//list param name
    let curParamName:string = paramNames[ix];
    let paramValues:any[] = params[curParamName];
    // console.log(paramNames,curParamName,paramValues);
    
    if(paramNames.length-1 === ix){
        let out:Record<string,any>[] = [];
        for(const val of paramValues){
            let row:Record<string,any>={};
            row[curParamName]= val;
            row["expect"]= "";
            out.push(row);
        }
        return out
    }else {
        let out:Record<string,any>[] = [];
        let _out = recTestcase(params,ix+1);
        for(const val of paramValues){
            for(const child of _out){
            let row:Record<string,any>={};
            row[curParamName]= val;
            row = {...row, ...child};
                out.push(row);
            }
        }
        return out;
    }
}

// let x = {test:[1,2],test2:["g","l","x"],test3:["k","d","y"]}
// let y = recTestcase(x);
// console.log(y);

