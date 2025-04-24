import React from 'react';
import '../styles/layout.css';

export default function Sidebar({ open }) {
  return (
    <aside className={`sidebar ${open? 'open':''}`}>
      <h2>Categories</h2>
      <ul>
        <li>
          <a href="#kids">Kid’s</a>
          <ul>
            <li><a href="#shirt">Shirt</a></li>
        
          </ul>
        </li>
       
      </ul>
    </aside>
  );
}
