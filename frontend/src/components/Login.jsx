import React, { useContext } from 'react';
import AuthPage from './AuthPage.jsx';
import { AuthContext } from '../contexts/AuthContext.jsx';

const Login = () => {
  const { login } = useContext(AuthContext);

  return (
    <AuthPage
      mode="login"
      title="Sign in to your account"
      subtitle="Access your cart, wishlist, orders, and seller dashboard."
      alternateText="Don’t have an account?"
      alternateLink="/signup"
      alternateLabel="Create one"
      onSubmit={async (payload) => {
        const normalized = { username: payload.username || payload.email, password: payload.password };
        return login(normalized);
      }}
    />
  );
};

export default Login;
