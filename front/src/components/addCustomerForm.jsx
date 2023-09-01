import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import axios from "axios"


function BasicExample({token,userType,typeHandle,tokenHandler}) {
    const navigate = useNavigate();
    const [cities, setCities] = useState([]);
    useEffect(() => {
        axios
            .get('http://localhost:3001/getCity')
            .then((response) => {
                if (response.status === 200) {
                    setCities(response.data)
                } else {
                    window.location.href = "/"
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

            });
    },[]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [ad, setAd] = useState('');
    const [dist, setDist] = useState('');
    const [city, setCity] = useState(1);
    const [phone, setPhone] = useState('');
    
    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        var postObj = {"first_name":first,"last_name":last,"email":email, "password":password
                       ,address:{"address":ad,"district":dist,"city_id":city,"phone":phone}}
        
        axios
        .post('http://localhost:3001/addCustomerAsAdmin', postObj,{headers: {
            'Authorization': `Bearer ${token}`
        }})
        .then((response) => {
          if (response.status==200) {
                alert("added!")
              window.location.href = '/';
          }
          if(response.status==401){
            alert("you token is invalid, please login")
            tokenHandler(null)
            typeHandle("public")
            navigate("/")
          } else {
            console.error("error");
            navigate("/");
          }
        })
        .catch((error) => {
            alert("Invalid")
            console.error(error);
        });
    };
  return (
    <Form onSubmit={handleSubmit} className="m-5 p-2" style={{"border": "1px solid black",
    "padding": "10px"}}>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>First Name</Form.Label>
          <Form.Control type="text" placeholder="eg. Sam" onChange={(e)=>{setFirst(e.target.value)}} />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridPassword">
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="text" placeholder="eg. Mike" onChange={(e)=>{setLast(e.target.value)}}  />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={(e)=>{setEmail(e.target.value)}}  />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}}  />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="formGridAddress1">
        <Form.Label>Address</Form.Label>
        <Form.Control placeholder="eg. 1234 Main St"  onChange={(e)=>{setAd(e.target.value)}} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGridAddress2">
        <Form.Label>District</Form.Label>
        <Form.Control type="text" placeholder="Apartment, studio, or floor" onChange={(e)=>{setDist(e.target.value)}}  />
      </Form.Group>

      <Row className="mb-3">
        
        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>City</Form.Label>
          <Form.Select onChange={(e)=>{setCity(e.target.value)}} >
          {cities.map(city => (
          <option id={city.city_id} value={city.city_id}>
            {city.city}
          </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridZip">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="tel" onChange={(e)=>{setPhone(e.target.value)}} />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" id="formGridCheckbox">
        <Form.Check type="checkbox" label="Stay updated" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default BasicExample;