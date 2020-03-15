import firebase, { database } from 'firebase';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

const composeEnhancers = composeWithDevTools({})

//Action types
const GET_ISSUES = 'get issues';

//Action creators
export const getIssues = (issues) => ({type: GET_ISSUES, issues});

//Thunks
export function getIssuesThunk() {
    return dispatch => {
        const issues = [];
        const db = firebase.firestore();
        let issuesRef = db.collection('issues');
        issuesRef.get()
            .then(snapshot => {
                snapshot.forEach(issue =>{
                    issue = {
                        id: issue.id,
                        info: issue.dm.proto.fields.info.stringValue,
                        lng: issue.dm.proto.fields.lng.doubleValue,
                        lat: issue.dm.proto.fields.lat.doubleValue,
                        issueType: issue.dm.proto.fields.issueType.stringValue
                    }
                    issues.push(issue)
                })
            })
        .then(()=> dispatch(getIssues(issues)));
    }
}

//Reducer
function Reducer (state = [], action) {
    switch (action.type) {
        case GET_ISSUES:
            return action.issues
        default:
            return state
    }
}

export default createStore(Reducer, composeEnhancers(applyMiddleware(thunkMiddleware)));