import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { detailAction } from '../reducers/DetailReducer';
import { StyledBG } from './Login';
import TodoDetail from './TodoDetail';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState({
    title: '',
    content: '',
  });
  const navigate = useNavigate();
  const detail = useSelector((state) => state.detail);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!localStorage.getItem('loginToken')) {
      alert('로그인이 필요합니다.');
      navigate('/auth/login');
    }
  });

  useEffect(() => {
    const loginToken = localStorage.getItem('loginToken');
    fetch('http://localhost:8080/todos', {
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
          setTodos(res.data);
        } else {
          alert('리스트 호출에 실패하였습니다.');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [todo, detail]);

  const changeValue = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTodo({ ...todo, [name]: value });
  };
  const addTodo = (e) => {
    const loginToken = localStorage.getItem('loginToken');

    e.preventDefault();
    fetch('http://localhost:8080/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `${loginToken}`,
      },
      body: JSON.stringify(todo),
    })
      .then((res) => {
        console.log(res);
        if (res.status === 200) return res.json();
        else return null;
      })
      .then((res) => {
        if (res !== null) {
          setTodo({ title: '', content: '' });
        } else {
          alert('리스트 등록에 실패하였습니다.');
          setTodo({ title: '', content: '' });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <StyledBG>
      <StyledTodoInner>
        <StyledH1>Todo List</StyledH1>
        <StyledLogoutBtn
          onClick={() => {
            localStorage.removeItem('loginToken');
            navigate('/auth/login');
          }}
        >
          로그아웃
        </StyledLogoutBtn>
        <form onSubmit={addTodo}>
          <StyledTodoInput
            type="text"
            placeholder="제목을 입력하세요."
            onChange={changeValue}
            name="title"
            value={todo.title}
          />
          <br />
          <StyledTodoInput
            type="text"
            placeholder="내용을 입력하세요."
            onChange={changeValue}
            name="content"
            value={todo.content}
          />
          <br />
          <StyledAddBtn type="submit" value="추가" />
        </form>
        <StyledTodo>
          <StyledTodoList>
            {todos.map((todo) => {
              return (
                <div key={todo.id}>
                  <h3>제목: {todo.title}</h3>
                  <input
                    type="button"
                    value="상세보기"
                    onClick={() => {
                      dispatch(detailAction.setId(todo.id));
                      dispatch(detailAction.setIsUp(false));
                      dispatch(detailAction.setIsOpen(true));
                    }}
                  />
                </div>
              );
            })}
          </StyledTodoList>
          {detail.isOpen && <TodoDetail />}
        </StyledTodo>
      </StyledTodoInner>
    </StyledBG>
  );
};

export default TodoList;

const StyledTodoInner = styled.div`
  border-radius: 20px;
  position: absolute;
  width: 500px;
  height: 800px;
  inset: 0;
  margin: auto;
  background: #fff;
  background-color: white;
`;
const StyledH1 = styled.h1`
  background-color: rgb(0 196 0);
  border-radius: 20px 20px 0 0;
  padding: 20px 0;
  text-align: center;
`;
const StyledTodoInput = styled.input`
  width: 75%;
  height: 30px;
  margin: 10px 0 0 10px;
`;

const StyledAddBtn = styled.input`
  position: absolute;
  width: 20%;
  height: 70px;
  right: 10px;
  top: 92px;
`;

const StyledLogoutBtn = styled.button`
  position: absolute;
  right: 20px;
  top: 30px;
  height: 30px;
`;

const StyledTodo = styled.div`
  display: flex;
  height: 610px;
  margin-top: 10px;
  overflow-y: auto;
`;
const StyledTodoList = styled.div`
  padding: 10px;
`;
