import React, { useEffect, useState } from "react";
import MovieList from "./components/MovieList";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MovieHeading from "./components/MovieHeading";
import SearchBox from "./components/SearchBox";
import AddtoWatchList from "./components/AddtoWatchList";
import RemovefromWatchList from "./components/RemovefromWatchList";
import MovieList2 from "./components/MovieList2";
import { auth } from "./config/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  db,
  AddShowtoFirestoreWatchList,
  RemoveShowfromFirestoreWatchList,
  AddShowtoFirestoreWatchedList,
  RemoveShowfromFirestoreWatchedList,
} from "./config/firebase";
import {
  getDocs,
  collection,
  getFirestore,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import "./navbarbuttons.css";

const TVApp = () => {
  const [shows, setShows] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [watched, setWatched] = useState([]);
  const navigate = useNavigate();
  const users = collection(db, "Users");

  const getMovieRequest = async (searchValue) => {
    const url = `https://api.themoviedb.org/3/search/tv?api_key=f46cc141482b65a1ce4af7ceec09ccd5&language=en-US&page=1&include_adult=false&query=${searchValue}`;

    const Showresponse = await fetch(url);
    const responseJson = await Showresponse.json();
    if (!responseJson.errors) {
      setShows(responseJson.results);
    }
  };
  useEffect(() => {
    getMovieRequest(searchValue);
  }, [searchValue]);

  useEffect(() => {
    FetchShowWatchList();
    FetchShowWatchedList();
    console.log(watchlist);
  }, []);

  const FetchShowWatchList = () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const db = getFirestore();
      const usersRef = collection(db, "users");
      if (user) {
        const userDocRef = doc(usersRef, user.uid);
        const subcollectionRef = collection(userDocRef, "tvwatchlist");
        const snapshot = getDocs(subcollectionRef);
        const q = query(subcollectionRef, orderBy("timestamp", "desc"));
        getDocs(q)
          .then((querySnapshot) => {
            const moviewatchlistfromfirestore = [];
            querySnapshot.forEach((doc) => {
              moviewatchlistfromfirestore.push({ ...doc.data(), id: doc.id });
              console.log(doc);
            });
            setWatchlist(moviewatchlistfromfirestore);
          })
          .catch((err) => {
            console.log(err.message);
          });

        /*const ml = getDocs(subcollectionRef)
          .then((snapshot) => {
            const tvwatchlistfromfirestore = [];
            snapshot.docs.forEach((doc) => {
              tvwatchlistfromfirestore.push({ ...doc.data(), id: doc.id });
            });
            setWatchlist(tvwatchlistfromfirestore.reverse());
          })
          .catch((err) => {
            console.log(err.message);
          });*/
      } else {
        console.log("error");
      }
      return unsubscribe;
    });
  };
  const FetchShowWatchedList = () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const db = getFirestore();
      const usersRef = collection(db, "users");
      if (user) {
        const userDocRef = doc(usersRef, user.uid);
        const subcollectionRef = collection(userDocRef, "tvwatchedlist");
        const snapshot = getDocs(subcollectionRef);
        const q = query(subcollectionRef, orderBy("timestamp", "desc"));
        getDocs(q)
          .then((querySnapshot) => {
            const moviewatchlistfromfirestore = [];
            querySnapshot.forEach((doc) => {
              moviewatchlistfromfirestore.push({ ...doc.data(), id: doc.id });
              console.log(doc);
            });
            setWatched(moviewatchlistfromfirestore);
          })
          .catch((err) => {
            console.log(err.message);
          });

        /*const ml = getDocs(subcollectionRef)
          .then((snapshot) => {
            const tvwatchlistfromfirestore = [];
            snapshot.docs.forEach((doc) => {
              tvwatchlistfromfirestore.push({ ...doc.data(), id: doc.id });
            });
            setWatched(tvwatchlistfromfirestore.reverse());
          })
          .catch((err) => {
            console.log(err.message);
          });*/
      } else {
        console.log("error");
      }
      return unsubscribe;
    });
  };
  const addtolist = (show) => {
    if (watchlist.find((s) => parseInt(s.id) === show.id)) {
      alert("This show is already in your watchlist!");
      return;
    }
    if (watched.find((s) => parseInt(s.id) === show.id)) {
      alert("This show is already in your watched list!");
      return;
    }
    const newList = [show, ...watchlist];
    setWatchlist(newList);
    AddShowtoFirestoreWatchList(show);
    console.log(watchlist);
  };
  const removefromlist = (show) => {
    const newlist = watchlist.filter((favourite) => favourite.id !== show.id);
    setWatchlist(newlist);
    RemoveShowfromFirestoreWatchList(show);
  };
  const addtowatchedlist = (show) => {
    if (watched.find((s) => parseInt(s.id) === show.id)) {
      alert("This show is already in your watched list!");
      return;
    }
    const newlist = watchlist.filter((favourite) => favourite.id !== show.id);
    setWatchlist(newlist);
    const newList = [show, ...watched];
    setWatched(newList);
    AddShowtoFirestoreWatchedList(show);
    RemoveShowfromFirestoreWatchList(show);
    console.log(watched);
  };
  const removefromwatched = (show) => {
    const newlist = watched.filter((favourite) => favourite.id !== show.id);
    setWatched(newlist);
    RemoveShowfromFirestoreWatchedList(show);
  };
  const logout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const navigatetomovies = () => {
    navigate("/movies");
  };

  const navigatetohome = () => {
    navigate("/");
  };

  const navigatetoanime = () => {
    navigate("/anime");
  };
  return (
    <div>
      <nav className="navbar">
        <div className="logodivv" onClick={navigatetohome}>
          <svg
            width="346.5"
            height="91.21367493541021"
            viewBox="0 0 369.5454545454545 97.28022789254689"
            class="css-1j8o68f"
          >
            <defs id="SvgjsDefs3648">
              <linearGradient id="SvgjsLinearGradient3653">
                <stop id="SvgjsStop3654" stop-color="#ef4136" offset="0"></stop>
                <stop id="SvgjsStop3655" stop-color="#fbb040" offset="1"></stop>
              </linearGradient>
            </defs>
            <g
              id="SvgjsG3649"
              featurekey="symbolFeature-0"
              transform="matrix(1.3891873056016855,0,0,1.3891873056016855,-14.895318228038425,-12.185921008141122)"
              fill="#ff5722"
            >
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M74.058,55.333c-0.934-0.094-1.879-0.14-2.83-0.153c0.338-0.065,0.676-0.145,1.013-0.253  c3.163-1.028,4.082-6.021,5.192-8.691c0.078-0.188,0.112-0.363,0.126-0.532c0.658-1.053,0.856-2.502,1.011-3.643  c0.602-4.466,0.343-9.303-5.151-9.856c-0.934-0.094-1.879-0.139-2.828-0.154c0.337-0.065,0.674-0.144,1.011-0.253  c3.164-1.026,4.082-6.021,5.193-8.69c0.078-0.189,0.111-0.364,0.125-0.533c0.659-1.054,0.856-2.503,1.011-3.643  c0.603-4.466,0.344-9.302-5.152-9.856c-3.745-0.377-7.671,0.029-11.436,0.073c-4.518,0.053-9.034,0.188-13.551,0.299  C38.754,9.671,29.71,9.782,20.688,9.117C20.369,9.094,20.1,9.15,19.871,9.254c-0.247-0.069-0.509-0.089-0.767-0.06  c-0.756-0.579-1.986-0.654-2.687,0.362c-1.673,2.424-5.558,3.307-5.689,6.792c-0.07,1.874,0.521,3.542,1.036,5.324  c0.755,2.612,1.098,5.594,1.315,8.291c0.025,0.313,0.118,0.59,0.251,0.83c0.101,0.783,0.656,1.496,1.676,1.497  c0.805,0.001,1.61,0.005,2.417,0.008c-0.131,0.107-0.256,0.23-0.364,0.388c-1.674,2.425-5.557,3.308-5.689,6.792  c-0.071,1.874,0.52,3.542,1.035,5.324c0.755,2.611,1.097,5.594,1.315,8.289c0.025,0.313,0.117,0.589,0.25,0.828  c0.1,0.783,0.655,1.499,1.675,1.499c0.806,0.001,1.611,0.006,2.417,0.009c-0.13,0.107-0.255,0.23-0.364,0.388  c-1.673,2.426-5.556,3.307-5.688,6.792c-0.071,1.873,0.52,3.541,1.035,5.323c0.756,2.611,1.097,5.595,1.314,8.29  c0.025,0.314,0.118,0.59,0.251,0.83c0.101,0.782,0.656,1.497,1.675,1.497c13.338,0.011,26.675,0.349,40.014,0.224  c3.423-0.033,6.847-0.11,10.268-0.224c2.145-0.07,4.232,0.185,6.313-0.491c3.163-1.027,4.082-6.021,5.192-8.689  c0.079-0.189,0.112-0.364,0.126-0.533c0.658-1.054,0.856-2.503,1.01-3.643C79.812,60.724,79.553,55.887,74.058,55.333z   M49.957,32.539c-0.509,0.013-1.018,0.026-1.526,0.039c-8.613,0.212-17.233,0.314-25.834-0.25  C31.717,32.399,40.836,32.553,49.957,32.539z M20.711,32.312c-0.07,0.021-0.137,0.043-0.2,0.071  c-0.165-0.046-0.335-0.074-0.508-0.077C20.238,32.308,20.475,32.31,20.711,32.312z M50.578,55.667  c-0.503,0.014-1.006,0.026-1.507,0.039c-8.614,0.212-17.233,0.314-25.834-0.251C32.351,55.528,41.463,55.682,50.578,55.667z   M21.35,55.44c-0.07,0.021-0.137,0.043-0.2,0.071c-0.165-0.046-0.335-0.074-0.508-0.077C20.878,55.437,21.114,55.439,21.35,55.44z   M75.878,63.444c-0.049,1.043-0.218,2.06-0.486,3.067c-0.094,0.16-0.142,0.271-0.15,0.339c-0.317,0.06-0.655,0.077-0.956,0.107  c-1.941,0.191-3.911,0.181-5.859,0.187c-2.631,0.006-5.441,0.838-8.042,1.239c-3.798,0.586-7.576,1.056-11.415,1.199  c-5.69,0.215-11.391,0.197-17.063,0.723c-2.036,0.189-8.823,1.798-9.671-0.748c-1.081-3.25-0.284-7.147,0.012-10.657  c14.19,1.02,28.406,0.114,42.611-0.01c2.797-0.024,5.613-0.242,8.408-0.13C76.321,58.884,75.988,61.047,75.878,63.444z   M75.238,40.315c-0.049,1.043-0.218,2.061-0.487,3.068c-0.093,0.16-0.141,0.271-0.149,0.339c-0.318,0.06-0.654,0.077-0.956,0.106  c-1.941,0.192-3.91,0.182-5.859,0.187c-2.63,0.007-5.441,0.838-8.042,1.239c-3.798,0.585-7.576,1.056-11.415,1.2  c-5.69,0.214-11.391,0.196-17.063,0.722c-2.037,0.189-8.823,1.798-9.671-0.749c-1.081-3.249-0.283-7.146,0.012-10.656  c14.19,1.02,28.408,0.114,42.611-0.01c2.796-0.024,5.613-0.242,8.407-0.129C75.681,35.755,75.348,37.917,75.238,40.315z   M63.578,12.633c2.797-0.025,5.613-0.243,8.407-0.13c3.056,0.123,2.724,2.286,2.612,4.684c-0.048,1.044-0.216,2.06-0.485,3.068  c-0.094,0.16-0.142,0.27-0.149,0.338c-0.318,0.06-0.656,0.077-0.958,0.107c-1.94,0.192-3.91,0.182-5.858,0.187  c-2.631,0.006-5.44,0.838-8.043,1.239c-3.797,0.585-7.575,1.055-11.414,1.199c-5.69,0.215-11.39,0.197-17.064,0.723  c-2.036,0.188-8.823,1.797-9.671-0.75c-1.081-3.249-0.283-7.146,0.012-10.656C35.157,13.663,49.374,12.756,63.578,12.633z   M19.952,32.306c-0.069,0.001-0.139,0.009-0.208,0.017c-0.008-0.005-0.018-0.011-0.026-0.018  C19.796,32.305,19.875,32.305,19.952,32.306z M20.591,55.435c-0.069,0.001-0.138,0.009-0.207,0.017  c-0.008-0.006-0.017-0.011-0.025-0.017C20.436,55.435,20.514,55.435,20.591,55.435z"
              ></path>
            </g>
            <g
              id="SvgjsG3650"
              featurekey="nameFeature-0"
              transform="matrix(1.7839930766981846,0,0,1.7839930766981846,115,2.8042306837071678)"
              fill="url(#SvgjsLinearGradient3653)"
            >
              <path d="M15.68 11.440000000000001 l3.84 0 l-3.72 28.56 l-3.96 0 l-2 -14.32 l-1.88 14.32 l-3.96 0 l-4 -28.56 l3.84 0 l2.08 14.72 l1.92 -14.72 l3.84 0 l2.08 14.72 z M29.147000000000002 40 l-1.44 -9.88 l-4.04 0 l-1.32 9.88 l-3.84 0 l4.32 -28.6 l5.16 0 l5 28.6 l-3.84 0 z M24.187 26.32 l2.96 0 l-1.52 -10.4 z M45.294 11.36 l0 3.84 l-4.76 0 l0 24.84 l-3.84 0 l0 -24.84 l-5.24 0 l0 -3.84 l13.84 0 z M53.161 39.92 c-2.96 0 -5.36 -2.4 -5.36 -5.36 l0 -17.76 c0 -2.96 2.4 -5.36 5.36 -5.36 s5.36 2.4 5.36 5.36 l0 1.6 l-3.8 0 l0 -1.6 c0 -0.84 -0.72 -1.56 -1.56 -1.56 s-1.56 0.72 -1.56 1.56 l0 17.76 c0 0.84 0.72 1.56 1.56 1.56 s1.56 -0.72 1.56 -1.56 l0 -2.56 l3.8 0 l0 2.56 c0 2.96 -2.4 5.36 -5.36 5.36 z M68.22800000000001 11.440000000000001 l3.8 0 l0 28.52 l-3.8 0 l0 -15.08 l-3.4 0 l0 15.08 l-3.8 0 l0 -28.52 l3.8 0 l0 9.68 l3.4 0 l0 -9.68 z M80.01500000000001 40.24 c-3.04 0 -5.48 -2.48 -5.48 -5.48 l0 -4.36 l3.88 0 l0 4.36 c0 0.88 0.72 1.6 1.6 1.6 s1.56 -0.72 1.56 -1.6 l0 -3.8 l-7.04 -9.72 l0 -4.96 c0 -3.04 2.44 -5.52 5.48 -5.52 c3 0 5.44 2.48 5.44 5.52 l0 4.32 l-3.88 0 l0 -4.32 c0 -0.92 -0.68 -1.6 -1.56 -1.6 s-1.6 0.68 -1.6 1.6 l0 3.64 l7.04 9.72 l0 5.12 c0 3 -2.44 5.48 -5.44 5.48 z M100.56200000000003 11.36 l0 3.84 l-4.76 0 l0 24.84 l-3.84 0 l0 -24.84 l-5.24 0 l0 -3.84 l13.84 0 z M110.70900000000002 40 l-1.44 -9.88 l-4.04 0 l-1.32 9.88 l-3.84 0 l4.32 -28.6 l5.16 0 l5 28.6 l-3.84 0 z M105.74900000000002 26.32 l2.96 0 l-1.52 -10.4 z M122.41600000000001 39.92 c-2.96 0 -5.36 -2.4 -5.36 -5.36 l0 -17.76 c0 -2.96 2.4 -5.36 5.36 -5.36 s5.36 2.4 5.36 5.36 l0 1.6 l-3.8 0 l0 -1.6 c0 -0.84 -0.72 -1.56 -1.56 -1.56 s-1.56 0.72 -1.56 1.56 l0 17.76 c0 0.84 0.72 1.56 1.56 1.56 s1.56 -0.72 1.56 -1.56 l0 -2.56 l3.8 0 l0 2.56 c0 2.96 -2.4 5.36 -5.36 5.36 z M138.80300000000003 39.84 l-4.2 -15.76 l-0.6 1 l0 14.88 l-3.72 0 l0 -28.52 l3.72 0 l0 6.2 l2.48 -6.2 l4.6 0 l-3.8 8.24 l5.4 20.16 l-3.88 0 z"></path>
            </g>
          </svg>
        </div>
        <button className="buttonn" onClick={navigatetomovies}>
          Movies
        </button>
        <button className=" buttonn" onClick={navigatetoanime}>
          Anime
        </button>
        <button className="buttonn " onClick={logout}>
          Logout
        </button>
      </nav>
      <div className="container-fluid movie-app">
        <div className="row d-flex align-items-center mt-4 mb-4">
          <MovieHeading heading="TV Shows" />
        </div>
        <div className="row d-flex align-items-center mt-4 mb-4">
          <SearchBox
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>
        <div className="row">
          <MovieList
            movies={shows}
            handleoverlayclick={addtolist}
            handleoverlayclick2={addtowatchedlist}
            watchlist={AddtoWatchList}
          />
        </div>
        <MovieHeading heading="Watchlist" />
      </div>
      <div className="row ml-3">
        <MovieList
          movies={watchlist}
          handleoverlayclick={removefromlist}
          handleoverlayclick2={addtowatchedlist}
          watchlist={RemovefromWatchList}
        />
      </div>
      <div className="result-card">
        <div className="poster-wrapper">
          <MovieHeading heading="Finished Watching" />
          <MovieList2
            movies={watched}
            handleremovefromwatched={removefromwatched}
          />
        </div>
      </div>
    </div>
  );
};

export default TVApp;
