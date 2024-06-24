import { ReactComponent as DiscordLogo } from '@slender/shared/icons/logo/discord.svg';
import { ReactComponent as GithubLogo } from '@slender/shared/icons/logo/github.svg';
import { ReactComponent as NotionLogo } from '@slender/shared/icons/logo/notion.svg';
import { ReactComponent as TwitterLogo } from '@slender/shared/icons/logo/twitter.svg';
import { ButtonsWrapper, Wrapper } from './footer.styled';
import { Title } from '../styled';
import { DISCORD_LINK, GITHUB_PROTOCOL_LINK, NOTION_LINK, TWITTER_LINK } from '../../links';
import { FooterLink } from './footer-link';

export function Footer() {
  return (
    <Wrapper>
      <Title>Join our community</Title>
      <ButtonsWrapper>
        <FooterLink href={TWITTER_LINK} title="Twitter">
          <TwitterLogo width={24} />
        </FooterLink>
        <FooterLink href={DISCORD_LINK} title="Discord">
          <DiscordLogo width={24} />
        </FooterLink>
        <FooterLink href={GITHUB_PROTOCOL_LINK} title="Protocol GitHub">
          <GithubLogo width={24} />
        </FooterLink>
        <FooterLink href={NOTION_LINK} title="Notion">
          <NotionLogo width={24} />
        </FooterLink>
      </ButtonsWrapper>
    </Wrapper>
  );
}
