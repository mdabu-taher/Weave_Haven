import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPinterestP,
  FaYoutube,
  FaTiktok,
  FaSpotify,
} from "react-icons/fa";
import logo from "../assets/LOGO.png";          // reuse your logo
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      {/* ───────── Top grid ───────── */}
      <div className="footer-grid">
        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/women">Ladies</Link>
          <Link to="/men">Men</Link>
          <Link to="/kids">Children</Link>
          <Link to="/home-decor">Home</Link>
          <Link to="/beauty">Beauty</Link>
          <Link to="/magazine">Magazine</Link>
        </div>

        <div className="footer-col">
          <h4>Company information</h4>
          <Link to="/careers">Career at Weave Haven</Link>
          <Link to="/about">About the group</Link>
          <Link to="/sustainability">Sustainability</Link>
          <Link to="/press">Press</Link>
          <Link to="/investors">Investor relations</Link>
          <Link to="/governance">Corporate governance</Link>
        </div>

        <div className="footer-col">
          <h4>Help</h4>
          <Link to="/support">Customer service</Link>
          <Link to="/profile">My account</Link>
          <Link to="/stores">Our stores</Link>
          <Link to="/terms">Terms & Privacy</Link>
          <Link to="/contact">Contact us</Link>
          <Link to="/gift-card">Gift card</Link>
          <Link to="/safe-shopping">Safe shopping</Link>
        </div>

        <div className="footer-col">
          <h4>Join now</h4>
          <p>Become a member and take advantage of fantastic offers!</p>
          <Link to="/membership" className="cta-link">
            Read more
          </Link>
        </div>
      </div>

      {/* ───────── Bottom bar ───────── */}
      <div className="footer-bottom">
        <div className="footer-left">
          <img src={logo} alt="Weave Haven" className="footer-logo" />
          <div className="region">
            Sweden (SEK) &nbsp;|&nbsp; <Link to="/">Change region</Link>
          </div>
          <div className="copyright">
            © {new Date().getFullYear()} Weave Haven AB. All rights reserved.
          </div>
        </div>

        <div className="footer-social">
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <FaInstagram />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noreferrer">
            <FaTiktok />
          </a>
          <a href="https://spotify.com" target="_blank" rel="noreferrer">
            <FaSpotify />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">
            <FaYoutube />
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noreferrer">
            <FaPinterestP />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <FaTwitter />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <FaFacebookF />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;