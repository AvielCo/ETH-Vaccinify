import React, {useState} from 'react'


function VaccineCheck({contract}) {
    const [id, setId] = useState("")
    const [isVaccinated, setIsVaccinated] = useState(false)
    const [show, setShow] = useState(false)

    const getID = async (id) => {
        let vaccinated = await contract.methods
            .checkID(id)
            .call();
        return vaccinated;
    }

    const handleClick = () => {
        if(id.length <= 0){
            return
        }
        getID(id).then((res)=>{
            setIsVaccinated(res);
            setShow(true)
        })
    }

    const handleChange = (event) => {
        setShow(false)
        setId(event.target.value)
    }

  return (
    <div>
      <div>
          <input type="text" id="vaccCheck" value={id} placeholder="ID" onChange={handleChange}/> 
          <button onClick={handleClick} id="checkID">Check vaccine</button>
        </div>
        {show && (
        <div>
            <label>Person with id: {id} is {isVaccinated ? "" : "not"} vaccinated</label>
        </div>)}
    </div>
  )
}

export default VaccineCheck
