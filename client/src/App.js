import React, { createContext,useReducer, useEffect,useContext } from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Switch ,useHistory} from 'react-router-dom';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import Signin from './components/screens/Signin';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import {reducer,initialState} from './reducers/userReducer'
import FollowingUserPosts from './components/screens/FollowingUserPosts';

export const UserContext = createContext()

const Routing =()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
      // history.push('/')
    }else{
      history.push('signin')
    }
  },[])
  return(
    <Switch>
    <Route path="/" component={Home} exact ></Route>
    <Route path="/profile" component={Profile} exact ></Route>
    <Route path="/signin" component={Signin} exact ></Route>
    <Route path="/signup" component={Signup} exact ></Route> 
    <Route path="/createpost" component={CreatePost} exact ></Route>
    <Route path="/profile/:userid" component={UserProfile} exact  ></Route>
    <Route path="/myfollowingpost" component={FollowingUserPosts} exact  ></Route>
  </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
      <Navbar/>
      <Routing/>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
