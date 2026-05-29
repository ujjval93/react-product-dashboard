import React, { useContext } from 'react';
import AuthPage from './AuthPage.jsx';
import { AuthContext } from '../contexts/AuthContext.jsx';

const SellerLogin = () => {
  const { login } = useContext(AuthContext);

  return (
    <AuthPage
      mode="login"
      role="seller"
      title="Seller sign in"
      subtitle="Access seller tools, manage inventory, and view orders."
      alternateText="Need a seller account?"
      alternateLink="/seller/register"
      alternateLabel="Register now"
      onSubmit={async (payload) => {
        return login({ username: payload.username || payload.email, password: payload.password });
      }}
    />
  );
}

export default SellerLogin;
