import React, { useState } from 'react';
import {useHistory} from "react-router-dom";
import Nav1 from "./Nav1";


function Signup(){
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

    async function postSignup(event){
        console.log(user);
        event.preventDefault();


        const {name, username, password} = user;

        const response = await fetch("/postsignup", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                name, username, password
            })
        });

        const data = await response.json();

        if(response.status === 422 || !data){
            window.alert("FAILED");
        }else if(response.status===200){
            History.push("/page/login");
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
                    {/* <h1 className="pageHeading"> SIGNUP </h1> */}
                    <br/>
                    <img className="icon" src="../add-user.png"/>
                    <form method="POST" onSubmit={postSignup} className="inputForm">
                        <h1 className="pageHeading"> SIGNUP </h1>
                        <div className="form-group">
                            <label for="name">Enter your name, username and password.</label><br/>
                            <input onChange ={handleInput} name="name" value={user.name} placeholder="Name" type="text" autoComplete="off" />
                        </div>

                        <div className="form-group">
                            {/* <label for="username">Enter a username</label><br/> */}
                            <input onChange ={handleInput} name="username" value={user.username} placeholder="Username" type="text" autoComplete="off" />
                        </div>

                        <div className="form-group">
                            {/* <label for="password">Enter a password</label><br/> */}
                            <input onChange ={handleInput} name="password" value={user.password} placeholder="Password" type="text" autoComplete="off" />
                        </div>

                        <button onMouseOver={mouseOver} onMouseOut={mouseOut} style={{color: button}} className="btn btn-custom" type="submit">Sign Up</button>
                        <br/>
                    </form>
                </div>

            </div>
            
        </div>
    );
}
export default Signup;