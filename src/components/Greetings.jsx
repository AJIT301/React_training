import { State } from "react";
import "../styles/Greeting.css"


function Greeting({ name }) {
    return (
        <div className="greeting">
        <h1>Hello, {name}! Welcome to React.</h1>
        </div>
    )
}

export default Greeting;
