import React, { useState, useEffect, useRef } from 'react';
import { hubConnection } from 'signalr-no-jquery';
import { toast } from 'react-toastify';

import Message from './ChatboxMessage';
import Input from './ChatboxInput';

import { createMessageChatbox, getClubMessages } from '../API/Club';
import { getDefaultUser } from '../API/User';

const RightPanel = ({ club }) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [listMessages, setListMessages] = useState([]);
    const [continueTime, setContinuetime] = useState(null);
    const [totalLeft, setTotalLeft] = useState(null);
    const [isLoading, setLoading] = useState(true);

    const refDivMessage = useRef(null);
    const refChat = useRef(null);
    refChat.current = listMessages;

    const scrollDivMessage = () => {
        const objDiv = refDivMessage.current;
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    const setupSignalR = () => {

        function registerServerEvent(hub){

            hub.on('ReceiveMessage', data => {
                const newMessage = {
                    Id: data.Id,
                    Text: data.Text,
                    Owner: {
                        Id: data.Owner.Id,
                        UserName: data.Owner.UserName,
                        Name: data.Owner.DisplayName,
                        Role: data.Owner.Role,
                        AuthenticateType: data.Owner.AuthenticateType
                    },
                    CreatedAt: data.CreatedAt
                }
                setListMessages([...refChat.current, newMessage]);
                scrollDivMessage();
            });
        }

        const signalRToast = toast.dark("Setup signalR ...", {
            autoClose: false,
            position: toast.POSITION.BOTTOM_RIGHT
        });

        const signalrConnection = hubConnection("/signalr");
        const hub = signalrConnection.createHubProxy("ChatHub");
        registerServerEvent(hub);

        signalrConnection.start().done(() => {
            toast.update(signalRToast, {
                render: "Connected OK, joining chatbox...",
                type: toast.TYPE.INFO
            });
            hub.invoke("JoinGroupChat", club.Id).done(data => {
                if (!data) {
                    return toast.update(signalRToast, {
                        render: "Joining chatbox failure!",
                        type: toast.TYPE.ERROR,
                        autoClose: 5000
                    });
                } 

                toast.update(signalRToast, {
                    render: "Joining chatbox success!",
                    type: toast.TYPE.SUCCESS,
                    autoClose: 5000
                });
            });
        });
    }

    // Get current user information and setup signalR
    useEffect(() => {
        getDefaultUser((err, res) => {
            if (err) {
                return toast.error("Can't get user profile!")
            } 
            if (!res.data.success) return;
            setCurrentUser(res.data.user);

            // Set up singalR
            setupSignalR();


        })
    }, [])


    // Load messages first time after user is loading
    useEffect(() => {
        if (!currentUser) return;
        getClubMessages(club.Id, continueTime, (err, res) => {
            setLoading(false);
            if (err || !res.data.success) {
                return toast.error("Can't load messages!")
            } 

            loadMoreMessage(null);
            scrollDivMessage();
        })
    }, [currentUser]);

    const createNewMessage = (message) => {
        createMessageChatbox(club.Id, message, (err, res) => {
            if (err) {
                return toast.error("Can't send message!")
            } 
            if (!res.data.success) return;

            scrollDivMessage();
        });
    }

    const loadMoreMessage = (e) => {
        e ? e.preventDefault() : null;
        setLoading(true);
        getClubMessages(club.Id, continueTime, (err, res) => {
            setLoading(false);
            if (err || !res.data.success) {
                return toast.error("Can't load messages!")
            } 

            const { messages, continueTime, totalLeft } = res.data.data;
            setListMessages([...messages.reverse(), ...listMessages]);
            setContinuetime(continueTime);
            setTotalLeft(totalLeft);
        })
    }

    return (
        <div className="col-7 px-0">
            <div ref={refDivMessage} className="px-4 py-5 chat-box bg-white">
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