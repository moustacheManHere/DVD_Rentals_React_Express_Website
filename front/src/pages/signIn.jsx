// Name: Jeyakumar Sriram
// Admin Number: 2214618
// Class: DAAA/FT/1B/01
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import axios from "axios"


function BasicExample(props) {
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    var tokenHandler = props.tokenHandler
    var setUserType = props.typeHandle
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
      };
    const handleUsernameChange = (event) => {
        setEmail(event.target.value);
      };
    
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const [selectedValue, setSelectedValue] = useState("User");

    const handleChange = (e) => {
        setSelectedValue(e.target.id);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        setValidated(true);

        if(selectedValue=="Admin"){
            axios
            .post('http://localhost:3001/createToken', { "username":email, "password":password })
            .then((response) => {
                console.log(response)
                const token = response.data.token;
                const type = response.data.type;
                tokenHandler(token);
                setUserType(type)
                if (response.status === 200) {
                    window.location.href = '/';
                } else {
                    navigate(0);
                }
            })
            .catch((error) => {
                console.error(error);
                navigate(0);
            });
        } else {
            axios
            .post('http://localhost:3001/createToken', { "email":email, "password":password })
            .then((response) => {
                console.log(response)
                const token = response.data.token;
                const type = response.data.type;
                tokenHandler(token);
                setUserType(type)
                if (response.status === 200) {
                    navigate("/")
                } else if(response.status == 401){
                  alert("Invalid Credentials")
                } 
                else {
                  alert("Error!")
                    navigate(0);
                }
            })
            .catch((error) => {
                console.error(error);
                navigate(0);
            });
        }
        
    };
  return (<>
  <h1 className='text-center text_underline'>Login</h1>
    <Form className="m-5 p-2" style={{"border": "1px solid black",
    "padding": "10px"}} noValidate validated={validated} onSubmit={handleSubmit}>
      <div key={`inline-radio`} className="mb-3">
          <Form.Check
            inline
            label="User"
            name="User"
            type="radio"
            id={`User`}
            onChange={handleChange}
            defaultChecked 
          />
          <Form.Check
            inline
            label="Admin"
            name="User"
            type="radio"
            id={`Admin`}
            onChange={handleChange}
          />
          
        </div>
      
      {selectedValue === "User" && (
        <div>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onChange={handleEmailChange} type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
            We'll never share your email with anyone else.
            </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onChange={handlePasswordChange} type="password" placeholder="Password" />
        </Form.Group>
        </div>
      )}
      {selectedValue === "Admin" && (
        <div>
        <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Username</Form.Label>
            <Form.Control onChange={handleUsernameChange} type="text" placeholder="Enter Username" />
            
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onChange={handlePasswordChange} type="password" placeholder="Password" />
        </Form.Group>
        </div>
      )}
      

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form></>
  );
}

export default BasicExample;