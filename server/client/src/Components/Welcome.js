import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import Nav2 from "./Nav2";

function Welcome(){
    const History = useHistory();
    const [userName, setUserName]= useState("");
    
    async function callWelcome(){
        const response = await fetch("/getwelcome", {
            method:"GET",
            headers:{
                Accept: "application/json",
                "Content-Type":"application/json"
            },
            credentials:"include"
        })

        console.log("calling");
        const data = await response.json();

        //console.log(data);

        if(!response.status===200||data.status===404){
            History.push("/page/login");
        }
        else{
           setUserName(data.user.name);
        }
    }

    useEffect(()=> {
        callWelcome();
    }, []);

    return (
        <div>
            <Nav2 />
            <div className="mainBody">
                <h1 className="pageHeading"> <img src="https://img.icons8.com/ios-glyphs/100/fa314a/react.png"/>WELCOME {userName}! <img src="https://img.icons8.com/ios-glyphs/100/fa314a/react.png"/> </h1>
                <div className="icon-wallpaper">
                    <img className="icon-main" src="../news.png"/>
                </div>
            </div>
        </div>
    )
}
export default Welcome;