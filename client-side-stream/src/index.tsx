import ReactDOM from 'react-dom/client';
import App from './App';
import store from './Redux/Store';
import './Components/css/Global.css'
import './Components/css/loadingSpinner.css';
import './Components/css/responsive.css';

import { UserProvider } from './UserContext';
import { Provider } from 'react-redux';
import SocketContext from './Functions/realtime/socketContext';
import { register } from './serviceWorker'
import { LiveProvider } from './LiveZegoProvider';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <Provider store={store} >
        <UserProvider>
            <LiveProvider>
                <App />
            </LiveProvider>
        </UserProvider>
    </Provider>
);


const config = {
    onUpdate: (registration: ServiceWorkerRegistration) => {
        console.log('Service worker updated');
        // Handle update logic here
    },
    onSuccess: (registration: ServiceWorkerRegistration) => {
        console.log('Service worker registered successfully');
        // Handle success logic here
    },
};

register(config);


