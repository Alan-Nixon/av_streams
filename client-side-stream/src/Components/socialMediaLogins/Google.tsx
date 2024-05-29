import { jwtDecode } from 'jwt-decode';

import React from "react";
import { googleClientId } from '../../Functions/interfaces';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';


const Google: React.FC<any> = ({ onSuccess, responseErrorGoogle }) => {

  const responseMessage = (response: any) => {
    if (response.credential) {
      const userData = jwtDecode(response.credential);
      if (userData) {
        onSuccess(userData)
      }
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {googleClientId && <GoogleOAuthProvider clientId={googleClientId ?? ""}>
        <GoogleLogin
          width="650px"
          onSuccess={responseMessage}
          onError={responseErrorGoogle}
          size="large"
          theme='filled_black'
          logo_alignment='center'
          text='continue_with'
          ux_mode='popup'
        />
      </GoogleOAuthProvider>
      }
    </div>
  );
};

export default React.memo(Google); 