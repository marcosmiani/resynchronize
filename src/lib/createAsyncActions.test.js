/* global test, expect, describe */
const createAsyncActions = require('./createAsyncActions')

describe('createAsyncActions', () => {
  const actions = createAsyncActions.default('TEST')

  test('returns an object with 3 actions', () => {
    expect(actions).toHaveProperty('start')
    expect(actions).toHaveProperty('done')
    expect(actions).toHaveProperty('error')
    expect(actions).toHaveProperty('reset')
  })

  test('stringified returns the type', () => {
    expect(`${actions}`).toBe('TEST')
  })

  test('properties stringified return the concatenation', () => {
    expect(`${actions.start}`).toBe('START_TEST')
    expect(`${actions.done}`).toBe('DONE_TEST')
    expect(`${actions.error}`).toBe('ERROR_TEST')
    expect(`${actions.reset}`).toBe('RESET_TEST')
  })

  test('properties type return the concatenation too', () => {
    expect(actions.start.type).toBe('START_TEST')
    expect(actions.done.type).toBe('DONE_TEST')
    expect(actions.error.type).toBe('ERROR_TEST')
    expect(actions.reset.type).toBe('RESET_TEST')
  })
})
