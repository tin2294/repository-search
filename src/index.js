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


// Connecting to the GitHub v4 API
const token = process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN;

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${token}`
  }
});


// GraphQL query in order to get repositories from the API
const GET_REPOSITORIES = gql`
   query repositories {
    viewer {
        login
        repositories(first: 50) {
            edges {
                node {
                name
                }
            }
        }
    }
}
`;


// filterRepos filters the full list of repositories based on the search term (query)
// it returns an array with the names of the repositories
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


// GetRepos performs the GQL query GET_REPOSITORIES and returns the information
// from the query to the API.
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


// Main App rendered in the body of the HTML
function App() {
  // retrieve the search term from the url
  const { search } = window.location;
  const query = new URLSearchParams(search).get('s');

  // get results as we type on the searchbar
  const [searchQuery, setSearchQuery] = useState(query || '');

  // call the filterRepos function that filters all the repositories called by
  // GetRepos based on the search term that searchQuery gets
  const filteredRepos = filterRepos(GetRepos(), searchQuery);
  return (
    <div>
      <div className="upper">
        <h2>My Repositories 🚀</h2>
        < SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <div className="repo-list container-cards">
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
// [X] 3. Heroku (Sun morning) (4:30-5:30pm)
// [X] 4. Write README & Pseudocode (Sun morning) (5:30-6pm)
// [ ] 5. Responsiveness
// [ ] 6. Testing with an existing user, nonexisting user,
//        and repos found and not found (Sat morning) (6-8:30pm)
// [ ] 7. Refactor code & finish README
// [ ] 8. Avatar of user (8:30-9:30pm)
// [ ] 9. More Repo info
