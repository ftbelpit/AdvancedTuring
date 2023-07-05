import "./Footer.css"

import logo from "../assets/turingwash-logo.svg"

import instagram from "../assets/instagram.png"

import {Link} from "react-router-dom"

const Footer = () => {
  return (
  <footer className="footer">
    <div className="footer-logo">
      <img src={logo} alt="Turing Wash" />
    </div>
    <nav className="footer-nav">
      <Link>Sobre</Link>
      <Link>FAQ</Link>
      <Link>Contato</Link>
      <Link>Termos de uso</Link>
    </nav>  
    <div className="footer-site">
      <Link>
      <img src={instagram} alt="" />
      @turingwash
      </Link>
      <p>2023. TuringWash. Todos os direitos reservados.</p>
    </div>   
  </footer> 
  )
}

export default Footer