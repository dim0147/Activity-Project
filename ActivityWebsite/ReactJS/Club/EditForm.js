import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';

import { getClubOwner } from '../API/Club';
import { getAllCategory } from '../API/Category';
import InputCol12 from '../Components/InputCol12';
import DescriptionArea from '../Components/DescriptionArea';
import ListCategory from '../Components/ListCategory';
import GoogleMap from '../Components/GoogleMap';
import InputFile from '../Components/InputFile';
import Alert from '../Components/Alert';
import DisplayThumbImg from '../Components/DisplayThumbImg'

class FormCreate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            csrfToken: '',
            clubId: '',

            previewHeaderImg: '',
            previewThumbnailImg: [],
            previewLat: '',
            previewLng: '',

            originalName: '',
            name: '',
            operationHours: '',
            establishedAt: '',
            description: '',
            categories: [],
            address: '',
            headerImg: '',
            thumbnails: [],

            listImgIdNeedDelete: [],

            isEditing: false,
            doneLoadingClub: false,
            errorLoadingClub: null,

            notification: {
                type: null,
                messages: null
            }
        }

    }

    async componentDidMount() {
        // Get CSRF Token and club Id
        const csrfToken = document.getElementsByName('__RequestVerificationToken')[0].value;
        const clubId = document.getElementsByName('__ClubId')[0].value;

        await this.setState({
            csrfToken,
            clubId
        });

        // Get Club by Id
        const club = await getClubOwner(this.state.clubId)
            .catch(err => {
                if (err.response && err.response.data && err.response.data.error === true) 
                    this.setState({ errorLoadingClub: err.response.data.errors });
                else
                    this.setState({ errorLoadingClub: ['Unexpected error from server!'] });
                return null;
            });

        if (club) {
            this.setState({
                originalName: club.Name,
                name: club.Name,
                operationHours: club.OperationHours,
                establishedAt: moment(club.EstablishedAt).format('YYYY-MM-DD'),
                description: club.Description,
                address: {
                    lat: club.Lat,
                    lng: club.Lng,
                    name: club.Address
                },
                previewLat: club.Lat,
                previewLng: club.Lng,
                previewHeaderImg: club.HeaderImg,
                previewThumbnailImg: club.Thumbnails,

                doneLoadingClub: true
            })
        }

        // Get all category and filter club's category
        const categories = await getAllCategory().catch(err => []);
        categories.forEach(category => {
            const isIncluded = club.ClubCategories.some(clubCategory => {
                if (clubCategory.Id == category.Id) return true;
                else return false;
            })
            category.isChecked = isIncluded;
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

    handleClickRemoveThumbnailImg = (imgId) => {
        if (this.state.listImgIdNeedDelete.includes(imgId))
            return;

        // Add Image's Id need to delete
        const listImg = this.state.listImgIdNeedDelete;
        listImg.push(imgId);

        // Remove from previewThumbnail
        const newPreviewThumbnail = this.state.previewThumbnailImg.filter(img => {
            return img.Id != imgId
        });

        this.setState({
            listImgIdNeedDelete: listImg,
            previewThumbnailImg: newPreviewThumbnail
        });
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
        this.setState({ headerImg: imgs[0], previewHeaderImg: '' });
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
            isEditing: true
        })

        const formData = new FormData();

        formData.append('name', this.state.name);
        formData.append('operationHours', this.state.operationHours);
        formData.append('establishedAt', this.state.establishedAt);
        formData.append('description', this.state.description);
        formData.append('address', JSON.stringify(this.state.address));
        this.state.listImgIdNeedDelete.forEach(imgId => formData.append('listImgIdNeedDelete', imgId));

        formData.append('headerImg', this.state.headerImg);

        if (this.state.thumbnails.length > 0)
            this.state.thumbnails.forEach(thumbnail => formData.append('thumbnails', thumbnail));

        this.state.categories.forEach(category => {
            if (category.isChecked)
                formData.append('categories', category.Id)
        });

        const csrfToken = document.getElementsByName('__RequestVerificationToken')[0].value;
        formData.append('__RequestVerificationToken', csrfToken);

        axios({
            method: 'post',
            url: window.location.href,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                if (res.status === 200 && res.data && Array.isArray(res.data.messages)) {
                    this.setState({
                        notification: {
                            type: 'success',
                            messages: res.data.messages
                        },
                        isEditing: false
                    })
                } else {
                    this.setState({
                        notification: {
                            type: 'success',
                            messages: ["Edit success!"]
                        },
                        isEditing: false
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
                        isEditing: false
                    })
                }
                else {
                    this.setState({
                        notification: {
                            type: 'error',
                            messages: ['Unexpected Error From Server!']
                        },
                        isEditing: false
                    });
                }
            })
    }

    render() {
        if (!this.state.doneLoadingClub) {
            if (this.state.errorLoadingClub)
                return (
                    <Alert listMessages={this.state.errorLoadingClub} alertType='error' />   
                )
            else
                return (
                    <div className="text-center"><i className="fas fa-spinner fa-spin"></i>   Loading Club Detail...</div>
                )
        }
        else
            return (
                <div className="leave-comment spad">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="leave__comment__text">
                                    <h2>Edit "{this.state.originalName}" Club</h2>
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


                                            {this.state.previewHeaderImg &&
                                                <div className="col-lg-2 col-md-2 img-preview-div-element">
                                                    <img className="img-fluid img-pv" src={this.state.previewHeaderImg} />
                                                </div>
                                            }

                                            <InputFile
                                                files={this.state.thumbnails}
                                                setFiles={this.setThumbnailImg}
                                                header="Thumbnails"
                                                title="+ Drag and drop thumbnail images here, or click to select images"
                                            />

                                            {this.state.previewThumbnailImg &&
                                                <div>
                                                    <p>Click the 'trash' icon to remove the images that currently have</p>
                                                    <DisplayThumbImg
                                                        files={this.state.previewThumbnailImg}
                                                        handleClickRemoveThumbnailImg={this.handleClickRemoveThumbnailImg}
                                                    />
                                                </div>
                                            }

                                            <div className="col-lg-12 col-md-12 text-center">
                                                {this.state.notification.type === 'error' && <Alert listMessages={this.state.notification.messages} alertType='error' />}
                                                {this.state.notification.type === 'success' && <Alert listMessages={this.state.notification.messages} alertType='success' />}
                                            </div>

                                            {this.state.isEditing
                                                ?
                                                <div className="col-lg-12 col-md-12 text-center">
                                                    <p>Updating...   <i className="fas fa-spinner fa-spin"></i></p>
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

ReactDOM.render(<FormCreate />, document.getElementById("root"));
