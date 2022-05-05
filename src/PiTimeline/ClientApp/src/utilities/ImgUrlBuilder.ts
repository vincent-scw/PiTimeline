export const buildImgUrl = (path: string, resFactor?: number) => {
  let url = `api/Gallery/f/${path}`;
  if (resFactor)
    url += `?res=${resFactor}`;

  return url;
}