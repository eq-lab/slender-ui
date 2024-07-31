'use client';

import { styled } from 'styled-components';
import { Button, Container } from '@/widgets/landing/components/styled';

export const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  .nobr {
    white-space: nowrap;
  }
`;

export const Header = styled.header`
  position: fixed;
  top: 20px;
  left: 50%;
  width: 100%;
  transform: translateX(-50%);
  padding: 0 16px;
  z-index: 99;
  ${Container} {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    background: rgba(204, 187, 184, 0.16);
    padding: 4px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  @media (min-width: 1024px) {
    padding: 0 64px;
  }
`;

export const LogoLink = styled.a`
  padding: 0 16px;
  display: flex;
  align-items: center;
  img {
    height: 24px;
    object-fit: contain;
  }
`;

export const HeaderButton = styled(Button)`
  box-shadow:
    0 4px 8px 0 rgba(51, 20, 0, 0.08),
    0 2px 1px 0 rgba(51, 20, 0, 0.04);
  background: rgba(204, 187, 184, 0.16);
  color: #faf8f7;
  &:hover {
    background: rgba(178, 162, 162, 0.32);
  }
`;

export const Pluses = styled.div`
  position: absolute;
  height: 360px;
  object-fit: cover;
  left: 50%;
  top: 0;
  transform: translateX(-44%);
  width: 867px;

  @media (min-width: 765px) {
    transform: translateX(0);
    left: auto;
    right: -220px;
  }

  @media (min-width: 1024px) {
    height: 438px;
    right: 0;
  }
`;

export const RatesBox = styled.div`
  background: #252222;
  border-radius: 48px;
  padding: 24px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 436px 1fr;
    gap: 64px;
    padding: 48px;
  }
`;

export const RatesPack = styled.div`
  position: relative;
  height: 424px;
  width: 100%;

  @media (min-width: 1024px) {
    margin: auto;
    width: 436px;
    height: 630px;
  }
`;

export const RatesAside = styled.div`
  @media (min-width: 1440px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

export const RatesInfoUnit = styled.div`
  padding-top: 22px;
  padding-bottom: 42px;
  display: flex;
  gap: 20px;
  flex-direction: column;
  & + & {
    border-top: 1px solid #faf8f7;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }

  @media (min-width: 1024px) {
    flex-direction: column;
  }

  @media (min-width: 1440px) {
    flex-direction: row;
  }

  @media (min-width: 1920px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
`;
export const RatesTitle = styled.div`
  color: #faf8f7;
  font-size: 32px;
  font-variation-settings: 'wght' 600;
  line-height: 40px;
  letter-spacing: 0.64px;
  text-transform: uppercase;

  @media (min-width: 768px) {
    &.liquidations {
      white-space: nowrap;
    }
  }
  @media (min-width: 1024px) {
    &.liquidations {
      white-space: normal;
    }
  }
`;
export const RatesDescription = styled.div`
  color: #faf8f7;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0.16px;

  @media (min-width: 768px) {
    max-width: 320px;
  }

  @media (min-width: 1920px) {
    max-width: 100%;
  }
`;

export const SugarBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-top: 16px;
  @media (min-width: 1024px) {
    margin-top: 0;
    align-items: flex-start;
  }

  @media (min-width: 1440px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const SugarInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

export const Launch = styled.div`
  position: relative;

  ${Container} {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    > * {
      width: 100%;
      position: relative;
      z-index: 2;
    }
  }
`;

export const LaunchBg = styled.div`
  position: absolute;
  height: 630px;
  width: 604px;
  object-fit: contain;
  object-position: center;
  right: 90px;
  top: 80px;

  @media (min-width: 768px) {
    left: -100px;
    top: 80px;
    height: 600px;
  }

  @media (min-width: 1024px) {
    left: -80px;
    top: 120px;
    width: 936px;
    height: 976px;
  }

  @media (min-width: 1440px) {
    height: 976px;
    left: 0;
  }
`;

export const AuditLabelInner = styled.div`
  display: flex;
  gap: 4px;
  span {
    color: #f2edeb7a;
  }
`;

export const AuditLabel = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const AuditSection = styled.div`
  && {
    p {
      max-width: 330px;
      font-weight: normal;
      line-height: 72px;
      margin-bottom: 64px;
    }
    @media (min-width: 1024px) {
      max-width: 480px;
    }
  }
`;

export const AuditBg = styled.div`
  position: absolute;
  width: 366px;
  height: 216px;
  top: -170px;
  right: 0px;
  object-fit: contain;
  object-position: center;
  @media (min-width: 1024px) {
    top: -210px;
    height: 544px;
    width: 923px;
  }
`;

export const AuditBgWrapper = styled.div`
  position: relative;
`;

export const BlogTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0;
  .secondary {
    white-space: nowrap;
  }
  @media (max-width: 1023px) {
    padding: 0 16px;
    align-items: center;
    a {
      margin-top: -34px;
    }
  }
  && {
    .title {
      font-weight: normal;
    }
  }
`;

export const BlogOverflow = styled.div`
  @media (max-width: 1023px) {
    padding: 0 16px 16px;
    overflow: scroll;
    overflow: -moz-scrollbars-none;
    -ms-overflow-style: none;
    scrollbar-color: transparent;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 0 !important;
      height: 0 !important;
      display: none !important;
      opacity: 0;
      background-color: transparent;
    }

    &::-moz-scrollbar {
      width: 0 !important;
      height: 0 !important;
      display: none !important;
      opacity: 0;
      background-color: transparent;
    }

    &::-webkit-scrollbar:horizontal {
      width: 0 !important;
      height: 0 !important;
      display: none !important;
      opacity: 0;
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      width: 0 !important;
      height: 0 !important;
      opacity: 0;
      background: rgba(255, 255, 255, 0);
      background-color: transparent;
      display: none !important;
    }
    &::-webkit-scrollbar-track-piece {
      width: 0 !important;
      height: 0 !important;
      opacity: 0;
      background: rgba(255, 255, 255, 0);
      background-color: transparent;
      display: none !important;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: transparent;
      opacity: 0;
    }

    &::-webkit-scrollbar-track {
      opacity: 0;
      background: transparent;
      background-color: transparent;
      width: 0 !important;
      height: 0 !important;
      display: none !important;
    }
  }
`;

export const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  @media (max-width: 1023px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    &::after {
      content: ' ';
      width: 16px;
      display: block;
    }
  }
`;

export const BlogSection = styled.div`
  padding: 26px 0 16px;
  background: var(--background-secondary);
  border-radius: 48px;
  overflow: hidden;
  .show-desktop {
    display: none;
  }
  .show-mobile {
    display: block;
    padding: 0 16px;
  }

  @media (min-width: 1024px) {
    padding: 48px;
    .show-desktop {
      display: block;
    }
    .show-mobile {
      display: none;
    }
  }
`;
