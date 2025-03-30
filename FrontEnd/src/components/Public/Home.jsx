import React from 'react'
import '../../assets/style/home.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';



function Home() {
  const login=useNavigate('/login')
  return (
   <>
   <NavBar/>
   <h1>This Home Page</h1>
   <Footer/>
   
   </>
  )
}

export default Home

export function NavBar(){
  return (
    <>
     <Navbar bg="light" data-bs-theme="light" className='navBar'>
        <Container className='navSection'>
          <Navbar.Brand href="#home">SmartBoda</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">About us</Nav.Link>
            <Nav.Link href="#pricing">Help</Nav.Link>
            <Link to='/login' className="btn btn-primary">Login</Link> 
            <Link  to='/register' className="btn btn-success">Sign Up</Link>
          </Nav>
        </Container>
      </Navbar>
    
    </>
  )
}
export function Footer(){
  return(
    <>
    This is footer
    </>
  )
}