import instance from './axios-instance';

export const GallerySvc = {
  get: (path?: string) => instance({
    method: 'GET',
    url: path ? `api/gallery/${path}` : `api/gallery/`
  })
}