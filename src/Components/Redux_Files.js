import { createStore, applyMiddleware } from 'redux';

//Initial state object of the APP_data
const state = {
    items: null,
    isLoaded: false,
    search_word: null,
    isSearched: false,
    inputbox: false
};


//Reducer definition, I am using if-else in preference to normal switch case
const First_reducer = (state, action) => {
    if (action.type == 'SHOW_SEARCH')
        return ({ ...state, inputbox: action.inputbox });
    if (action.type == 'HIDE_SEARCH')
        return ({ ...state, inputbox: action.inputbox })
    if (action.type == 'SEARCH_WORD')
        return ({ ...state, search_word: action.search_word });
    if (action.type == 'GET_PAGE1_DATA')
        return ({ ...state, items: action.items })

    return state
}



//Sore
const Store = createStore(First_reducer, state);

export { Store };


console.log(Store.getState());

