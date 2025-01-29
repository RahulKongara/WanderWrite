import React, { useState, useEffect } from 'react'
import Editor from '../components/Editor';
import { Navigate, useParams } from 'react-router-dom';

const EditPost = () => {
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');        
    const [files, setFiles] = useState('');
    const [cover, setCover] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then(res => {
                res.json().then(postInfo => {
                    setTitle(postInfo.title);
                    setContent(postInfo.content);
                    setSummary(postInfo.summary);
                });
            });
    }, [])

    async function updatePost(e) {
        e.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if (files?.[0]) {
            data.set('file', files?.[0]);
        }
        const response = await fetch('http://localhost:4000/post', {
            method: 'PUT',
            body: data, 
            credentials: 'include',
        });
        if (response.ok) {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={`/post/${id}`} />
    }



    return (
        <form action="" onSubmit={updatePost}>
            <input className='write-title' type="title" placeholder={'Title'} value={title} onChange={e => setTitle(e.target.value)}/>
            <input className='write-summary' type="summary" placeholder={'Summary'} value={summary} onChange={e => setSummary(e.target.value)}/>
            <input className='write-file' type="file" onChange={e => setFiles(e.target.files)} />
            <Editor onChange={setContent} value={content} />
            <button className='write-btn'>Save Post</button>
        </form>
    )
}

export default EditPost