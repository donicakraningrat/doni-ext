
function recTestcase(params: Record<string, any>, ix: number = 0) {
    let temp: Record<string, any>[] = [];
    let out: Record<string, any>[] = [];
    for (const pName in params) {
        for (const val of params[pName]) {
            if (out.length <= 0) { temp.push({ [pName]: val }) }
            else {
                for (let p of out) {
                    temp.push({ ...p, [pName]: val });
                }
            }
        }
            out = temp;
            temp = [];
    }
    return out;
}

let x = { test: [1, 2], test2: ["g", "l", "x"], test3: ["k", "d", "y"] }
let y = recTestcase(x);
console.log(y);

