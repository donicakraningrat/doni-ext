
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

let x = {test:[1,2],test2:["g","l","x"],test3:["k","d","y"]}
let y = recTestcase(x);
console.log(y);

