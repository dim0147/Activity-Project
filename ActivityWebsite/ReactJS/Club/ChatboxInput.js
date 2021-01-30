import React, { useRef, useState } from 'react';

import Picker from 'emoji-picker-react';

const InputMessage = ({ createNewMessage }) => {

    const style = {
        position: 'absolute',
        top: '200px',    
        zIndex: 999
    }

    const ipRef = useRef();
    const [displayEmotion, setEmotion] = useState(false);
    const submitForm = (e) => {
        e.preventDefault();

        createNewMessage(ipRef.current.value);
        ipRef.current.value = '';
    }

    const onEmojiClick = (event, emojiObject) => {
        ipRef.current.value += emojiObject.emoji;
    };

    return (
        <>
            {displayEmotion &&
                <Picker
                    pickerStyle={style}
                    onEmojiClick={onEmojiClick}
                />
            }
            <form onSubmit={submitForm} action="#" className="bg-light">
                <div className="input-group">
                    <div onClick={() => setEmotion(!displayEmotion)} className="p-2"><i className="fas fa-grin-beam"></i></div>
                    <input onClick={() => setEmotion(false)} ref={ipRef} type="text" placeholder="Type a message" aria-describedby="button-addon2" className="form-control rounded-0 border-0 py-4 bg-light" />

                    <div className="input-group-append">

                        <button id="button-addon2" type="submit" className="btn btn-link"> <i className="fa fa-paper-plane" /></button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default InputMessage;