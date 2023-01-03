import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export const StyledBG = styled.div`
  background-color: rgb(150, 150, 150);
  height: 100vh;
  color: white;
`;

export const StyledAuthInner = styled.div`
  position: relative;
  width: 500px;
  margin: 0 auto;
  padding: 30vh 0 0;
  text-align: center;
`;

export const StyledAuthForm = styled.form`
  width: 300px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 0.5rem;
`;

export const StyledAuthInput = styled.input`
  width: 100%;
`;

export const StyledAuthButton = styled.input`
  width: 100%;
  cursor: pointer;

  &:disabled {
    cursor: auto;
  }
`;

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

  const submitUser = (e) => {
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
        <div>
          <h1>로그인 페이지</h1>
        </div>
        <div>
          <StyledAuthForm onSubmit={submitUser}>
            <label htmlFor="email">Email</label>
            <StyledAuthInput
              type="text"
              placeholder="Enter Email"
              onChange={changeValue}
              id="email"
              name="email"
              value={user.email}
            ></StyledAuthInput>
            <label htmlFor="password">password</label>
            <StyledAuthInput
              type="password"
              placeholder="Enter Password"
              onChange={changeValue}
              id="password"
              name="password"
              value={user.password}
            ></StyledAuthInput>
            <StyledAuthButton
              type="submit"
              value="로그인"
              disabled={!isValid}
            />
            <StyledAuthButton
              type="button"
              value="회원가입"
              onClick={() => navigate('/auth/signup')}
            />
          </StyledAuthForm>
        </div>
      </StyledAuthInner>
    </StyledBG>
  );
};

export default Login;
