import React from 'react';
import Nav1 from "./Nav1";


function Home(){
    return (
        <div>
            <Nav1 />
        <div className="mainBody">
            <h1 className="pageHeading"> <img src="https://img.icons8.com/ios-glyphs/100/fa314a/react.png"/> WELCOME HOME <img src="https://img.icons8.com/ios-glyphs/100/fa314a/react.png"/> </h1>
            <div className="icon-wallpaper">
                <img className="icon-main" src="../news.png"/>
            </div>
        </div>

        </div>
    )
}
export default Home;