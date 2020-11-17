import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';//using react-redux hooks for redux implimentation
import nav_back from '../src/Assets/nav_bar.png';
import '../src/Css/Page_css.css';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Paper, Grid, Typography, Divider } from '@material-ui/core';
import Posters from '../src/Components/Posters';

const App = () => {

  //React-specific Hooks
  const [scr, setScr] = useState(null);
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
  const dispatch = useDispatch();


  const getSearchedResults = (e) => {
    var res = mySearch.current.value;
    dispatch({ type: 'SEARCH_WORD', search_word: res });
    dispatch({ type: 'HIDE_SEARCH', inputbox: false });
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
    console.log(data)
    console.log(title_data)
  }, [data, title_data])

  useEffect(() => {

    //hide search box if user scrolls , when saerch box is open , without typing anything
    if (!val && showInput && scr)
      dispatch({ type: 'HIDE_SEARCH', inputbox: false });


    if (scr) {
      var el = document.querySelector("div[id='movie_grid_block']");

      if (el) {

        //Load and append PAGE2 data and run the fetch() method only once after users scrolls 60% threshold scrollheight
        if (!page2append && el.getBoundingClientRect().y < 0 && Math.abs(el.getBoundingClientRect().y) > (0.6 * el.getBoundingClientRect().height)) {
          const myPromise = fetch("/CONTENTLISTINGPAGE-PAGE2.json", {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          myPromise.then(res => res.json()).then(json => dispatch({ type: 'GET_RENEWED_ARRAY_DATA_AFTER_PAGE2_ADDITION', arraydata: data.concat(json.page["content-items"].content), titledata: json.page.title }));
          dispatch({ type: 'PAGE2_DATA_FETCHED_AND_APPENDED', page2Append: true });
        }

        //Load and append PAGE3 data and run the fetch() method only once after users scrolls 65% threshold of new scrollheight
        if (!page3append && page2append && el.getBoundingClientRect().y < 0 && Math.abs(el.getBoundingClientRect().y) > (0.65 * el.getBoundingClientRect().height)) {
          const myPromise = fetch("/CONTENTLISTINGPAGE-PAGE3.json", {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          myPromise.then(res => res.json()).then(json => dispatch({ type: 'GET_RENEWED_ARRAY_DATA_AFTER_PAGE3_ADDITION', arraydata: data.concat(json.page["content-items"].content), titledata: json.page.title }));
          dispatch({ type: 'PAGE3_DATA_FETCHED_AND_APPENDED', page3Append: true });
        }

      }

    }
  }, [scr])


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


  return (
    <div>
      {window.innerWidth > 768 && <span id='open_desk_msg'>Switch to Mobile Device</span>}
      {window.innerWidth < 768 && data &&
        <div className='home' style={{
          maxWidth: window.innerWidth
        }}>
          < img alt='header_background' id='nav_back' src={nav_back} />
          {
            !showInput && <SearchIcon onClick={() => {
              { dispatch({ type: 'SHOW_SEARCH', inputbox: true }) }
            }} id='searchIcon' />
          }
          <span><ArrowBackIcon id='backIcon' /><Typography className='title_typo'>{!showInput && title_data}</Typography></span>
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
            data &&
            <div id='movie_grid_block'>
              <Grid className='card_deck' container>
                {
                  data.map(item =>
                    <Grid item xs={4}>
                      <img alt='posters' style={{ width: ((window.innerWidth - 60) / 3), height: '200px' }} src={pick_src(item["poster-image"])} />
                      <p id='poster_info'>{item.name}</p>
                      <Divider id='divider' />
                    </Grid>
                  )
                }

              </Grid>
            </div>
          }


        </div>
      }
    </div >
  )

}
const MemoizedApp = React.memo(App);
export default MemoizedApp;
