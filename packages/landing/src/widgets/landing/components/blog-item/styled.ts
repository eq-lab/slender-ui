import styled from 'styled-components';

export const BlogImageCover = styled.div`
  height: 212px;
  border-radius: var(--rounding-radius-xl, 24px) var(--rounding-radius-xl, 24px) 0 0;
  overflow: hidden;
`;

export const BlogImage = styled.img`
  display: block;
  object-fit: cover;
  object-position: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

export const BlogContent = styled.div`
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 2;
`;

export const BlogArticle = styled.div`
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  && {
    p {
      font-weight: normal;
    }
  }
`;

export const BlogInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Blog = styled.a`
  background: var(--fill-elevated, #fff);
  box-shadow:
    0px 8px 24px 0px rgba(51, 20, 0, 0.08),
    0px 4px 8px 0px rgba(51, 20, 0, 0.04);
  display: block;
  padding: 0;
  border: 0;
  outline: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border-radius: 32px;
  animation-delay: 500ms;
  animation-play-state: paused;

  transition: 300ms ease-in;

  &:hover {
    background: var(--fill-elevated-hover);
  }

  @media (max-width: 1023px) {
    transform: translateY(0);
    animation: none;
    min-width: 342px;
  }
`;
