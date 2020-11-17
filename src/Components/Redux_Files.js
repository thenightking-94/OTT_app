import { createStore } from 'redux';

//Initial state object of the APP_data
const state = {
    arraydata: null,
    titledata: '',
    page2Append: false,
    page3Append: false,
    search_word: null,
    performSearch: false,
    searchRes: null,
    inputbox: false
};


//Reducer definition, I am using if-else in preference to normal switch case
const First_reducer = (state, action) => {
    if (action.type === 'SHOW_SEARCH')
        return ({ ...state, inputbox: action.inputbox });
    if (action.type === 'HIDE_SEARCH')
        return ({ ...state, inputbox: action.inputbox })
    if (action.type === 'SEARCH_WORD')
        return ({ ...state, search_word: action.search_word });
    if (action.type === 'GET_PAGE1_ARRAY_DATA')
        return ({ ...state, arraydata: action.arraydata, titledata: action.titledata })
    if (action.type === 'ASYNC_PAGE_2_DATA_FETCH_AND_CONCATENATION_STARTED')
        return ({ ...state, page2Append: action.page2Append });
    if (action.type === 'GET_RENEWED_ARRAY_DATA_AFTER_PAGE_2_CONCATENATION')
        return ({ ...state, arraydata: action.arraydata, titledata: action.titledata })
    if (action.type === 'ASYNC_PAGE_3_DATA_FETCH_AND_CONCATENATION_STARTED')
        return ({ ...state, page3Append: action.page3Append });
    if (action.type === 'GET_RENEWED_ARRAY_DATA_AFTER_PAGE_3_CONCATENATION')
        return ({ ...state, arraydata: action.arraydata, titledata: action.titledata })




    return state
}



//Store
const Store = createStore(First_reducer, state);
export { Store };


//console.log(Store.getState());

