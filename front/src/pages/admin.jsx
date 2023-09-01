// Name: Jeyakumar Sriram
// Admin Number: 2214618
// Class: DAAA/FT/1B/01
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Nav from '../components/navBar';
import Stack from 'react-bootstrap/Stack';
import Actor from "../components/addActorForm"
import Cust from "../components/addCustomerForm"

// allow amount to increment
export default function Home({token,userType,typeHandle,tokenHandler}){
    // ad new actor
    // add new customer
    // add new dvd
    var [state,setState] = useState(0)
    if(state==0){ return(<>
        <Nav userType={userType}></Nav>
        <Stack direction="horizontal" gap={3} className="m-5">
            <Button onClick={()=>{setState(1)}}>Add Actor</Button>
            <Button onClick={()=>{setState(2)}}>Add Customer</Button>
        </Stack>
        
    </>)
        
    } else if(state==1){
        return(<><Nav userType={userType}></Nav>
        <Actor token={token} tokenHandler = {tokenHandler} typeHandle={typeHandle}></Actor>
        </>
            )
    } else if(state==2){
        console.log(1)
        return(<><Nav userType={userType}></Nav>
        <Cust token={token} tokenHandler = {tokenHandler} typeHandle={typeHandle}></Cust>
        </>
            )
    } else {
        return(<>
            <Nav userType={userType}></Nav>
                <Button onClick={()=>{setState(1)}}>Add Actor</Button>
                <Button onClick={()=>{setState(2)}}>Add Customer</Button>
            </>)
    }
}
