import React, { useContext } from 'react';
import AuthPage from './AuthPage.jsx';
import { AuthContext } from '../contexts/AuthContext.jsx';

const Signup = () => {
  const { register } = useContext(AuthContext);

  return (
    <AuthPage
      mode="signup"
      title="Create your account"
      subtitle="Register as a customer and start building your wishlist."
      alternateText="Already have an account?"
      alternateLink="/login"
      alternateLabel="Sign in"
      onSubmit={async (payload) => {
        return register({
          fullName: payload.fullName,
          username: payload.username,
          email: payload.email,
          password: payload.password,
          role: 'user',
        });
      }}
    />
  );
};

export default Signup;
