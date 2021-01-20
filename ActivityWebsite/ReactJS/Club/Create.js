import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import { getAllCategory } from '../API/Category';
import InputCol12 from '../Components/InputCol12';
import DescriptionArea from '../Components/DescriptionArea';
import ListCategory from '../Components/ListCategory';
import GoogleMap from '../Components/GoogleMap';
import InputFile from '../Components/InputFile';
import Alert from '../Components/Alert';


class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            operationHours: '',
            establishedAt: '',
            description: '',
            categories: [],
            address: '',
            headerImg: '',
            thumbnails: [],

            isCreating: false,

            notification: {
                type: null,
                messages: null
            }
        }

    }

    async componentDidMount() {
        // Load category from server
        const categories = await getAllCategory().catch(err => []);
        categories.forEach(category => {
            category.isChecked = false;
        });
        this.setState({ categories });
    }

    handleCheckCategoryElement = (event) => {
        const categories = this.state.categories;
        const categoryId = Number(event.target.id);
        const isChecked = event.target.checked;

        categories.forEach(category => {
            if (category.Id === categoryId)
                category.isChecked = isChecked;
        })
        this.setState({ categories });
    }

    setNameChange = (event) => {
        this.setState({ name: event.target.value });
    }

    setOperationHoursChange = (event) => {
        this.setState({ operationHours: event.target.value });
    }

    setEstablishedAtChange = (event) => {
        this.setState({ establishedAt: event.target.value });
    }

    setDescriptionChange = (data) => {
        this.setState({ description: data });
    }

    setAddressChange = (address) => {
        this.setState({ address });
    }

    setHeaderImg = (imgs) => {
        if (imgs.length === 0) return
        this.setState({ headerImg: imgs[0] });
    }

    setThumbnailImg = (imgs) => {
        if (imgs.length === 0) return
        this.setState({ thumbnails: imgs });
    }

    onSubmitForm = (e) => {
        e.preventDefault();
        return false;
    }


    onClickButton = (e) => {
        this.setState({
            notification: {
                type: null,
                messages: null
            },
            isCreating: true
        })

        const formData = new FormData();

        formData.append('name', this.state.name);
        formData.append('operationHours', this.state.operationHours);
        formData.append('establishedAt', this.state.establishedAt);
        formData.append('description', this.state.description);
        formData.append('address', JSON.stringify(this.state.address));

        formData.append('headerImg', this.state.headerImg);
        this.state.thumbnails.forEach(thumbnail => formData.append('thumbnails', thumbnail));

        this.state.categories.forEach(category => {
            if (category.isChecked)
                formData.append('categories', category.Id)
        });

        const csrfToken = document.getElementsByName('__RequestVerificationToken')[0].value;
        formData.append('__RequestVerificationToken', csrfToken);

        axios({
            method: 'post',
            url: '/club/create',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
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

    render() {
        return (
            <div className="leave-comment spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="leave__comment__text">
                                <h2>Create New Club</h2>
                                <form onSubmit={this.onSubmitForm}>
                                    <div className="row">

                                        <InputCol12
                                            title='Name'
                                            value={this.state.name}
                                            setValue={this.setNameChange}
                                            placeholder="Enter your club name"
                                        />

                                        <GoogleMap
                                            address={this.state.address}
                                            setAddress={this.setAddressChange}
                                        />

                                        <InputCol12
                                            title='Operation Hours'
                                            value={this.state.operationHours}
                                            setValue={this.setOperationHoursChange}
                                            placeholder="Enter your operation hours, ex: Mon- Fri, 10:30 AM to 11:00 PM"
                                        />

                                        <InputCol12
                                            title='Established at'
                                            value={this.state.establishedAt}
                                            setValue={this.setEstablishedAtChange}
                                            type="date"
                                            placeholder="Enter your club establish time"
                                        />

                                        <DescriptionArea
                                            value={this.state.description}
                                            setValue={this.setDescriptionChange}
                                        />


                                        <ListCategory
                                            handleCheckElement={this.handleCheckCategoryElement}
                                            categories={this.state.categories}
                                        />

                                        <InputFile
                                            files={[this.state.headerImg]}
                                            setFiles={this.setHeaderImg}
                                            header="Header Image"
                                            title="+ Drag and drop header image here, or click to select image"
                                        />

                                        <InputFile
                                            files={this.state.thumbnails}
                                            setFiles={this.setThumbnailImg}
                                            header="Thumbnails"
                                            title="+ Drag and drop thumbnail images here, or click to select images"
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
                                                <button type="button" className="site-btn" onClick={this.onClickButton}>Submit</button>
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
