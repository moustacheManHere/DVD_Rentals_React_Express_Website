// Name: Jeyakumar Sriram
// Admin Number: 2214618
// Class: DAAA/FT/1B/01
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import Nav from '../components/navBar';


function BasicExample({token,userType,typeHandle,tokenHandler}) {
    const navigate = useNavigate();

    const [name, setName] = useState(null);
    const [year, setYear] = useState(null);
    
    const handleTitleChange = (event) => {
        setName(event.target.value);
      };
    
    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    const handleSubmit = (event) => {
        
            event.preventDefault();
        if(name==null || year==null||name==" " || year==" "||name=="" || year==""){
            alert("invalid!")
            return 1
        }
        axios
        .post('http://localhost:3001/addRequest', { "title":name, "film_year":year },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            console.log(response)
            if (response.status === 200) {
                alert("added!")
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
                navigate(0);
            }
        });
    };
  return (<>
    <Nav userType={userType} />
    <h1>Request for new DVD</h1>
    <Form onSubmit={handleSubmit}>

        <div>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Title</Form.Label>
            <Form.Control onChange={handleTitleChange} type="text" placeholder="Enter title" />
            <Form.Text className="text-muted">
                Ensure correct spelling please
            </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Year</Form.Label>
            <Form.Control onChange={handleYearChange} type="number" placeholder="eg. 2020" />
        </Form.Group>
        </div>
      
      

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
    </>
  );
}

export default BasicExample;