import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../App.css'
import { UserContext } from '../App';

const Navbar =()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  const renderList=()=>{
    if(state){
      return [
        <li><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
        <li><Link to="profile">Profile</Link></li>,
        <li><Link to="createPost">CreatPost</Link></li>,
        <li><Link to="myfollowingpost">Following Posts</Link></li>,
        <li>
          <button className="btn #00bcd4 cyan"
           onClick={()=>{localStorage.clear() 
          dispatch({type:"CLEAR"})
          history.push('/signin')
          }}
           >Logout</button>
        </li>
      ]
    }else{
      return [
        <li><Link to="signin">Signin</Link></li>,
        <li><Link to="signup">Signup</Link></li>
      ]
    }
  }
    return(
        <nav>
    <div className="nav-wrapper">
      <Link to={state?"/":"/signin"} className="brand-logo">Instagram</Link>
      <ul id="nav-mobile" className="right">
        {renderList()}
        {/* <li><Link to="signin">Signin</Link></li>
        <li><Link to="signup">Signup</Link></li>
        <li><Link to="profile">Profile</Link></li>
        <li><Link to="createPost">CreatPost</Link></li> */}
      </ul>
    </div>
    <div id="modal1" className="modal">
    <div className="modal-content">
      <h4>Modal Header</h4>
      <p>A bunch of text</p>
    </div>
    <div className="modal-footer">
      <button href="#!" className="modal-close waves-effect waves-green btn-flat">Agree</button>
    </div>
  </div>
  </nav>
    )
}

export default Navbar;