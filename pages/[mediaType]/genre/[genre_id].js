import Head from 'next/head';
import React, { useEffect } from 'react';
import { useStateContext } from '../../../components/HBOProvider';
import Login from '../../../components/UI/Login/Login';
import { useRouter } from 'next/router';
import LazyLoad from 'react-lazyload';
import MainLayout from '../../../components/Layouts/MainLayout';
import FeaturedMedia from '../../../components/UI/FeaturedMedia/FeaturedMedia';
import MediaRow from '../../../components/UI/MediaRow/MediaRow';
import AuthCheck from '../../../components/AuthCheck';
import Placeholders from '../../../components/UI/Placeholders/Placeholders';
import GenreNav from '../../../components/UI/GenreNav/GenreNav';
import axios from 'axios';
import { shuffleArray } from '../../../components/utilities';





export default function MediaTypePage(props) {
  // this allows us to start using the context in HBOProvider
  const globalState = useStateContext();
  // we have to instantiate useRouter
  const router = useRouter();




  // show random media for mediatype movies under featuredMedia
  const showRandomMedia = () => {
    let thumbType;

    return props.genresData.map((item, index) => {
      // give first index of the shuffled array
      thumbType = shuffleArray(globalState.thumbTypes)[0];

      return (
        <div key={item.id}>
          <LazyLoad
            offset={-200}
            placeholder={<Placeholders title={item.name} type={thumbType} />}
          >
            <MediaRow
              updateData={props.query.genre_id}
              title={item.name}
              type={thumbType}
              endpoint={`discover/${props.query.mediaType}?with_genres=${props.query.genre_id}&sort_by=popularity.desc&primary_release_year=2021&page=${index + 1}`}
            />
          </LazyLoad>
        </div>
      )
    })
  }




  return AuthCheck(
    <MainLayout>
      <FeaturedMedia
        mediaUrl={`https://image.tmdb.org/t/p/w1280${props.featuredData.backdrop_path}`}
        title={props.query.mediaType === 'movie' ? props.featuredData.title : props.featuredData.name}
        linkUrl={`/${props.query.mediaType}/${props.featuredData.id}`}
        type="single"
        mediaType={props.query.mediaType}
        mediaId={props.featuredData.id}
      />

      <GenreNav mediaType={props.query.mediaType} genresData={props.genresData} />
      {showRandomMedia()}
    </MainLayout>
  );
}





export async function getServerSideProps(context) {
  let genresData;
  let featuredData;

  try {
    genresData = await axios.get(`https://api.themoviedb.org/3/genre/${context.query.mediaType}/list?api_key=c1b0e735ad3ff470f44fa29c9a1e6189`);

    featuredData = await axios.get(`https://api.themoviedb.org/3/discover/${context.query.mediaType}?primary_release_year=2021&with_genres=${context.query.genre_id}&api_key=c1b0e735ad3ff470f44fa29c9a1e6189`);

    console.log("genresData");
    console.log(genresData.data);
  } catch (error) {
    console.log("Error");
    console.log(error);
  }

  console.log(genresData);


  return {
    props: {
      genresData: genresData.data.genres,
      featuredData: shuffleArray(featuredData.data.results)[0],
      query: context.query,
    }
  };
}


