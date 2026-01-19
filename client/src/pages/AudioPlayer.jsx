import { useRef, useState, useEffect } from "react";

const AudioPlayer = ({ track }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (track?.audioUrl) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [track]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.onloadedmetadata = () => setDuration(audio.duration);
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(err => console.error(err));
      setIsPlaying(true);
    }
  };

  const handleProgress = (e) => {
    audioRef.current.currentTime = e.target.value;
  };

  return (
    <div>
      <audio ref={audioRef} />
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
      <input type="range" min="0" max={duration} value={currentTime} onChange={handleProgress} />
      <div>{Math.floor(currentTime)} / {Math.floor(duration)} sec</div>
    </div>
  );
};

export default AudioPlayer;
