import React from 'react';

const LeftPanelRecentPosts = () => {
    return (
        <div className="blog__sidebar__recent">
            <h4>Recent Posts</h4>
            <div className="blog__recent__item">
                <div className="blog__recent__item__pic">
                    <img src="img/blog/br-1.jpg" alt="" />
                </div>
                <div className="blog__recent__item__text">
                    <h6>09 Kinds Of Vegetables Protect The Liver</h6>
                    <span>MAR 05, 2019</span>
                </div>
            </div>
            <div className="blog__recent__item">
                <div className="blog__recent__item__pic">
                    <img src="img/blog/br-2.jpg" alt="" />
                </div>
                <div className="blog__recent__item__text">
                    <h6>Tips You To Balance Nutrition Meal Day</h6>
                    <span>MAR 05, 2019</span>
                </div>
            </div>
            <div className="blog__recent__item">
                <div className="blog__recent__item__pic">
                    <img src="img/blog/br-3.jpg" alt="" />
                </div>
                <div className="blog__recent__item__text">
                    <h6>4 Principles Help You Lose Weight With Vegetables</h6>
                    <span>MAR 05, 2019</span>
                </div>
            </div>
        </div>
    );
}

export default LeftPanelRecentPosts;