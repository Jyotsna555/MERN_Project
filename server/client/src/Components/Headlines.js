import React, { useEffect, useState } from 'react';
import {useHistory} from "react-router-dom";
import Nav2 from "./Nav2";
import NewsBox from "./NewsBox";


function Headlines(){
    const History = useHistory();
    const [newsArr, setNews] = useState([]);
    
    async function callNews(){
        const response = await fetch("/getheadlines", {
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
            History.push("/page/welcome");
        }
        else{
            setNews(data.articles);
            //console.log("got news!!", newsArr);
        }
       
    }

    useEffect(()=> {
        callNews();
    }, []);

    //callNews();


    return (
        <div>
            <Nav2 />
            <div className="mainBody">
                <h1 className="pageHeading text-danger"> Headlines </h1>
                <ul>
                {newsArr.map((a, index) => {
                        // console.log("NEWS");
                        return (

                        <NewsBox
                        key={index}
                        number={index}
                        title={a.title}
                        img = {a.urlToImage}
                        link = {a.url}
                        description={a.content}
                        date={a.publishedAt}
                        />
                        );   
                    })}
            </ul>
            </div>


        </div>
    )
}
export default Headlines;