import React, { useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const DetailDescription = ({ description }) => {

    useEffect(() => {
        document.querySelectorAll('oembed[url]').forEach(element => {
            const anchor = document.createElement('a');

            anchor.setAttribute('href', element.getAttribute('url'));
            anchor.className = 'embedly-card';

            element.appendChild(anchor);
        });
    })

    return (
        <section className="chooseus spad">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="chooseus__text">
                            <h2>Description</h2>
                            <div className="ck-content" dangerouslySetInnerHTML={{ __html: description }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DetailDescription;