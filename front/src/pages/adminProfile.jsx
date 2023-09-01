// Name: Jeyakumar Sriram
// Admin Number: 2214618
// Class: DAAA/FT/1B/01
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from '../components/navBar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home({token,userType,typeHandle,tokenHandler}){
    var navigate = useNavigate()
    const [results, setResults] = useState({"phone":999,"first_name":"loading","last_name":"loading","address":"loading","address2":"loading","district":"loading","postal":0,"city_id":0});
    const [cities, setCities] = useState(["none"]);
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
                console.error(error);
                navigate("/");
            });
    },[]);
    const fetchRecommendations = async () => {
        try {
          const response = await axios.get('http://localhost:3001/getAdminProfileData',{
            headers: {
                'authorization': `Bearer ${token}`
            }
          });
          if (response.status === 200) {
            console.log(response.data)
            setResults(response.data[0]);
            setCity(response.data[0].city_id)
          } else {
            throw new Error("Request to API failed with status code " + response.status);
          }
        } catch (error) {
          console.error(error);
          navigate('/djsvb');
        }
      };
      
      useEffect(() => {
        fetchRecommendations();
      }, []);
      const [city_id, setCity] = useState(1);
      var [first_name, setfirst_name] = useState(null);
      var [last_name, setlast_name] = useState(null); 
      var [address, setaddress] = useState(null);
      var [address2, setaddress2] = useState(null);
      var [district, setdistrict] = useState(null);
      var [postal, setpostal] = useState(null);
      var [phone, setphone] = useState(null);
      var submitter = async(event) =>{
        
        event.preventDefault();
        var x = [city_id,first_name,last_name,address,address2,district,postal, phone]
        var y = ["city_id","first_name","last_name","address","address2","district","postal_code", "phone"]
        var postObj = {}
        for (var i = 0 ;i<x.length;i++){
          if(x[i]){
            postObj[y[i]]=x[i]
          }
        }
        try {
            const response = await axios.put(`http://localhost:3001/updateAdmin`,postObj,{
              headers: {
                  'authorization': `Bearer ${token}`
              }
          });
            if (response.status === 200) {
              alert("updated")
              navigate("/")  
            }else  if(response.status==401){
              alert("you token is invalid, please login")
              tokenHandler(null)
              typeHandle("public")
              navigate("/")
            } else {
                console.error("error");
                navigate('/djsvb');
            }
          } catch (error) {
            console.error(error);
            navigate('/djsvb');
          }
      }
    return(<>
    <Nav userType={userType}></Nav>
    <Form onSubmit={submitter} className="m-5 p-2" style={{"border": "1px solid black",
    "padding": "10px"}}>
    <Form.Group controlId="formSearchTerm">
      <h5>first_name: {results.first_name}</h5>
            <Form.Control
              type="text"
              placeholder="Type new value"
              value={first_name}
              onChange={(e) => setfirst_name(e.target.value)}
            />
    </Form.Group>
    <Form.Group controlId="formSearchTerm">
      <h5>last_name: {results.last_name}</h5>
            <Form.Control
              type="text"
              placeholder="Type new value"
              value={last_name}
              onChange={(e) => setlast_name(e.target.value)}
            />
    </Form.Group>
    <Form.Group controlId="formSearchTerm">
      <h5>address: {results.address}</h5>
            <Form.Control
              type="text"
              placeholder="Type new value"
              value={address}
              onChange={(e) => setaddress(e.target.value)}
            />
    </Form.Group>
    <Form.Group controlId="formSearchTerm">
      <h5>address2: {results.address2}</h5>
            <Form.Control
              type="text"
              placeholder="Type new value"
              value={address2}
              onChange={(e) => setaddress2(e.target.value)}
            />
    </Form.Group>
    <Form.Group controlId="formSearchTerm">
      <h5>district: {results.district}</h5>
            <Form.Control
              type="text"
              placeholder="Type new value"
              value={district}
              onChange={(e) => setdistrict(e.target.value)}
            />
    </Form.Group>
    <Form.Group controlId="formSearchTerm">
      <h5>postal: {results.postal_code}</h5>
            <Form.Control
              type="number"
              placeholder="Type new value"
              value={postal}
              onChange={(e) => setpostal(e.target.value.toString())}
            />
    </Form.Group>
    <Form.Group controlId="formSearchTerm">
      <h5>phone: {results.phone}</h5>
            <Form.Control
              type="tel"
              placeholder="Type new value"
              value={phone}
              onChange={(e) => setphone(e.target.value)}
            />
    </Form.Group>
    <Form.Control as="select" value={city_id} onChange={(e) => setCity(e.target.value)}>
              {cities.map(category => (
                <option id={category.city_id} value={category.city_id}>
                  {category.city}
                </option>
              ))}
    </Form.Control>
    <Button type='submit'>Update!</Button>
    </Form>
    </>)
}