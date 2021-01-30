import React, { useState, useEffect } from 'react';

import Message from './ChatboxMessage';
import Input from './ChatboxInput';

import { createMessageChatbox, getClubMessages } from '../API/Club';
import { getDefaultUser } from '../API/User';

const RightPanel = ({ club }) => {

    const [currentUser, setCurrentUser] = useState([]);
    const [listMessages, setListMessages] = useState([]);
    const [continueTime, setContinuetime] = useState(null);
    const [totalLeft, setTotalLeft] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        getDefaultUser((err, res) => {
            if (err) return console.log(err);
            if (!res.data.success) return;
            setCurrentUser(res.data.user);

        })
    }, [])

    useEffect(() => {
        getClubMessages(club.Id, continueTime, (err, res) => {
            if (err) return console.log(err);
            if (!res.data.success) return;

            const { messages, continueTime, totalLeft } = res.data.data;
            setListMessages(messages.reverse())
            setContinuetime(continueTime)
            setTotalLeft(totalLeft)
            setLoading(false);
        })
    }, [currentUser]);

    const createNewMessage = (message) => {
        createMessageChatbox(club.Id, message, (err, res) => {
            if (err) return console.log(err);
            if (!res.data.success) return;
            const { message } = res.data;
            console.log('res');
            console.log(message);
            const newMessage = {
                Id: message.Id,
                Text: message.Text,
                Owner: {
                    Id: message.Owner.Id,
                    UserName: message.Owner.UserName,
                    Name: message.Owner.Displayname,
                    Role: message.Owner.Role,
                    AuthenticateType: message.Owner.AuthenticateType
                },
                CreatedAt: message.CreatedAt
            }
            setListMessages([...listMessages, newMessage]);
        });
    }

    const loadMoreMessage = (e) => {
        e.preventDefault();
        setLoading(true);
        getClubMessages(club.Id, continueTime, (err, res) => {
            if (err) return console.log(err);
            if (!res.data.success) return;

            const { messages, continueTime, totalLeft } = res.data.data;
            setListMessages([...messages.reverse(), ...listMessages])
            setContinuetime(continueTime)
            setTotalLeft(totalLeft)
            setLoading(false);
        })
    }

    return (
        <div className="col-7 px-0">
            <div className="px-4 py-5 chat-box bg-white">
                {totalLeft > 0 && !isLoading && <div className="text-center mb-3"><a onClick={loadMoreMessage} href="#">   Loading More...</a></div>}
                {isLoading && <div className="text-center"><i className="fas fa-spinner fa-spin"></i>   Loading Messages...</div>}
                {listMessages.map(message => <Message key={message.Id} message={message} isOwner={message.Owner.Id === currentUser.Id} />)}
            </div>

            {/* Typing area */}
            <Input
                createNewMessage={createNewMessage}
            />
        </div>

    );
}

export default RightPanel;