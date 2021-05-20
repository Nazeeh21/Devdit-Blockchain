import Head from 'next/head';
import { Layout } from '../components/Layout';
import PostFactory from '../ethereum/PostFactory';

interface HomeProps {
  manager: String;
  isRegistered: Boolean
};

const Home = ({ manager, isRegistered }: HomeProps) => {
  return (
    <div className='container'>
      <Head>
        <title>Devdit</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <Layout>
          <div>Devdit in blockchain</div>
          <div>Manager: {manager}</div>
          <div>is Current User Registered: {`${isRegistered}`}</div>
        </Layout>
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
  );
};

Home.getInitialProps = async ({}) => {
  // @ts-ignore
  const manager = await PostFactory.manager();
  const isRegistered = await PostFactory.isRegistered()
  // console.log(isRegistered);
  
  // console.log('manager: ', manager);
  return { manager, isRegistered };
};

export default Home;
