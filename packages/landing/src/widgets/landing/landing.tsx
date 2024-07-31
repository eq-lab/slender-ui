'use client';

import React from 'react';
import Image from 'next/image';
import { SubscriptionSection } from '@/widgets/landing/components/subscription-section/subscription-section';
import Typography from '@marginly/ui/components/typography';
import Button from '@marginly/ui/components/button';
import NextLink from 'next/link';

import { PostOrPage } from '@tryghost/content-api';
import { ReactComponent as LogoIcon } from './images/logo.svg';
import { ReactComponent as SugarIcon } from './images/sugar.svg';
import { ReactComponent as NoSugarIcon } from './images/nosugar.svg';
import { ReactComponent as BarcodeIcon } from './images/barcode.svg';
import decorImage from './images/decor.png';
import bagImage from './images/bag.png';
import endImage from './images/end.png';
import auditBg from './images/audit-bg.png';

import {
  AuditBg,
  AuditBgWrapper,
  AuditLabel,
  AuditLabelInner,
  AuditSection,
  BlogGrid,
  BlogOverflow,
  BlogSection,
  BlogTitle,
  Header,
  HeaderButton,
  Launch,
  LaunchBg,
  LogoLink,
  Pluses,
  RatesAside,
  RatesBox,
  RatesDescription,
  RatesInfoUnit,
  RatesPack,
  RatesTitle,
  SugarBlock,
  SugarInner,
  Wrapper,
} from './styled';

import { Space } from './components/space';
import { Container, Title } from './components/styled';
import { AppSection } from './components/app-section/app-section';
import { QuestionSection } from './components/question-section/question-section';
import { Footer } from './components/footer/footer';
import { AuditIcon } from './images/audit-icon';
import BlockItem from './components/blog-item';

const APP_LINK = 'https://app.slender.fi';
const SUBSCRIPTION_ANCHOR = 'subscription';

interface Props {
  posts?: PostOrPage[];
}

function ShowAllButton({ className }: { className?: string }) {
  return (
    <NextLink href="https://marginly.ghost.io/" target="_black" className={className}>
      <Button text fullWidth lg>
        <Typography action secondary>
          Show All
        </Typography>
      </Button>
    </NextLink>
  );
}

export function Landing({ posts }: Props) {
  const showPosts = false;
  return (
    <main id="top-anchor">
      <Wrapper>
        <Pluses>
          <Image
            src={decorImage}
            alt=""
            fill
            style={{
              objectFit: 'contain',
            }}
            sizes="867px"
          />
        </Pluses>
        <Header>
          <Container>
            <LogoLink href="#top-anchor">
              <LogoIcon />
            </LogoLink>
            <a href={APP_LINK}>
              <HeaderButton className="md">Enter App</HeaderButton>
            </a>
          </Container>
        </Header>
        <Space $height={200} $heightMobile={136} />
        <Container>
          <h1>
            <Title>
              Lend & borrow fat stakes{' '}
              <div>
                at <span className="nobr">a fair</span> interest
              </div>
            </Title>
          </h1>

          <Space $height={48} $heightMobile={48} />
          <AuditLabel>
            <AuditLabelInner>
              <AuditIcon /> <span>Security Audit by Certora</span>
            </AuditLabelInner>
          </AuditLabel>
          <Space $height={48} $heightMobile={48} />

          <AppSection appLink={APP_LINK} />

          <Space $height={98} $heightMobile={64} />

          <RatesBox>
            <RatesPack>
              <Image
                src={bagImage}
                alt=""
                fill
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                }}
              />
            </RatesPack>
            <RatesAside>
              <div>
                <RatesInfoUnit>
                  <RatesTitle>Dynamic & fair interest</RatesTitle>
                  <RatesDescription>
                    Rates are based on a smooth hyperbolic function without inflection points
                  </RatesDescription>
                </RatesInfoUnit>

                <RatesInfoUnit>
                  <RatesTitle>Competitive passive yield</RatesTitle>
                  <RatesDescription>
                    Put your $XLM and other funds to work by&nbsp;supplying to Slender
                  </RatesDescription>
                </RatesInfoUnit>

                <RatesInfoUnit>
                  <RatesTitle className="liquidations">Flash loans</RatesTitle>
                  <RatesDescription>
                    Borrow and repay in the same block with no&nbsp;collateral
                  </RatesDescription>
                </RatesInfoUnit>
              </div>

              <SugarBlock>
                <SugarInner>
                  <SugarIcon />
                  <NoSugarIcon />
                </SugarInner>
                <BarcodeIcon />
              </SugarBlock>
            </RatesAside>
          </RatesBox>
        </Container>
        <Space $height={208} $heightMobile={150} />
        <AuditBgWrapper>
          <AuditBg>
            <Image
              src={auditBg}
              alt=""
              fill
              style={{
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />
          </AuditBg>
          <Container>
            <AuditSection>
              <Typography title>Slender is robust and secure</Typography>
              <a href="Slender_security_report_by_Certora.pdf" target="_blank" rel="nofollow">
                <Button lg secondary icon={<AuditIcon />}>
                  Audit Report
                </Button>
              </a>
            </AuditSection>
          </Container>
        </AuditBgWrapper>

        <Launch id={SUBSCRIPTION_ANCHOR}>
          <LaunchBg>
            <Image
              src={endImage}
              alt=""
              fill
              style={{
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />
          </LaunchBg>
          <SubscriptionSection />
        </Launch>
        <Container>
          <QuestionSection subscriptionAnchor={SUBSCRIPTION_ANCHOR} />
        </Container>
        {showPosts && (
          <>
            <Space $height={192} $heightMobile={128} />
            <Container>
              <BlogSection>
                <BlogTitle>
                  <Typography title>Latest articles</Typography>
                  <ShowAllButton className="show-desktop" />
                </BlogTitle>

                <Space $height={40} $heightMobile={40} />

                <BlogOverflow>
                  <BlogGrid>
                    {posts?.map((post) => <BlockItem key={post.url} post={post} />)}
                  </BlogGrid>
                </BlogOverflow>

                <ShowAllButton className="show-mobile" />
              </BlogSection>
            </Container>
          </>
        )}

        <Space $height={192} $heightMobile={128} />

        <Footer />

        <Space $height={128} $heightMobile={128} />
      </Wrapper>
    </main>
  );
}
