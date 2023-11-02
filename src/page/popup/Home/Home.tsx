import { TDbConfig } from "../../const/db";
import Epoch from "./Epoch/Epoch";
import Jwt from "./Jwt/Jwt";
import Redis from "./Redis/Redis";

export default function Home({apiEndpoint,sqlConn}:{apiEndpoint:string,sqlConn:TDbConfig}) {
    return (
        <div>
            <Epoch/>
            <Jwt apiEndpoint={apiEndpoint} sqlConn={sqlConn}/>
            <Redis apiEndpoint={apiEndpoint} sqlConn={sqlConn}/>
        </div>
    );
}