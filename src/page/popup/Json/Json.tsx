import { useState } from "react";
import TextArea from "../../components/TextArea";
import TreeViewJson from "../../components/TreeViewJson";
import useLocalStorage from "../../hooks/useLocalStorage";
import TextBox from "../../components/TextBox";

export default function Json(){
    const [jsonDoc, setJsonDoc] = useLocalStorage<string>("Json_Doc","");
    const [jsonObject, setJsonObject] = useState({});
    const [jsonPath, setJsonPath] = useState("");

    function h_JsonDocOnChange(){
        try {
            setJsonObject(JSON.parse(jsonDoc));
        } catch (error) {
            alert(error);
        }
    }
    return (
        <>
            <button onClick={h_JsonDocOnChange}>Read</button><br/>
        <span>
            <TextArea id="jsonDoc" value={jsonDoc} onChange={e=>setJsonDoc(e.target.value)} />
        </span><span>
            <TextBox id="jsonPath" value={jsonPath} /><br/>
            <TreeViewJson jsonKey="" jsonData={jsonObject} path="" onClick={setJsonPath}/>
        </span>
        </>
    );
}