import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
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
          dispatch(detailAction.setIsOpen(false));
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

  const timeOutline = (time) => {
    const year = time.substring(0, 4);
    const month = time.substring(5, 7);
    const day = time.substring(8, 10);
    const hour = time.substring(11, 13);
    const minute = time.substring(14, 16);

    return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
  };

  return (
    <StyledTodoDetail>
      {detail.id === '' ? (
        ''
      ) : (
        <StyledForm onSubmit={detail.isUp ? updateTodo : deleteTodo}>
          <StyledLabel htmlFor="content">생성일 </StyledLabel>
          <StyledInput
            type="text"
            name="title"
            id="title"
            value={timeOutline(detail.createdAt)}
            onChange={changeValue}
            disabled={!detail.isUp}
          />
          <StyledLabel htmlFor="content">수정일 </StyledLabel>
          <StyledInput
            type="text"
            name="title"
            id="title"
            value={timeOutline(detail.updatedAt)}
            onChange={changeValue}
            disabled={!detail.isUp}
          />
          <StyledLabel htmlFor="title">제목 </StyledLabel>
          <StyledInput
            type="text"
            name="title"
            id="title"
            value={detail.isUp ? todo.title : detail.title}
            onChange={changeValue}
            disabled={!detail.isUp}
          />
          <StyledLabel htmlFor="content">내용 </StyledLabel>
          <StyledContent
            name="content"
            id="content"
            value={detail.isUp ? todo.content : detail.content}
            onChange={changeValue}
            disabled={!detail.isUp}
          />
          <StyledDetailBtn
            type="submit"
            value={detail.isUp ? '확인' : '삭제'}
          />
          <StyledDetailBtn
            type="button"
            value={detail.isUp ? '취소' : '수정'}
            onClick={() => {
              dispatch(detailAction.setIsUp(!detail.isUp));
              setTodo({ title: detail.title, content: detail.content });
            }}
          />
        </StyledForm>
      )}
      <StyledCancelBtn
        onClick={() => {
          dispatch(detailAction.setIsOpen(false));
        }}
      >
        X
      </StyledCancelBtn>
    </StyledTodoDetail>
  );
};

export default TodoDetail;

const StyledTodoDetail = styled.div`
  background-color: rgb(200, 200, 200);
  z-index: 10;
  position: absolute;
  width: 100%;
  height: 60%;
  inset: 0;
  margin: auto;
  padding: 15px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-top: 25px;
`;

const StyledLabel = styled.label`
  width: 20%;
  height: 30px;
  text-align: center;
  line-height: 33px;
`;

const StyledContent = styled.textarea`
  width: 80%;
  height: 300px;
  overflow-y: auto;
  resize: none;
  padding: 5px;
`;

const StyledInput = styled.input`
  width: 80%;
  padding: 5px;
`;

const StyledDetailBtn = styled.input`
  width: 49%;
  height: 30px;
  margin-top: 8px;
  cursor: pointer;
`;

const StyledCancelBtn = styled.button`
  position: absolute;
  width: 20px;
  height: 20px;
  top: 10px;
  right: 15px;
  cursor: pointer;
`;
