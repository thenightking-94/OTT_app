import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';//using react-redux hooks for redux implimentation
import nav_back from '../src/Assets/nav_bar.png';
import '../src/Css/Page_css.css';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Paper } from '@material-ui/core';

const App = () => {

  //React-specific Hooks
  const [scr, setScr] = useState(null);
  const mySearch = useRef(null);

  //Redux-specific Hooks refer https://react-redux.js.org/next/api/hooks
  const val = useSelector(state => state.search_word);
  const showInput = useSelector(state => state.inputbox);
  const data = useSelector(state => state.items);
  const dispatch = useDispatch();


  const getSearchedResults = (e) => {
    var res = mySearch.current.value;
    dispatch({ type: 'SEARCH_WORD', search_word: res });
    dispatch({ type: 'HIDE_SEARCH', inputbox: false });
    e.preventDefault();
  }


  //mimic componentDidMount to fetch page1 data & scroll-calculation
  useEffect(() => {

    //getting Page1 data on APP-loading
    let myPromise = fetch("/CONTENTLISTINGPAGE-PAGE1.json", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    myPromise.then(res => res.json()).then(json => dispatch({ type: 'GET_PAGE1_DATA', items: json }));

    //attaching a scroll-event listener for scroll calculation
    window.addEventListener('scroll', calculate_scroll);
    return () => {
      window.removeEventListener('scroll', calculate_scroll);
    }
  }, [])


  //calculate scrolled distanceF
  const calculate_scroll = () => { if (window.pageYOffset) setScr(window.pageYOffset) }



  useEffect(() => {
    //hide search box if user scrolls , when saerch box is open , without typing anything
    if (!val && showInput && scr)
      dispatch({ type: 'HIDE_SEARCH', inputbox: false });
  }, [scr])

  
  return (
    <div>
      {window.innerWidth < 768 && data &&
        <div style={{ height: '1200px' }}>
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
              <Paper id='search_paper'>
                <input autoComplete='off' type='text' id='input_box' placeholder='Search here ...' ref={mySearch} />
                <SearchIcon id='blackSearchIcon' onClick={getSearchedResults} />
              </Paper>

            </form>

          }
        </div>
      }
    </div>
  )

}
const MemoizedApp = React.memo(App);
export default MemoizedApp;
