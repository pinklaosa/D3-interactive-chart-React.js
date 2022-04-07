import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <Link to="/">Home</Link>|
      <Link to="/simpleline">Simple LineChart</Link>|
      <Link to="/multiline">Multi LineChart</Link>|
      {/* <Link to="/linecolor">Change line color</Link>| */}
      <Link to="/scatter">Scatter plot</Link>|<Link to="/lasso">Lasso</Link>
    </div>
  );
};
export default Navbar;

// const t = [
//     {
//       col: "nameSensor",
//       values: [
//         {
//           date: "12/11/2021",
//           vSensor: "10.87",
//         },
//         {
//           date: "13/11/2021",
//           vSensor: "11.87",
//         }
//       ]
//     },
//     {
//       col: "nameSensor",
//       values: [
//         {
//           date: "12/11/2021",
//           vSensor: "8.87",
//         },
//         {
//           date: "13/11/2021",
//           vSensor: "7.7",
//         }
//       ]
//     }
// ];
