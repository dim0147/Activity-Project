import React from 'react';

const DetailTextTags = ({ tags }) => {
    return (
        <div className="blog__details__tags__share">
            <p><span>Tags:</span> {tags.map(tag => tag.Name).join(",")}</p>
            <div className="blog__details__share">
                <a href={`https://www.facebook.com/sharer/sharer.php?u= ${window.location.href}`} target="_blank"><span className="social_facebook" /></a>
                <a href={`https://twitter.com/intent/tweet?url= ${window.location.href}`} target="_blank"><span className="social_twitter" /></a>
                <a href={`http://www.linkedin.com/shareArticle?url= ${window.location.href}`} target="_blank"><span className="social_linkedin" /></a>
            </div>
        </div>
    );
}

export default DetailTextTags;