'use client'

import React, { ChangeEvent, useState } from 'react'
import cn from 'classnames'
import { sendEmail } from '@/widgets/landing/api'
import {
  Container,
  Header,
  LogoLink,
  Wrapper,
  HeaderButton,
  Title,
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
import { Space } from './space'

export function Landing() {
  const [email, setEmail] = useState('')

  const [emailIsFocused, setEmailIsFocused] = useState(false)
  const [emailHasError, setEmailHasError] = useState(false)

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setEmailHasError(false)
  }

  const handleSubscribe = () => {
    const emailIsValid = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
    setEmailHasError(!emailIsValid)
    if (emailIsValid) {
      sendEmail(email).then(() => {
        setEmail('')
      })
    } else {
      setEmailHasError(true)
    }
  }

  return (
    <main id="top-anchor">
      <Wrapper>
        <Pluses src="/img/decor.png" alt="" />
        <Header>
          <Container>
            <LogoLink href="#top-anchor">
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
            <Title>
              Lend & borrow fat stakes{' '}
              <div>
                at <span className="nobr">a fairer</span> interest
              </div>
            </Title>
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
                  <RatesTitle className="liquidations">flash-loans</RatesTitle>
                  <RatesDescription>
                    Borrow and repay in the same block with no&nbsp;collateral
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
            <Space height={192} heightMobile={128} />

            <Title className="title">Be the first to&nbsp;know about our launch</Title>

            <Space height={80} heightMobile={68} />
            <Form>
              <InputBox
                onFocus={() => setEmailIsFocused(true)}
                onBlur={() => setEmailIsFocused(false)}
                className={cn({ focused: !!email || emailIsFocused, error: emailHasError })}
              >
                <InputLabel>Your email</InputLabel>
                <input value={email} className="input" onChange={handleEmailChange} />
              </InputBox>

              <Button onClick={handleSubscribe}>Subscribe</Button>
            </Form>
            <Space height={192} heightMobile={192} />
          </Container>
        </Launch>
      </Wrapper>
    </main>
  )
}