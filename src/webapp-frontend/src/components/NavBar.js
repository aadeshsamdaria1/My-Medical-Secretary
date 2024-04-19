import React from 'react';

export default function NavBar () {
  return (
    <div className='navbar'>
      <div className='navbar-logo'>
        My Medical Secretary
      </div>
      <ul className='navbar-menu'>
        <li><a href='/'>Home</a></li>
        <li><a href='/file_upload'>File Upload</a></li>
        <li><a href='/patients'>Patients</a></li>
        <li><a href='/doctors'>Doctors</a></li>
        <li><a href='/facilities'>Facilities</a></li> 
      </ul>
    </div>
  );
}