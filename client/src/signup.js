import axios from "axios";
import React, {useState} from "react";

function signup(){
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [name, setName] = useState('')
    const navigate = useNavigate()
    const handleName = (e) => {
        e.preventDefault()
        setName(e.target.value)
    }  
    const handleEmail = (e) => {
        e.preventDefault()
        setEmail(e.target.value)
    }    

    const handlepass = (e) => {
        e.preventDefault()
        setPass(e.target.value)
    }
    const handleSubmit = (e) => {
        axios.post(`http://localhost:8080/users/login`, {name: name, email: email, password: pass}).then(res => {navigate(`/login`)
        }).catch(err => {})
    }


    
    return  <div>{this.state}
      <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={handleName} placeholder={"name"}/>
        <input type="text" value={email} onChange={handleEmail} placeholder={"email"}/>
        <input type="text" value={pass} onChange={handlepass} placeholder={"password"}/>
        <button type="submit">Sign up</button>
      </form>
    </div>
}
export default signup;