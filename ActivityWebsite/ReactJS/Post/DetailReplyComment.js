import React, { useState } from 'react';
import Rating from 'react-rating-stars-component';

const style = {
    margin: '10px',
    marginLeft: '100px',
    background: '#c0c1c4',
    padding: '1em',
}

const editorReplyStyle = {
    width: '100%',
    height: '100px',
    fontSize: '16px',
    color: '#6E7580',
    paddingLeft: '28px',
    paddingTop: '15px',
    borderradius: '2px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    marginBottom: '34px'
}

const ReplyComment = () => {

    const [isReply, setReply] = useState(false);


    return (
        <div className="comment-single comment-reply mt-4 text-justify" style={style}>
            <div className="mb-3">
                <p><i className="fa fa-reply" aria-hidden="true" />   Reply To Jhon Doe</p>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Crystal_Clear_kdm_user_female.svg/1024px-Crystal_Clear_kdm_user_female.svg.png" className="rounded-circle" width={40} height={40} />
            <h4 style={{ fontWeight: 'bold' }}>Jhon Doe <span style={{ color: '#6E7580', fontSize: '15px' }}>20 October, 2018</span></h4>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus numquam assumenda hic aliquam vero sequi velit molestias doloremque molestiae dicta?</p>
            <div>
                <button className="btn btn-outline-danger m-3">23   <i className="far fa-thumbs-up"></i>   Like</button>
                <button className="btn btn-outline-primary" onClick={() => setReply(true)}><i className="fas fa-reply-all"></i>   Reply</button>
            </div>

            {isReply &&
                (
                    <div className="comment-single comment-parent mt-4 text-justify" style={style}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Crystal_Clear_kdm_user_female.svg/1024px-Crystal_Clear_kdm_user_female.svg.png" className="rounded-circle" width={40} height={40} />
                        <p><i className="fa fa-reply" aria-hidden="true" />   Reply To Jhon Doe</p>
                        <textarea style={editorReplyStyle}></textarea>
                        <div>
                            <button className="btn btn-outline-primary m-3"><i className="fas fa-reply-all"></i>   Reply</button>
                            <button className="btn btn-outline-danger" onClick={() => setReply(false)}>   Cancel</button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default ReplyComment;