// Name: Jeyakumar Sriram
// Admin Number: 2214618
// Class: DAAA/FT/1B/01
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from '../components/navBar';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

export default function Home({token,userType,typeHandle,tokenHandler}) {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([{"category_id":null,"name":"None"}]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/getCat');
      setCategories(categories.concat(response.data));
    } catch (error) {
      console.error(error);
      navigate('/');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setResults([]);

    try {
        var url = "http://localhost:3001/dvdSearch"
        if(!(selectedCategory||searchTerm||maxPrice)){
            // nthg
        } else{
            var x = [searchTerm,selectedCategory,maxPrice]
            var z = ["title","category","max"]
            var y = 0;
            for (var i = 0;i<3;i++){
                if(x[i]){
                    if(y==0){
                        
                        url+=`?${z[i]}=${x[i]}`
                        y++;
                    } else {
                        url+=`&${z[i]}=${x[i]}`
                    }
                }
            }
        }
        
      const response = await axios.get(url);
      if (response.status === 200) {
        const filmIds = response.data.map(obj => obj.film_id);
        const promises = filmIds.map((filmId) => axios.get(`http://localhost:3001/dvdDetails/${filmId}`));
        const responses = await Promise.all(promises);
        const data = responses.map((res) => res.data);
        setResults(data);
      }
    } catch (error) {
      console.error(error);
      navigate('/djsvb');
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get('http://localhost:3001/dvdRecommend');
      if (response.status === 200) {
        const filmIds = response.data.map(obj => obj.film_id);
        const promises = filmIds.map((filmId) => axios.get(`http://localhost:3001/dvdDetails/${filmId}`));
        const responses = await Promise.all(promises);
        const data = responses.map((res) => res.data);
        setResults(data);
      }
    } catch (error) {
      console.error(error);
      navigate('/djsvb');
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchRecommendations();
  }, []);

  return (
    <>
      <Nav userType={userType} />
      <Form onSubmit={handleSearch} className="row">
        <Row className="flex">
          <Form.Group controlId="formSearchTerm">
            <Form.Control
              type="text"
              placeholder="Enter search term"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formSearchTerm">
            <Form.Control
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formGridState">
            
            <Form.Control as="select" onChange={(e) => setSelectedCategory(e.target.value)}>
              {categories.map(category => (
                <option id={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
            
            
          </Form.Group>
          <Button type="submit">Search</Button>
        </Row>
      </Form>
      <hr />
      <h2>Results:</h2>
      <hr />
      <Container fluid className="d-flex flex-wrap justify-content-center">
        {results.length > 0 ? (
          results.map((variant) => (
            <Card
              key={variant.film[0].film_id}
              style={{ width: '18rem' }}
              className="m-3"
            >
              <Card.Img variant="top" src={variant.film[0].poster} />
              <Card.Body>
                <Card.Title>{variant.film[0].title}</Card.Title>
                <Card.Text>{variant.film[0].description}</Card.Text>
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
          ))
        ) : (
          <>
            <h4>Strange... Maybe you can try requesting a new title.&nbsp;</h4>
            <div className=''>
              <Button onClick={() => { window.location.href = "/request" }}>Request for New Title</Button>

            </div>
          </>
            
        )}
      </Container>
    </>
  );
}
