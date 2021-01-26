import React, {useContext} from 'react';

import { PostContext } from '../Post/Context';

const LeftPanelTags = () => {

    const post = useContext(PostContext);

    return (
        <div className="blog__sidebar__tags">
            <h4>Search By Tags</h4>
            {post.Tags.map((tag,i) => <a key={i} href={`/search/post?tags=${tag.Name}`}>{tag.Name}</a>)}
        </div>
    );
}

export default LeftPanelTags;