import React, { Component } from 'react';

import SearchBar from '../Components/SearchBar';
import LeftPanelCategories from '../Components/LeftPanelCategories';
import LeftPanelRecentPosts from '../Components/LeftPanelRecentPosts';
import LeftPanelTags from '../Components/LeftPanelTags';

class LeftPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="col-lg-4 order-lg-1 order-2">
                <div className="blog__sidebar">
                    <SearchBar

                    />
                    <div className="blog__sidebar">
                        <LeftPanelCategories

                        />

                        <LeftPanelRecentPosts

                        />

                        <LeftPanelTags

                        />
                    </div>
                </div>
            </div>
        );
    }

}

export default LeftPanel;