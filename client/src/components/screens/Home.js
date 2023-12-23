import React, {useState, useEffect, useContext } from 'react';
import {UserContext} from '../../App'
import { Link } from 'react-router-dom';

const Home=()=> {
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
        fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/allpost`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setData(result.posts)
        })
    },[])

    const likePost=(id)=>{
        fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/like`,{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const unlikePost=(id)=>{
        fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/unlike`,{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const makeComment=(text,postId)=>{
        fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/comment`,{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                text,postId
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const deletePost=(postId)=>{
        fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/deletepost/${postId}`, {
          method: "delete",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
          .then((res) => res.json())
          .then((result) => {
            console.log(result);
            const newData = data.filter((item) => {
              return item._id != result._id;
            });
            setData(newData);
          });
    }

    const deleteComment=(commentId)=>{
        fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/deletecomment/${commentId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(record=>{
                return record._id=result._id
            })
            setData(newData)
        })
    }

        return ( 
            <div className="home">
                {
                    data.map(item=>{
                        return(
                            <div className="card home-card" key={item._id}>
                                <div style={{display:"flex", alignItems: "center"}}>
                                <img cla style={{width:"40px",height:"40px", borderRadius:"50px", margin: "10px 0 0 10px"}} src={item.postedBy.pic}/>
                                <h5
                                style={{margin:"6px"}}
                                >
                                    <Link className="profile__name" to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile"}>
                                    {item.postedBy.name} 
                                    </Link>
                                    {item.postedBy._id == state._id
                                && 
                                 <i className="material-icons" style={{float:"right" }} onClick={()=>deletePost(item._id)} >delete</i> 
                                }
                                 </h5>
                                </div>
                                <div className="card-image">
                                    <img src={item.photo}/>
                                </div>
                                <div className="card-content">
                                {/* <i className="material-icons">favorite_border</i>
                                <i className="material-icons" style={{color:"red"}} >favorite</i> */}
                                {item.likes.includes(state._id)
                                ?
                                <i className="material-icons"  style={{color:"red"}} onClick={()=>{unlikePost(item._id)}}>favorite</i>
                                :
                                <i className="material-icons" onClick={()=>{likePost(item._id)}}>favorite_border</i>
                                }
                                
                                
                                    <h6>{item.likes.length} likes</h6>
                                    <h6>{item.title}</h6>
                                    <p>{item.body}</p>
                                    
                                    {
                                        item.comments.map(record=>{
                                            return(
                                                <div key={record._id}>
                                                    <hr/>
                                                    <h6><span style={{fontWeight:"500"}} > {record.postedBy.name} </span> {record.text} 
                                                    {record.postedBy._id == state._id
                                                    && 
                                                    <i className="material-icons" style={{float:"right"}} onClick={()=>deleteComment(record._id)} >delete</i> 
                                                    }
                                                    </h6>
                                                    <hr/>
                                                </div>
                                            )
                                        })
                                    }
                                    <form onSubmit={(e)=>{
                                        e.preventDefault()
                                        makeComment(e.target[0].value,item._id)
                                    }}>
                                        <input type="text" placeholder="add a comment"/>
                                    </form>
                                </div>
                            </div>
                        )
                    })
                } 
            </div>
         );
}
 
export default Home;