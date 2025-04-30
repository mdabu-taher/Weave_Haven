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
import logo from "../assets/LOGO.png";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      {/* ───────── Top grid ───────── */}
      <div className="footer-grid">
        <div className="footer-col">
          <h4>About Weave Haven</h4>
          <Link to="/sustainability-ethics">Sustainability & Ethics</Link>
          <Link to="/brand-origin">Brand Origin Story</Link>
          <Link to="/mission-vision">Mission & Vision</Link>
          <Link to="/product-focus">Product Focus</Link>
          <Link to="/customer-promise">Customer Promise</Link>
          <Link to="/career">Career</Link>
        </div>

        <div className="footer-col">
          <h4>Terms and Conditions</h4>
          <Link to="/useof-site">Use of Site</Link>
          <Link to="/product-availability&pricing">Product Availability & Pricing</Link>
          <Link to="/orders-payments">Orders & Payments</Link>
          <Link to="/shipping-delivery">Shipping & Delivery</Link>
          <Link to="/returns-exchanges">Returns & Exchanges</Link>
          <Link to="/privacy-data">Privacy & Data</Link>
          <Link to="/intellectual-property">Intellectual Property</Link>
        </div>

        <div className="footer-col">
          <h4>Customer Service</h4>
          <Link to="/contact-information">Contact Information</Link>
          <Link to="/faqs">FAQs</Link>
          <Link to="/order-support">Order Support</Link>
          <Link to="/shipping-returns">Shipping & Returns</Link>
          <Link to="/size-guide">Size Guide</Link>
          <Link to="/satisfaction-guarantee">Satisfaction Guarantee</Link>
        </div>

        <div className="footer-col">
          <h4>Join Now</h4>
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
          <a href="https://instagram.com" className="icon instagram" target="_blank" rel="noreferrer">
            <FaInstagram />
          </a>
          <a href="https://tiktok.com" className="icon tiktok" target="_blank" rel="noreferrer">
            <FaTiktok />
          </a>
          <a href="https://spotify.com" className="icon spotify" target="_blank" rel="noreferrer">
            <FaSpotify />
          </a>
          <a href="https://youtube.com" className="icon youtube" target="_blank" rel="noreferrer">
            <FaYoutube />
          </a>
          <a href="https://pinterest.com" className="icon pinterest" target="_blank" rel="noreferrer">
            <FaPinterestP />
          </a>
          <a href="https://twitter.com" className="icon twitter" target="_blank" rel="noreferrer">
            <FaTwitter />
          </a>
          <a href="https://facebook.com" className="icon facebook" target="_blank" rel="noreferrer">
            <FaFacebookF />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
