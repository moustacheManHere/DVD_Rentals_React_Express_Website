// Name: Jeyakumar Sriram
// Admin Number: 2214618
// Class: DAAA/FT/1B/01
import React, { useState, useEffect } from 'react';
import {useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';

import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Nav from '../components/navBar';;

export default function Home({token,userType,typeHandle,tokenHandler}){
    var navigate = useNavigate()
    token = localStorage.getItem("token")
    var [details, setDetail] = useState("yes");
    let { id } = useParams();

    
    const [bought, setBought] = useState(false);
    const [addedCart, setAdded] = useState(false);
    const [outOfStock, setStock] = useState(false);
    const [isReviewed, setIsReviewed] = useState(false);

    const [rating, setRating] = useState(3);
    const [review, setReview] = useState("");

    // check if addedToCart
    const checkAddedCart = async () => {
        try {
            const response = await axios.get('http://localhost:3001/checkAddedCart', {
            params: {
              film_id: id
            },
            headers: {
              "Authorization": `Bearer ${token}`
            }
            });
            if(response.status==200){
                setAdded(response.data.bought);
            } else {
                if(response.status==401){
                    alert("you token is invalid, please login")
                    tokenHandler(null)
                    typeHandle("public")
                    navigate("/")
                  } else {
                      console.error("error");
                      navigate('/djsvb');
                  }
            }
        } catch {
          console.error("error");
        }
    };
    // check if addedToCart
    const checkIfStock = async () => {
        try {
            const response = await axios.get('http://localhost:3001/checkAvailableFilm', {
            params: {
              film_id: id
            },
            headers: {
              "Authorization": `Bearer ${token}`
            }
            });
            if(response.status == 200){
                setStock(response.data.bought);
            } else {
                if(response.status==401){
                    alert("you token is invalid, please login")
                    tokenHandler(null)
                    typeHandle("public")
                    navigate("/")
                  } else {
                      console.error("error");
                      navigate('/djsvb');
                  }
            }
        } catch (error) {
          console.error("error");
        }
    };

    // check if bought already
    const checkBought = async () => {
        try {
            const response = await axios.get('http://localhost:3001/checkBought', {
            params: {
              film_id: id
            },
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
            if(response.status==200){
                setBought(response.data.bought);
            } else {
                if(response.status==401){
                    alert("you token is invalid, please login")
                    tokenHandler(null)
                    typeHandle("public")
                    navigate("/")
                  } else {
                      console.error("error");
                      navigate('/djsvb');
                  }
            }
          
        } catch (error) {
          console.error("error");
        }
    };

    // check if reviewed already
    const checkReview = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/checkReview/${id}`, {
                headers: {
                "Authorization": `Bearer ${token}`
                }
            });
            if(response.status==200){
                setIsReviewed(response.data.done);
            } else {
                if(response.status==401){
                    alert("you token is invalid, please login")
                    tokenHandler(null)
                    typeHandle("public")
                    navigate("/")
                  } else {
                      console.error("error");
                      navigate('/djsvb');
                  }
               
            }
        } catch (error) {
          console.error("error");
        }
    };

    // get details to show
    const getDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/dvdDetails/${id}`);
            if(response.status==200){
                setDetail(response.data);
            } else {
                alert("error4")
                
            }
        } catch (error) {
            console.error(error);
            window.location.href("/")
        }
    }

    // run all on render
    useEffect(()=>{
        checkBought()
        checkAddedCart()
        checkIfStock()
        checkReview()
        getDetails()
        console.log(isReviewed)
    },[token])
    useEffect(()=>{
        checkBought()
        checkAddedCart()
        checkIfStock()
        checkReview()
        getDetails()
    },[])

    // add to cart

    var addToCart = async(event)=>{
        event.preventDefault();
        if(!bought && userType=="customer"){
            try {
                const response = await axios.post('http://localhost:3001/addToCart',{"film_id":id} ,{
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if(response.status==411){
                    alert("out of stock!")
                } else if(response.status==200){
                    alert("Added to cart!")
                    navigate(0)
                } else if(response.status==401){
                    alert("you token is invalid, please login")
                    tokenHandler(null)
                    typeHandle("public")
                    navigate("/")
                } else {
                    console.error("error");
                    navigate('/djsvb');
                }
                    // navigate(0)
                
            }catch(error){
                console.log(error);
                navigate(0)
            }
            
            
        }
    }
    // add review
    var addReview = async(event)=>{
        event.preventDefault();
        if(bought && userType=="customer"){
            try {
                const response = await axios.post(`http://localhost:3001/addReview`,{"film_id":id,"rating":rating,"review":review},{
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                
                if(response.status==407){
                    alert("Film not bought!")
                } else if(response.status==201){
                    setIsReviewed(true)
                    alert("review added!")
                    navigate(0)
                } else if(response.status==401){
                    alert("you token is invalid, please login")
                    tokenHandler(null)
                    typeHandle("public")
                    navigate("/")

                } else {
                    alert(response.status)
                }
            }catch(error){
                alert("error")
                console.log(error);
                navigate(0)
            }
            
            
        }
    }

    return(
        <>
            {details=="yes"?
            <h1>Loading...</h1>
            :
            <>
                <Nav userType={userType}/>
                <Card>
                    <Card.Header>{details.film[0].title}</Card.Header>
                    <Card.Body>
                        <Card.Title>Actors </Card.Title>
                        <Table>
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">First Name</th>
                                <th scope="col">Last Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.actors.map((item)=>{
                                    return (
                                        <tr>
                                            <th></th>
                                            <td>{item.first_name}</td>
                                            <td>{item.last_name}</td>
                                        </tr>
                                    
                                    )
                                })}
                            </tbody>
                        </Table>
                        
                            
                        <Card.Title>Reviews</Card.Title>
                        
                            {details.review.length==0?<p>No reviews yet</p>:
                            <Table>
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Rating</th>
                                <th scope="col">Review</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.review.map((item)=>{
                                    return (
                                        <tr>
                                            <th></th>
                                            <td>{item.rating}</td>
                                            <td>{item.review}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                        }
                        <Card.Title>Film Details </Card.Title>
                        <Table>
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Property</th>
                                <th scope="col">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys( details.film["0"]).map((i)=>{
                                    return (
                                        <tr>
                                            <th></th>
                                            <td>{i}</td>
                                            <td>{details.film["0"][i]}</td>
                                        </tr>
                                    
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Card.Body>
                    <Card.Footer>
                        {userType=="customer"?
                            (bought?
                                (isReviewed?
                                    (<h1>Reviewed</h1>)
                                    :
                                    (
                                        <Form onSubmit={addReview}>
                                            <Form.Group controlId="formSearchTerm">
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control
                                                type="range"
                                                min={0}
                                                max={5}
                                                value={rating}
                                                onChange={event => setRating(event.target.value)}
                                                />  
                                            </Form.Group>
                                            <Form.Group controlId="formSearchTerm">
                                                <Form.Label>Review</Form.Label>
                                                <Form.Control
                                                type="text"
                                                placeholder="Enter review"
                                                value={review}
                                                onChange={(e) => setReview(e.target.value)}
                                                />
                                            </Form.Group>
                                            <Button type='submit'>Submit</Button>
                                        </Form>
                                    )
                                )
                                :
                                (addedCart?
                                    (<h1>Added To Cart</h1>)
                                    :
                                    (outOfStock?
                                        (<h1>Out of Stock</h1>)
                                        :
                                        (<Button variant="primary" onClick={addToCart}>
                                            Add to Cart
                                        </Button>)
                                    
                                    )
                                )
                            )
                            :
                            (<></>)
                        }
                    </Card.Footer>
                </Card>
            </>
            }
        
        </>

    )
}