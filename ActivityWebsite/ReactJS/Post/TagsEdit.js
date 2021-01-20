import React, { useRef } from 'react';

const TagsEdit = ({ handleTag, tags }) => {
    const tagName = useRef();

   

    const addNewTag = () => {
        console.log(`Add new tag ${tagName.current.value}`);
        if (tagName.current.value == '') return;
        const newTag = {
            name: tagName.current.value,
            type: 'add'
        };
        handleTag(newTag);
        tagName.current.value = '';
    }

    const removeTag = (tagName) => {
        handleTag({
            name: tagName,
            type: 'remove'
        });
    }

    return (
        <div className="col-lg-12 col-md-12">
            <label className="label-for">Tags: </label>
            <input ref={tagName} type='text' placeholder='Enter new tag' />
            <button className="btn btn-success" onClick={addNewTag}><i className="fas fa-plus"></i>   Add new tag</button>

            <div className="m-3">
                {
                    tags.map((tag, index) =>
                        <button key={index} type="button" className="btn btn-primary m-3" onClick={() => removeTag(tag.name)}>
                            {tag.name} <span className="badge badge-light"><i className="fas fa-minus"></i></span>
                        </button>
                    )
                }
            </div>
        </div>
    );
}

export default TagsEdit;