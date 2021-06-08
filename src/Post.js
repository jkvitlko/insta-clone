import React, {useState, useEffect} from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from 'firebase'

function Post({postId, user, username, caption, imageUrl}){
  const [comments , setComments] = useState([]);
  const [comment , setComment] = useState('');

  useEffect(()=>{
    let unsubscribe;
    if(postId) {
        unsubscribe  = db.collection('posts').doc(postId).collection('comments').orderBy('timeStamp' , 'desc').onSnapshot(snapshot => {
            setComments(snapshot.docs.map((doc)=> doc.data()));
        })
    }
    return ()=>{
        unsubscribe();
    }
  }, [postId])

  const postComment =(event) =>{
    event.preventDefault();
    db.collection('posts').doc(postId).collection('comments').add({
        comment: comment,
        username: user.displayName,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment('');
  }

    return(
        <div className="post">
            {/* header wil username and avatar */}
            {/* then Image */}
            {/* username + caption */}
            <div className="post-header">
            <Avatar className="post-img" alt={username} src="/static/Images/avatar/jyoti.jpeg"/>
            <h3>{username}</h3>
            </div>

            <img className="post-img" alt=" " src={imageUrl}/>
            <h4 className="post-text" ><strong>{username} </strong>  {caption} </h4>
            <div className="post-comment-display">
                {comments.map((commentText) => (
                    <p key={commentText.comment}> <strong>{commentText.username}</strong> {commentText.comment} </p>
                ))}
          </div>
           {user && (
                <form className="post-comment-box">
                <input className="post-comment" type="text" placeholder="Add a comment..."
                value={comment} onChange={(event) => setComment(event.target.value)} />
                <button className="post-comment-btn" type="submit" disabled={!comment} onClick={postComment} >post</button>
            </form>
           )}
        </div>
    )
}
 export default Post;