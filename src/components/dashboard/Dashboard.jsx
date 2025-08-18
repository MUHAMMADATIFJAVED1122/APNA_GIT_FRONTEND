import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import Navbar from "../user/Navbar";
const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setsearchQuery] = useState("");
  const [suggestedRepositories, setsuggestedRepositories] = useState([]);
  const [searchResults, setsearchResults] = useState([]);
  const [starredRepos, setStarredRepos] = useState([]); // ⭐ state for starred repos

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/repo/user/${userId}`
        );
        const data = await response.json();
        setRepositories(data.repositories);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/all`);
        const data = await response.json();
        setsuggestedRepositories(data);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    fetchSuggestedRepositories();
    fetchRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setsearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setsearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  // ⭐ function to handle starring a repo
  const handleStarRepo = (repo) => {
    if (!starredRepos.find((r) => r._id === repo._id)) {
      setStarredRepos([...starredRepos, repo]);
    }
  };

  return (
    <>  <Navbar />
    <section id="dashboard">
      {/* Suggested Repos with Star */}
      <aside>
        <h3>Suggested Repositories</h3>
        {suggestedRepositories.map((repo) => (
          <div key={repo._id} className="repo-card">
            <h4>{repo.name}</h4>
            <p>{repo.description}</p>
            {/* Open repo button */}
            {/* <button onClick={() => navigate(`/repo/${repo._id}`)}>
              Open
            </button> */}
            {/* Star repo button */}
            <button onClick={() => handleStarRepo(repo)}>⭐ Star</button>
          </div>
        ))}
      </aside>

      {/* Your Repositories */}
      <main>
        <h2>Your Repositories</h2>
        <div id="search">
          <input
            type="text"
            value={searchQuery}
            placeholder="search..."
            onChange={(e) => setsearchQuery(e.target.value)}
          />
        </div>

        {searchResults.map((repo) => (
          <div key={repo._id} className="repo-card">
            <h4>{repo.name}</h4>
            <p>{repo.description}</p>
          </div>
        ))}
      </main>

      {/* ⭐ Starred Repositories */}
      <aside>
        <h3>Starred Repositories ⭐</h3>
        {starredRepos.length === 0 ? (
          <p>No starred repositories yet</p>
        ) : (
          starredRepos.map((repo) => (
            <div key={repo._id}>
              <h4>{repo.name}</h4>
              <p>{repo.description}</p>
            </div>
          ))
        )}
      </aside>

      <aside>
        <h3>Upcoming Events</h3>
        <ul>
          <li>
            <p>Tech Conference - DEC 15</p>
          </li>
          <li>
            <p>Tech Meetup - DEC 25</p>
          </li>
          <li>
            <p>Tech Summit - DEC 5</p>
          </li>
        </ul>
      </aside>
    </section>
    </>
  );
};

export default Dashboard;
