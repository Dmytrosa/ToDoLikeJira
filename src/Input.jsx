import React, { useState, useEffect } from 'react';
import inputStore from './stores/inputStore';
import inputActions from './actions/inputActions';
import dispatcher from './dispatchers/dispatcher';
import Modal from './Modal';
import './App.css';

export const InputField = ({ onFetchIssues }) => {
  const [value, setValue] = useState(inputStore.getValue());
  const [fetching, setFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [own, setOwner] = useState();
  const [rep, setRepo] = useState();
  const [modalShow, setModalShow] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  const handleCloseModal = () => {
    setModalShow(false)
  }

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
        setModalShow(true)
          setModalMessage("Invalid GitHub repository URL")
              }
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues?per_page=100&page=${page}`
      )
      if (!response.ok) {
        setModalShow(true)
          setModalMessage(`GitHub API request failed: ${response.status}`)
      }

      const issues = await response.json();

      setPage((prevPage) => prevPage + 1);
      onFetchIssues(issues, repoUrl);
    } catch (error) {
      console.error(error.message);
      alert(error.message)
    }
    finally {
      setFetching(false)
    }
  };

  const handleClear = (e) => {
    e.preventDefault()
    setTimeout(() => { localStorage.clear();
      window.location.reload()  }, 2000)
    setModalShow(true)
    if(localStorage.length){
      setModalMessage("LocalStore Deleted")
    } 
    else{
      setModalMessage("LocalStore Is Already Empty")
    }
  }


  return (
    <>
      <form>
        <div className='center' >
          <input
            className='serch'
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <button type="submit" className='fetch'
            onClick={fetchIssues} disabled={fetching}>Fetch Issues</button>
          {modalShow ? 
          <Modal onClose={handleCloseModal} ><p>{modalMessage}</p></Modal>:
            <></>
          }
          <button className='fetch' onClick={handleClear}> Delete Store</button>
        </div>
      </form>
      <div className='center'>
        {
          (own) ?
            <div className=' anc '><a href={`https://github.com/${own}`}>{own}</a>/
              <a href={`https://github.com/${own}/${rep}`}>{rep}</a></div>
            : <></>
        }
      </div>
    </>
  );
};

