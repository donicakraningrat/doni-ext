import useLocalStorage from "../../../hooks/useLocalStorage";

export default function Epoch() {

    const [epoch, setEpoch] = useLocalStorage<number>("Epoch", 0);
    const [date, setDate] = useLocalStorage<string>("Epoch_Date", "");
    function h_dateTxt_click() {
        setEpoch(new Date(date).getTime() / 1000);
    }
    function h_epochTxt_click() {
        const _date = new Date(epoch * 1000);
        const sDatetime: string = _date.toLocaleString("id-ID").replace(", ", "/").replace(/\./g, "/");
        const arDatetime = sDatetime.split("/");
        const formattedDatetime = `${arDatetime[2]}-${arDatetime[1].padStart(2,"0")}-${arDatetime[0].padStart(2,"0")}T${arDatetime[3]}:${arDatetime[4]}`
        setDate(formattedDatetime);
    }
    return (
        <fieldset>
            <legend>Epoch</legend>
            <label htmlFor="dateTxt"></label>
            <input id="dateTxt" value={date} onChange={e => setDate(e.target.value)} type="datetime-local" />
            <button onClick={h_dateTxt_click}>to Epoch</button>
            <label htmlFor="epochTxt"></label>
            <input id="epochTxt" value={epoch} onChange={e => setEpoch(parseInt(e.target.value))} type="number" style={{width:"80px"}}/>
            <button onClick={h_epochTxt_click}>to Date</button>
        </fieldset>
    );
}