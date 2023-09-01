// Name: Jeyakumar Sriram
// Admin Number: 2214618
// Class: DAAA/FT/1B/01
import {useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from '../components/navBar';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home({token,userType,typeHandle,tokenHandler}){
    var nav = useNavigate()
    let { id } = useParams();
    const [results, setResults] = useState("yes");
    const [rental, setRental] = useState(3);
    console.log(userType)
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const currentYear = new Date().getFullYear();
    const yearRange = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString());
    var submitter = async (event)=>{
        event.preventDefault();
        const resp = await axios.post(`http://localhost:3001/addPayment`,{"film_id":id,"rentalDays":rental},{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).catch(function(error){
            if (error.response && error.response.status === 401) {
              alert("you token is invalid, please login")
              tokenHandler(null)
              typeHandle("public")
              nav("/")
                // redirect to login page or display message
            } else if(error.response.status==408){
                alert("Out of Stock!")
            } else {
                alert("Error!")
                console.log(error);
            }
        });
        if(resp.status==201){
            alert("payment updated")
            nav("/")
        }
            
    }
    
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/dvdDetails/${id}`);
            
            setResults(response.data);
            console.log(results)
          } catch (error) {
            console.error(error);
            window.location.href("/")
          }
    }
    useEffect(()=>{
        fetchCategories()   
    },[])
    
    return (<> {results=="yes"? <h1>Not Here</h1>
  :
  <>
  <Nav userType={userType}/>
  <Card>
  <Card.Header>{results.film[0].title}</Card.Header>
  <Card.Body>
    <Card.Title>Payment</Card.Title>
  <Form onSubmit={submitter} className="m-5 p-2" style={{"border": "1px solid black",
    "padding": "10px"}}>
        <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>How many days rental?</Form.Label>
          <Form.Control type="number" placeholder="3" value={rental} onChange={(e)=>{setRental(e.target.value)}}/>
        </Form.Group>
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>First Name</Form.Label>
          <Form.Control type="text" placeholder="eg. Sam"/>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridPassword">
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="text" placeholder="eg. Mike" />
        </Form.Group>
      </Row>
      <Form.Group className="mb-3" controlId="formGridAddress1">
        <Form.Label>Credit Card Number</Form.Label>
        <Form.Control placeholder="eg. 1234 Main St"  />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGridAddress2">
        <Form.Label>CVV</Form.Label>
        <Form.Control type="text" placeholder="Apartment, studio, or floor" />
      </Form.Group>
      <Form.Group as={Col} xs="6" className="mb-3">
        <Form.Label>Expiration Month</Form.Label>
        <Form.Control as="select">
          {months.map((month) => (
            <option key={month}>{month}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group as={Col} xs="6" className="mb-3">
        <Form.Label>Expiration Year</Form.Label>
        <Form.Control as="select">
          {yearRange.map((year) => (
            <option key={year}>{year}</option>
          ))}
        </Form.Control>
      </Form.Group>


      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
    
  </Card.Body>
    </Card> 
    </>
  }
    </>)
}