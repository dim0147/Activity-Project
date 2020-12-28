import React from 'react';

const Alert = ({ listMessages, alertType }) => {

    const renderAlertType = () => {
        if (alertType === 'success') return 'success';
        else if (alertType === 'error') return 'danger';
        else if (alertType === 'warning') return 'warning';
        else if (alertType === 'default') return 'primary';
    }

    return (
        <div className={'alert alert-' + renderAlertType()} role="alert">

            {listMessages.map((message, id) => {
                return (
                    <p key={id}><strong>- {message}</strong></p>
                )
            })}

        </div>
    )
}

export default Alert;