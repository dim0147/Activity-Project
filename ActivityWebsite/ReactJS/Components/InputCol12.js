import React from 'react';

const InputCol12 = ({ title, value, setValue, placeholder, type = "text" }) => {
    return (
        <div className="col-lg-12 col-md-12">
            <label className="label-for">{title}:</label>
            <input type={type} placeholder={placeholder} onChange={setValue} value={value} />
        </div>
    )
}
export default InputCol12
