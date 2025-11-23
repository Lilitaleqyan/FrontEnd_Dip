import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStoredBooks } from "@/lib/storage";
import { 
  Play, Pause, SkipBack, SkipForward, RotateCcw, RotateCw,
  Volume2, Star, Headphones
} from "lucide-react";

export default function Audiobooks() {
  const [audiobooks, setAudiobooks] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("2:15:30");
  const [totalTime, setTotalTime] = useState("8:45:12");
  const [progress, setProgress] = useState(26);

  useEffect(() => {
    const allBooks = getStoredBooks();
    const audiobookList = allBooks.filter(book => book.category === "audiobook");
    setAudiobooks(audiobookList);
    
    if (audiobookList.length > 0 && !currentlyPlaying) {
      setCurrentlyPlaying(audiobookList[0]);
    }
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleBookSelect = (book) => {
    setCurrentlyPlaying(book);
    setIsPlaying(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Аудиокниги</h1>
        <p className="text-xl text-muted-foreground">
          Слушайте любимые книги в дороге ({audiobooks.length} аудиокниг)
        </p>
      </div>

      {/* Current Playing */}
      {currentlyPlaying && (
        <div className="bg-gradient-to-r from-accent to-primary rounded-2xl p-8 mb-12 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <img 
                src={currentlyPlaying.coverUrl} 
                alt={`Обложка аудиокниги ${currentlyPlaying.title}`}
                className="w-24 h-24 rounded-xl shadow-lg"
              />
              <div>
                <h3 className="text-2xl font-bold mb-2" data-testid="current-title">
                  {currentlyPlaying.title}
                </h3>
                <p className="text-white/80 text-lg" data-testid="current-author">
                  {currentlyPlaying.author}
                </p>
                {currentlyPlaying.narrator && (
                  <p className="text-white/60 text-sm">
                    Читает: {currentlyPlaying.narrator}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm mb-1">Прогресс</p>
              <p className="text-xl font-semibold" data-testid="current-progress">
                {currentTime} / {totalTime}
              </p>
            </div>
          </div>
          
          {/* Audio Player Controls */}
          <div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-center space-x-8">
              <Button variant="ghost" size="lg" className="text-white/80 hover:text-white" data-testid="button-prev-chapter">
                <SkipBack className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="lg" className="text-white/80 hover:text-white" data-testid="button-rewind">
                <RotateCcw className="w-5 h-5" />
                <span className="text-sm ml-1">15s</span>
              </Button>
              <Button
                onClick={handlePlayPause}
                className="bg-white text-accent rounded-full w-16 h-16 flex items-center justify-center text-2xl hover:bg-white/90 transition-colors shadow-lg"
                data-testid="button-play-pause"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </Button>
              <Button variant="ghost" size="lg" className="text-white/80 hover:text-white" data-testid="button-forward">
                <RotateCw className="w-5 h-5" />
                <span className="text-sm ml-1">30s</span>
              </Button>
              <Button variant="ghost" size="lg" className="text-white/80 hover:text-white" data-testid="button-next-chapter">
                <SkipForward className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Audiobooks Grid */}
      {audiobooks.length === 0 ? (
        <div className="text-center py-12">
          <Headphones className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Аудиокниги не найдены</h3>
          <p className="text-muted-foreground mb-4">В настоящее время в библиотеке нет аудиокниг</p>
          <Link href="/books">
            <Button>Перейти к обычным книгам</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {audiobooks.map((audiobook) => (
            <Card key={audiobook.id} className="overflow-hidden shadow-md hover-lift border border-border" data-testid={`audiobook-${audiobook.id}`}>
              <div className="relative">
                <img src={audiobook.coverUrl} alt={`Обложка аудиокниги ${audiobook.title}`} className="w-full h-48 object-cover" />
                <div className="absolute top-2 right-2 bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {audiobook.duration || "8ч 45м"}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Headphones className="w-4 h-4 text-accent" />
                  <span className="text-accent text-xs font-medium">Аудиокнига</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{audiobook.title}</h3>
                <p className="text-muted-foreground text-sm mb-2">{audiobook.author}</p>
                {audiobook.narrator && (
                  <p className="text-xs text-muted-foreground mb-3">Читает: {audiobook.narrator}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex mr-2">{renderStars(audiobook.rating)}</div>
                    <span className="text-xs text-muted-foreground">{audiobook.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleBookSelect(audiobook)}
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      data-testid={`play-audiobook-${audiobook.id}`}
                    >
                      <Play className="w-3 h-3 mr-1" /> Слушать
                    </Button>
                    <Link href={`/book/${audiobook.id}`}>
                      <Button size="sm" variant="outline" data-testid={`view-audiobook-${audiobook.id}`}>
                        Подробнее
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
