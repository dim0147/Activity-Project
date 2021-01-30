import React from 'react';
import moment from 'moment';

const Message = ({ message, isOwner }) => {

    if (isOwner) {
        return (
            <div className="media w-50 ml-auto mb-3">
                <div className="media-body">
                    <div className="bg-primary rounded py-2 px-3 mb-2">
                        <p className="text-small mb-0 text-white">{message.Text}</p>
                    </div>
                    <p className="small text-muted">{moment(message.CreatedAt).fromNow()}</p>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className="media w-50 mb-3"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1024px-User_icon_2.svg.png" alt="user" width={50} className="rounded-circle" />
                <div className="media-body ml-3">
                   
                    <div className="bg-light rounded py-2 px-3 mb-2">
                        <p className="small text-muted">{message.Owner.Name}</p>
                        <p className="text-small mb-0 text-muted">{message.Text}</p>
                    </div>
                    <p className="small text-muted">{moment(message.CreatedAt).fromNow()}</p>
                </div>
            </div>
        )
    }

}

export default Message;