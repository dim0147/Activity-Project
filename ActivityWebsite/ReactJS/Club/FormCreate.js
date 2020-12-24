import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GoogleMapReact from 'google-map-react';

import { getAllCategory } from '../API/Category';
import InputCol12 from '../Components/InputCol12';
import DescriptionArea from '../Components/DescriptionArea';
import ListCategory from '../Components/ListCategory';
import GoogleMap from '../Components/GoogleMap'; 


class FormCreate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            address: '',
            operationHours: '',
            establishedAt: '',
            description: '',
            categories: []
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

    setAdressChange = (event) => {
        this.setState({ address: event.target.value });
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

    render() {
        return (
            <div className="leave-comment spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="leave__comment__text">
                                <h2>Create New Club</h2>
                                <form action="#">
                                    <div className="row">

                                        <InputCol12
                                            title='Name'
                                            value={this.state.name}
                                            setValue={this.setNameChange}
                                            placeholder="Enter your club name"
                                        />

                                        <InputCol12
                                            title='Address'
                                            value={this.state.address}
                                            setValue={this.setAdressChange}
                                            placeholder="Enter your club address"
                                        />


                                        <GoogleMap />
                                        
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

                                        {/*<div className="col-lg-12">
                                            <label className="label-for">Description:</label>
                                            <textarea placeholder="Enter some description about your club" defaultValue={""} />
                                        </div>*/}

                                        {/*<div className="col-lg-12 col-md-12" style={{ marginBottom: '10px' }}>
                                            <label className="label-for">Category:</label>
                                            <br />
                                            <div className="custom-control custom-checkbox d-inline">
                                                <input type="checkbox" className="custom-control-input" id="customCheck" name="example1" />
                                                <label className="custom-control-label" htmlFor="customCheck">Check this custom checkbox</label>
                                            </div>
                                            <div className="custom-control custom-checkbox d-inline">
                                                <input type="checkbox" className="custom-control-input" id="customCheck1" name="customCheck1" />
                                                <label className="custom-control-label" htmlFor="customCheck1">Check this custom checkbox</label>
                                            </div>
                                        </div>*/}

                                        <ListCategory
                                            handleCheckElement={this.handleCheckCategoryElement}
                                            categories={this.state.categories}
                                        />


                                        <div className="col-lg-12 text-center">
                                            <button className="site-btn">Submit</button>
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
