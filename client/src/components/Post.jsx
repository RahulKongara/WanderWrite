import React from 'react'
import {Link} from 'react-router-dom'
import {format, formatISO9075} from 'date-fns';
// 2:20:34

const Post = ({_id,title, summary, cover, content, createdAt, author}) => {
  
  return (
    <div className='post'>
        <div className="image">
          <Link to={`/post/${_id}`}>
            <img src={'https://wanderwrite-backend.onrender.com/'+cover} alt="Blog-post-image" />
          </Link>
        </div>
        <div className="texts">
          <Link to={`/post/${_id}`}>
            <h2>{title}</h2>
          </Link>
            <p className="info">
                <a href="#" className="author">{author.username}</a>
                <time>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
                {/* <time>{formatISO9075(new Date(createdAt))}</time> */}
                
            </p>
            <p className="summary">{summary}</p>
        </div>
    </div>
  )
}

export default Post