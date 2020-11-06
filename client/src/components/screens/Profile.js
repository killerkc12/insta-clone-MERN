import React, { Component, useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';

const Profile =()=> {
    const {state,dispatch} = useContext(UserContext)
    const [data,setData] = useState([])
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)
   useEffect(()=>{
        fetch('/myposts',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setData(result.posts)
        })
   },[])

   const updatePIc=()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","killerkc")
        fetch("https://api.cloudinary.com/v1_1/killerkc/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            // setUrl(data.url)
            console.log(data)
            // localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
            // dispatch({type:"UPDATEPIC",payload:data.url})
            fetch('/updatepic',{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    pic:data.url
                })
            }).then(res=>res.json())
            .then(result=>{
                console.log(result)
                localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                dispatch({type:"UPDATEPIC",payload:result.pic})
                // window.location.reload()

            })
        })
        .catch(err=>{
            console.log(err)
        })
   }
        return ( 
            
            <div style={{maxWidth:"550px",margin:"0px auto"}}>
                
                <div style={{
                    display: 'flex',
                    justifyContent:"space-around",
                    margin:"18px 0px",
                    borderBottom:"1px solid gray"
                }}>
                    <div>
                        <img style={ { width:"160px",height:"160px",borderRadius:"80px" }}
                        src={state?state.pic:"loading pic.."}
                        />

                            <div className="file-field input-field">
                            <div className="btn">
                                <span>Choose Image</span>
                                <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text"/>
                            </div>
                            </div>

                        <button className="btn waves-effetc waves-light"
                         style={{marginLeft:"20px"}}
                         onClick={()=>updatePIc()}
                         >Update Pic</button>
                    </div>
                    <div>
                        <h4>{state?state.name:"loading"}</h4>
                        <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                            <h5>{data.length} posts</h5>
                            <h5>{state?state.followers.length:"updating"} followers</h5>
                            <h5>{state?state.following.length:"updating"} following</h5>
                        </div>
                    </div>
                </div>
                <div className="gallery">
                {
                        data.map(item=>{
                            return(
                                <img className="item" src={item.photo} />
                            )
                        })
                    }
                    
                </div>
            </div>
         );
}
 
export default Profile;