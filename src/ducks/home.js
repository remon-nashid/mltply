// @flow

type State = {
  orderBy: 'amount' | 'price' | 'value' | 'percentage' | '1h' | '1d' | '7d',
  descending: boolean
}

const SORT = 'mltply/home/SORT'

export function sort(orderBy: string) {
  return { type: SORT, orderBy }
}

const initialState = {
  orderBy: 'percentage',
  descending: true
}

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SORT:
      return {
        orderBy: action.orderBy,
        descending:
          state.orderBy === action.orderBy
            ? !state.descending
            : state.descending
      }
    default:
      return state
  }
}
