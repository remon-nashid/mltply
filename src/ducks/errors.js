// @flow

import type { ExtractReturn } from '../types'

const ADD_ERROR = 'mltply/errors/ADD_ERROR'
const REMOVE_ERROR = 'mltply/errors/REMOVE_ERROR'

export const addError = (error: string) => {
  return { type: ADD_ERROR, error }
}

export const removeError = () => {
  return { type: REMOVE_ERROR }
}

type Action = ExtractReturn<typeof addError> | ExtractReturn<typeof removeError>

type State = string | null
const initialState = null
const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ADD_ERROR:
      return action.error
    case REMOVE_ERROR:
      return initialState
    default:
      return state
  }
}

export default reducer
