import { useEffect, useState } from "react";
import TextArea from "../../components/TextArea";
import TreeViewJson from "../../components/TreeViewJson";
import useLocalStorage from "../../hooks/useLocalStorage";
import TextBox from "../../components/TextBox";
import "./Json.css"

export default function Json() {
    const [jsonDoc, setJsonDoc] = useLocalStorage<string>("Json_Doc", "");
    const [jsonObject, setJsonObject] = useState({});
    const [jsonPath, setJsonPath] = useState("");

    useEffect(()=>{
        const eJsonDoc = document.getElementById("jsonDoc") as HTMLTextAreaElement;
        const JsonDocVal = eJsonDoc.value;
        eJsonDoc.rows = JsonDocVal.split("\n").length+1;
    },[jsonDoc])

    function h_JsonDocOnChange() {
        try {
            setJsonObject(JSON.parse(jsonDoc));
        } catch (error) {
            alert(error);
        }
    }
    return (
        <>
            <button onClick={h_JsonDocOnChange}>Read</button>
            <div className="json-div">
                <div>
                    {/* <span contentEditable>{jsonDoc}</span> */}
                    <TextArea id="jsonDoc" value={jsonDoc} onChange={e => setJsonDoc(e.target.value)} />
                </div><div>
                    <TextBox id="jsonPath" value={jsonPath} readOnly={true}/>
                    <TreeViewJson jsonKey="" jsonData={jsonObject} path="" onClick={setJsonPath} />
                </div>
            </div>
        </>
    );
}