import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FormControl } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import axios from "axios"


function BasicExample({token,userType,typeHandle,tokenHandler}) {
    const navigate = useNavigate();

    const [first, setFirst] = useState(null);
    const [last, setLast] = useState(null);
    
    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log(first)
        if(first&&last){
                axios
            .post('http://localhost:3001/addActor', { "first_name":first, "last_name":last },{headers: {
                'Authorization': `Bearer ${token}`
            }})
            .then((response) => {
                if (response.status === 201) {
                    alert("Added")
                    window.location.href = '/';
                } else {
                    navigate(0);
                }
            })
            .catch((error) => {
                if(error.response.status==401){
                    alert("you token is invalid, please login")
                    tokenHandler(null)
                    typeHandle("public")
                    navigate("/")
                  } else {
                    console.error(error);
                    navigate("/");
                  }
                console.error(error);
                navigate(0);
            });
        } else {
            alert("incomplete info!")
        }
            
    };
  return (
    <Form onSubmit={handleSubmit} className="m-5 p-2" style={{"border": "1px solid black",
    "padding": "10px"}}>
      
    <Form.Group className="mb-3" controlId="formBasicText">
        <Form.Label>First Name</Form.Label>
        <Form.Control onChange={(e)=>{setFirst(e.target.value)}} value={first} type="text" placeholder="Enter First name" />
        
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Last Name</Form.Label>
        <Form.Control onChange={(e)=>{setLast(e.target.value)}} value={last}  type="text" placeholder="Enter Last Name" />
    </Form.Group>
    
    <Button variant="primary" type="submit">
    Submit
    </Button>
    </Form>
  );
}

export default BasicExample;