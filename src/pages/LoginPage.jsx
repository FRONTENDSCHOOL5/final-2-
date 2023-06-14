import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { IsLogin, UserAtom } from '../recoil/AtomUserState';
import styled from 'styled-components';

import { Input } from '../components/common/Input';
import { GreenLgBtn, GreyLgBtn } from '../components/common/Button';
import PostLogin from '../api/PostLogin';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [valid, setValid] = useState(true);
  const [alertMsg, setAlertMsg] = useState('');
  const [userValue, setUserValue] = useRecoilState(UserAtom);
  const [isLogin, setIsLogin] = useRecoilState(IsLogin);

  const navigate = useNavigate();

  const handleEmailInput = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordInput = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLogin) {
      const User = await PostLogin(email, password);
      if (User.status === 422) {
        // 로그인 실패한 경우
        setValid(false);
        setAlertMsg(User.message);
        setEmail('');
        setPassword('');
      } else {
        // 로그인 성공한 경우
        // UserAtom에 로그인된 회원 정보 저장
        setUserValue(User.user);
        setValid(true);
        setAlertMsg('');
        setEmail('');
        setPassword('');
        setIsLogin(true);
        navigate('/');
      }
    }
  };

  return (
    <>
      <LoginPageStyle>
        <h1>로그인</h1>
        <form onSubmit={handleSubmit}>
          <Input
            id={'user-email'}
            type={'email'}
            label={'이메일'}
            value={email}
            valid={valid}
            onChange={handleEmailInput}
          />
          <Input
            id={'user-password'}
            type={'password'}
            label={'비밀번호'}
            value={password}
            valid={valid}
            alertMsg={alertMsg}
            onChange={handlePasswordInput}
          />
          {email && password ? (
            <GreenLgBtn type="submit" contents={'로그인'} />
          ) : (
            <GreyLgBtn type="submit" contents={'로그인'} />
          )}
        </form>
      </LoginPageStyle>
    </>
  );
}

const LoginPageStyle = styled.section`
  padding: 34px;
  width: 390px;
  height: 844px;
  background-color: var(--background-color);

  h1 {
    font-weight: var(--font--Medium);
    font-size: 24px;
    text-align: center;
    padding-bottom: 40px;
  }
`;
