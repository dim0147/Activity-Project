import React from 'react';

import Tags from './DetailTextTags';
import Author from './DetailTextAuthor';

const DetailText = ({ title, headerImg, text, tags, owner }) => {
    return (
        <div className="col-lg-8 order-lg-2 order-1">
            <div className="blog__details">

                <div className="blog__details__large text-center">
                    <img src={headerImg} alt="" />
                </div>

                <div className="text-center">
                    <h1>{title}</h1>
                </div>

                {/* Text Section*/}

                <div className="post-text" dangerouslySetInnerHTML={{ __html: text }}>
                </div>

                <Tags
                    tags={tags}
                />

                <Author
                    author={owner}
                />

            </div>
        </div>

    );
}

export default DetailText;