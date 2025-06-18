


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
        const res = await axios.get(`${apiUrl}/videos/recommended/${userId}`, {
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
                    url={video.s3url}
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
