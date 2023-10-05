import React from 'react'
import Image from 'next/image'
import { SubscriptionSection } from '@/widgets/landing/components/subscription-section/subscription-section'
import { ReactComponent as LogoIcon } from './images/logo.svg'
import { ReactComponent as SugarIcon } from './images/sugar.svg'
import { ReactComponent as NoSugarIcon } from './images/nosugar.svg'
import { ReactComponent as BarcodeIcon } from './images/barcode.svg'
import decorImage from './images/decor.png'
import bagImage from './images/bag.png'
import endImage from './images/end.png'
import {
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
} from './styled'
import { Space } from './components/space'
import { Container, Title } from './components/styled'
import { AppSection } from './components/app-section/app-section'
import { QuestionSection } from './components/question-section/question-section'

const APP_LINK = 'https://app.slender.fi'
const SUBSCRIPTION_ANCHOR = 'subscription'

export function Landing() {
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

          <Space $height={96} $heightMobile={64} />

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

        <QuestionSection subscriptionAnchor={SUBSCRIPTION_ANCHOR} />

        <Space $height={192} $heightMobile={128} />
      </Wrapper>
    </main>
  )
}
