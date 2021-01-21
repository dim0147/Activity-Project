import React from 'react';
import GoogleMap from '../Components/GoogleMap';

const DetailAddress = ({ address }) => {

    const setAddress = (address) => { };

    return (
        <section className="instructor spad m-5">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title normal-title">
                            <h2>Address</h2>
                            <p>{address ? address.name : ''}</p>
                        </div>
                    </div>
                </div>
                {/* Map Begin */}
                <div className="map">
                    <GoogleMap
                        address={address}
                        setAddress={setAddress}
                        noSearchBar={true}
                    />
                </div>
                {/* Map End */}
            </div>
        </section>    
    )
}

export default DetailAddress;