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

  //Redux-specific Hooks refer https://react-redux.js.org/next/api/hooks
  const val = useSelector(state => state.search_word);
  const showInput = useSelector(state => state.inputbox);
  const data = useSelector(state => state.arraydata);
  const title_data = useSelector(state => state.titledata);
  const dispatch = useDispatch();


  const getSearchedResults = (e) => {
    var res = mySearch.current.value;
    dispatch({ type: 'SEARCH_WORD', search_word: res });
    dispatch({ type: 'HIDE_SEARCH', inputbox: false });
    e.preventDefault();
  }


  //mimic componentDidMount() to fetch page1 data & scroll-calculation
  useEffect(() => {

    //getting Page1 data on APP-loading
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

    console.log(scr)
  }, [scr])

  //picking image src from react-custom hook
  const pick_src = (str) => {
    var index = Number(str[6]);
    return posters[index - 1];
  }

  return (
    <div>
      {window.innerWidth < 768 && data &&
        <div style={{
          maxWidth: window.innerWidth
        }}>
          < img id='nav_back' src={nav_back} />
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
