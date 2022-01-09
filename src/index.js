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

const token = process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN;

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${token}`
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
  return (
    <div>
      <div className="upper">
        <h2>My Repositories 🚀</h2>
        < SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <div className="repo-list container">
        {filteredRepos && filteredRepos.map(repo => <div className="card" key={repo.name}>{repo.name}</div>)}
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


// [X] 1. Front end -> cards per repo (1-2pm)
// [X] 2. Token situation (2-3pm)
// [ ] 3. Heroku (Sun morning) (4:30-5:30pm)
// [ ] 4. Write README & Pseudocode (Sun morning) (5:30-6pm)
// [ ] 5. Responsiveness
// [ ] 6. Testing with an existing user, nonexisting user,
//        and repos found and not found (Sat morning) (6-8:30pm)
// [ ] 7. Refactor code
// [ ] 8. Avatar of user (8:30-9:30pm)
// [ ] 9. More Repo info
