import type { NextPage } from 'next'
import Head from 'next/head'
import Banner from '../components/Banner'
import Header from '../components/Header'

const Home: NextPage = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Medium Blog with NextJS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Banner />
    </div>
  )
}

export default Home
