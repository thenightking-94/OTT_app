import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';//using react-redux hooks for redux implimentation
import nav_back from '../src/Assets/nav_bar.png';
import '../src/Css/Page_css.css';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Store } from './Components/Redux_Files';



const App = () => {
  const val = useSelector(state => state.isLoaded);
  const showInput = useSelector(state => state.inputbox);
  const mySearch = useRef(null);
  const dispatch = useDispatch();


  const getSearchedResults = (e) => {
    var res = mySearch.current.value;
    dispatch({ type: 'SEARCH_WORD', search_word: res });
    dispatch({ type: 'HIDE_SEARCH', inputbox: false });
    e.preventDefault();
  }

  useEffect(() => {
    console.log(Store.getState())
  }, [showInput])

  return (
    <div>
      {window.innerWidth < 768 &&
        <div>
          <img id='nav_back' src={nav_back} />
          {
            !showInput && <SearchIcon onClick={() => {
              { dispatch({ type: 'SHOW_SEARCH', inputbox: true }) }
            }} id='searchIcon' />
          }

          <ArrowBackIcon id='backIcon' />
          {
            showInput &&
            <form type='submit' onSubmit={getSearchedResults}>
              <input autoComplete='off' type='text' id='input_box' ref={mySearch} />
            </form>

          }
        </div>
      }
    </div>
  )

}
const MemoizedApp = React.memo(App);
export default MemoizedApp;
