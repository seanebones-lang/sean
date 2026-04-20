type TimelapseEmbedProps = {
  url: string;
  title: string;
};

function toYouTubeEmbed(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const v = parsed.searchParams.get("v");
      if (v) return `https://www.youtube-nocookie.com/embed/${v}`;
    }
    return null;
  } catch {
    return null;
  }
}

function toVimeoEmbed(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("vimeo.com")) return null;
    const id = parsed.pathname.split("/").filter(Boolean)[0];
    if (!id) return null;
    return `https://player.vimeo.com/video/${id}`;
  } catch {
    return null;
  }
}

export function TimelapseEmbed({ url, title }: TimelapseEmbedProps) {
  const youtube = toYouTubeEmbed(url);
  const vimeo = toVimeoEmbed(url);
  const embed = youtube ?? vimeo;

  if (embed) {
    return (
      <div className="relative aspect-video w-full">
        <iframe
          src={embed}
          title={`${title} — process`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  if (/\.(mp4|webm|mov)$/i.test(url)) {
    return (
      <video
        src={url}
        controls
        preload="metadata"
        className="w-full"
        aria-label={`${title} — process video`}
      />
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block p-4 text-center text-sm text-electric hover:underline"
    >
      Watch the process →
    </a>
  );
}
