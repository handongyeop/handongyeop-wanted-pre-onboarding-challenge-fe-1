import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  StyledAuthButton,
  StyledAuthForm,
  StyledAuthInner,
  StyledAuthInput,
  StyledBG,
  validEmailCheck,
} from './Login';

const Login = () => {
  const [signUpValid, setSignUpValid] = useState(false);
  const [signUpUser, setSignUpUser] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const changeValue = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSignUpUser({ ...signUpUser, [name]: value });
  };

  useEffect(() => {
    if (signUpUser.password.length >= 8 && validEmailCheck(signUpUser.email)) {
      setSignUpValid(true);
    } else {
      setSignUpValid(false);
    }
  }, [signUpUser]);

  const submitUser = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(signUpUser),
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else return null;
      })
      .then((res) => {
        if (res !== null) {
          alert(res.message);
          navigate('/auth/login');
        } else {
          alert('회원가입에 실패하였습니다.');
        }
      });
  };

  return (
    <StyledBG>
      <StyledAuthInner>
        <div>
          <h1>회원가입 페이지</h1>
        </div>
        <div>
          <StyledAuthForm onSubmit={submitUser}>
            <label htmlFor="email">Email</label>
            <StyledAuthInput
              type="text"
              placeholder="ex) test@test.com"
              onChange={changeValue}
              id="email"
              name="email"
              value={signUpUser.email}
            ></StyledAuthInput>
            <label htmlFor="password">password</label>
            <StyledAuthInput
              type="password"
              placeholder="8자 이상 입력해주세요."
              onChange={changeValue}
              id="password"
              name="password"
              value={signUpUser.password}
            ></StyledAuthInput>
            <StyledAuthButton
              type="submit"
              value="회원가입"
              disabled={!signUpValid}
            />
            <StyledAuthButton
              type="button"
              value="뒤로가기"
              onClick={() => navigate(-1)}
            />
          </StyledAuthForm>
        </div>
      </StyledAuthInner>
    </StyledBG>
  );
};

export default Login;
