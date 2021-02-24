import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { getClubDetail } from '../API/Club';

import DetailAbout from './DetailAbout';
import DetailCategory from './DetailCategory';
import DetailDescription from './DetailDescription';
import DetailPost from './DetailPost';
import DetailThumbnail from './DetailThumbnail';
import DetailAddress from './DetailAddress';
import CommentBox from './CommentBox';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {

            clubId: '',
            clubSlug: '',
            clubHeaderImg: '',
            clubName: '',
            clubOperationHours: '',
            clubEstablishAt: '',
            clubDescription: '',
            clubCategories: [],
            clubPosts: [],
            clubThumbnail: [],
            clubAddress: '',
            clubOwner: null,

            status: 'loading'
        }


    }

    async componentDidMount() {

        const clubId = document.getElementsByName('__ClubId')[0].value;
        this.setState({ status: 'loading' })
        const club = await getClubDetail(clubId).catch(err => {
            this.setState({ status: 'error' })
            return false;
        });
        if (club) {
            this.setState({
                clubId: club.Id,
                clubSlug: club.Slug,
                clubRate: club.Rate ? club.Rate : 0,
                clubHeaderImg: club.HeaderImg,
                clubName: club.Name,
                clubOperationHours: club.OperationHours,
                clubEstablishAt: club.EstablishedAt,
                clubDescription: club.Description,
                clubCategories: club.ClubCategories,
                clubThumbnail: club.Thumbnails,
                clubAddress: {
                    name: club.Address,
                    lat: club.Lat,
                    lng: club.Lng
                },
                clubOwner: club.owner,
                clubPosts: club.Posts,

                status: 'success'
            });
        }
        else
            this.setState({ status: 'error' })


    }

    render() {
        if (this.state.status === 'loading') {
            return (
                <div className="text-center"><i className="fas fa-spinner fa-spin"></i>   Loading Club Detail...</div>
            )
        }
        else if (this.state.status === 'error')
        {
            return (
                <div className="text-center alert alert-danger">Unexpected error from server</div>
            )
        }
        else if (this.state.status === 'success') {
            return (
                <>
                    <DetailAbout
                        clubId={this.state.clubId}
                        clubSlug={this.state.clubSlug}
                        clubRate={this.state.clubRate}
                        clubName={this.state.clubName}
                        clubEstablishAt={this.state.clubEstablishAt}
                        clubOperationHours={this.state.clubOperationHours}
                        clubHeaderImg={this.state.clubHeaderImg}
                        clubOwner={this.state.clubOwner}
                    />

                    <DetailCategory
                        listCategories={this.state.clubCategories}
                    />

                    <DetailDescription
                        description={this.state.clubDescription}
                    />

                    <DetailPost
                        posts={this.state.clubPosts}
                    />

                    <DetailThumbnail
                        thumbnails={this.state.clubThumbnail}
                    />

                    <CommentBox
                        clubId={this.state.clubId}
                    />
                    
                    <DetailAddress
                        address={this.state.clubAddress}
                    />
                    
                </>
            )
        }

    }

}

ReactDOM.render(<App />, document.getElementById('root'));