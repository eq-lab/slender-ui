import React from 'react'
import Image from 'next/image'
import { SubscriptionSection } from '@/widgets/landing/subscription-section'
import {
  Container,
  Fund,
  Header,
  HeaderButton,
  Launch,
  LaunchBg,
  LogoLink,
  Pluses,
  Protocol,
  ProtocolRow,
  RatesAside,
  RatesBox,
  RatesDescription,
  RatesInfoUnit,
  RatesPack,
  RatesTitle,
  SugarBlock,
  SugarInner,
  Title,
  Wrapper,
} from './styled'
import { Space } from './space'

const LAUNCH_ANCHOR = 'launch'

export function Landing() {
  return (
    <main id="top-anchor">
      <Wrapper>
        <Pluses>
          <Image
            src="/img/decor.png"
            alt=""
            fill
            style={{
              objectFit: 'contain',
            }}
            sizes="(max-width: 1440px) 867px, (max-width: 768px) 712px"
          />
        </Pluses>
        <Header>
          <Container>
            <LogoLink href="#top-anchor">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/logo.svg" alt="Slender logo" />
            </LogoLink>
            <a href={`#${LAUNCH_ANCHOR}`}>
              <HeaderButton className="md">Subscribe</HeaderButton>
            </a>
          </Container>
        </Header>
        <Space $height={200} $heightMobile={136} />
        <Container>
          <h1>
            <Title>
              Lend & borrow fat stakes{' '}
              <div>
                at <span className="nobr">a fairer</span> interest
              </div>
            </Title>
          </h1>

          <Space $height={116} $heightMobile={74} />

          <ProtocolRow>
            <Protocol>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              #1 lending protocol on <img src="/img/stellar.svg" alt="Stellar" />
            </Protocol>
            <Fund>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/fund.svg" alt="" /> <span>Supported by Stellar Community Fund</span>
            </Fund>
          </ProtocolRow>

          <Space $height={98} $heightMobile={96} />

          <RatesBox>
            <RatesPack>
              <Image
                src="/img/bag.png"
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
                  <RatesTitle className="liquidations">flash-loans</RatesTitle>
                  <RatesDescription>
                    Borrow and repay in the same block with no&nbsp;collateral
                  </RatesDescription>
                </RatesInfoUnit>
              </div>

              <SugarBlock>
                <SugarInner>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/sugar.svg" alt="" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/nosugar.svg" alt="No added sugar" />
                </SugarInner>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/barcode.svg" alt="Barcode" />
              </SugarBlock>
            </RatesAside>
          </RatesBox>
        </Container>

        <Launch id={LAUNCH_ANCHOR}>
          <LaunchBg>
            <Image
              src="/img/end.png"
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
      </Wrapper>
    </main>
  )
}
