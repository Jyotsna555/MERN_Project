import React, { useState } from 'react';
import {useHistory} from "react-router-dom";
import Nav1 from "./Nav1";


function Login(){

    const History = useHistory();

    const [user, setUser] = useState({
        name:"",
        username:"",
        password:""
    });
    const [button, setButton] = useState("black");

    function handleInput(event){
        const {name, value} = event.target;
        setUser(prev => {
            return {
                ...prev, [name]:value
            }
        });

    }

    async function postLogin(event){
        console.log(user);
        event.preventDefault();


        const {name, username, password} = user;

        const response = await fetch("/postlogin", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                name, username, password
            })
        });

        const data = await response.json();
        console.log("data",data);

        if(data.status === 422 || !data){
            window.alert("FAILED");
        }else if(data.status===200){
            console.log("YAYYAY");
            History.push("/page/welcome");
        }
    }

    function mouseOver(event){
        setButton("white");
    }
    function mouseOut(event){
        setButton("black");
    }

    return (
        <div>
            <Nav1 />
            <div className="mainBody">
                <div className="container">
                    <form method="POST" onSubmit={postLogin} className="inputForm">
                        {/* <br/> */}
                        <h1 className="pageHeading"> LOGIN </h1>
                        <br/>
                        <div className="form-group">
                            <label for="username">Enter username and password.</label><br/>
                            <input onChange ={handleInput} name="username" value={user.username} placeholder="Username" type="text" autoComplete="off" />
                        </div>

                        <div className="form-group">
                            <input onChange ={handleInput} name="password" value={user.password} placeholder="Password" type="password" autoComplete="off"/>
                        </div>

                        <button onMouseOver={mouseOver} onMouseOut={mouseOut} style={{color: button}} className="btn btn-custom"type="submit">Login</button>

                    </form>

                    <img className="icon" src="../login.png"/>
                </div>
                  
            </div>
        </div>
    )
}
export default Login;