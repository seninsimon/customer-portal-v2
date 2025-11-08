"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, Loader } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useAdsQuery } from "@/api/query/ads.query";
import { Ad } from "@/api/query/types/ads/ads.response";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

export const AdBanner = () => {
  const { data, isLoading, isError } = useAdsQuery();
  const autoplay = useRef(Autoplay({ delay: 3000 }));

  if (isLoading) {
    return (
      <div className="col-span-5 flex items-center justify-center h-64 bg-gray-100 rounded-xl">
        <Loader size="lg" color="blue" />
      </div>
    );
  }

  if (isError || !data?.data?.length) {
    return (
      <div className="col-span-5 relative rounded-xl  overflow-hidden">
        <div className="rounded-xl overflow-hidden">
          <div>
            <div className="relative w-full h-[600px] rounded-xl overflow-hidden">
              <Image
                src="/images/fallback/containers.webp"
                alt="Ad Banner"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 w-full text-white p-6">
                <h2 className="text-2xl font-bold mb-2">
                  Solution for all your shipping needs
                </h2>
                <p className="text-lg mb-4">
                  Get your goods delivered fast and safe with our reliable shipping solutions.
                </p>
                <Button
                  component={Link}
                  href={"/get-a-quote"}
                  variant="filled"
                  color="blue"
                >
                  Get a Quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ads: Ad[] = data?.data;

  return (
    <div className="col-span-5 relative rounded-xl  overflow-hidden">
      <Carousel
        withIndicators
        height={600}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={() => autoplay.current.play()}
        emblaOptions={{ dragFree: false, align: "start", loop: true }}
        slideGap="md"
        className="rounded-xl overflow-hidden"
      >
        {ads.map((ad, index) => {
         
          const imageUrl = `${process.env.NEXT_PUBLIC_MEDIA_URL}/${ad.file}`;

          return (
            <Carousel.Slide key={index}>
              <div className="relative w-full h-[600px] rounded-xl overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={ad.title || "Ad Banner"}
                  fill
                  className="object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Text Content */}
                <div className="absolute bottom-0 w-full text-white p-6">
                  <h2 className="text-2xl font-bold mb-2">
                    {ad.title || ""}
                  </h2>
                  <p className="text-lg mb-4">
                    {ad.description || ""}
                  </p>
                  <Button
                    component={Link}
                    href={"/get-a-quote"}
                    variant="filled"
                    color="blue"
                  >
                    Get a Quote
                  </Button>
                </div>
              </div>
            </Carousel.Slide>
          );
        })}
      </Carousel>
    </div>
  );
};

export default AdBanner;
