"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { Autoplay, EffectCoverflow } from "swiper/modules";
import Image from "next/image";

const events = [
  {
    id: "event1",
    src: "/swiper1.jpg",
    alt: "Event 1",
  },
  {
    id: "event2",
    src: "/swiper2.jpg",
    alt: "Event 2",
  },
  {
    id: "event3",
    src: "/swiper3.jpg",
    alt: "Event 3",
  },
  {
    id: "event3",
    src: "/swiper4.jpg",
    alt: "Event 3",
  },
  {
    id: "event3",
    src: "/swiper5.jpg",
    alt: "Event 3",
  },
  {
    id: "event3",
    src: "/swiper6.jpg",
    alt: "Event 3",
  },
  {
    id: "event3",
    src: "/swiper7.jpg",
    alt: "Event 3",
  },
  {
    id: "event3",
    src: "/swiper8.jpg",
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
          rotate: 50,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{ delay: 1000 }}
        navigation={true}
        loopAdditionalSlides={1}
        loop={true}
        className="!w-full  opacity-70 "
        maxBackfaceHiddenSlides={32}
        modules={[EffectCoverflow, Autoplay]}
      >
        {events.map((event, index) => (
          <SwiperSlide
            key={index}
            className="!h-[600px] !w-96 !overflow-clip !rounded-md shadow-xl bg-gray-400 flex justify-center items-center blur-[2px]"
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
