import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {

  return {

    name: "Gạo Trần Huy",

    short_name: "GTH",

    description: "Website bán gạo tại Đà Nẵng",

    start_url: "/",

    display: "standalone",

    background_color: "#FAFAF5",

    theme_color: "#2E7D32",

    lang: "vi"
  }

}
