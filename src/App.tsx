import React, { useState, useEffect } from 'react';
import { InputField } from './Input'
import './App.css';

interface Item {
  id: number;
  title: string;
  updated_at: string;
  type: string;
  comment: number;
}
interface Board {
  id: number;
  title: string;
  items: Item[];
}
interface BoardItem {
  id: number;
  title: string;
  updated_at: string;
  type: string;
  comment: number;
}
interface BoardData {
  url: string;
  boards: Board[];
}
interface Issue {
  number: number;
  title: string;
  state: string;
  assignee: any;
  updated_at: string;
  user: {
    type: string;
  };
  comments: number;
}

const App: React.FC = () => {

  const [issues, setIssues] = useState<any[]>(null);////
  const [boards, setBoards] = useState<Board[]>([
    { id: 1, title: "ToDo", items: [] },
    { id: 2, title: "in Progress", items: [] },
    { id: 3, title: "Done", items: [] },
  ]);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null)
  const [currentItem, setCurrentItem] = useState<Item | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false);


  useEffect(() => {
    const savedBoards = localStorage.getItem("boards");
    if (savedBoards) {
      const boardsData = JSON.parse(savedBoards);
      const boardForUrl = boardsData.find((boardData: BoardData) => boardData.url === inputUrl);
      if (boardForUrl) {
        setBoards(boardForUrl.boards);
      }
    }
   
  }, [inputUrl]);

  


  useEffect(() => {
    saveBoardsToLocalStorage();
  }, [boards, inputUrl]);
  //збереження даних у ls

  useEffect(() => {
    if (isLoading && issues.length > 0) {
      sortIssues(issues);
      setIsLoading(false);
    }
  }, [issues, isLoading]);
  //старт сортування

  function saveBoardsToLocalStorage() {
    if (inputUrl) {
      const savedBoards = localStorage.getItem("boards");
      let boardsData = [];
      if (savedBoards) {
        boardsData = JSON.parse(savedBoards) 
        const existingIndex = boardsData.findIndex((boardData: BoardData) => boardData.url === inputUrl);
        if (existingIndex !== -1) {
          boardsData[existingIndex].boards = boards;
        } else {
          boardsData.push({ url: inputUrl, boards });
        }
      } else {
        boardsData.push({ url: inputUrl, boards });
      }
      localStorage.setItem("boards", JSON.stringify(boardsData));
    }
  }

  // const handleIssues = (fetchedIssues: Issue[], url: string) => {
  //   setIsLoading(true);
  //   setIssues(fetchedIssues);
  //   setInputUrl(url);
  
  //   const savedBoards = localStorage.getItem("boards");
  //   if (savedBoards) {
  //     const boardsData = JSON.parse(savedBoards);
  //     const boardForUrl = boardsData.find(
  //       (boardData: BoardData) => boardData.url === url
  //     );
  //     if (boardForUrl) {
  //       // Update the boards with the data from localStorage
  //       setBoards(boardForUrl.boards);
  //     } else {
  //       setBoards([
  //         { id: 1, title: "ToDo", items: [] },
  //         { id: 2, title: "In Progress", items: [] },
  //         { id: 3, title: "Done", items: [] },
  //       ]);
  //     }
  //   }
  // };

  const handleIssues = (fetchedIssues: Issue[], url: string) => {
    setIsLoading(true);
    setIssues(fetchedIssues);
  
    setBoards([
      { id: 1, title: "ToDo", items: [] },
      { id: 2, title: "In Progress", items: [] },
      { id: 3, title: "Done", items: [] },
    ]);
  
    const savedBoards = localStorage.getItem("boards");
    if (savedBoards) {
      const boardsData = JSON.parse(savedBoards);
      const boardForUrl = boardsData.find(
        (boardData: BoardData) => boardData.url === url
      );
      if (boardForUrl) {
        // Update the boards with the data from localStorage
        setBoards(boardForUrl.boards);
      }
    }
  
    setInputUrl(url);
  };
  
  

  const dragOverHandler = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.target instanceof HTMLElement && e.target.className === "item") {
      e.target.style.boxShadow = "0 400px 300px green";
    }
  };

  const dragLeaveHandler = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.style.boxShadow = 'none';
    }
  };

  const dragEndHandler = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.style.boxShadow = 'none';
    }
  };
  const dragStartHandler = (e: React.DragEvent, board: Board, item: BoardItem) => {
    setCurrentBoard(board)
    setCurrentItem(item)
  }
  const dropHandler = (e: React.DragEvent, board: Board, item: BoardItem) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.target instanceof HTMLElement) {
      e.target.style.boxShadow = 'none';
    }
    const currentIndex = currentBoard.items.indexOf(currentItem)
    currentBoard.items.splice(currentIndex, 1)
    const dropIndex = board.items.indexOf(item)
    board.items.splice(dropIndex + 1, 0, currentItem)
    setBoards(boards.map(b =>{
      
      if (b.id === board.id) {
        return board
      }
      if (b.id === currentBoard.id) {
        return currentBoard
      }
      return b 
      
    }))
  }

  function sortIssues(issues: Issue[]) {
    issues.forEach((issue) => {
      if (issue.state === 'open') {

        if (issue.assignee !== null) {
          boards[1].items.unshift({
            id: issue.number,
            title: issue.title,
            updated_at: issue.updated_at.replace(/[a-zA-Z]/g, ' '),
            type: issue.user.type,
            comment: issue.comments,
          });

        } else {
          boards[0].items.unshift({
            id: issue.number,
            title: issue.title,
            updated_at: issue.updated_at.replace(/[a-zA-Z]/g, ' '),
            type: issue.user.type,
            comment: issue.comments,
          });
        }

      } else if (issue.state === 'closed') {
        boards[2].items.unshift({
          id: issue.number,
          title: issue.title,
          updated_at: issue.updated_at.replace(/[a-zA-Z]/g, ' '),
          type: issue.user.type,
          comment: issue.comments,
        });
      }
    });
  }


  function dropCardHandler(e: React.DragEvent, board: Board) {
    board.items.push(currentItem)
    const currentIndex = currentBoard.items.indexOf(currentItem)
    currentBoard.items.splice(currentIndex, 1)
    setBoards(boards.map(b => {
      if (b.id === board.id) {
        return board
      }
      if (b.id === currentBoard.id) {
        return currentBoard
      }
      return b
    }))
  }

  return (
    <div className='App'>
      <InputField onFetchIssues={(issues: Issue[], url: string) => handleIssues(issues, url)} />
      <div className='ToDo'>
        {boards.map(board =>
          <div className='board' 
            onDragOver={(e) => { dragOverHandler(e) }}
            onDrop={(e) => dropCardHandler(e, board)}
            // key={board.id}
          >
            <div className='container'>
              <div className='board__title'>{board.title}</div>
              {board.items.map(item =>
                <div 
                //  key ={item.id}
                  onDragOver={(e) => { dragOverHandler(e) }}
                  onDragLeave={e => dragLeaveHandler(e)}
                  onDragEnd={(e) => { dragEndHandler(e) }}
                  onDragStart={(e) => { dragStartHandler(e, board, item) }}
                  onDrop={(e) => { dropHandler(e, board, item) }}
                  draggable='true' className='item text-wrap'>
                  <div >№{item.id}</div>
                  <div className='title'> title: {item.title}</div>
                  <div className='board__updated_at'>updated: {item.updated_at}</div>
                  <div>{item.type} | Comments:{item.comment}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App;
