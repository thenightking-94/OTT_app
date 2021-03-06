import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';//using react-redux hooks for redux implimentation
import nav_back from '../src/Assets/nav_bar.png';
import '../src/Css/Page_css.css';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Paper, Grid, Typography, Divider } from '@material-ui/core';
import Posters from '../src/Components/Posters';
import "animate.css/animate.min.css";
import ScrollAnimation from 'react-animate-on-scroll';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import nothing_found from '../src/Assets/nothing-found.png';


const App = () => {

  //React-specific Hooks
  const [scr, setScr] = useState(null);
  const [isColor, setColor] = useState(false);
  const mySearch = useRef(null);

  //React-custom hook for posters
  let posters = Posters();

  //Redux-specific Hooks please refer https://react-redux.js.org/next/api/hooks
  const val = useSelector(state => state.search_word);
  const showInput = useSelector(state => state.inputbox);
  const data = useSelector(state => state.arraydata);
  const title_data = useSelector(state => state.titledata);
  const page2append = useSelector(state => state.page2Append);
  const page3append = useSelector(state => state.page3Append);
  const searchPerformed = useSelector(state => state.performSearch);
  const searchResults = useSelector(state => state.searchRes);
  const dispatch = useDispatch();


  const getSearchedResults = (e) => {
    var res = mySearch.current.value;
    document.documentElement.scrollIntoView();
    dispatch({ type: 'SEARCH_WORD', search_word: res });
    dispatch({ type: 'HIDE_SEARCH_BAR', inputbox: false });
    e.preventDefault();
  }

  //mimic componentDidMount() to fetch page1 data & scroll-calculation
  useEffect(() => {

    //getting PAGE1 data on APP-loading
    let myPromise = fetch("/CONTENTLISTINGPAGE-PAGE1.json", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    myPromise.then(res => res.json()).then(json => dispatch({ type: 'GET_PAGE1_ARRAY_DATA', arraydata: json.page["content-items"].content, titledata: json.page.title }));

    //attaching a scroll-event listener for scroll calculation
    window.addEventListener('scroll', calculate_scroll);
    return () => {
      window.removeEventListener('scroll', calculate_scroll);
    }
  }, [])

  //calculate scrolled distance
  const calculate_scroll = () => {
    var scr_distance = window.pageYOffset;
    if (scr_distance) {
      if (scr_distance > scr)
        setScr(scr_distance);
      if (scr_distance < scr)
        setScr(scr_distance);

    }
  }

  useEffect(() => {

    //hide search box if user scrolls , when saerch box is open , without typing anything
    if (!val && showInput && scr)
      dispatch({ type: 'HIDE_SEARCH_BAR', inputbox: false });


    if (scr) {
      var el = document.querySelector("div[id='movie_grid_block']");
      //console.log(scr)
      if (el) {

        //Load and append PAGE2 data and run the fetch() method only once after users scrolls 60% threshold scrollheight
        if (!page2append && el.getBoundingClientRect().y < 0 && Math.abs(el.getBoundingClientRect().y) > (0.6 * el.getBoundingClientRect().height)) {
          const PromisePage2 = fetch("/CONTENTLISTINGPAGE-PAGE2.json", {
            method: 'GET', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
          })
          PromisePage2.then(res => res.json()).then(json => dispatch({ type: 'GOT_RENEWED_ARRAY_DATA_AFTER_PAGE_2_CONCATENATION', arraydata: data.concat(json.page["content-items"].content), titledata: json.page.title }));
          dispatch({ type: 'ASYNC_PAGE_2_DATA_FETCH_AND_CONCATENATION_STARTED', page2Append: true });
        }

        //Load and append PAGE3 data and run the fetch() method only once after users scrolls 65% threshold of new scrollheight
        if (!page3append && page2append && el.getBoundingClientRect().y < 0 && Math.abs(el.getBoundingClientRect().y) > (0.65 * el.getBoundingClientRect().height)) {
          const PromisePage3 = fetch("/CONTENTLISTINGPAGE-PAGE3.json", {
            method: 'GET', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
          })
          PromisePage3.then(res => res.json()).then(json => dispatch({ type: 'GOT_RENEWED_ARRAY_DATA_AFTER_PAGE_3_CONCATENATION', arraydata: data.concat(json.page["content-items"].content), titledata: json.page.title }));
          dispatch({ type: 'ASYNC_PAGE_3_DATA_FETCH_AND_CONCATENATION_STARTED', page3Append: true });
        }
      }
    }
  }, [scr])
  //dependent on computed scroll-state-value

  //picking image src from react-custom hook
  const pick_src = (str) => {
    var index = null;
    if (str) {
      index = Number(str[6]);
      if (!(index >= 0 && index <= 9))
        return posters[posters.length - 1];
    }
    return posters[index - 1];
  }

  //changing theme
  const changeTheme = () => {
    if (!isColor)
      setColor(true);
    if (isColor)
      setColor(false);
  }

  return (
    <div>
      {window.innerWidth > 768 && <span id='open_desk_msg'>Switch to Mobile Device</span>}
      {window.innerWidth < 768 && data &&
        <div className='home' style={{
          maxWidth: window.innerWidth
        }}>
          <p id='change_theme' onClick={changeTheme} style={{ color: isColor ? 'white' : 'black', background: isColor ? 'black' : 'white' }}>Change Theme</p>
          < img alt='header_background' id='nav_back' src={nav_back} />
          {
            !showInput && <SearchIcon onClick={() => {
              { dispatch({ type: 'SHOW_SEARCH_BAR', inputbox: true }) }
            }} id='searchIcon' />
          }
          <span>
            {!searchPerformed && <ArrowBackIcon id='backIcon' onClick={() => { document.documentElement.scrollIntoView({ behavior: 'smooth' }); }} />}
            {searchPerformed && <HighlightOffIcon id='clear_icon' onClick={() => {
              dispatch({ type: 'CLEAR_SEARCH', performSearch: false, searchRes: [], search_word: '' });
            }} />}
            {!searchPerformed && <Typography className='title_typo'>{!showInput && title_data}</Typography>}
            {searchPerformed && <Typography className='result_typo'>Searched for :&nbsp;&nbsp;{!showInput && val}</Typography>}
          </span>
          {
            showInput &&
            <form type='submit' onSubmit={getSearchedResults}>
              <Paper id='search_paper'>
                <input autoComplete='off' type='text' id='input_box' placeholder='Search here ...' ref={mySearch} />
                <SearchIcon id='blackSearchIcon' onClick={getSearchedResults} />
              </Paper>
            </form>
          }
          {
            data && !searchPerformed &&
            <div id='movie_grid_block' style={{ background: isColor ? 'white' : 'black' }}>
              <Grid className='card_deck' container>
                {!page2append && !page3append &&
                  data.map(item =>
                    <Grid item xs={4}>
                      <img alt='posters' style={{ width: ((window.innerWidth - 60) / 3), height: '200px' }} src={pick_src(item["poster-image"])} />
                      <p id='poster_info' style={{ color: isColor ? 'black' : 'white' }}>{item.name}</p>
                      <Divider id='divider' />
                    </Grid>
                  )
                }
                {
                  data.map(item =>
                    <Grid item xs={4}>
                      <ScrollAnimation delay={200} animateIn="fadeIn">
                        <img alt='posters' style={{ width: ((window.innerWidth - 60) / 3), height: '200px' }} src={pick_src(item["poster-image"])} />
                        <p id='poster_info' style={{ color: isColor ? 'black' : 'white' }}>{item.name}</p>
                        <Divider id='divider' />
                      </ScrollAnimation>
                    </Grid>
                  )
                }

              </Grid>
            </div>
          }
          {
            data && searchPerformed && searchResults.length > 0 &&
            <div id='movie_grid_block' style={{ background: isColor ? 'white' : 'black' }}>
              <Grid className='card_deck' container>
                {
                  searchResults.map(item =>
                    <Grid item xs={4}>
                      <ScrollAnimation delay={200} animateIn="fadeIn">
                        <img alt='posters' style={{ width: ((window.innerWidth - 60) / 3), height: '200px' }} src={pick_src(item["poster-image"])} />
                        <p id='poster_info' style={{ color: isColor ? 'black' : 'white' }}>{item.name}</p>
                        <Divider id='divider' />
                      </ScrollAnimation>
                    </Grid>
                  )
                }

              </Grid>
            </div>
          }
          {
            data && searchPerformed && searchResults.length == 0 &&
            <div id='nothing_found_div'>
              <img alt='nothing_found' id='nothing_found' src={nothing_found} />
              <p>Nothing Found....</p>
            </div>
          }
        </div>
      }
    </div >
  )

}
const MemoizedApp = React.memo(App);
export default MemoizedApp;
