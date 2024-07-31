import T from '@marginly/ui/components/typography';
import { PostOrPage } from '@tryghost/content-api';
import React from 'react';

import { BlogArticle, BlogContent, BlogImage, BlogImageCover, BlogInfo, Blog } from './styled';
import { Space } from '../space';
import { formatDate } from '../../util/date';

function BlockItem({ post }: { post: PostOrPage }) {
  // eslint-disable-next-line camelcase
  const { title, feature_image, url, created_at, updated_at } = post;
  // eslint-disable-next-line camelcase
  const articleDate = updated_at || created_at;
  return (
    <Blog href={url} className="blog" target="_blank">
      <BlogImageCover>
        {/* eslint-disable-next-line camelcase */}
        <BlogImage src={feature_image || ''} alt="" />
      </BlogImageCover>
      <BlogContent>
        <BlogArticle>
          <T headerS>{title}</T>
        </BlogArticle>

        <Space $height={16} $heightMobile={16} />
        <BlogInfo>
          {!!articleDate && (
            <T secondary body>
              {formatDate(articleDate)}
            </T>
          )}
        </BlogInfo>
      </BlogContent>
    </Blog>
  );
}

export default BlockItem;
