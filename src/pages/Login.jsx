import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export const validEmailCheck = (email) => {
  const emailRegex =
    /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

  return emailRegex.test(email);
};

const Login = () => {
  const [isValid, setIsValid] = useState(false);
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('loginToken')) {
      alert('이미 로그인되어 있습니다.');
      navigate('/');
    }
  });

  const validEmailCheck = (email) => {
    const emailRegex =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

    return emailRegex.test(email);
  };

  const changeValue = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  useEffect(() => {
    if (user.password.length >= 8 && validEmailCheck(user.email)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [user]);

  const checkUser = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else return null;
      })
      .then((res) => {
        if (res !== null) {
          alert(res.message);
          localStorage.setItem('loginToken', res.token);
          navigate('/');
        } else {
          alert('로그인에 실패하였습니다.');
          setUser({ email: '', password: '' });
        }
      });
  };

  return (
    <StyledBG>
      <StyledAuthInner>
        <StyledSignH1>로그인 페이지</StyledSignH1>
        <StyledAuthForm onSubmit={checkUser}>
          <StyledLabel htmlFor="email">이메일</StyledLabel>
          <StyledAuthInput
            type="text"
            placeholder="Enter Email"
            onChange={changeValue}
            id="email"
            name="email"
            value={user.email}
          ></StyledAuthInput>
          <StyledLabel htmlFor="password">비밀번호</StyledLabel>
          <StyledAuthInput
            type="password"
            placeholder="Enter Password"
            onChange={changeValue}
            id="password"
            name="password"
            value={user.password}
          ></StyledAuthInput>
          <StyledAuthButton type="submit" value="로그인" disabled={!isValid} />
          <StyledAuthButton
            type="button"
            value="회원가입"
            onClick={() => navigate('/auth/signup')}
          />
        </StyledAuthForm>
      </StyledAuthInner>
    </StyledBG>
  );
};

export default Login;

export const StyledBG = styled.div`
  height: 100vh;
  color: black;
  background-color: rgb(230, 230, 230);
`;

export const StyledAuthInner = styled.div`
  background-color: white;
  border-radius: 20px;
  position: absolute;
  width: 500px;
  height: 400px;
  inset: 0;
  margin: auto;
  text-align: center;
`;

export const StyledSignH1 = styled.h1`
  background-color: rgb(0, 196, 0);
  border-radius: 20px 20px 0 0;
  display: block;
  padding: 20px 0 20px;
  margin-bottom: 50px;
`;

export const StyledLabel = styled.label`
  font-weight: 700;
`;

export const StyledAuthForm = styled.form`
  width: 400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 0.5rem;
`;

export const StyledAuthInput = styled.input`
  width: 100%;
  height: 30px;
`;

export const StyledAuthButton = styled.input`
  width: 49%;
  height: 30px;
  cursor: pointer;
  margin-top: 20px;

  &:disabled {
    cursor: auto;
  }
`;
