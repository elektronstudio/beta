// From https://tooling.one/json-to-typescript

type ImageFormat = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: any;
  size: number;
  width: number;
  height: number;
};

type ImageSchema = {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width?: number;
  height?: number;
  formats?: {
    large?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    thumbnail: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: any;
  provider: string;
  provider_metadata: any;
  created_at: string;
  updated_at: string;
};

type ImageComputed = {
  sizes: any; // TODO: Fix this type
  alt: string;
  caption: string;
};

export type Image = ImageSchema & ImageComputed;

export function filterImage(image: Image) {
  return image.mime.startsWith("image");
}

export function processImage(image: Image): Image {
  const imageData = image.formats
    ? {
        sizes: Object.values(image.formats),
        alt: image.alternativeText,
        caption: image.caption,
      }
    : {};
  return { ...image, ...imageData };
}
