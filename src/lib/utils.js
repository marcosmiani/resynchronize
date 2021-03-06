import { INITIAL, STARTED, DONE, ERROR, CANCELLED } from './consts'

const get = (object, property, defaultValue) => object
  ? object[property] || defaultValue
  : defaultValue

// Basic set of functions to manage the state of async actions and reducers
const isLoading = asyncStatus => get(asyncStatus, 'status') === STARTED
const isDone = asyncStatus => get(asyncStatus, 'status') === DONE
const hasError = asyncStatus => get(asyncStatus, 'status') === ERROR
const isCancelled = asyncStatus => get(asyncStatus, 'status') === CANCELLED
const getError = asyncStatus => get(asyncStatus, 'error', null)
const getPayload = asyncStatus => get(asyncStatus, 'payload', null)

const getStateShape = (status = INITIAL, payload = null, error = null) => ({
  status, payload, error
})

/**
 * Basic action structure
 * @param {string} type unique identifier for the store
 * @return {funtion} action creator that returns an object with type and payload
 */
function Action (type) {
  return (payload = null) => ({ type, payload })
}

const createAction = type => {
  const action = new Action(type)
  action.toString = () => type
  action.type = type
  return action
}

const createReducer = (initialState, actionMap) =>
  (state = initialState, action = {}) =>
    typeof actionMap[action.type] === 'function'
      ? actionMap[action.type](state, action)
      : state

export {
  get,
  getStateShape,
  createAction,
  createReducer,
  isDone,
  hasError,
  getError,
  isCancelled,
  isLoading,
  getPayload
}
