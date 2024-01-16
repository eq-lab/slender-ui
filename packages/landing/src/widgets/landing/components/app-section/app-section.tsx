'use client';

import Image from 'next/image';
import React from 'react';
import { ReactComponent as LogoSlenderIcon } from '@slender/shared/icons/logo/slender.svg';
import cn from 'classnames';
import { ReactComponent as StellarIcon } from '../../images/stellar.svg';
import { ReactComponent as FundIcon } from '../../images/fund.svg';
import screenAppImage from './screenapp.png';
import screenAppMobileImage from './screenapp-mobile.png';
import {
  AppButton,
  Fund,
  MobileWrapper,
  Protocol,
  ProtocolRow,
  ScreenApp,
  DesktopWrapper,
  ImageWrapper,
} from './styled';

export function AppSection({ appLink }: { appLink: string }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <>
      <DesktopWrapper>
        <ScreenApp className={cn({ hovered: isHovered })}>
          <Image
            src={screenAppImage}
            alt="a screenshot of the app"
            fill
            style={{
              objectFit: 'contain',
            }}
            sizes="89vw"
          />

          <ProtocolRow
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn({ hovered: isHovered })}
          >
            <Protocol>
              #1 lending protocol on <StellarIcon width={128} />
            </Protocol>
            <Fund>
              <FundIcon /> <span>Supported by Stellar Community Fund</span>
            </Fund>
            <a href={appLink}>
              <AppButton>
                <LogoSlenderIcon width={24} />
                Enter App
              </AppButton>
            </a>
          </ProtocolRow>
        </ScreenApp>
      </DesktopWrapper>
      <MobileWrapper>
        <ImageWrapper>
          <Image
            src={screenAppMobileImage}
            alt="a screenshot of the app"
            fill
            style={{
              objectFit: 'contain',
            }}
            sizes="97vw"
          />
        </ImageWrapper>
        <Protocol className="mobile">
          #1 lending protocol on <StellarIcon width={128} />
        </Protocol>
        <Fund>
          <FundIcon /> <span>Supported by Stellar Community Fund</span>
        </Fund>
      </MobileWrapper>
    </>
  );
}
