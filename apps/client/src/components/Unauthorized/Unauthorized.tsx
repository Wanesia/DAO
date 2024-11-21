import React from "react";
import { BiErrorAlt } from "react-icons/bi";

const Unauthorized: React.FC = () => (
  <div style={{ padding: "20px", textAlign: "center" }}>
    <h1>Unauthorized</h1>
    <p>You are not allowed to access this content. Please log in or contact support if the issue persists.</p>
    <BiErrorAlt style={{margin:"1rem", fontSize: "8rem", color:"#bf1e2e"}}></BiErrorAlt>
  </div>
);

export default Unauthorized;