



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
// useEffect(() => {
//   if (!currentVideo || watchLogged) return;

//   const percentWatched = (playedSeconds / duration) * 100;

//   if (percentWatched >= 70) {
//     const logWatched = async () => {
//       try {
//         const jwtToken = localStorage.getItem("jwtToken");

//         // ✅ Use videoId from currentVideo instead of extracting from URL
//         const videoId = currentVideo.videoId;

//         await axios.post(
//           `${apiUrl}/api/video-watch/track`,
//           {
//             applicantId: userId,
//             videoId: videoId,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${jwtToken}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         setWatchLogged(true);
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

// import React, { useEffect, useState } from 'react';
// import ReactPlayer from 'react-player';
// import axios from 'axios';
// import { apiUrl } from '../../services/ApplicantAPIService';
// import { useUserContext } from '../common/UserProvider';

// const VerifiedVideos = () => {
//   const { user } = useUserContext();
//   const userId = user.id;

//   const [videoList, setVideoList] = useState([]);
//   const [playingIndex, setPlayingIndex] = useState(null);
//   const [watchedVideos, setWatchedVideos] = useState({});

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

//   const handleEnded = async (videoId) => {
//     if (watchedVideos[videoId]) return; // Avoid re-sending for already watched

//     try {
//       const jwtToken = localStorage.getItem('jwtToken');
//       await axios.post(
//         `${apiUrl}/api/video-watch/track`,
//         {
//           applicantId: userId,
//           videoId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${jwtToken}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       setWatchedVideos((prev) => ({ ...prev, [videoId]: true }));
//       console.log(`Watched logged for videoId ${videoId}`);
//     } catch (err) {
//       console.error('Failed to log watch:', err);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>
//         Check Our <span style={{ color: 'orange' }}>Reviews</span>
//       </h2>

//       <div style={styles.grid}>
//         {videoList.map((video, index) => (
//           <div key={video.videoId || index} style={styles.card}>
//             <div style={styles.playerWrapper}>
//               <ReactPlayer
//                 url={video.s3Url}
//                 playing={playingIndex === index}
//                 controls
//                 muted
//                 width="100%"
//                 height="200px"
//                 light={true}
//                 onClickPreview={() => setPlayingIndex(index)}
//                 onEnded={() => handleEnded(video.videoId)}
//               />
//             </div>
//             <p style={styles.caption}>
//               {video.title || `Video ${index + 1}`}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: '1200px',
//     margin: '0 auto',
//     padding: '40px 20px',
//     fontFamily: 'sans-serif',
//   },
//   heading: {
//     textAlign: 'center',
//     fontSize: '26px',
//     marginBottom: '30px',
//     fontWeight: 'bold',
//   },
//   grid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//     gap: '30px',
//   },
//   card: {
//     textAlign: 'center',
//   },
//   playerWrapper: {
//     borderRadius: '10px',
//     overflow: 'hidden',
//     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
//   },
//   caption: {
//     marginTop: '10px',
//     fontWeight: 'bold',
//     color: '#333',
//   },
// };

// export default VerifiedVideos;





import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { apiUrl } from '../../services/ApplicantAPIService';
import { useUserContext } from '../common/UserProvider';

const VerifiedVideos = () => {
  const { user } = useUserContext();
  const userId = user.id;

  const [videoList, setVideoList] = useState([]);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [watchedVideos, setWatchedVideos] = useState({});
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef(null);

  const videosPerPage = 3;
  const totalDots = Math.ceil(videoList.length / videosPerPage);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const jwtToken = localStorage.getItem('jwtToken');
        const res = await axios.get(`${apiUrl}/videos/by-applicant/${userId}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (res.data.length > 0) {
          setVideoList(res.data);
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };

    fetchVideos();
  }, [userId]);

  const handleEnded = async (videoId) => {
    if (watchedVideos[videoId]) return;

    try {
      const jwtToken = localStorage.getItem('jwtToken');
      await axios.post(
        `${apiUrl}/api/video-watch/track`,
        { applicantId: userId, videoId },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setWatchedVideos((prev) => ({ ...prev, [videoId]: true }));
    } catch (err) {
      console.error('Failed to log watch:', err);
    }
  };

  const scrollToDot = (dotIndex) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollX = dotIndex * container.offsetWidth;
    container.scrollTo({ left: scrollX, behavior: 'smooth' });
    setActiveDot(dotIndex);
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    const newIndex = Math.round(container.scrollLeft / container.offsetWidth);
    setActiveDot(newIndex);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        Check Our <span style={{ color: 'orange' }}>Videos</span>
      </h2>

      <div style={styles.carouselContainer}>
        <button
          onClick={() => scrollToDot(activeDot - 1)}
          style={{ ...styles.sideButton, left: 0 }}
          disabled={activeDot === 0}
        >
          ◀
        </button>

        <div style={styles.scrollWrapper}>
          <div style={styles.scrollContainer} ref={scrollRef} onScroll={handleScroll}>
            {videoList.map((video, index) => (
              <div key={video.videoId || index} style={styles.card}>
                <div style={styles.playerWrapper}>
                  <ReactPlayer
                    url={video.s3Url}
                    playing={playingIndex === index}
                    controls
                    muted
                    width="100%"
                    height="200px"
                    light={true}
                    onClickPreview={() => setPlayingIndex(index)}
                    onEnded={() => handleEnded(video.videoId)}
                  />
                </div>
                <p style={styles.caption}>{video.title || `Video ${index + 1}`}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => scrollToDot(activeDot + 1)}
          style={{ ...styles.sideButton, right: 0 }}
          disabled={activeDot === totalDots - 1}
        >
          ▶
        </button>
      </div>

      <div style={styles.dotsContainer}>
        {Array.from({ length: totalDots }).map((_, index) => (
          <span
            key={index}
            style={{
              ...styles.dot,
              backgroundColor: activeDot === index ? '#ff9800' : '#ccc',
            }}
            onClick={() => scrollToDot(index)}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'sans-serif',
    position: 'relative',
  },
  heading: {
    textAlign: 'center',
    fontSize: '26px',
    marginBottom: '30px',
    fontWeight: 'bold',
  },
  carouselContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  scrollWrapper: {
    overflow: 'hidden',
    width: '100%',
  },
  scrollContainer: {
    display: 'flex',
    overflowX: 'scroll',
    scrollBehavior: 'smooth',
    gap: '20px',
    padding: '10px 0',
    scrollbarWidth: 'none',
  },
  card: {
    minWidth: '300px',
    flex: '0 0 auto',
    textAlign: 'center',
  },
  playerWrapper: {
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  caption: {
    marginTop: '10px',
    fontWeight: 'bold',
    color: '#333',
  },
  sideButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#ff9800',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    padding: '10px 14px',
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: 10,
  },
  dotsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    gap: '10px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default VerifiedVideos;
