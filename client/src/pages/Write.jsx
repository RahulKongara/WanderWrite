import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import Editor from '../components/Editor';


const Write = () => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState();
    const [redirect, setRedirect] = useState(false);
    async function createNewPost(e) {
        e.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);
        // console.log(files);
        const response = await fetch('http://localhost:4000/post', {
            method: 'POST',
            body: data,
            credentials: 'include',
        });

        if (response.ok) {
            setRedirect(true);
        }

    }

    if (redirect) {
        return <Navigate to={'/'} />
    }
  return (
    <form action="" onSubmit={createNewPost}>
        <input className='write-title' type="title" placeholder={'Title'} value={title} onChange={e => setTitle(e.target.value)}/>
        <input className='write-summary' type="summary" placeholder={'Summary'} value={summary} onChange={e => setSummary(e.target.value)}/>
        <input className='write-file' type="file" onChange={e => setFiles(e.target.files)} />
        <Editor value={content} onChange={setContent} />
        <button className='write-btn'>Post</button>
    </form>
  )
}

export default Write