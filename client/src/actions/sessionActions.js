import axios from 'axios';

import {
  ADD_SESSION,
  GET_ERRORS,
  CLEAR_ERRORS,
  SESSION_LOADING,
  GET_SESSION,
  GET_SESSIONS,
  DELETE_SESSION
} from './types';

// Add Session
export const addSession = (sessionData, history) => dispatch => {
  dispatch(clearErrors());
  axios
    .post('/api/sessions', sessionData)
    .then(res => history.push('/tutors'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get Sessions
export const getSessions = () => dispatch => {
  dispatch(setSessionLoading());
  axios
    .get('/api/sessions')
    .then(res =>
      dispatch({
        type: GET_SESSIONS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_SESSIONS,
        payload: null
      })
    );
};

// Get Session
export const getSession = id => dispatch => {
  dispatch(setSessionLoading());
  axios
    .get(`/api/sessions/${id}`)
    .then(res =>
      dispatch({
        type: GET_SESSION,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_SESSION,
        payload: null
      })
    );
};

// Delete Session
export const deleteSession = id => dispatch => {
  axios
    .delete(`/api/sessions/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_SESSION,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Instructor
export const addInstructor = (sessionId, instructorData) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/sessions/instructor/${sessionId}`, instructorData)
    .then(res =>
      dispatch({
        type: GET_SESSION,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set loading state
export const setSessionLoading = () => {
  return {
    type: SESSION_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
