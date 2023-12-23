import React, { Component, useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';

const UserProfile =()=> {
    const [userProfile,setProfile] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showfollow,setShowfollow] = useState(state?!state.following.includes(userid):true)
    console.log(userid)
   useEffect(()=>{
        fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/${userid}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
          .then((res) => res.json())
          .then((result) => {
            console.log(result);
            setProfile(result);
          });
   },[])

   const followUser=()=>{
       fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/follow`,{
           method:"put",
           headers:{
               "Content-Type":"application/json",
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           },
           body:JSON.stringify({
               followId:userid
           })
       }).then(res=>res.json())
       .then(data=>{
           console.log(data)
           dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
           localStorage.setItem("user",JSON.stringify(data))
           setProfile((prevState)=>{
               return{
                   ...prevState,
                   user:{
                       ...prevState.user,
                       followers:[...prevState.user.followers,data._id]
                   }
               }
           })
           setShowfollow(false)
       })
   }
   const unfollowUser=()=>{
       fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/unfollow`,{
           method:"put",
           headers:{
               "Content-Type":"application/json",
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           },
           body:JSON.stringify({
               unfollowId:userid
           })
       }).then(res=>res.json())
       .then(data=>{
           console.log(data)
           dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
           localStorage.setItem("user",JSON.stringify(data))
           setProfile((prevState)=>{
               const newFollower = prevState.user.followers.filter(item=>item !== data._id)
               return{
                   ...prevState,
                   user:{
                       ...prevState.user,
                       followers:newFollower
                   }
               }
           })
           setShowfollow(true)
       })
   }
        return ( 
            <>
            {
                !userProfile ? <h2>Loading....</h2>
                :
            
            <div style={{maxWidth:"550px",margin:"0px auto"}}>
                
                <div style={{
                    display: 'flex',
                    justifyContent:"space-around",
                    margin:"18px 0px",
                    borderBottom:"1px solid gray"
                }}>
                    <div>
                        <img style={ { width:"160px",height:"160px",borderRadius:"80px" }}
                        src={userProfile.user.pic}
                        />
                    </div>
                    <div>
                        <h4>{userProfile.name}</h4>
                        <h5>{userProfile.email}</h5>
                        <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                            <h5>{userProfile.posts.length} posts</h5>
                            <h5>{userProfile.user.followers.length} followers</h5>
                            <h5>{userProfile.user.following.length} following</h5>
                        </div>
                        {
                            showfollow
                            ?
                            <button className="btn waves-effetc waves-light" onClick={followUser}>Follow</button>
                            :
                            <button className="btn waves-effetc waves-light" onClick={unfollowUser}>UnFollow</button>
                        }
                        
                        
                    </div>
                </div>
                <div className="gallery">
                {
                        userProfile.posts.map(item=>{
                            return(
                                <img className="item" src={item.photo} />
                            )
                        })
                    }
                    
                </div>
            </div>
            }
            </>
         );
}
 
export default UserProfile;