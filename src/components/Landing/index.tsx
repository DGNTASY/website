"use client";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import Image from "next/image";

const events = [
  {
    id: "event1",
    src: "/test2.png",
    alt: "Event 1",
  },
  {
    id: "event2",
    src: "/test2.png",
    alt: "Event 2",
  },
  {
    id: "event3",
    src: "/test2.png",
    alt: "Event 3",
  },
  {
    id: "event3",
    src: "/test2.png",
    alt: "Event 3",
  },
  {
    id: "event3",
    src: "/test2.png",
    alt: "Event 3",
  },
  {
    id: "event3",
    src: "/test2.png",
    alt: "Event 3",
  },
  {
    id: "event3",
    src: "/test2.png",
    alt: "Event 3",
  },
  {
    id: "event3",
    src: "/test2.png",
    alt: "Event 3",
  },
];

export default function Landing() {
  return (
    <>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 20,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{ delay: 1000 }}
        navigation={true}
        loopAdditionalSlides={1}
        loop={true}
        className="!w-full  [&_.swiper-button-prev]:!text-white [&_.swiper-button-next]:!text-white opacity-60"
        maxBackfaceHiddenSlides={32}
        modules={[EffectCoverflow, Autoplay, Navigation]}
      >
        {events.map((event, index) => (
          <SwiperSlide
            key={index}
            className="!h-[600px] !w-96 !overflow-clip !rounded-md shadow-xl bg-gray-400 flex justify-center items-center"
          >
            <Image
              src={event.src}
              width={1200}
              height={1200}
              alt={event.alt}
              className="!h-[600px] !w-full !object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
