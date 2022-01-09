// import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// search bar on the page
const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <div class="wrap">
    <form class="search" action="/" method="get">
      <div>
        <label htmlFor="header-search">
          <span className="visually-hidden">Search Repositories</span>
        </label>
        <input
          // in order to get the value as we type
          value={searchQuery}
          onInput={e => setSearchQuery(e.target.value)}
          type="text"
          className="searchTerm"
          id="header-search"
          placeholder="Search Repositories"
          name="s"
        />
      </div>
      <button type="submit" className="searchButton">
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </form>
  </div>
);

export default SearchBar;
