import React from 'react';
import moment from 'moment';

const ChatboxMemberCard = ({ member }) => {
    //<a className="list-group-item list-group-item-action active text-white rounded-0">

    return (
        <a className="list-group-item list-group-item-action list-group-item-light rounded-0">
            <div className="media"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1024px-User_icon_2.svg.png" alt="user" width={50} className="rounded-circle" />
                <div className="media-body ml-4">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                        <h6 className="mb-0">{member.Name}</h6><small className="small font-weight-bold">Joined {moment(member.JoinedAt).fromNow()}</small>
                    </div>
                    <p className="font-italic mb-0 text-small">
                        {member.AuthenticateType === "Google" && <i style={{ color: 'red' }} title="Authenticate with Google" className="fab fa-google"></i>}
                        {member.AuthenticateType === "Facebook" && <i style={{ color: 'blue' }} title="Authenticate with Facebook" className="fab fa-facebook-f"></i>}

                    </p>
                </div>
            </div>
        </a>
    );
}

export default ChatboxMemberCard;