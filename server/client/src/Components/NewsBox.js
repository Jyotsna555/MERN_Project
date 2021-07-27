import React, {useState} from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import LaunchRoundedIcon from '@material-ui/icons/LaunchRounded';


function NewsBox(props){

    const [description, setDescription] = useState(false);
    const [colour, setColour] = useState("black");
    const [saved, setSaved] = useState(false);

    function handleClick(){

        setTimeout(()=>{
            setDescription(!description); 
        } , 10);

    }

    function mouseOver(){
        setColour("white");
    }
    function mouseOut(){
        setColour("black");
    }

    async function savePin(event){

        const postData = {
            title: props.title,
            newslink: props.link,
            date: props.date
        }
        console.log(postData);

        event.preventDefault();

        const response = await fetch("/savepin", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                title: postData.title,
                newslink: postData.newslink,
                date: postData.date
            })
        });

        const data = await response.json();
        console.log("data",data);

        if(data.status === 406 || !data){
            window.alert("SAVE FAILED");
        }else if(data.status===208){
            window.alert("Already saved before 🤡");
        }else if(data.status===200){
            setSaved(true);
            console.log("Saved");
            window.alert("Saved Successfully");
        }
    }
    

    return (
            <li className="NewsLi">
                <div className="NewsBox">
                    <div onMouseOver={mouseOver} onMouseOut={mouseOut} className="newsHeading bg-info">
                        {description ? <ExpandLessIcon style={{color:colour}} onClick={handleClick}/>:<ExpandMoreIcon style={{color:colour}}onClick={handleClick}/>}

                        <h5 onClick={handleClick} style={{color:colour}}>{props.title}</h5>
                        {/* <p onClick={savePin}>{saved ? <BookmarkIcon/>:<BookmarkBorderIcon/>}</p> */}
                        <img src="../pin.png" className="savePin" onClick={savePin} />
                    </div>

                    {description && (<div className="newsDes border-info">
                        <p>{props.date}</p>
                        <div className="newsDesImg">
                            <img src={props.img} />
                        </div>
                        <p>{props.description && props.description.substring(0,190)+" . . ."} <span><a href={props.link} target="_blank" rel="noreferrer"><LaunchRoundedIcon /></a></span></p>
                    </div>)}
                    <br/>
                </div>
            </li>
    )
}
export default NewsBox;