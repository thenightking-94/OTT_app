import { act } from 'react-dom/test-utils';
import { createStore, applyMiddleware } from 'redux';

//Initial state object of the APP_data
const state = {
    items: [],
    isLoaded: false,
    search_word: null,
    isSearched: false,
    inputbox: false
};


//Reducer definition
const First_reducer = (state, action) => {
    if (action.type == 'SHOW_SEARCH')
        return ({ ...state, inputbox: action.inputbox });
    if (action.type == 'HIDE_SEARCH')
        return ({ ...state, inputbox: action.inputbox })
    if (action.type == 'SEARCH_WORD')
        return ({ ...state, search_word: action.search_word });

    return state
}

//Sore
const Store = createStore(First_reducer, state);

export { Store };


console.log(Store.getState());

