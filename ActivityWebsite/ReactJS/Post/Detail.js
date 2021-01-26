import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import LeftPanel from '../Components/LeftPanel';
import DetailText from './DetailText';
import CommentBox from './DetailCommentBox';
import Alert from '../Components/Alert';

import { getPostDetail } from '../API/Post';

import { PostDetailContext, PostContext } from './Context';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: null,

            appLoaded: false,
            errorLoading: null
        }
    }

    async componentDidMount() {
        const postId = document.getElementsByName('__PostId')[0].value;
        const post = await getPostDetail(postId)
            .catch(err => {
                if (err.response && err.response.data && err.response.data.error === true)
                    this.setState({ errorLoading: err.response.data.errors });
                else
                    this.setState({ errorLoading: ['Unexpected error from server!'] });
                return null;
            });

        if (post) {
            this.setState({
                post: post,

                appLoaded: true
            })
        }
    }

    render() {
        if (!this.state.appLoaded) {
            if (this.state.errorLoading)
                return (
                    <Alert listMessages={this.state.errorLoading} alertType='error' />
                )
            else
                return (
                    <div className="text-center"><i className="fas fa-spinner fa-spin"></i>   Loading Club Detail...</div>
                )
        } else {
            return (
                <PostDetailContext.Provider value={this.state.post.Id}>
                    <PostContext.Provider value={this.state.post}>
                        <div>
                            <section className="blog-details spad">
                                <div className="container">
                                    <div className="row">
                                        <LeftPanel />

                                        <DetailText
                                            title={this.state.post.Title}
                                            headerImg={this.state.post.HeaderImg}
                                            text={this.state.post.Text}
                                            tags={this.state.post.Tags}
                                            owner={this.state.post.Owner}
                                        />

                                    </div>
                                </div>
                            </section>


                            <CommentBox

                            />
                        </div>
                    </PostContext.Provider>
                </PostDetailContext.Provider>
            );
        }
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
