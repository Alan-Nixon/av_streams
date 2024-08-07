import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { isUserAuthenticated } from './Functions/userFunctions/userManagement';
import { isAdminAuthenticated } from './Functions/userFunctions/adminManagement';
import { ContentProps } from './Functions/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { setAdminAuthenticated, setUserAuthenticated } from './Redux/authenticationRedux'
import StartLive from './Components/Pages/user/pages/StartLive';
import Subscription from './Components/Pages/user/pages/Subscription';
import ReportManagement from './Components/Pages/admin/ReportManagement';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Components/css/Game.css'
import { useSocket } from './Functions/realtime/socketContext';
import { useUser } from './UserContext';
import { Toaster } from 'react-hot-toast'
import { toastFunction } from './Components/messageShowers/ToastFunction';
import ErrorBoundary from './ErrorBoundry';
import { showConfirmationToast } from './Components/Helpers/helperComponents';
import { setScreenHeight, setSceenWidth } from './Redux/sideBarRedux';
import QrCodeScanner from './Components/Pages/user/helpers/QrCodeSCanner';

const Error = lazy(() => import('./Components/Pages/user/pages/Error'));

const CategoryManagement = lazy(() => import('./Components/Pages/admin/CategoryManagement'));
const AdminDashboard = lazy(() => import('./Components/Pages/admin/AdminDashboard'));
const AdminLogin = lazy(() => import('./Components/Pages/admin/AdminLogin'));
const UserManagement = lazy(() => import('./Components/Pages/admin/UserManagement'));
const BannerManagement = lazy(() => import('./Components/Pages/admin/BannerManagement'))
const OfferManagement = lazy(() => import('./Components/Pages/admin/OfferManagement'))

const Profile = lazy(() => import('./Components/Pages/user/profile/Profile'));
const ForgetPassword = lazy(() => import('./Components/Pages/user/pages/ForgetPassword'));
const LiveNow = lazy(() => import('./Components/Pages/user/pages/LiveNow'));
const Videos = lazy(() => import('./Components/Pages/user/pages/Videos'));
const Channels = lazy(() => import('./Components/Pages/user/pages/Channels'));
const Shorts = lazy(() => import('./Components/Pages/user/pages/Shorts'));
const Home = lazy(() => import('./Components/Pages/user/pages/Home'));
const FullVideo = lazy(() => import('./Components/Pages/user/pages/FullVideo'))
const Login = lazy(() => import('./Components/Pages/user/pages/Login'))
const Signup = lazy(() => import('./Components/Pages/user/pages/Signup'))
const Channel = lazy(() => import('./Components/Pages/user/pages/Channel'))
const Search = lazy(() => import('./Components/Pages/user/pages/Search'))
const ShowLive = lazy(() => import('./Components/Pages/user/pages/ShowLive'))
const Game = lazy(() => import('./Components/Helpers/Game/Game'))

function App() {
  const [gameLoaded, setGameLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch();
  const userAuthenticated = useSelector((state: any) => state?.counter?.userAuthenticated);
  const adminAuthenticated = useSelector((state: any) => state?.counter?.adminAuthenticated)

  const { user } = useUser();
  const { socket } = useSocket();

  useEffect(() => {
    if (user && socket) {
      socket.emit('join', user._id)

      socket.on('showFollowMessage', (data: any) => {
        toastFunction(data)
      })
    }
  }, [user, socket])

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const userAuth: boolean = await isUserAuthenticated();
        dispatch(setUserAuthenticated(userAuth) as any)

        const adminAuth = await isAdminAuthenticated();
        dispatch(setAdminAuthenticated(adminAuth) as any)
        setLoading(false)

      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    const updateSize = () => {
      dispatch(setSceenWidth(window.innerWidth))
      dispatch(setScreenHeight(window.innerHeight))
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  if (!navigator.onLine && !gameLoaded) {
    showConfirmationToast(() => {
      setGameLoaded(true)
      setTimeout(() => window.location.href = '/game', 0)
    }, "you are not connected to internet do you wanna play a game ? ")
  } else {
    if (loading) { return (<div className="lds-dual-ring" />) }
  }

  const SuspenceComponent = ({ children }: ContentProps) => {
    return <Suspense fallback={<><div className="lds-dual-ring"></div></>} >
      <ErrorBoundary>
        <>
          <ToastContainer />
          <Toaster />
          {children}
        </>
      </ErrorBoundary>
    </Suspense>
  }

  return (
    <Router>
      <SuspenceComponent>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/forgetPassword' element={<ForgetPassword />} />
          <Route path='/LiveNow' element={<LiveNow />} />
          <Route path='/Videos' element={<Videos />} />
          <Route path='/Shorts' element={<Shorts />} />
          <Route path='/Channels' element={<Channels />} />
          <Route path='/FullVideo' element={<FullVideo />} />
          <Route path='/channel' element={<Channel />} />
          <Route path='/search' element={<Search />} />
          <Route path='/game' element={<Game />} />

          <Route path='/subscription' element={userAuthenticated ? <Subscription showSideBar /> : <Navigate to="/login" />} />
          <Route path='/profile' element={userAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path='/Login' element={userAuthenticated ? <Navigate to='/' /> : <Login />} />
          <Route path='/Signup' element={userAuthenticated ? <Navigate to='/' /> : <Signup />} />
          <Route path='/startLive' element={userAuthenticated ? <StartLive /> : <Navigate to='/' />} />
          <Route path='/showLive/:liveId' element={userAuthenticated ? <ShowLive /> : <Navigate to='/' />} />
          <Route path="/QrCodeScan" element={userAuthenticated ? <QrCodeScanner /> : <Navigate to="/login" />} />

          <Route path='/admin/adminLogin' element={adminAuthenticated ? <Navigate to="/admin" /> : <AdminLogin />} />
          <Route path='/admin' element={adminAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/adminLogin" />} />
          <Route path='/admin/userManagement' element={adminAuthenticated ? <UserManagement /> : <Navigate to="/admin/adminLogin" />} />
          <Route path='/admin/categoryManagement' element={adminAuthenticated ? <CategoryManagement /> : <Navigate to="/admin/adminLogin" />} />
          <Route path='/admin/bannerManagement' element={adminAuthenticated ? <BannerManagement /> : <Navigate to="/admin/adminLogin" />} />
          <Route path='/admin/reportManagement' element={adminAuthenticated ? <ReportManagement /> : <Navigate to="/admin/adminLogin" />} />
          <Route path='/admin/offerManagement' element={adminAuthenticated ? <OfferManagement /> : <Navigate to="/admin/adminLogin" />} />

          <Route path='*' element={<Error />} />
        </Routes>
      </SuspenceComponent>
    </Router>
  );
}

export default App;
