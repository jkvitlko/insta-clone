import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const[ posts, setPosts] = useState([
    // {
    //   username: "Jyoti",
    //   caption: "This is jyoti",
    //   imageUrl:"https://www.freecodecamp.org/news/content/images/size/w2000/2020/07/quizapp.png"
    // },
    // {
    //   username: "Verma",
    //   caption: "This is React",
    //   imageUrl:"https://www.freecodecamp.org/news/content/images/size/w2000/2020/07/quizapp.png"
    // },
    // {
    //   username: "Kiran",
    //   caption: "Be educated with manners , not just educated.",
    //   imageUrl:"https://www.freecodecamp.org/news/content/images/size/w2000/2020/07/quizapp.png"
    // }
  ]);

  const [open , setOpen] = useState(false);
  const [openSignIn , setOpenSignIn] = useState(false);
  const [email , setEmail] = useState('');
  const [password , setPassword] = useState('');
  const [username , setUsername] = useState('');
  const [user , setUser] = useState(null);

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        // user has logged in...
        console.log(authUser);
        setUser(authUser);
      }else {
        // user has logged out
        setUser(null);
      }
    })

    return() =>{
      // perform cleanup 
      unsubscribe();
    }
  },[user, username])

  // this runs based on some condtion
  // its gonna run only once when the page load because we have given []
  useEffect(()=>{
    db.collection('posts').orderBy('timeStamp','desc').onSnapshot(snapShot=> {
      setPosts(snapShot.docs.map(doc=> ({
        id: doc.id,
        post: doc.data()}))
    )});
  }, []);

  const handleSignUp = (event) =>{
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) =>alert(error.message));
    setOpen(false);
  }

  const handleSignIn = (event) =>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));
    setOpenSignIn(false);
  }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={()=> setOpen(false)}>
          <div style={modalStyle} className={classes.paper}>
          <form className="app-signup">
            {/* <center> */}
              <img className="app-header-img" alt=" " src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/>
              <Input type="text" placeholder="enter your username" value={username} onChange={(event) => setUsername(event.target.value)} />
              <Input type="email" placeholder="enter your email" value={email} onChange={(event) => setEmail(event.target.value)} />
              <Input type="password" placeholder="enter your password" value={password} onChange={(event) => setPassword(event.target.value)} />
              <Button  type="submit" onClick={handleSignUp}>Sign Up</Button>
            {/* </center> */}
          </form>
       </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={()=> setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app-signup">
            {/* <center> */}
              <img className="app-header-img" alt=" " src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/>
              <Input type="email" placeholder="enter your email" value={email} onChange={(event) => setEmail(event.target.value)} />
              <Input type="password" placeholder="enter your password" value={password} onChange={(event) => setPassword(event.target.value)} />
              <Button  type="submit" onClick={handleSignIn}>Sign In</Button>
            {/* </center> */}
          </form>
       </div>
      </Modal>
      
        <div className="app-header">
        <img className="app-header-img" alt=" " src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/>
        {user ? (<Button onClick={()=> auth.signOut()}>Logout</Button>) :(
          <div>
          <Button onClick={()=>setOpenSignIn(true)}>Sign Ip</Button>
        <Button onClick={()=>setOpen(true)}>Sign Up</Button> 
          </div>
        ) }
          
        </div>
       
          {/* <h2>Hello Instagram!! Building an instagram clone with React!</h2> */}
         <div className="app-posts">

        <div className="app-posts-left"> 
           {
            posts.map(({id,post}) => (
            <Post  key ={id} postId={id} user={user} username={post.username} imageUrl={post.imageUrl} caption={post.caption}/>
            ))
          }
        </div>
        <div className="app-posts-right">

          <InstagramEmbed 
          url="https://www.instagram.com/p/CC4NMmVJUfm/"
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript onLoading={()=>{}}
          onSuccess={()=>{}}
          onAfterRender={()=>{}}
          onFailure={()=>{}}
          />
        </div>
         </div>

        {user?.displayName ? 
        <ImageUpload  username={user.displayName}/> : <h3>Sorry need to login to upload the image</h3> }
        {/* <Post  />
        <Post username="React" imageUrl="https://www.freecodecamp.org/news/content/images/size/w2000/2020/07/quizapp.png" caption="This is React"/>
        <Post username="Verma" imageUrl="https://www.freecodecamp.org/news/content/images/size/w2000/2020/07/quizapp.png" caption="This is fun project"/>
        <Post username="Aadarsh" imageUrl="https://www.freecodecamp.org/news/content/images/size/w2000/2020/07/quizapp.png" caption="Be educated with manners , not just educated."/> */}
    </div>
  );
}

export default App;
