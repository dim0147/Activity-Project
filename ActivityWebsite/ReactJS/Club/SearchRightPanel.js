import React, { Component } from 'react';
import queryString from 'query-string';
import axios from 'axios';
import moment from 'moment';


export default class RightPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clubs: [],
        }
    }

    async componentDidMount() {

        const query = queryString.parse(location.search);

        const clubs = await axios.get('/api/club/search', { params: query }).then(res => res.data).catch(err => null)
        if (clubs !== null)
            this.setState({ clubs })

    }

    renderQueryString = (displayPageOnly = true) => {
        let currentPage = typeof queryString.parse(location.search).page !== 'undefined' ? Number(queryString.parse(location.search).page) : 1;
        if (displayPageOnly) return currentPage;

        let query = queryString.parse(location.search);
        query.page = Number(currentPage + 1);
        const stringified = queryString.stringify(query);
        return location.pathname + '?' + stringified;

    }

    renderBack = (displayPageOnly = true) => {
        let currentPage = typeof queryString.parse(location.search).page !== 'undefined' ? Number(queryString.parse(location.search).page) : 1;

        let query = queryString.parse(location.search);
        query.page = Number(currentPage - 1);
        const stringified = queryString.stringify(query);
        return location.pathname + '?' + stringified;

    }


    render() {

        const { clubs } = this.state;
        return (
            <div className="col-lg-8 order-lg-2 order-1">
                <div className="row">

                    {clubs.map(club => (
                        <div key={club.Id} className="col-lg-6 col-sm-6">
                            <div className="blog__item">
                                <div className="blog__item__pic">
                                    <img src={club.HeaderImg} alt="" />
                                </div>
                                <div className="blog__item__text">
                                    <ul>
                                        <li><i className="fa fa-calendar-o" />{moment(club.EstablishedAt).format('ll')}</li>
                                        <li><i className="fa fa-comment-o" />{club.TotalReviews} reviews</li>
                                    </ul>
                                    <h5><a href={`/club/${club.Slug}`}>{club.Name}</a></h5>
                                    <p>{club.Categories.map(category => category.Name).join(", ")}</p>
                                    <a href={`/club/${club.Slug}`} className="blog_read_more">LEARN MORE <span className="arrow_right" /></a>
                                </div>
                            </div>
                        </div>))}


                    <div className="col-lg-12">
                        <div className="classes__pagination blog__pagination">
                            {typeof queryString.parse(location.search).page !== 'undefined' && Number(queryString.parse(location.search).page > 1) ? <a href={this.renderBack(false)}><span className="arrow_carrot-left" /></a> : null }
                            <a href="#">{this.renderQueryString()}</a>
                            <a href={this.renderQueryString(false)}><span className="arrow_carrot-right" /></a>
                        </div>
                    </div>
                </div>
            </div>


        )
    }
}

