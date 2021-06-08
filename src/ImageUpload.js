import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { storage, db } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';

function ImageUpload({username}) {
    const [caption , setCaption] = useState('');
    const [image , setImage] = useState(null);
    const [progress , setProgress] = useState(0);

    const handleChange=(event)=>{
        if(event.target.files[0]){
            setImage(event.target.files[0]);
        }
    };
    const handleUploadImage= () =>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            'state_changed',
            (snapshot) =>{
                // progress function
                const progressBar = Math.round(
                    (snapshot.bytesTransferred/ snapshot.totalBytes) * 100
                );
                setProgress(progressBar);
            },
            (error) =>{
                console.log(error.message);
                alert(error.message)
            },
            () =>{
                storage.ref('images')
                .child(image.name)
                .getDownloadURL()
                .then((url) => {
                    // posting the image in database
                    db.collection('posts').add({
                        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    });
                    setProgress(0);
                    setImage(null);
                    setCaption('');
                })
            }
        )
    }
    return (
        <div className="image-upload">
            {/* <h2>Upload post</h2> */}
            <progress className="image-upload-progress" value={progress}  max="100"/>
            <input type="text" placeholder="Enter a caption..." onChange={(event)=>setCaption(event.target.value)}/>
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUploadImage}>Upload</Button>
        </div>
    )
}

export default ImageUpload;