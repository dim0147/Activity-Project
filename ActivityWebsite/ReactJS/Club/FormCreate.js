import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GoogleMapReact from 'google-map-react';

import { getAllCategory } from '../API/Category';
import InputCol12 from '../Components/InputCol12';
import DescriptionArea from '../Components/DescriptionArea';
import ListCategory from '../Components/ListCategory';
import GoogleMap from '../Components/GoogleMap';
import InputFile from '../Components/InputFile';


class FormCreate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            address: '',
            operationHours: '',
            establishedAt: '',
            description: '',
            categories: [],
            address: {
                name: null,
                lat: null,
                lng: null
            },
            headerImg: null,
            thumbnails: []
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
        this.setState({ categories }, () => {
            console.log(categories);
        });
    }

    setNameChange = (event) => {
        this.setState({ name: event.target.value });
    }

    setOperationHoursChange = (event) => {
        this.setState({ operationHours: event.target.value });
    }

    setEstablishedAtChange = (event) => {
        console.log(this.state.establishedAt)
        this.setState({ establishedAt: event.target.value });
    }

    setDescriptionChange = (data) => {
        console.log(data);
        this.setState({ description: data });
    }

    setAddressChange = (address) => {
        this.setState({ address }, () => {
            console.log("State");
            console.log(this.state.address);
        });
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
        alert("E");
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

                                        <div className="col-lg-12 text-center">
                                            <button className="site-btn" onClick={this.onClickButton}>Submit</button>
                                        </div>
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

ReactDOM.render(<FormCreate />, document.getElementById("test"));
