import React, { useState, useEffect } from 'react';
import inputStore from './stores/inputStore';
import inputActions from './actions/inputActions';
import dispatcher from './dispatchers/dispatcher';
// import './App.css';

export const InputField = ({ onFetchIssues }) => {
  const [value, setValue] = useState(inputStore.getValue());
  const [fetching, setFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [own, setOwner] = useState();
  const [rep, setRepo] = useState();

  const updateValue = () => {
    setValue(inputStore.getValue());
  };

  useEffect(() => {
    inputStore.on('change', updateValue);
    return () => {
      inputStore.removeListener('change', updateValue);
    };
  }, []);

  const handleChange = (e) => {
    dispatcher.dispatch(inputActions.updateInput(e.target.value));
  };

  const handleFocus = (e) => {
    if (e.target.value === 'Enter repo url:' || e.target.value === 'Please, enter repo url ;(') {
      dispatcher.dispatch(inputActions.updateInput(''));
    }
  };

  const handleBlur = (e) => {
    if (e.target.value === '') {
      dispatcher.dispatch(inputActions.updateInput('Please, enter repo url ;('));
    }
  };
 

  const fetchIssues = async () => {
    setFetching(true);

    const repoUrl = value;
  try {
    const parsedUrl = new URL(repoUrl);
    const [, owner, repo] = parsedUrl.pathname.split('/');
    setOwner(owner)
    setRepo(repo)
    if (!owner || !repo) {
      alert('Invalid GitHub repository URL');
    }

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues?per_page=30&page=${page}`
      );
      

    if (!response.ok) {
      alert(`GitHub API request failed: ${response.status}`);
    }

    const issues = await response.json();
    console.log(issues);

    setPage((prevPage) => prevPage + 1);
    onFetchIssues(issues, repoUrl);
  } catch (error) {
    console.error(error.message);
  }
  finally{
    setFetching(false)
  }
};

  return (
    <>
    <div className='center' >
      <input
        className='serch'
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <button className='fetch'
        onClick={fetchIssues} disabled={fetching}>Fetch Issues</button>
    </div>
    <div className='center'>
      {
      (own) ? 
      <div className=' anc '><a href ={`https://github.com/${own}`}>{own}</a>/
      <a href={`https://github.com/${own}/${rep}`}>{rep}</a></div>
      : <></>
       }
      
    </div>
    </>
  );
};

