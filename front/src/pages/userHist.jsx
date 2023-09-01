// Name: Jeyakumar Sriram
// Admin Number: 2214618
// Class: DAAA/FT/1B/01
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Nav from '../components/navBar';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// allow amount to increment
export default function Home({token,userType,typeHandle,tokenHandler}){
    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    
    const fetchRecommendations = async () => {
        try {
          const response = await axios.get('http://localhost:3001/getPurchaseHistory',{
            headers: {
                'authorization': `Bearer ${token}`
            }
        });
          if (response.status === 200) {
            const filmIds = response.data.map(obj => obj.film_id);
            const promises = filmIds.map((filmId) => axios.get(`http://localhost:3001/dvdDetails/${filmId}`));
            const responses = await Promise.all(promises);
            const data = responses.map((res) => res.data);
            setResults(data);

          } else if(response.status==401){
            alert("you token is invalid, please login")
            tokenHandler(null)
            typeHandle("public")
            navigate("/")
          } else {
              console.error("error");
              navigate(0);
          }
        } catch (error) {
          console.error(error);
          navigate('/djsvb');
        }
      };
      useEffect(()=>{
        fetchRecommendations()
      },[])
    return(<>
    <Nav userType={userType}></Nav>
    <hr />
    <h2 className='text-center'>Films Bought</h2>
    <hr />
    {results.length == 0 ?<> <hr /> <h3 className='text-center'>No purchases yet, please browse and add</h3> <hr /></>:
    <Container fluid className="d-flex flex-wrap justify-content-center">
      {results.map((variant) => (
        <Card
          key={variant.film[0].film_id}
          style={{ width: '18rem' }}
          className="m-3"
        >
          <Card.Img variant="top" src={variant.film[0].poster} />
          <Card.Body>
            <Card.Title>{variant.film[0].title}</Card.Title>
            <Card.Text>Summary: {variant.film[0].description}</Card.Text>
            <Button
              variant="primary"
              onClick={() =>
                navigate(`/dvd/${variant.film[0].film_id}`)
              }
            >
              View Details
            </Button>
            
            
            
          </Card.Body>
        </Card>
      ))}
    </Container>
    }</>)
}
