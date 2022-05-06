export const ThumbnailSize = {
  small: 260,
  large: 800
}

export const buildImgUrl = (path: string, resFactor?: number) => {
  let url = `api/Gallery/f/${path}`;
  if (resFactor)
    url += `?res=${resFactor}`;

  return url;
}