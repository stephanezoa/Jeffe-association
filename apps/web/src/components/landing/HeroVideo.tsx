import React from 'react';
import { VideoFrame } from '../ui/VideoFrame';
import { HERO } from '../../data/landing';

/** Vidéo de présentation du hero. */
export const HeroVideo: React.FC = () => (
  <VideoFrame
    poster={HERO.video.poster}
    posterAlt={HERO.video.posterAlt}
    src={HERO.video.src}
    title={HERO.video.title}
    className="mx-auto aspect-video w-full max-w-3xl shadow-player"
  />
);
