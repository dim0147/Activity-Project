import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import '../ckEditorExclude.css';

const DescriptionArea = ({ value, setValue }) => {

    return (
        <div className="col-lg-12">
            <label className="label-for">Description:</label>
            <CKEditor
                editor={ClassicEditor}
                data={value}
                config={{
                    ckfinder: {
                        uploadUrl: '/api/Image?typeUpload=description'
                    }
                }}
                onChange={(event, editor) => {
                const data = editor.getData();
                setValue(data);
            }}
            />
        </div>
    )
}

export default DescriptionArea;