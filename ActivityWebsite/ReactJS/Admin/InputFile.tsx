import React from 'react';
import Dropzone from 'react-dropzone';
import '../Components/InputFile.css';
const InputFiles = ({ files, setFiles, header, title }: any) => {

    const previewImg = () => {
        return files.map((file: any, i: number) => {
            return (
                <div className="col-lg-2 col-md-2 img-preview-div-element" key={i}>
                    <img className="img-fluid img-pv" src={URL.createObjectURL(file)} />
                </div>
            )
        })
    }

    return (
        <div className="col-lg-12 col-md-12">
            <label className="label-for">{header}:</label>
            <div className="ImgDivDropzone">
                <Dropzone
                    accept="image/*"
                    onDrop={setFiles}
                >
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <p>{title}</p>
                        </div>
                    )}
                </Dropzone>
            </div>

            <div className="preview-image-div row">
                {files[0] && previewImg()}
            </div>




        </div>
    )
}

export default InputFiles;