import Head from 'next/head'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Devdit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>Devdit in blockchain</div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0;
        }

        main {
          padding: 0rem 0;
        }

      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
