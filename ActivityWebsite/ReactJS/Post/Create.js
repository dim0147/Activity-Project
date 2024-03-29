﻿import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import InputCol12 from '../Components/InputCol12';
import InputFile from '../Components/InputFile';
import DescriptionArea from '../Components/DescriptionArea';
import TagsEdit from './TagsEdit';
import Alert from '../Components/Alert';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            text: '<h2>This is our first post</h2>',

            tags: [],
            headerImg: '',

            appLoaded: false,
            isCreating: false,

            notification: {
                type: null,
                messages: null
            }
        };
    }

    setTitleChange = e => {
        this.setState({ title: e.target.value });
    }

    setTextChange = data => {
        this.setState({ text: data });
    }

    handleTag = (tag) => {
        if (tag.type === 'add') {
            // Check tag add is exist already
            const isExist = this.state.tags.some(tagE => {
                if (tagE.name === tag.name)
                    return true;
                return false;
            });
            if (!isExist)
                this.setState({ tags: [...this.state.tags, { name: tag.name }] })
        }
        else if (tag.type === 'remove') {
            this.setState({
                tags: this.state.tags.filter(tagE => {
                    return tagE.name !== tag.name
                })
            });
        }
    }

    setHeaderImg = (imgs) => {
        if (imgs.length === 0) return
        this.setState({ headerImg: imgs[0] });
    }

    onSubmitForm = (e) => {
        e.preventDefault();
        return false;
    }

    onClickButton = () => {
        this.setState({ isCreating: true });
        const formData = new FormData();

        formData.append('title', this.state.title);
        formData.append('text', this.state.text);

        this.state.tags.forEach(tag => {
            formData.append('tags', tag.name)
        });

        formData.append('headerImg', this.state.headerImg);

        const csrfToken = document.getElementsByName('__RequestVerificationToken')[0].value;
        formData.append('__RequestVerificationToken', csrfToken);

        axios({
            method: 'post',
            url: window.location.href,
            data: formData
        })
            .then(res => {
                if (res.status === 201 && res.data && Array.isArray(res.data.messages)) {
                    this.setState({
                        notification: {
                            type: 'success',
                            messages: res.data.messages
                        },
                        isCreating: false
                    })
                } else {
                    this.setState({
                        notification: {
                            type: 'success',
                            messages: "Can't not know if create success or not but response return is OK!"
                        },
                        isCreating: false
                    })
                }
            })
            .catch(error => {
                if (error.response && error.response.data && Array.isArray(error.response.data.errors)) {
                    const listErrors = error.response.data.errors;
                    this.setState({
                        notification: {
                            type: 'error',
                            messages: listErrors
                        },
                        isCreating: false
                    })
                }
                else {
                    this.setState({
                        notification: {
                            type: 'error',
                            messages: ['Unexpected Error From Server!']
                        },
                        isCreating: false
                    });
                }
            })
    }


    async componentDidMount() {

    }

    render() {

        return (
            <div className="leave-comment spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="leave__comment__text">
                                <form onSubmit={this.onSubmitForm}>
                                    <div className="row">

                                        <InputCol12
                                            title='Title'
                                            value={this.state.title}
                                            setValue={this.setTitleChange}
                                            placeholder="Enter post's title"
                                        />

                                        <DescriptionArea
                                            value={this.state.text}
                                            setValue={this.setTextChange}
                                        />

                                        <TagsEdit
                                            handleTag={this.handleTag}
                                            tags={this.state.tags}
                                        />

                                        <InputFile
                                            files={[this.state.headerImg]}
                                            setFiles={this.setHeaderImg}
                                            header="Header Image"
                                            title="+ Drag and drop post header image here, or click to select image"
                                        />

                                        <div className="col-lg-12 col-md-12 text-center">
                                            {this.state.notification.type === 'error' && <Alert listMessages={this.state.notification.messages} alertType='error' />}
                                            {this.state.notification.type === 'success' && <Alert listMessages={this.state.notification.messages} alertType='success' />}
                                        </div>

                                        {this.state.isCreating
                                            ?
                                            <div className="col-lg-12 col-md-12 text-center">
                                                <p>Creating...   <i className="fas fa-spinner fa-spin"></i></p>
                                            </div>
                                            :
                                            <div className="col-lg-12 col-md-12 text-center">
                                                <button type="button" className="site-btn" onClick={this.onClickButton}>Create</button>
                                            </div>
                                        }
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
