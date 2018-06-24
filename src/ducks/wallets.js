/* @flow */
import type { ExtractReturn } from '../types'

type State = {
  editedToken?: string
}

/* constants */

export const POST_BALANCE = 'my-app/wallets/POST_BALANCE'
export const REMOVE_BALANCE = 'my-app/wallets/REMOVE_BALANCE'
export const TOGGLE_FORM = 'my-app/wallets/TOGGLE_FORM'

export function postBalance(token: string, balance: number) {
  return { type: POST_BALANCE, token, balance }
}

export function removeBalance(token: string) {
  return { type: REMOVE_BALANCE, token }
}

export function toggleForm(token: string) {
  return { type: TOGGLE_FORM, token }
}

type Action = ExtractReturn<typeof postBalance>

const initialState = {
  editedToken: undefined
}
const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case POST_BALANCE:
      return Object.assign({}, state, {
        editedToken: undefined
      })

    case REMOVE_BALANCE:
      return Object.assign({}, state, {
        editedToken: undefined
      })

    case TOGGLE_FORM:
      return Object.assign({}, state, { editedToken: action.token })

    default:
      return state
  }
}

export default reducer
