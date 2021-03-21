import React, { Component } from 'react';
import axios from 'axios';
import Rating from 'react-rating-stars-component';
import moment from 'moment';

//import LeftPanel from '../Components/LeftPanel';

export default class LeftPanel extends Component {
    constructor(props) {
        super(props);

        this.ipSearch = React.createRef();

        this.state = {
            categories: [],

            topClubs: []
        }
    }

    async componentDidMount() {
        const categories = await axios.get('/api/category').then(res => res.data.categories).catch(err => null);
        const topClubs = await axios.get('/api/club/top-club').then(res => res.data);

        if (categories != null)
            this.setState({ categories });
        if (topClubs != null)
            this.setState({ topClubs });
    }

    searchSubmit = (e) => {
        e.preventDefault();
        location.search = `name=${this.ipSearch.current.value}`;
    }

    render() {
        const { categories, topClubs } = this.state;

        return (
            <div className="col-lg-4 order-lg-1 order-2">
                <div className="blog__sidebar">
                    <div className="blog__sidebar__search">
                        <form onSubmit={this.searchSubmit}>
                            <input ref={this.ipSearch} type="text" placeholder="Search" />
                            <button><span className="icon_search" /></button>
                        </form>
                    </div>
                    <div className="blog__sidebar__categories">
                        <h4>Categories</h4>
                        <ul>
                            {categories.map(category => <li key={category.Id}><a href={`/club/search?category=${category.name}`}>{category.name}</a></li>)}
                        </ul>
                    </div>
                    <div className="blog__sidebar__recent">
                        <h4>Top Clubs</h4>

                        {topClubs.map(club => (
                            <div className="blog__recent__item" key={club.Id}>
                            <div className="blog__recent__item__pic">
                                    <img width={70} height={70} src={club.HeaderImg} alt="" />
                            </div>
                            <div className="blog__recent__item__text">
                                    <a href={`/club/${club.Slug}`}><h6>{club.Name}</h6></a>
                                    <Rating
                                        value={club.TotalRate ? club.TotalRate : 0}
                                        edit={false}
                                        size={20}
                                    />
                                    <span>{moment(club.EstablishAt).format('LL')}</span>
                            </div>
                        </div>))}

                    </div>
                </div>
            </div>

        )
    }
}
