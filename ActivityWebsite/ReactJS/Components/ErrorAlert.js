import React from 'react';

const ErrorAlert = ({ listErrors }) => {
    return (
        <div className='alert alert-danger' role="alert">

            {listErrors.map((messageError, id) => {
                return (
                    <p key={id}><strong>- {messageError}</strong></p>
                )
            })}

        </div>
    )
}

export default ErrorAlert;