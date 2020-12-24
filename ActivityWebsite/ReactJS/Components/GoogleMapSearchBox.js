import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class SearchBox extends React.Component {

    static propTypes = {
        onPlacesChanged: PropTypes.func,
        googlemaps: PropTypes.object,
        placeholder: PropTypes.string
    }

    render() {
        return <input ref="input" placeholder={this.props.placeholder} type="text" />;
    }

    onPlacesChanged = () => {
        const { onPlacesChanged } = this.props;
        onPlacesChanged(this.searchBox.getPlaces());
    }

    componentDidMount() {
        const { googlemaps } = this.props;
        var input = ReactDOM.findDOMNode(this.refs.input);
        this.searchBox = new googlemaps.places.SearchBox(input);
        this.searchBox.addListener('places_changed', this.onPlacesChanged);
    }

    componentWillUnmount() {
        const { googlemaps } = this.props;
        googlemaps.event.clearInstanceListeners(this.searchBox);
    }
}