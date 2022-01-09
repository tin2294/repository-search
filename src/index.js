import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import './App.css';
import SearchBar from './search';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import 'bootstrap/dist/css/bootstrap.min.css';


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


const filterRepos = (repos, query) => {
  if (!query) {
    return repos;
  }
  const finalRepos = repos && repos.filter((repo) => {
    const repoName = repo.name.toLowerCase();
    return repoName.includes(query);
  });
  return finalRepos ;
};


function GetRepos() {
  const { loading, error, data } = useQuery(GET_REPOSITORIES);
  if (loading) return;
  if (error) return;
  var repos = data.viewer.repositories.edges.map(({ node }) => (
    { name: node.name }
  ));
  return (
    repos
  );
};


function App() {
  const { search } = window.location;
  const query = new URLSearchParams(search).get('s');
  const repos1 = GetRepos();
  const [searchQuery, setSearchQuery] = useState(query || '');
  const filteredRepos = filterRepos(repos1, searchQuery);
  console.log(filteredRepos);
  return (
    <div>
      <h2>Repositories 🚀</h2>
      < SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="repo-list">
        {filteredRepos && filteredRepos.map(repo => <div key={repo.name}>{repo.name}</div>)}
      </div>
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
// 7. Avatar of user
// 8. More Repo info
