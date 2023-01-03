import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailAction } from '../reducers/DetailReducer';

const TodoDetail = () => {
  const detail = useSelector((state) => state.detail);
  const dispatch = useDispatch();
  const [todo, setTodo] = useState({
    title: detail.title,
    content: detail.content,
  });

  const changeValue = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTodo({ ...todo, [name]: value });
  };

  const deleteTodo = (e) => {
    const loginToken = localStorage.getItem('loginToken');

    e.preventDefault();

    fetch(`http://localhost:8080/todos/${detail.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `${loginToken}`,
      },
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else return null;
      })
      .then((res) => {
        if (res !== null) {
          dispatch(detailAction.setDetail({ title: '', content: '' }));
          dispatch(detailAction.setId(''));
          dispatch(detailAction.setIsUp(false));
        } else {
          alert('todo 삭제에 실패하였습니다.');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateTodo = (e) => {
    const loginToken = localStorage.getItem('loginToken');

    e.preventDefault();

    fetch(`http://localhost:8080/todos/${detail.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `${loginToken}`,
      },
      body: JSON.stringify(todo),
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else return null;
      })
      .then((res) => {
        if (res !== null) {
          dispatch(detailAction.setDetail(res.data));
          dispatch(detailAction.setIsUp(false));
        } else {
          alert('todo 수정에 실패하였습니다.');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const loginToken = localStorage.getItem('loginToken');

    if (detail.id !== '') {
      fetch(`http://localhost:8080/todos/${detail.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `${loginToken}`,
        },
      })
        .then((res) => {
          if (res.status === 200) return res.json();
          else return null;
        })
        .then((res) => {
          if (res !== null) {
            dispatch(detailAction.setDetail(res.data));
          } else {
            alert('todo 호출에 실패하였습니다.');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [detail, dispatch]);

  return (
    <div>
      {detail.id === '' ? (
        ''
      ) : (
        <form onSubmit={detail.isUp ? updateTodo : deleteTodo}>
          <label htmlFor="title">제목: </label>
          <input
            type="text"
            name="title"
            id="title"
            value={detail.isUp ? todo.title : detail.title}
            onChange={changeValue}
            disabled={!detail.isUp}
          />
          <label htmlFor="content">내용: </label>
          <input
            type="text"
            name="content"
            id="content"
            value={detail.isUp ? todo.content : detail.content}
            onChange={changeValue}
            disabled={!detail.isUp}
          />
          <input type="submit" value={detail.isUp ? '확인' : '삭제'} />
          <input
            type="button"
            value={detail.isUp ? '취소' : '수정'}
            onClick={() => {
              dispatch(detailAction.setIsUp(!detail.isUp));
              setTodo({ title: detail.title, content: detail.content });
            }}
          />
        </form>
      )}
    </div>
  );
};

export default TodoDetail;
