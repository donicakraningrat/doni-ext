import { useEffect, useState } from "react";
import TextArea from "../../components/TextArea";
import TreeViewJson from "../../components/TreeViewJson";
import TextBox from "../../components/TextBox";
import "./qa.css"
import useLocalStorage from "../../hooks/useLocalStorage";

export default function QA() {
    const [tcParam, setTcParam] = useLocalStorage<string>("TcParam", "{}");
    const [tcOutput, setTcOutput] = useState("");

    function h_generateTC() {
        try {
            let _tcParam = JSON.parse(tcParam);
            const out = recTestcase(_tcParam);
            let outStr: string[] = [];
            for (const s of out) {
                let temp = JSON.stringify(s);
                let ss = {
                    label: temp.replace(/["{}]/g, "").replace(/,/g, " & "),
                    ...s,
                    expect_1: ""
                }
                outStr.push(JSON.stringify(ss));
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


function recTestcase(params: Record<string, any>) {
    let temp: Record<string, any>[] = [];
    let out: Record<string, any>[] = [];
    for (const pName in params) {
        let next: Record<string, any>[] = [];
        for (const val of params[pName]) {
            next.push({ [pName]: val })
        }
        if (out.length <= 0) { out = next }
        else {
            for (let p of out) {
                for (let n of next) {
                    temp.push({ ...p, ...n });
                }
            }
            out = temp;
            temp = [];
        }
    }
    return out;
}

