import React, {useContext} from 'react';

import { PostContext } from '../Post/Context';

const LeftPanelTags = () => {

    const post = useContext(PostContext);

    return (
        <div className="blog__sidebar__tags">
          
        </div>
    );
}

export default LeftPanelTags;