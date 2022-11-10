import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

async function App() {
  const [value, setValue] = useState('')
  const navigate = useNavigate()
  const handleChange = (e) => {
      e.preventDefault()
      setValue(e.target.value)
  }
  const handleSubmit = (e) => {
      e.preventDefault()
      navigate(`/${value}`)
  }
  return await axios.get(`http://localhost:8080/users/login`)
}

export default App;
