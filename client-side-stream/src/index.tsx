import ReactDOM from 'react-dom/client';
import App from './App';
import store from './Redux/Store';
import './Components/css/Global.css'
import './Components/css/loadingSpinner.css';
import './Components/css/responsive.css';

import { UserProvider } from './UserContext';
import { Provider } from 'react-redux';
import SocketContext from './Functions/realtime/socketContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <Provider store={store} >
        <SocketContext>
            <UserProvider>
                <App />
            </UserProvider>
        </SocketContext>
    </Provider>
);

