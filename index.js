import _ from 'lodash'
import { createAction, createReducer } from 'redux-starter-kit'

/**
 * Fuses in one property the given argument properties
 * @param {any} previous previous property
 * @param {any} connected connected property
 */
const fuseProps = (own, connected) => {
  let newProp = connected

  if (typeof own !== 'undefined') {
    newProp = {
      own,
      connected
    }
  }

  return newProp
}

const getAsyncKeys = getter => {
  let asyncProps = ['asyncProp']

  if (typeof getter === 'object') {
    asyncProps = Object.keys(getter).map(key => key)
  }

  return asyncProps
}

// Basic set of functions to manage the state of async actions and reducers
export const isDone = asyncStatus => _.get(asyncStatus, 'status', null) === 'DONE'
export const hasError = asyncStatus => _.get(asyncStatus, 'status', null) === 'ERROR'
export const isLoading = asyncStatus => _.get(asyncStatus, 'status', null) === 'START'
export const getPayload = asyncStatus => _.get(asyncStatus, 'payload', null)

/**
 * Gets the async state properties for connection
 * @param {object} asyncProp Async state property
 */
export const getAsyncProperties = (asyncProp) => ({
  payoad: getPayload(asyncProp),
  loading: isLoading(asyncProp),
  done: isDone(asyncProp),
  error: hasError(asyncProp)
})

export const getGetterAsyncProps = (state, props) => {
  const { getter } = props

  let newAsyncProps = {}

  getAsyncKeys(getter).forEach(key => {
    const newProp = getAsyncProperties(
      getter[key](state)
    )
    newAsyncProps[key] = fuseProps(props[key], newProp)
  })

  return newAsyncProps
}

/**
 * Create a set of basic async actions
 * @param {string} storePath unique identifier for the store
 */
export const createAsyncActions = storePath => ({
  START: createAction(`START_${storePath}`),
  DONE: createAction(`DONE_${storePath}`),
  ERROR: createAction(`ERROR_${storePath}`),
  RESET: createAction(`RESET_${storePath}`)
})

const ASYNC_INITIAL_STATE = { status: null, payload: null, error: null }

export const defaultReducer = (state, { payload }) => payload || state || null

/**
 * Handlers for async actions
 * The reducer is used on the afected property to avoid structure changes on how the library behaves
 * Status is managed by the library and cannot be altered, but the payloads can be updated using custom
 * reducers
 */
const handleStart = reducer => (state, action) => ({
  status: 'START',
  payload: reducer(state.payload, action),
  error: null
})

const handleDone = reducer => (state, action) => ({
  status: 'DONE',
  payload: reducer(state.payload, action),
  error: null
})

const handleError = reducer => (state, action) => ({
  status: 'ERROR',
  payload: state.payload,
  error: reducer(state.error, action)
})

const handleReset = reducer => (state, action) => ({
  status: null,
  payload: reducer(state.payload, action),
  error: null
})

/**
 * Basic action handler creator for async actions
 * @param {object} actions Async actions
 */
const createActionsHandler = (
  actions,
  { start, done, reset, error } = {}
) => ({
  [actions.START]: handleStart(start || defaultReducer),
  [actions.DONE]: handleDone(done || defaultReducer),
  [actions.ERROR]: handleError(error || defaultReducer),
  [actions.RESET]: handleReset(reset || defaultReducer)
})

/**
 * Create a reducer to handle async actions
 * @param {*} asyncActions Set of actions that include every state of a fetch process
 */
export const createAsyncReducer = (asyncActions, asyncHandlers) => {
  let config = {}
  // If is an array of async actions all of them are put into the main reducer
  if (Array.isArray(asyncActions)) {
    asyncActions.forEach(actions => {
      config = {
        ...config,
        ...createActionsHandler(actions, asyncHandlers)
      }
    })
  } else {
    config = createActionsHandler(asyncActions, asyncHandlers)
  }

  return createReducer(ASYNC_INITIAL_STATE, config)
}
