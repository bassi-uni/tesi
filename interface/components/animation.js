'use client'

import * as AnimationData from "@/app/assets/animations/AI.json";

export const Animation = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: AnimationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
  return (
      <Lottie {...defaultOptions}/>
  );

}