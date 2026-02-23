const getYouTubeId = (url) => {
  if (!url) return '';
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{6,})/i,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/i,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/i
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return '';
};

const resolveVideoUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('/uploads/')) {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    return `${base}${url}`;
  }
  return url;
};

const Editorial = ({ secureUrl, thumbnailUrl, videoSourceType, youtubeUrl }) => {
  const resolvedUrl = resolveVideoUrl(secureUrl);
  const youtubeId = videoSourceType === 'youtube' ? getYouTubeId(youtubeUrl) : '';

  if (!resolvedUrl && !youtubeId) {
    return (
      <div className="bg-base-200 border border-base-300 rounded-xl p-6 text-sm text-base-content/60">
        No video solution has been added yet.
      </div>
    );
  }

  if (youtubeId) {
    return (
      <div className="relative w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg border border-base-300">
        <div className="aspect-video bg-black">
          <iframe
            title="Video Solution"
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg border border-base-300 bg-black">
      <video
        src={resolvedUrl}
        poster={thumbnailUrl || undefined}
        controls
        preload="metadata"
        className="w-full aspect-video bg-black"
      />
    </div>
  );
};


export default Editorial;
