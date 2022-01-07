import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import './App.css';
// import SearchPage from './SearchPage';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";


const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer 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`
  }
});

const GET_REPOSITORIES = gql`
   query repositories {
    viewer {
        login
        repositories(first: 30) {
            edges {
                node {
                name
                }
            }
        }
    }
}
`;

function RepositoriesList() {

  const { loading, error, data } = useQuery(GET_REPOSITORIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.viewer.repositories.edges.map(({ node }) => (
    <div key={node.name}>
      <p>
        {node.name}
      </p>
    </div>
  ));
};


// const client = new ApolloClient({
//   uri: 'https://48p1r2roz4.sse.codesandbox.io',
//   cache: new InMemoryCache()
// });


function App() {
  return (
    <div>
      <h2>My first Apollo app 🚀</h2>
      < RepositoriesList />
    </div>
  );
};


ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// 1. Fetch info from API and organize (Fri morning)
// 2. Implement Search Function and figure out what user is in: maybe a form? (Fri evening)
// 3. Front end (Fri evening, Sat morning)
// 4. Testing with an existing user, nonexisting user, and repos found and not found (Sat morning)
// 5. Write README (Sun morning)
// 6. Heroku (Sun morning)
