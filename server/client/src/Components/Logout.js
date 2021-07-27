import React, { useEffect } from 'react';
import {NavLink, useHistory} from "react-router-dom";
import Nav2 from "./Nav2";


function Logout(){

    const History = useHistory();

    async function callLogout(){
    
      console.log("logout")

        const response = await fetch("/logout", {
          method:"POST",
          headers:{
              "Content-Type":"application/json"
          },
          body: ""
        });

      const data = await response.json();
      console.log("data",data);

      if(data.status === 422 || !data){
          window.alert("FAILED");
        }else if(response.status===200){
            console.log("Logged out");
            History.push("/page/login");
        }
    }

    useEffect(()=> {
        callLogout();
    }, [])

    return (
        <div>
            <Nav2 />
            <h1>Logout</h1>
        </div>      
    )
}
export default Logout;