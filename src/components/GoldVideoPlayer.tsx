import React, { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cx } from "@/lib/utils";

/*
 * GoldVideoPlayer — the product explainer, played from YouTube but skinned in
 * the site's gold, with the controls in a bar BELOW the frame so nothing sits
 * over the video itself (YouTube's own chrome does, and it is blue/red).
 *
 * The YouTube IFrame API is only fetched when the visitor asks to play, so a
 * read-only visit makes no third-party request and sets no cookie. The player
 * is embedded in privacy-enhanced mode (youtube-nocookie).
 *
 * `controls: 0` hides YouTube's overlay; the bar below is the only chrome.
 * Keyboard: space/arrows are left to the player, so the bar stays a pointer
 * affordance and the video keeps its focus behaviour.
 */

type YTPlayerLike = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: unknown) => YTPlayerLike };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<Window["YT"]> | null = null;

/** Load the IFrame API once, on first play. */
function loadYouTubeApi(): Promise<Window["YT"]> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error("YouTube IFrame API loaded without Player"));
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => reject(new Error("YouTube IFrame API failed to load"));
    document.head.appendChild(script);
  });
  return ytApiPromise;
}

function clock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function GoldVideoPlayer({
  videoId,
  poster,
  title = "Product explainer",
}: {
  videoId: string;
  poster: string;
  title?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerLike | null>(null);
  const [phase, setPhase] = useState<"idle" | "loading" | "ready" | "failed">("idle");
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Track playback for the seek bar while the video runs.
  useEffect(() => {
    if (phase !== "ready" || !playing) return;
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      setTime(p.getCurrentTime() || 0);
      const d = p.getDuration() || 0;
      if (d) setDuration(d);
    }, 250);
    return () => window.clearInterval(id);
  }, [phase, playing]);

  useEffect(
    () => () => {
      try { playerRef.current?.destroy(); } catch { /* already gone */ }
    },
    [],
  );

  const start = useCallback(async () => {
    if (phase === "loading" || phase === "ready") return;
    setPhase("loading");
    try {
      const YT = await loadYouTubeApi();
      if (!YT?.Player || !hostRef.current) throw new Error("unavailable");
      // Mount into a child we create: the API replaces the element it is given,
      // and React must keep owning the host alone.
      const mount = document.createElement("div");
      hostRef.current.appendChild(mount);
      playerRef.current = new YT.Player(mount, {
        videoId,
        host: "https://www.youtube-nocookie.com",
        width: "100%",
        height: "100%",
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          iv_load_policy: 3,
          fs: 0,
        },
        events: {
          onReady: (e: { target: YTPlayerLike }) => {
            setPhase("ready");
            const d = e.target.getDuration?.() ?? 0;
            if (d) setDuration(d);
            e.target.playVideo();
          },
          onStateChange: (e: { data: number }) => {
            setPlaying(e.data === 1);
          },
          onError: () => setPhase("failed"),
        },
      });
    } catch {
      setPhase("failed");
    }
  }, [phase, videoId]);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) { p.unMute(); setMuted(false); }
    else { p.mute(); setMuted(true); }
  };

  const seek = (v: number) => {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(v, true);
    setTime(v);
  };

  const pct = duration > 0 ? Math.min(100, (time / duration) * 100) : 0;
  const controlBtn =
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-400/40 bg-gold-400/10 text-gold-300 transition-colors hover:border-gold-400/80 hover:bg-gold-400/20 disabled:opacity-40";

  return (
    <div className="w-full">
      <div
        ref={frameRef}
        className="relative aspect-video overflow-hidden rounded-md border border-phantix-700 bg-black shadow-[0_0_0_1px_rgba(232,181,77,0.18),0_1px_2px_0_rgba(0,0,0,0.5)]"
      >
        {/* The video lives here; the API fills this host with its iframe. */}
        <div
          ref={hostRef}
          className={cx("absolute inset-0 h-full w-full", phase === "idle" && "invisible")}
        />

        {phase === "idle" && (
          <button
            type="button"
            onClick={start}
            aria-label={`Play ${title}`}
            className="group absolute inset-0 h-full w-full cursor-pointer"
          >
            <img
              src={poster}
              alt=""
              width={1280}
              height={720}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
            <span className="absolute inset-0 bg-phantix-950/40" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/50 bg-phantix-950/80 text-gold-300 backdrop-blur-sm transition-colors duration-200 group-hover:border-gold-400/80 group-hover:bg-phantix-900/90">
                <Play size={24} className="ml-0.5" fill="currentColor" />
              </span>
            </span>
          </button>
        )}

        {phase === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-phantix-950/70 text-sm text-slate-300">
            <Loader2 size={20} className="mr-2 animate-spin text-gold-400" /> Please wait while the player starts.
          </div>
        )}

        {phase === "failed" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-phantix-950/90 px-6 text-center text-sm text-slate-300">
            <p>The player could not load here.</p>
            <a
              href={`https://youtu.be/${videoId}`}
              target="_blank"
              rel="noreferrer"
              className="text-gold-300 underline hover:text-gold-200"
            >
              Watch it on YouTube
            </a>
          </div>
        )}
      </div>

      {/* The controls live BELOW the video, so nothing covers the content. */}
      <div className="mt-3 flex items-center gap-3 rounded-md border border-phantix-700/60 bg-phantix-950/60 px-3 py-2">
        <button
          type="button"
          onClick={phase === "idle" ? start : togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          disabled={phase === "loading" || phase === "failed"}
          className={controlBtn}
        >
          {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" fill="currentColor" />}
        </button>

        <span className="w-10 shrink-0 text-right font-mono text-[12px] tabular-nums text-slate-400">
          {clock(time)}
        </span>

        <span className="relative h-1.5 flex-1 rounded-full bg-phantix-700">
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-gold-400"
            style={{ width: `${pct}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(time, duration || 0)}
            onChange={(e) => seek(Number(e.target.value))}
            disabled={phase !== "ready" || duration <= 0}
            aria-label="Seek the video"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"
          />
        </span>

        <span className="w-10 shrink-0 font-mono text-[12px] tabular-nums text-slate-500">
          {clock(duration)}
        </span>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          disabled={phase !== "ready"}
          className={controlBtn}
        >
          {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        <button
          type="button"
          onClick={() => frameRef.current?.requestFullscreen?.()}
          aria-label="Open full screen"
          disabled={phase !== "ready"}
          className={controlBtn}
        >
          <Maximize size={15} />
        </button>
      </div>

      <p className="mt-2 text-center text-xs text-slate-500">
        <a
          href={`https://youtu.be/${videoId}`}
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-slate-300"
        >
          Watch on YouTube
        </a>
      </p>
    </div>
  );
}
