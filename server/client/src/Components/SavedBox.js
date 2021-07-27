import React, {useEffect,useState} from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import LaunchRoundedIcon from '@material-ui/icons/LaunchRounded';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';


function SavedBox(props){

    const [description, setDescription] = useState(false);
    const [colour, setColour] = useState("black");
    const [deleted, setDeleted] = useState(false);

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

    async function deletePin(event){

        const title = props.title;

        event.preventDefault();

        const response = await fetch("/deletepins", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                title: title,
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
    

    return (
            <li className="NewsLi">
                <div className="NewsBox">
                    <div onMouseOver={mouseOver} onMouseOut={mouseOut} className="newsHeading bg-info">
                        {description ? <ExpandLessIcon style={{color:colour}} onClick={handleClick}/>:<ExpandMoreIcon style={{color:colour}}onClick={handleClick}/>}

                        <h5 onClick={handleClick} style={{color:colour}}>{props.title}</h5>
                        <DeleteOutlineIcon onClick={deletePin}/>
                    </div>

                    {description && (<div className="newsDes border-info">
                        <p>{props.date}</p>
                        {/* <div className="newsDesImg">
                            <img src={props.img} />
                        </div> */}
                        <p><span><a href={props.newslink} target="_blank">. . .<LaunchRoundedIcon /></a></span></p>
                    </div>)}
                    <br/>
                </div>
            </li>
    )
}
export default SavedBox;