import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function ColorSchemesExample(props) {
    var state = props.userType
    function logOut(){
        localStorage.removeItem("token");
        localStorage.removeItem("type");
        window.location.href = "/"
    }
    if(state=="staff"){
        return (
            <>
              <Navbar bg="primary" variant="dark" sticky="top" >
                <Container>
                  <Navbar.Brand href="/">OneDVD</Navbar.Brand>
                  <Nav className="me-auto">
                    <Nav.Link href="/">Controls</Nav.Link>
                    <Nav.Link href="/profile">Profile</Nav.Link>
                    <Nav.Link href="/" onClick={logOut}>SignOut</Nav.Link>
                  </Nav>
                </Container>
              </Navbar>
            </>
          );
    } else if(state=="customer"){
        return (
            <>
              <Navbar bg="primary" variant="dark" sticky="top" >
                <Container>
                  <Navbar.Brand href="/">OneDVD</Navbar.Brand>
                  <Nav className="me-auto">
                    <Nav.Link href="/profile">Profile</Nav.Link>
                    <Nav.Link href="/cart">Cart</Nav.Link>
                    <Nav.Link href="/history">History</Nav.Link>
                    <Nav.Link href="/review">Reviews</Nav.Link>
                    <Nav.Link href="/" onClick={logOut}>SignOut</Nav.Link>
                  </Nav>
                </Container>
              </Navbar>
            </>
          );
    } else{
        return (
            <>
              <Navbar bg="primary" variant="dark" sticky="top" >
                <Container>
                  <Navbar.Brand href="/">OneDVD</Navbar.Brand>
                  <Nav className="me-auto">
                    <Nav.Link href="/"> Home </Nav.Link>
                    <Nav.Link href="/login">Login</Nav.Link>
                    <Nav.Link href="/signUp">SignUp</Nav.Link>
                  </Nav>
                </Container>
              </Navbar>
            </>
          );
    }
  
}

export default ColorSchemesExample;