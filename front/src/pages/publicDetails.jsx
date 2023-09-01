// Name: Jeyakumar Sriram
// Admin Number: 2214618
// Class: DAAA/FT/1B/01
import React, { useState, useEffect } from 'react';
import {useParams } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Nav from '../components/navBar';;

export default function Home({userType}){

    var [details, setDetail] = useState("yes");
    let { id } = useParams();

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

    useEffect(()=>{
        
        getDetails()
    },[])

   

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
                    
                </Card>
            </>
            } 
       </>

    )
}