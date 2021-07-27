import React, { useEffect, useState } from 'react';
import {useHistory} from "react-router-dom";
import Nav2 from "./Nav2";
import SavedBox from "./SavedBox";


function Pinned(){
    const History = useHistory();
    const [newsArr, setNews] = useState([]);
    const [isEmpty, checkEmpty] = useState(true);
    const [deleted, setDeleted] = useState(false);


    async function deleteAll(event){

        const response = await fetch("/deleteallpins", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
            })
        });

        const data = await response.json();
        console.log("data",data);

        if(data.status === 400 || !data){
            window.alert("DELETE FAILED");
        }else if(data.status===200){
            window.alert("Deleted Successfully! :)");
            window.location.reload(); 
            setDeleted(!deleted);
        }
    }
    
    async function getPins(){
        const response = await fetch("/getpins", {
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

        if(data.status===404 || !data){
            //window.alert("No Pins Created!");
            History.push("/page/welcome");
        }
        else if(data.status===204){
            checkEmpty(true);
        }else{
            checkEmpty(false);
            setNews(data);
        }
       
    }


    useEffect(()=> {
        getPins();
    }, []);

    //callNews();
    console.log(isEmpty);

    return (
        <div>
            <Nav2 />
            <div className="mainBody">
                <h1 className="pageHeading text-danger"> Pinned Headlines </h1>
                <ul>
                {newsArr.map((a, index) => {
                        return (

                        <SavedBox
                        key={index}
                        number={index}
                        title={a.title}
                        newslink = {a.newslink}
                        date={a.date}
                        />
                        );   
                    })}
            </ul>
            {!isEmpty && (
                <div className="deleteall">
                    <button onClick={deleteAll} className="btn btn-danger"> Delete all pins</button>
                </div>
            )}
            </div>


        </div>
    )
}
export default Pinned;