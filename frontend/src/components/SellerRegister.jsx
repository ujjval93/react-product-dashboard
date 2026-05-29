import React, { useContext } from 'react';
import AuthPage from './AuthPage.jsx';
import { AuthContext } from '../contexts/AuthContext.jsx';

const SellerRegister = () => {
  const { register } = useContext(AuthContext);

  return (
    <AuthPage
      mode="signup"
      role="seller"
      title="Register as a seller"
      subtitle="Create your seller account and start listing products."
      alternateText="Already have an account?"
      alternateLink="/seller/login"
      alternateLabel="Sign in"
      onSubmit={async (payload) => {
        return register({
          fullName: payload.fullName,
          username: payload.username,
          email: payload.email,
          password: payload.password,
          role: 'seller',
        });
      }}
    />
  );
};

export default SellerRegister;
