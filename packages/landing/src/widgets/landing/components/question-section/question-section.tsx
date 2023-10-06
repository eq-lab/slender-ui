import { Title } from '../styled'
import { Wrapper } from './styled'
import { Faq } from './faq'
import { FaqLink } from './FaqLink'
import { DISCORD_LINK, NOTION_LINK } from '../../links'

export function QuestionSection({ subscriptionAnchor }: { subscriptionAnchor: string }) {
  return (
    <Wrapper>
      <Title>
        Questions?
        <br />
        Answers
      </Title>
      <div>
        <Faq title="What is Slender?">
          Slender is the first non-custodial Lending protocol on Stellar’s Soroban. Slender allows
          users to lend and borrow any crypto asset supported by the Soroban network. Learn more
          about how Slender works by reading the <FaqLink href={NOTION_LINK}>docs here</FaqLink>.
        </Faq>
        <Faq title="What can I do on Slender?">
          Lend or Borrow Soroban-native crypto assets. Use flash loans to borrow atomically without
          any collateral involved.
        </Faq>
        <Faq title="Does Slender have a token?">
          Slender doesn’t have a token at this moment. We will introduce the SLNR token after
          carefully crafting the protocol tokenomics and launching it in production.
        </Faq>
        <Faq title="Where can I get more info?">
          <FaqLink href={`#${subscriptionAnchor}`} sameTab>
            Subscribe to our newsletter
          </FaqLink>{' '}
          and follow Slender project posts on{' '}
          <FaqLink href={DISCORD_LINK}>Stellar’s Discord</FaqLink>. Our Social networks like Twitter
          and Discord will launch a bit later.
        </Faq>
      </div>
    </Wrapper>
  )
}
