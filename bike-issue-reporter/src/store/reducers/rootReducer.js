import issueReducer from './issueReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    issue: issueReducer
});

export default rootReducer;