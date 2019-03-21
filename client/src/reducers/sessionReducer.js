import {
  GET_SESSION,
  GET_SESSIONS,
  SESSION_LOADING,
  GET_PROFILE
} from '../actions/types';

const initialState = {
  session: null,
  sessions: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SESSION_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_SESSION:
      return {
        ...state,
        session: action.payload,
        loading: false
      };
    case GET_PROFILE:
      return {
        ...state,
        tutorProfile: action.payload,
        loading: false
      };
    case GET_SESSIONS:
      return {
        ...state,
        sessions: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
