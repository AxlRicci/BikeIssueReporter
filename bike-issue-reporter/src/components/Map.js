import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import firebase from '../firebase/Firestore';
import { connect } from 'react-redux';
import { getIssuesThunk } from './store';

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: -79.8564,
            lat: 43.2470,
            zoom: 11,
            markerLngLat: {lng: -79.8564, lat: 43.2470},
            info: '',
            issueType: '',
            issues: []
        };
    }
    // send info and markerLngLat data to Firestore when submit button is clicked.
    handleSubmit = (event) => {
        event.preventDefault();
        const db = firebase.firestore();
        db.collection('issues').add({
            lng: this.state.markerLngLat.lng,
            lat: this.state.markerLngLat.lat,
            info: this.state.info,
            issueType: this.state.issueType
        });
        this.setState({
            markerSubmit: null,
            info: '',
            issueType: ''
        });
        alert("Issue submitted. Thank you.")
        document.getElementById('info').value='';
        document.getElementById('issueType').value='none';
    };



    // listen to info and type input boxes and update state on change.
    handleInfoChange = (event) => {
        this.setState({
            info: event.target.value
        });
    }

    handleTypeChange = (event) => {
        this.setState({
            issueType: event.target.value
        });
    }

    //get points from props and create list that will be added to map
    getPoints() {
        if (this.state.issues === null){
            let output = [];
            return output;
        } else {
            console.log(this.props.state)
            let issuePoints = [];
            this.props.state.map(issue => {
                let point = {
                    'type': 'Feature',
                    'properties': {
                        'id': issue.id,
                        'info': issue.info,
                        'issueType': issue.issueType
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [issue.lng, issue.lat]
                    }
                }
                issuePoints.push(point);
            })
            this.setState({
                issues: issuePoints
            })
        }
    }

    componentDidUpdate() {
        this.getPoints()
    }

    // keep updating component until props are available.
    shouldComponentUpdate(newProps, newState) {
        if (this.state.issues.length === newProps.state.length){
            return false;
        } else {
            return true;
        }
    }

    componentDidMount() {
        // Initialize map
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });
        // add geojson source
        map.on('load', () => {
            map.addSource('issue-points', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': this.state.issues
                }
            })
            // add layers and set symbols from the geojson source using filters.
            map.addLayer({
                'id': 'issues',
                'type': 'circle',
                'source': 'issue-points',
                'paint': {
                    'circle-radius': 6,
                    'circle-color': ['match',
                    ['get','issueType'],
                    'infrastructure',
                    '#E60505',
                    'network',
                    '#5D036B',
                    'other',
                    '#E69F07',
                    '#999999'
                ]
                }
            })
        })

        //make point popup 
        map.on('click','issues', (event) => {
            let coordinates = event.features[0].geometry.coordinates.slice();
            let description = event.features[0].properties.info;
            while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });

        //change cursor to pointer when over points
        map.on('mouseenter','issues', ()=>{
            map.getCanvas().style.cursor = 'pointer';
        });

        //change back to cursor when over map
        map.on('mouseleave', 'issues', () => {
            map.getCanvas().style.cursor = '';
        });



        // Create draggable marker
        let marker = new mapboxgl.Marker({
            draggable: true,
        })
        marker.setLngLat([-79.8564,43.2470])
        marker.addTo(map);

        marker.on('dragend', () =>{
            this.setState({
                markerLngLat: marker.getLngLat()
            });
        });
        const M = window.M;
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems, {});
          });
    }
    
    render() {
        return (
            <div className="map">
                <div className="sidebarStyle">
                    <button><a href='/'>Home</a></button>
                    <form>
                        <label htmlFor="info">Info:</label>
                        <input onChange={this.handleInfoChange} type="text" id="info"></input>
                        <div class="input-field col s12">
                            <select onChange={this.handleTypeChange}id='issueType'>
                            <option value="none" disabled selected>Select type</option>
                            <option value="infrastructure">Infrastructure</option>
                            <option value="network">Network</option>
                            <option value="other">Other</option>
                            </select>
                            <label htmlfor='issueType'>Type of Issue:</label>
                        </div>
                        <button onClick={this.handleSubmit}>Submit</button>
                    </form>
                </div>
                <div ref={el => this.mapContainer = el} className='mapContainer' />
            </div>
        )
    }

}

const mapState = (state) => ({
    state
})

const mapDispatch = dispatch => {
    dispatch(getIssuesThunk())
    return {
    }
  }

export default connect(mapState, mapDispatch)(Map);