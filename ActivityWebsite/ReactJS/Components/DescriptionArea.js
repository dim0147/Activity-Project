import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
const DescriptionArea = ({ value, setValue }) => {
    console.log(ClassicEditor.builtinPlugins.map(plugin => plugin.pluginName));
    const configSimpleUpload = {
        ckfinder: {
            // Upload the images to the server using the CKFinder QuickUpload command.
            uploadUrl: '/upload?command=QuickUpload&type=Images&responseType=json'
        }
    }

    return (
        <div className="col-lg-12">
            <label className="label-for">Description:</label>
            <CKEditor
                editor={ClassicEditor}
                data="<p>Hello from CKEditor 5!</p>"
                config={configSimpleUpload}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setValue(data);
                    console.log({ event, editor, data });
                }}
            />
        </div>
    )
}

export default DescriptionArea;