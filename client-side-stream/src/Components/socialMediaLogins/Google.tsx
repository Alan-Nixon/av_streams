import React from 'react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { googleClientId } from '../../Functions/interfaces';

interface GoogleProps {
  onSuccess: (response: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
  responseErrorGoogle: (error: any) => void;
}

const Google: React.FC<GoogleProps> = ({ onSuccess, responseErrorGoogle }) => {
  return (
    googleClientId ? (
      <GoogleLogin
        className='googleButtonLogin'
        clientId={googleClientId}
        buttonText="Login with Google"
        onSuccess={onSuccess}
        onFailure={responseErrorGoogle}
        cookiePolicy={'single_host_origin'}
        uxMode="popup"
        scope='email profile openid https://www.googleapis.com/auth/user.phonenumbers.read'
      />
    ) : (
      <p>Service is not available</p>
    )
  );
}

export default Google;
