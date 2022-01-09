import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import SearchBar from './Search';
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

// GraphQL query in order to get the logged in user's avatar url
const GET_AVATAR = gql`
  query GetAbout {
    viewer {
        login
        id
        name
        bio
        avatarUrl
        location
        url
        status {
          emojiHTML
          message
        }
        company
      }
    }
`;


// function to execute the avatar query and get the png url
function GetAvatar() {
  const { loading, error, data } = useQuery(GET_AVATAR);
  if (loading) return;
  if (error) return;
  return (
    `${data.viewer.avatarUrl}.png`
    // data.viewer
  );
};


// function to execute the avatar query and get the png url
function GetUsername() {
  const { loading, error, data } = useQuery(GET_AVATAR);
  if (loading) return;
  if (error) return;
  return (
    // `${data.viewer.avatarUrl}.png`
    data.viewer.login
  );
};



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
  if (filteredRepos) {var count = filteredRepos.length};
  // calling the avatar function
  const avatar = GetAvatar();
  const username = GetUsername();

  return (
    <div>
      <div className="upper">
        <div className="user">
          <img class="avatar-large" alt="avatar-large" src={avatar} />
          <h6>{username}</h6>
        </div>
        <div className="title">
          <h2>My Repositories 🚀
          </h2>
        </div>
        < SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <div className="lower">
        <div className="count">{count} repositories found</div>
        <div className="repo-list container-cards">
          {filteredRepos && filteredRepos.map(repo => <div className="card" key={repo.name}>{repo.name}</div>)}
        </div>
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
// to  log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
