import React, {useState} from 'react'

function GetStats({contract}) {
    const [stats, setStats] = useState({})
    const [show, setShow] = useState(false)

    const showStats = async () => {
      let stats = await contract.methods.getStats().call();
      return stats
    }

    const handleClick = (event) => {
        showStats().then((res)=>{
          setStats(res);
          setShow(true);
          })
    }
  return (
    <div>
      <div>
          <button onClick={handleClick} id="showStats">Show statistics</button>
        </div>
        <div>
          {show && (<div>
            <div><label><b>Statistics:</b></label></div>
            <div><label>Total registered: {stats[3]}</label></div>
            <div><label>Vaccinated percentage: {(stats[0]/stats[3])*100} %</label></div>
            <div><label>Vaccinated average age: {stats[1]}</label></div>
            <div><label>Unvaccinated average age: {stats[2]}</label></div>
          </div>)}
        </div>
    </div>
  )
}

export default GetStats;
