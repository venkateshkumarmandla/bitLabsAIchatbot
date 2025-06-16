// import React, { useRef, useState, useEffect } from 'react';
// import ReactPlayer from 'react-player';
// import axios from 'axios';
// import {
//   FaPlay,
//   FaPause,
//   FaVolumeMute,
//   FaVolumeUp,
//   FaForward,
//   FaBackward,
// } from 'react-icons/fa';
// import { apiUrl } from '../../services/ApplicantAPIService';
// import { useUserContext } from '../common/UserProvider';

// const VerifiedVideos = () => {
//   const playerRef = useRef(null);
//   const [videoList, setVideoList] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [playing, setPlaying] = useState(true);
//   const [muted, setMuted] = useState(true);
//   const [volume, setVolume] = useState(0.5);
//   const [playedSeconds, setPlayedSeconds] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [seeking, setSeeking] = useState(false);
//   const [playbackRate, setPlaybackRate] = useState(1);
//     const { user } = useUserContext();
//     const userId = user.id;

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

// useEffect(() => {
//   const fetchVideos = async () => {
//     try {
//       const jwtToken = localStorage.getItem('jwtToken'); // get token from localStorage

//       const res = await axios.get(`${apiUrl}/videos/by-applicant/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${jwtToken}`, // add token to headers
//         },
//       });

//       if (res.data.length > 0) {
//         setVideoList(res.data);
//       }
//     } catch (err) {
//       console.error('Error fetching videos:', err);
//     }
//   };

//   fetchVideos();
// }, []);


//   const handleSeekChange = (e) => {
//     const newTime = parseFloat(e.target.value);
//     setPlayedSeconds(newTime);
//     playerRef.current.seekTo(newTime, 'seconds');
//   };

//   const skipTime = (sec) => {
//     const currentTime = playerRef.current.getCurrentTime();
//     const newTime = currentTime + sec;
//     playerRef.current.seekTo(newTime, 'seconds');
//     setPlayedSeconds(newTime);
//   };

//   const changeSpeed = (rate) => setPlaybackRate(rate);

//   const goToVideo = (index) => {
//     setCurrentIndex(index);
//     setPlayedSeconds(0);
//   };

//   const currentVideo = videoList[currentIndex];

//   const [watchLogged, setWatchLogged] = useState(false);


//   useEffect(() => {
//   if (!currentVideo || watchLogged) return;

//   const percentWatched = (playedSeconds / duration) * 100;

//   if (percentWatched >= 70) {
//     const logWatched = async () => {
//       try {
//         const jwtToken = localStorage.getItem("jwtToken");

//         await axios.post(
//           `${apiUrl}/api/videos/watch`,
//           {
//             applicantId: userId,
//             videoId: currentVideo.videoId, // ensure this is the correct property
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${jwtToken}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         setWatchLogged(true); // prevent multiple API calls
//         console.log("Watch recorded at 70%+");
//       } catch (err) {
//         console.error("Failed to log watch:", err);
//       }
//     };

//     logWatched();
//   }
// }, [playedSeconds, duration, watchLogged, currentVideo, userId]);


//   return (
//     <div style={styles.container}>
//       {currentVideo ? (
//         <>
//           <h2 style={styles.title}>{currentVideo.title}</h2>
//           {/* <p style={styles.tags}>Tags: {currentVideo.tags}</p> */}

//           <div style={styles.playerWrapper}>
//             <ReactPlayer
//               ref={playerRef}
//               url={currentVideo.s3Url}
//               playing={playing}
//               muted={muted}
//               volume={volume}
//               controls={false}
//               playbackRate={playbackRate}
//               width="100%"
//               height="100%"
//               onProgress={({ playedSeconds }) => !seeking && setPlayedSeconds(playedSeconds)}
//               onDuration={(d) => setDuration(d)}
//             />
//           </div>

//           <div style={styles.controls}>
//             <button onClick={() => skipTime(-10)}><FaBackward /></button>
//             <button onClick={() => setPlaying(!playing)}>
//               {playing ? <FaPause /> : <FaPlay />}
//             </button>
//             <button onClick={() => skipTime(10)}><FaForward /></button>
//             <button onClick={() => setMuted(!muted)}>
//               {muted ? <FaVolumeMute /> : <FaVolumeUp />}
//             </button>
//             <input
//               type="range"
//               min={0}
//               max={1}
//               step={0.1}
//               value={volume}
//               onChange={(e) => setVolume(parseFloat(e.target.value))}
//               style={styles.volumeSlider}
//             />
//           </div>

//           <div style={styles.seekBarContainer}>
//             <input
//               type="range"
//               min={0}
//               max={duration}
//               step={0.1}
//               value={playedSeconds}
//               onMouseDown={() => setSeeking(true)}
//               onChange={handleSeekChange}
//               onMouseUp={() => setSeeking(false)}
//               style={styles.seekBar}
//             />
//             <div style={styles.timer}>
//               {formatTime(playedSeconds)} / {formatTime(duration)}
//             </div>
//           </div>

//           <div style={styles.speedControl}>
//             {[0.5, 1, 1.5, 2].map((rate) => (
//               <button
//                 key={rate}
//                 onClick={() => changeSpeed(rate)}
//                 style={{
//                   ...styles.speedButton,
//                   backgroundColor: playbackRate === rate ? '#ff0000' : '#333',
//                 }}
//               >
//                 {rate}x
//               </button>
//             ))}
//           </div>

//           <div style={styles.navigation}>
//             <button
//               onClick={() => goToVideo(currentIndex - 1)}
//               disabled={currentIndex === 0}
//               style={styles.navButton}
//             >
//               ⬅ Previous
//             </button>
//             <button
//               onClick={() => goToVideo(currentIndex + 1)}
//               disabled={currentIndex === videoList.length - 1}
//               style={styles.navButton}
//             >
//               Next ➡
//             </button>
//           </div>

//           <div style={styles.dots}>
//             {videoList.map((_, index) => (
//               <span
//                 key={index}
//                 onClick={() => goToVideo(index)}
//                 style={{
//                   ...styles.dot,
//                   color: index === currentIndex ? '#ff0000' : 'gray',
//                 }}
//               >
//                 ●
//               </span>
//             ))}
//           </div>
//         </>
//       ) : (
//         <p style={{ textAlign: 'center', marginTop: '50px', color: '#fff' }}>Loading video...</p>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: '800px',
//     margin: 'auto',
//     padding: '20px',
//     backgroundColor: '#121212',
//     color: '#fff',
//     borderRadius: '10px',
//   },
//   title: {
//     fontSize: '22px',
//     textAlign: 'center',
//   },
//   tags: {
//     textAlign: 'center',
//     fontStyle: 'italic',
//     marginBottom: '10px',
//     color: '#bbb',
//   },
//   playerWrapper: {
//     position: 'relative',
//     // paddingTop: '56.25%',
//     marginBottom: '20px',
//   },
//   controls: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: '15px',
//     marginBottom: '15px',
//   },
//   volumeSlider: {
//     width: '100px',
//   },
//   seekBarContainer: {
//     textAlign: 'center',
//     marginBottom: '10px',
//   },
//   seekBar: {
//     width: '80%',
//   },
//   timer: {
//     marginTop: '5px',
//     color: '#aaa',
//   },
//   speedControl: {
//     textAlign: 'center',
//     marginBottom: '15px',
//   },
//   speedButton: {
//     margin: '0 5px',
//     padding: '5px 10px',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   },
//   navigation: {
//     textAlign: 'center',
//     marginBottom: '15px',
//   },
//   navButton: {
//     margin: '0 10px',
//     padding: '6px 12px',
//     backgroundColor: '#ff0000',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//   },
//   dots: {
//     textAlign: 'center',
//     fontSize: '24px',
//   },
//   dot: {
//     cursor: 'pointer',
//     margin: '0 5px',
//   },
// };

// export default VerifiedVideos;




// import React, { useRef, useState, useEffect } from 'react';
// import ReactPlayer from 'react-player';
// import axios from 'axios';
// import {
//   FaPlay,
//   FaPause,
//   FaVolumeMute,
//   FaVolumeUp,
//   FaForward,
//   FaBackward,
// } from 'react-icons/fa';
// import { apiUrl } from '../../services/ApplicantAPIService';
// import { useUserContext } from '../common/UserProvider';

// const VerifiedVideos = () => {
//   const playerRef = useRef(null);
//   const [videoList, setVideoList] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [playing, setPlaying] = useState(true);
//   const [muted, setMuted] = useState(true);
//   const [volume, setVolume] = useState(0.5);
//   const [playedSeconds, setPlayedSeconds] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [seeking, setSeeking] = useState(false);
//   const [playbackRate, setPlaybackRate] = useState(1);
//   const [watchLogged, setWatchLogged] = useState(false);
//   const [videoReady, setVideoReady] = useState(false);

//   const { user } = useUserContext();
//   const userId = user.id;

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   const extractVideoIdFromUrl = (url) => {
//     try {
//       const path = new URL(url).pathname;
//       const parts = path.split('/');
//       const filename = parts[parts.length - 1];
//       const videoId = filename.split('.')[0];
//       return videoId;
//     } catch (e) {
//       console.error("Failed to extract videoId from URL:", url);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const jwtToken = localStorage.getItem('jwtToken');
//         const res = await axios.get(`${apiUrl}/videos/by-applicant/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${jwtToken}`,
//           },
//         });

//         if (res.data.length > 0) {
//           setVideoList(res.data);
//         }
//       } catch (err) {
//         console.error('Error fetching videos:', err);
//       }
//     };

//     fetchVideos();
//   }, [userId]);

//   const handleSeekChange = (e) => {
//     const newTime = parseFloat(e.target.value);
//     setPlayedSeconds(newTime);
//     playerRef.current.seekTo(newTime, 'seconds');
//   };

//   const skipTime = (sec) => {
//     const currentTime = playerRef.current.getCurrentTime();
//     const newTime = currentTime + sec;
//     playerRef.current.seekTo(newTime, 'seconds');
//     setPlayedSeconds(newTime);
//   };

//   const changeSpeed = (rate) => setPlaybackRate(rate);

//   const goToVideo = (index) => {
//     setCurrentIndex(index);
//     setPlayedSeconds(0);
//     setWatchLogged(false);
//     setVideoReady(false);
//   };

//   const currentVideo = videoList[currentIndex];

//   useEffect(() => {
//     if (!currentVideo || watchLogged) return;

//     const percentWatched = (playedSeconds / duration) * 100;

//     if (percentWatched >= 70) {
//       const logWatched = async () => {
//         try {
//           const jwtToken = localStorage.getItem("jwtToken");
//           const videoIdFromUrl = extractVideoIdFromUrl(currentVideo.s3Url);

//           await axios.post(
//             `${apiUrl}/api/videos/watch`,
//             {
//               applicantId: userId,
//               videoId: videoIdFromUrl,
//             },
//             {
//               headers: {
//                 Authorization: `Bearer ${jwtToken}`,
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//           setWatchLogged(true);
//           console.log("Watch recorded at 70%+");
//         } catch (err) {
//           console.error("Failed to log watch:", err);
//         }
//       };

//       logWatched();
//     }
//   }, [playedSeconds, duration, watchLogged, currentVideo, userId]);

//   return (
//     <div style={styles.container}>
//       {currentVideo ? (
//         <>
//           <h2 style={styles.title}>{currentVideo.title}</h2>

//           <div style={styles.playerWrapper}>
//             {!videoReady && (
//               <p style={{ textAlign: 'center', color: '#bbb' }}>Loading video...</p>
//             )}
//             <ReactPlayer
//               ref={playerRef}
//               url={currentVideo.s3Url}
//               playing={playing}
//               muted={muted}
//               volume={volume}
//               controls={false}
//               playbackRate={playbackRate}
//               width="100%"
//               height="100%"
//               onProgress={({ playedSeconds }) => !seeking && setPlayedSeconds(playedSeconds)}
//               onDuration={(d) => setDuration(d)}
//               onReady={() => setVideoReady(true)}
//             />
//           </div>

//           <div style={styles.controls}>
//             <button onClick={() => skipTime(-10)}><FaBackward /></button>
//             <button onClick={() => setPlaying(!playing)}>
//               {playing ? <FaPause /> : <FaPlay />}
//             </button>
//             <button onClick={() => skipTime(10)}><FaForward /></button>
//             <button onClick={() => setMuted(!muted)}>
//               {muted ? <FaVolumeMute /> : <FaVolumeUp />}
//             </button>
//             <input
//               type="range"
//               min={0}
//               max={1}
//               step={0.1}
//               value={volume}
//               onChange={(e) => setVolume(parseFloat(e.target.value))}
//               style={styles.volumeSlider}
//             />
//           </div>

//           <div style={styles.seekBarContainer}>
//             <input
//               type="range"
//               min={0}
//               max={duration}
//               step={0.1}
//               value={playedSeconds}
//               onMouseDown={() => setSeeking(true)}
//               onChange={handleSeekChange}
//               onMouseUp={() => setSeeking(false)}
//               style={styles.seekBar}
//             />
//             <div style={styles.timer}>
//               {formatTime(playedSeconds)} / {formatTime(duration)}
//             </div>
//           </div>

//           <div style={styles.speedControl}>
//             {[0.5, 1, 1.5, 2].map((rate) => (
//               <button
//                 key={rate}
//                 onClick={() => changeSpeed(rate)}
//                 style={{
//                   ...styles.speedButton,
//                   backgroundColor: playbackRate === rate ? '#ff0000' : '#333',
//                 }}
//               >
//                 {rate}x
//               </button>
//             ))}
//           </div>

//           <div style={styles.navigation}>
//             <button
//               onClick={() => goToVideo(currentIndex - 1)}
//               disabled={currentIndex === 0}
//               style={styles.navButton}
//             >
//               ⬅ Previous
//             </button>
//             <button
//               onClick={() => goToVideo(currentIndex + 1)}
//               disabled={currentIndex === videoList.length - 1}
//               style={styles.navButton}
//             >
//               Next ➡
//             </button>
//           </div>

//           <div style={styles.dots}>
//             {videoList.map((_, index) => (
//               <span
//                 key={index}
//                 onClick={() => goToVideo(index)}
//                 style={{
//                   ...styles.dot,
//                   color: index === currentIndex ? '#ff0000' : 'gray',
//                 }}
//               >
//                 ●
//               </span>
//             ))}
//           </div>
//         </>
//       ) : (
//         <p style={{ textAlign: 'center', marginTop: '50px', color: '#fff' }}>Loading video list...</p>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: '800px',
//     margin: 'auto',
//     padding: '20px',
//     backgroundColor: '#121212',
//     color: '#fff',
//     borderRadius: '10px',
//   },
//   title: {
//     fontSize: '22px',
//     textAlign: 'center',
//   },
//   playerWrapper: {
//     position: 'relative',
//     marginBottom: '20px',
//   },
//   controls: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: '15px',
//     marginBottom: '15px',
//   },
//   volumeSlider: {
//     width: '100px',
//   },
//   seekBarContainer: {
//     textAlign: 'center',
//     marginBottom: '10px',
//   },
//   seekBar: {
//     width: '80%',
//   },
//   timer: {
//     marginTop: '5px',
//     color: '#aaa',
//   },
//   speedControl: {
//     textAlign: 'center',
//     marginBottom: '15px',
//   },
//   speedButton: {
//     margin: '0 5px',
//     padding: '5px 10px',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   },
//   navigation: {
//     textAlign: 'center',
//     marginBottom: '15px',
//   },
//   navButton: {
//     margin: '0 10px',
//     padding: '6px 12px',
//     backgroundColor: '#ff0000',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//   },
//   dots: {
//     textAlign: 'center',
//     fontSize: '24px',
//   },
//   dot: {
//     cursor: 'pointer',
//     margin: '0 5px',
//   },
// };

// export default VerifiedVideos;





import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import {
  FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaForward, FaBackward,
} from 'react-icons/fa';
import { apiUrl } from '../../services/ApplicantAPIService';
import { useUserContext } from '../common/UserProvider';

const VerifiedVideos = () => {
  const playerRef = useRef(null);
  const [videoList, setVideoList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [watchLogged, setWatchLogged] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const { user } = useUserContext();
  const userId = user.id;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const extractVideoIdFromUrl = (url) => {
    try {
      const path = new URL(url).pathname;
      const filename = path.split('/').pop();
      return filename.split('.')[0];
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const jwtToken = localStorage.getItem('jwtToken');
        const res = await axios.get(`${apiUrl}/videos/by-applicant/${userId}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (res.data?.length > 0) setVideoList(res.data);
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };
    fetchVideos();
  }, [userId]);

  const handleSeekChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setPlayedSeconds(newTime);
    playerRef.current.seekTo(newTime, 'seconds');
  };

  const skipTime = (sec) => {
    const currentTime = playerRef.current.getCurrentTime();
    const newTime = currentTime + sec;
    playerRef.current.seekTo(newTime, 'seconds');
    setPlayedSeconds(newTime);
  };

  const changeSpeed = (rate) => setPlaybackRate(rate);

  const goToVideo = (index) => {
    if (index < 0 || index >= videoList.length) return;
    setCurrentIndex(index);
    setPlayedSeconds(0);
    setWatchLogged(false);
    setVideoReady(false);
    setPlaying(false); // pause before loading
  };

  const currentVideo = videoList[currentIndex];

  useEffect(() => {
    if (!currentVideo || watchLogged || !duration) return;
    const percentWatched = (playedSeconds / duration) * 100;

    if (percentWatched >= 70) {
      const logWatched = async () => {
        try {
          const jwtToken = localStorage.getItem("jwtToken");
          const videoIdFromUrl = extractVideoIdFromUrl(currentVideo.s3Url);
          await axios.post(`${apiUrl}/api/videos/watch`, {
            applicantId: userId,
            videoId: videoIdFromUrl,
          }, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          });
          setWatchLogged(true);
          console.log("✅ Watch logged");
        } catch (err) {
          console.error("❌ Failed to log watch:", err);
        }
      };
      logWatched();
    }
  }, [playedSeconds, duration, watchLogged, currentVideo, userId]);

  return (
    <div style={styles.container}>
      {currentVideo ? (
        <>
          <h2 style={styles.title}>{currentVideo.title}</h2>
          <div style={styles.playerWrapper}>
            {!videoReady && (
              <p style={{ textAlign: 'center', color: '#bbb' }}>Loading video...</p>
            )}
            <ReactPlayer
              ref={playerRef}
              url={currentVideo.s3Url}
              playing={playing}
              muted={muted}
              volume={volume}
              controls={false}
              playbackRate={playbackRate}
              width="100%"
              height="100%"
              onProgress={({ playedSeconds }) => !seeking && setPlayedSeconds(playedSeconds)}
              onDuration={(d) => setDuration(d)}
              onReady={() => {
                setVideoReady(true);
                setPlaying(true); // auto play only when ready
              }}
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload', // prevent download icon
                    disablePictureInPicture: true, // prevent PiP
                  },
                },
              }}
            />
          </div>

          {/* Controls */}
          <div style={styles.controls}>
            <button onClick={() => skipTime(-10)}><FaBackward /></button>
            <button onClick={() => setPlaying(!playing)}>{playing ? <FaPause /> : <FaPlay />}</button>
            <button onClick={() => skipTime(10)}><FaForward /></button>
            <button onClick={() => setMuted(!muted)}>{muted ? <FaVolumeMute /> : <FaVolumeUp />}</button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={styles.volumeSlider}
            />
          </div>

          {/* Seek bar */}
          <div style={styles.seekBarContainer}>
            <input
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={playedSeconds}
              onMouseDown={() => setSeeking(true)}
              onChange={handleSeekChange}
              onMouseUp={() => setSeeking(false)}
              style={styles.seekBar}
            />
            <div style={styles.timer}>
              {formatTime(playedSeconds)} / {formatTime(duration)}
            </div>
          </div>

          {/* Speed control */}
          <div style={styles.speedControl}>
            {[0.5, 1, 1.5, 2].map((rate) => (
              <button
                key={rate}
                onClick={() => changeSpeed(rate)}
                style={{
                  ...styles.speedButton,
                  backgroundColor: playbackRate === rate ? '#ff0000' : '#333',
                }}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div style={styles.navigation}>
            <button
              onClick={() => goToVideo(currentIndex - 1)}
              disabled={currentIndex === 0}
              style={styles.navButton}
            >
              ⬅ Previous
            </button>
            <button
              onClick={() => goToVideo(currentIndex + 1)}
              disabled={currentIndex === videoList.length - 1}
              style={styles.navButton}
            >
              Next ➡
            </button>
          </div>

          {/* Dot navigation */}
          <div style={styles.dots}>
            {videoList.map((_, index) => (
              <span
                key={index}
                onClick={() => goToVideo(index)}
                style={{
                  ...styles.dot,
                  color: index === currentIndex ? '#ff0000' : 'gray',
                }}
              >
                ●
              </span>
            ))}
          </div>
        </>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '50px', color: '#fff' }}>Loading video list...</p>
      )}
    </div>
  );
};


const styles = {
  container: {
    maxWidth: '800px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#121212',
    color: '#fff',
    borderRadius: '10px',
  },
  title: {
    fontSize: '22px',
    textAlign: 'center',
  },
  playerWrapper: {
    position: 'relative',
    marginBottom: '20px',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px',
  },
  volumeSlider: {
    width: '100px',
  },
  seekBarContainer: {
    textAlign: 'center',
    marginBottom: '10px',
  },
  seekBar: {
    width: '80%',
  },
  timer: {
    marginTop: '5px',
    color: '#aaa',
  },
  speedControl: {
    textAlign: 'center',
    marginBottom: '15px',
  },
  speedButton: {
    margin: '0 5px',
    padding: '5px 10px',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  navigation: {
    textAlign: 'center',
    marginBottom: '15px',
  },
  navButton: {
    margin: '0 10px',
    padding: '6px 12px',
    backgroundColor: '#ff0000',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  dots: {
    textAlign: 'center',
    fontSize: '24px',
  },
  dot: {
    cursor: 'pointer',
    margin: '0 5px',
  },
};

export default VerifiedVideos;

