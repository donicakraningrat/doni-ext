import "./TreeViewJson.css"
type PropsTreeViewJson = {
    jsonKey?: string|number;
    jsonData: any;
    path:string;
    onClick: (path:string)=>void;
}
export default function TreeViewJson({ jsonKey, jsonData,path,onClick }: PropsTreeViewJson) {
    return (
        <>
            {
                (jsonData.constructor === Array) ?
                    <>
                        <span className="p-json">{`${jsonKey}`}{`[`}</span>
                        <ul className="ul-json">
                            {jsonData.map((d,ix) => <TreeViewJson jsonData={d} path={`${path}[${ix}]`} onClick={onClick}/>)}
                        </ul>
                        <span className="p-json">{`]`}</span>
                    </> :
                    (jsonData.constructor === Object) ?
                        <>
                            <span className="p-json">{(jsonKey)?`${jsonKey} : {`:`{`}</span>
                            <ul className="ul-json">
                                {Object.keys(jsonData).map(k => <TreeViewJson jsonKey={k} jsonData={jsonData[k]} path={`${path}.${k}`} onClick={onClick}/>)}
                            </ul>
                            <span className="p-json">{"}"}</span>
                        </> :
                        <li onClick={e=>onClick(`${path}`)}>{(jsonKey)?`${jsonKey} : ${jsonData}`:`${jsonData}`}</li>
            }
        </>
    );
}
