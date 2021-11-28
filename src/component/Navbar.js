import { Link } from "react-router-dom"


const Navbar = () =>{
    return(
        <div>
            <Link to="/">Home</Link>|
            <Link to="/simpleline">Simple LineChart</Link>|
            <Link to="/multiline">Multi LineChart</Link>|
            <Link to="/d3fc">d3fc-line</Link>
        </div>
    )
}
export default Navbar;