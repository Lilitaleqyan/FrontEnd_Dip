import { useState, useEffect, useRef } from "react";
import AudioPlayer from "./AudioPlayer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStoredBooks } from "@/lib/storage";
import {
  Play, Pause, SkipBack, SkipForward, RotateCcw, RotateCw,
  Volume2, Star, Headphones,
} from "lucide-react";

export default function Audiobooks() {
  const audioRef = useRef(new Audio());
  const [audiobooks, setAudiobooks] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [totalTime, setTotalTime] = useState("00:00");
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastAudioUrl, setLastAudioUrl] = useState(""); // նոր՝ autoplay կառավարելու համար

  const rewind = () => {
    audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 15, 0);
  };

  const forward = () => {
    audioRef.current.currentTime = Math.min(
      audioRef.current.currentTime + 30,
      audioRef.current.duration || 0
    );
  };

  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Fetch audiobooks
  useEffect(() => {
    const fetchBooks = async () => {
      const allBooks = await getStoredBooks();
      const audiobookList = (allBooks || []).filter(
        (book) => book.category === "audiobook"
      );
      setAudiobooks(audiobookList);
      if (audiobookList.length > 0 && !currentlyPlaying) {
        setCurrentlyPlaying(audiobookList[0]);
      }
    };
    fetchBooks();
  }, []);

  // Handle currently playing
  useEffect(() => {
    const audio = audioRef.current;

    if (currentlyPlaying?.audioUrl) {
      const fileUrl = `http://localhost:8181/file${currentlyPlaying.audioUrl}`;

      // Եթե նույն աուդիոն է, ավտոմատ չնվագել
      if (lastAudioUrl === fileUrl) return;

      // Stop previous playback
      audio.pause();
      audio.currentTime = 0;
      audio.src = fileUrl;
      setLastAudioUrl(fileUrl);

      // Remove old listener
      audio.onloadedmetadata = null;

      // Start playback when metadata is loaded
      audio.onloadedmetadata = async () => {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (err) {
          console.error("Playback error:", err);
        }
      };
    }

    // Cleanup on unmount
    return () => {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    };
  }, [currentlyPlaying]);

  // Update progress
  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      setCurrentTime(formatTime(audio.currentTime));
      setTotalTime(formatTime(audio.duration));
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
    };
  }, []);

  const handlePlayPause = async () => {
    try {
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.error("Playback error:", err);
    }
  };

  const handleBookSelect = (book) => {
    setCurrentlyPlaying(book);
    setIsPlaying(true);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Աուդիոգրքեր</h1>
        <p className="text-xl text-muted-foreground">
          Լսեք ձեր սիրած գրքերը ճանապարհին ({audiobooks.length} աուդիոգիրք)
        </p>
      </div>

      {currentlyPlaying && (
        <div className="bg-gradient-to-r from-accent to-primary rounded-2xl p-8 mb-12 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <img
                src={currentlyPlaying.coverUrl}
                alt={`Աուդիոգիրք ${currentlyPlaying.title} կազմ`}
                className="w-24 h-24 rounded-xl shadow-lg"
              />
              <div>
                <h3 className="text-2xl font-bold mb-2">{currentlyPlaying.title}</h3>
                <p className="text-white/80 text-lg">{currentlyPlaying.author}</p>
                {currentlyPlaying.narrator && (
                  <p className="text-white/60 text-sm">Ընթերցում է․ {currentlyPlaying.narrator}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm mb-1">Առաջընթաց</p>
              <p className="text-xl font-semibold">{currentTime} / {totalTime}</p>
            </div>
          </div>

          <div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-center space-x-8">
              <Button variant="ghost" size="lg" onClick={rewind}>
                <SkipBack className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="lg" onClick={rewind}>
                <RotateCcw className="w-5 h-5" />
                <span className="text-sm ml-1">15վ</span>
              </Button>
              <Button
                onClick={handlePlayPause}
                className="bg-white text-accent rounded-full w-16 h-16 flex items-center justify-center text-2xl hover:bg-white/90 transition-colors shadow-lg"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </Button>
              <Button variant="ghost" size="lg" onClick={forward}>
                <RotateCw className="w-5 h-5" />
                <span className="text-sm ml-1">30վ</span>
              </Button>
              <Button variant="ghost" size="lg" onClick={forward}>
                <SkipForward className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {currentlyPlaying?.audioUrl && (
            <AudioPlayer
              track={{
                audioUrl: `http://localhost:8181/file${currentlyPlaying.audioUrl}`,
              }}
            />
          )}
        </div>
      )}

      {audiobooks.length === 0 ? (
        <div className="text-center py-12">
          <Headphones className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Աուդիոգիրքեր չեն գտնվել</h3>
          <p className="text-muted-foreground mb-4">Ներկայումս գրադարանում աուդիոգրքեր չկան</p>
          <Link href="/books">
            <Button>Անցնել սովորական գրքերին</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {audiobooks.map((book) => (
            <Card key={book.id} className="overflow-hidden shadow-md hover-lift border border-border">
              <div className="relative">
                <img src={book.coverUrl} alt={`Աուդիոգիրք ${book.title}`} className="w-full h-48 object-cover" />
                <div className="absolute top-2 right-2 bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {book.duration || "8ժ 45ր"}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Headphones className="w-4 h-4 text-accent" />
                  <span className="text-accent text-xs font-medium">Աուդիոգիրք</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-muted-foreground text-sm mb-2">{book.author}</p>
                {book.narrator && <p className="text-xs text-muted-foreground mb-3">Ընթերցում է․ {book.narrator}</p>}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex mr-2">{renderStars(book.rating)}</div>
                    <span className="text-xs text-muted-foreground">{book.rating}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleBookSelect(book)}
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Play className="w-3 h-3 mr-1" /> Լսել
                    </Button>
                    <Link href={`/book/${book.id}`}>
                      <Button size="sm" variant="outline">
                        Մանրամասներ
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
