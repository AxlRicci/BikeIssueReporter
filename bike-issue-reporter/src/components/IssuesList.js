import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getIssuesThunk, getIssues } from './store';

class IssuesList extends Component {
    constructor() {
        super();
        this.state = {
            issues: null
        }
    }
    render() {
        return (
            null
        )
    }
}

const mapState = (state) => ({
    state
})


export default connect(mapState)(IssuesList);