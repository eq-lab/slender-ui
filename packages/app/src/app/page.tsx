import '@marginly/ui/styles/reset.css'
import { Providers } from '../global/providers'
import { Header } from '../widgets/header'

export default function Home() {
  return (
    <main>
      <Providers>
        <Header />
      </Providers>
    </main>
  )
}
