import axios from "axios";
import React, {useState} from "react";

function login(){
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')

    
    const handleEmail = (e) => {
        e.preventDefault()
        setEmail(e.target.value)
    }    

    const handlepass = (e) => {
        e.preventDefault()
        setPass(e.target.value)
    }
    const handleSubmit = (e) => {
        axios.post(`http://localhost:8080/users/login`, {email: email, password: pass}).then(res => {navigate(`/home`)
        }).catch(err => {})
    }


    
    return  <div>{this.state}
      <form onSubmit={handleSubmit}>
        <input type="text" value={email} onChange={handleEmail} placeholder={"email"}/>
        <input type="text" value={pass} onChange={handlepass} placeholder={"password"}/>
        <button type="submit">Log in</button>
      </form>
    </div>
}
export default login;;