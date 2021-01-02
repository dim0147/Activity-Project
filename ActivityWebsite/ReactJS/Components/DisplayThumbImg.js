import React from 'react';
import Dropzone from 'react-dropzone';
import './InputFile.css';

const InputFiles = ({ handleClickRemoveThumbnailImg, files }) => {

    const previewImg = () => {
        return files.map((file, i) => {
            return (
                <div className="col-lg-2 col-md-2 img-preview-div-element" key={i}>
                    <img className="img-fluid img-pv" src={file.image} />
                    <div className="pl-4 m-2">
                        <button onClick={() => handleClickRemoveThumbnailImg(file.Id)} className="btn btn-danger btn-sm"><i className="far fa-trash-alt"></i></button>
                    </div>
                </div>
            )
        })
    }

    return (
            <div className="preview-image-div row">
                {files[0] && previewImg()}
            </div>
    )
}

export default InputFiles;