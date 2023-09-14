'use client'

import React, { ChangeEvent, FormEvent, useState } from 'react'
import { Button, Container, Form, InputBox, InputLabel, Title } from '@/widgets/landing/styled'
import cn from 'classnames'
import { sendEmail } from '@/widgets/landing/api'
import { Space } from '@/widgets/landing/space'

export function SubscriptionSection() {
  const [email, setEmail] = useState('')

  const [emailIsFocused, setEmailIsFocused] = useState(false)
  const [emailHasError, setEmailHasError] = useState(false)
  const [emailIsSent, setEmailIsSent] = useState(false)

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setEmailHasError(false)
  }

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const emailIsValid = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
    setEmailHasError(!emailIsValid)
    if (emailIsValid) {
      sendEmail(email).then(() => {
        setEmailIsSent(true)
        setEmail('')
      })
    } else {
      setEmailHasError(true)
    }
  }

  return (
    <Container>
      <Space $height={192} $heightMobile={128} />

      <Title className="title">
        {emailIsSent ? (
          <>We will send you an email about our&nbsp;launch</>
        ) : (
          <>Be the first to&nbsp;know about our&nbsp;launch</>
        )}
      </Title>

      <Space $height={80} $heightMobile={68} />
      {emailIsSent ? (
        <Form>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/email.svg" alt="" className="email" />
        </Form>
      ) : (
        <Form onSubmit={handleSubscribe}>
          <InputBox
            onFocus={() => setEmailIsFocused(true)}
            onBlur={() => setEmailIsFocused(false)}
            className={cn({ focused: email || emailIsFocused, error: emailHasError })}
          >
            <InputLabel>Your email</InputLabel>
            <input value={email} className="input" onChange={handleEmailChange} />
          </InputBox>

          <Button type="submit">Subscribe</Button>
        </Form>
      )}
      <Space $height={192} $heightMobile={192} />
    </Container>
  )
}
