import React from 'react';
import { Landing } from '@/widgets/landing/landing';
import { VersionAlert } from '@slender/shared/components/version-alert';
// import { BLOG_TAG } from '@/global/constants';
import { PostOrPage } from '@tryghost/content-api';

// async function makeRequest<H extends {}, P extends {}>({
//   url,
//   method,
//   headers: _headers,
//   params,
// }: {
//   url: string;
//   method: string;
//   headers: H;
//   params: P;
// }) {
//   const headers = new Headers();
//   const q = new URLSearchParams();

//   // eslint-disable-next-line no-restricted-syntax
//   for (const [key, value] of Object.entries(_headers)) {
//     headers.append(key, String(value));
//   }

//   // eslint-disable-next-line no-restricted-syntax
//   for (const [key, value] of Object.entries(params)) {
//     q.append(key, String(value));
//   }

//   const response = await fetch(`${url}?${q.toString()}`, {
//     headers,
//     method,
//     next: { tags: [BLOG_TAG] },
//   });

//   const data = await response.json();

//   return {
//     data,
//     status: response.status,
//     statusText: response.statusText,
//     headers: response.headers,
//   };
// }

// const api = new GhostContentAPI({
//   url: 'https://marginly.ghost.io',
//   key: '058e253a4681b854b7163ee0e6',
//   version: 'v5.0',
//   makeRequest,
// });
// const POSTS_LIMIT = 100;
const POSTS_WITH_ALLOWED_TAG_AMOUNT = 3;

export default async function Home() {
  // const apiPosts = await api.posts.browse({
  //   limit: POSTS_LIMIT,
  //   include: 'tags',
  // });
  const apiPosts = undefined as undefined | PostOrPage[];
  const articlesWithAllowedTag = apiPosts?.slice(0, POSTS_WITH_ALLOWED_TAG_AMOUNT);
  return (
    <main>
      <Landing posts={articlesWithAllowedTag} />
      <VersionAlert />
    </main>
  );
}
