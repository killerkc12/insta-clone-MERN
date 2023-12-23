import React, {  useState, useEffect } from 'react';
import { Link,useHistory } from 'react-router-dom';
import M from 'materialize-css'

const Signup = ()=>{
    const history = useHistory()
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)
    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[])

    const uploadPic=()=>{
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
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const uploadFields=()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:'Invalid Email',classes:"#f44336 red"})
            return
        }
        fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/signup`,{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,email,password,pic:url
            })
        }).then(res=>res.json())
        .then(data => {
            if(data.error){
                M.toast({html: data.error,classes:"#f44336 red"})
            }else{
                M.toast({html: data.message,classes:"#00c853 green accent-4"})
                history.push('/signin')
            }
            
        })
        .catch(err=>{
            console.log(err)
        })
    }


    const PostData = ()=>{
        if(image){
            uploadPic()
        }else
            uploadFields()
    }
        return ( 
            <div>
               <div className="mycard">
                <div className="card auth-card">
                    <h1 className="brand-logo">Instagram</h1>
                    <input type="text" placeholder="Enter Name" value={name} onChange={(e)=>setName(e.target.value)} />
                    <input type="email" placeholder="Enter Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                    <input type="password" placeholder="Enter Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                    <div className="file-field input-field">
                    <div className="btn">
                        <span>Choose Image</span>
                        <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                    </div>
                    <button className="btn waves-effetc waves-light" onClick={PostData}>Signup</button>
                    <h6><Link to="/signin">Already have an Account?</Link></h6>
                </div>
            </div>
            </div>
         );
    
}
 
export default Signup;