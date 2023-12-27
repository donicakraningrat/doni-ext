import axios from "axios";
import { TConfig } from "../../const/db";
import useLocalStorage from "../../hooks/useLocalStorage";
import TextBox from "../../components/TextBox";
import { useState } from "react";
import TextArea from "../../components/TextArea";
type TQuery = {
  db:string;
  table: string;
  query: string;
  where: string;
  result: Record<string,any>;
}
export default function Query({apiEndpoint,config}:{apiEndpoint:string,config:TConfig}){
  const[queryList, setQueryList] = useLocalStorage<TQuery>("TQuery",{db:"users",
  table: "users",
  query: "select * from users where email = ? limit 10;",
  where: ""});
  const [userEmail,setUserEmail] = useState("")


  function query(q:TQuery) {
    if(!config || !config.dbConfig.host || !config.dbConfig.user || !config.dbConfig.password) {
        alert(`Koneksi SQl tidak benar
        ${JSON.stringify(config,null,4)}`)
        return;
      }
    
    const apiUrl = `${apiEndpoint}/mysql/query`; // Replace with your API URL
        axios.post(apiUrl, {
            dbConfig: {
                host: config.dbConfig.host,
                user: config.dbConfig.user,
                password: config.dbConfig.password,
                port: config.dbConfig.port,
                connectTimeout: config.dbConfig.connectTimeout,
            },
            type: "q",
            query: q.query,
            params: userEmail
        })
        .then(function (response) {
            if(response.data.length === 0) {
                alert(`${userEmail} tidak di temukan`);
                return;
            }
            console.log(JSON.stringify({...queryList,result:response.data}));
            
            setQueryList({...queryList,result:response.data});
        })
        .catch((error)=>{
                if (error.code === "ERR_NETWORK")
                    alert(`Error: Kemungkinan API belum diaktifkan.`);
                else
                    alert(error.message);
            });
}
function h_getOnClick(){
  query(queryList);
}
    return(
      <>
      <TextBox id="userEmail" value={userEmail} onChange={e=>setUserEmail(e.target.value)}/>
      <button onClick={h_getOnClick}>Get</button>
      <TextArea id="result" value={JSON.stringify(queryList)}/>
      </>
    );
}