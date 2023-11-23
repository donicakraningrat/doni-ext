import { TConfig, TDbConfig } from "../../const/db";
import Epoch from "./Epoch/Epoch";
import Jwt from "./Jwt/Jwt";
import Redis from "./Redis/Redis";

export default function Home({apiEndpoint,config}:{apiEndpoint:string,config:TConfig}) {
    return (
        <div>
            <Epoch/>
            <Jwt apiEndpoint={apiEndpoint} config={config}/>
            <Redis apiEndpoint={apiEndpoint} config={config}/>
        </div>
    );
}