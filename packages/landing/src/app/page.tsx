'use client'

import React, { useState } from 'react'
import cn from 'classnames'
import {
  Container,
  Header,
  LogoLink,
  Wrapper,
  HeaderButton,
  TItle,
  Pluses,
  ProtocolRow,
  Protocol,
  Fund,
  RatesBox,
  RatesPack,
  RatesAside,
  RatesInfoUnit,
  RatesTitle,
  RatesDescription,
  SugarBlock,
  SugarInner,
  Launch,
  InputBox,
  InputLabel,
  Button,
  Form,
  LaunchBg,
} from './styled'
import { Space } from './common/space'

export default function Home() {
  const [email, setEmail] = useState('')

  const [emailIsFocused, setEmailIsFocused] = useState(false)
  const [isEmailError, setIsEmailError] = useState(false)

  return (
    <main>
      <Wrapper>
        <Pluses src="/img/decor.png" alt="" />
        <Header>
          <Container>
            <LogoLink>
              <img src="/img/logo.svg" alt="Slender logo" />
            </LogoLink>
            <a href="#launch">
              <HeaderButton className="md">Subscribe</HeaderButton>
            </a>
          </Container>
        </Header>
        <Space height={200} heightMobile={136} />
        <Container>
          <h1>
            <TItle>
              Lend & borrow fat stakes at <span className="nobr">a fairer</span> interest{' '}
              <span className="accent">with no liquidations</span>
            </TItle>
          </h1>

          <Space height={116} heightMobile={74} />

          <ProtocolRow>
            <Protocol>
              #1 lending protocol on <img src="/img/stellar.svg" alt="Stellar" />
            </Protocol>
            <Fund>
              <img src="/img/fund.svg" alt="" /> <span>Supported by Stellar Community Fund</span>
            </Fund>
          </ProtocolRow>

          <Space height={98} heightMobile={96} />

          <RatesBox>
            <RatesPack src="/img/bag.png" alt="" />
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
                  <RatesTitle className="liquidations">Flash-loans</RatesTitle>
                  <RatesDescription>
                    Borrow and repay in the same block with no&nbsp;collateral.
                  </RatesDescription>
                </RatesInfoUnit>
              </div>

              <SugarBlock>
                <SugarInner>
                  <img src="/img/sugar.svg" alt="" />
                  <img src="/img/nosugar.svg" alt="No added sugar" />
                </SugarInner>
                <img src="/img/barcode.svg" alt="Barcode" />
              </SugarBlock>
            </RatesAside>
          </RatesBox>
        </Container>

        <Launch id="launch">
          <LaunchBg src="/img/end.png" alt="" />
          <Container>
            <Space height={200} heightMobile={128} />

            <TItle className="title">Be the first to&nbsp;know about our launch</TItle>

            <Space height={80} heightMobile={68} />
            <Form>
              <InputBox
                onFocus={() => setEmailIsFocused(true)}
                onBlur={() => setEmailIsFocused(false)}
                className={cn({ focused: !!email || emailIsFocused, error: isEmailError })}
              >
                <InputLabel>Your email</InputLabel>
                <input value={email} className="input" onChange={(e) => setEmail(e.target.value)} />
              </InputBox>

              <Button>Subscribe</Button>
            </Form>
            <Space height={150} heightMobile={150} />
          </Container>
        </Launch>
      </Wrapper>
    </main>
  )
}
