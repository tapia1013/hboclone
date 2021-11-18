import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { shuffleArray } from '../../utilities';
import Link from 'next/link';



const MediaRow = (props) => {
  const [loadingData, setLoadingData] = useState(true);
  const [movies, setMoviesData] = useState([])




  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/${props.endpoint}&api_key=c1b0e735ad3ff470f44fa29c9a1e6189`)
      .then(function (response) {
        // console.log(response.data.results);
        // list of movies from api
        setMoviesData(shuffleArray(response.data.results))
        setLoadingData(false);

        console.log('Success Response For ' + props.title);
        console.log(response);
      })
      .catch(function (error) {
        console.log('Error Response For ' + props.title);
        console.log(error);
      })
  }, []);

  const loopComp = (comp, digit) => {
    let thumbnails = [];
    for (let i = 0; i < digit; i++) {
      thumbnails.push(comp)
    }
    return thumbnails;
  }

  // showing the thumbnails
  const showThumbnails = (type) => {
    return loadingData
      ? loopComp((<Skeleton />), 10)
      : movies.map((movie) => {
        return <Thumbnail movieData={movie} type={type} />
      })
  }





  return (
    <div className={`media-row ${props.type}`}>
      <h3 className='media-row__title'>{props.title}</h3>
      <div className='media-row__thumbnails'>

        {showThumbnails(props.type)}

        {/* {
          loopComp((<Thumbnail />), 10)
        } */}
      </div>
    </div>
  )
}


const Thumbnail = (props) => {
  const thumbSize = (type) => {
    if (props.type === 'large-v') {
      return '400';
    }
    if (type === 'small-v') {
      return '185';
    }
    if (type === 'large-h') {
      return '500';
    }
    if (type === 'small-h') {
      return '342';
    }
  }

  return (
    <Link href={`/movie/${props.movieData.id}`}>
      <a>
        <div className="media-row__thumbnail">
          <img src={`https://image.tmdb.org/t/p/w${thumbSize(props.type)}/${props.movieData.poster_path} `} />
          <div className="media-row__top-layer">
            <i className="fas fa-play" />
          </div>
        </div>
      </a>
    </Link>

  )
}


const Skeleton = () => {
  return (
    <div className="media-row__thumbnail-skeleton">
      <div className="media-row__thumbnail-skeleton-img"></div>
    </div>
  )
}



export default MediaRow;
