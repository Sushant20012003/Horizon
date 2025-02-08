import Signup from './components/Signup';
import Login from './components/Login';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import ChatPage from './components/ChatPage';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import store from './redux/store';
import { useEffect } from 'react';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice';
import { setNotification } from './redux/rtnSlice';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationPage from './components/NotificationPage';
import { setFollowerUser } from './redux/authSlice';
import { BASE_URL } from './config/apiConfig';

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      {
        path: '/',
        element: <ProtectedRoute><Home /></ProtectedRoute>
      },
      {
        path: '/profile/:id',
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      {
        path: '/profile/edit',
        element: <ProtectedRoute><EditProfile /></ProtectedRoute>
      },
      {
        path: '/chat',
        element:<ProtectedRoute> <ChatPage /></ProtectedRoute>
      },
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  }
])

function App() {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const {socket} = useSelector(store=>store.socketio);

  useEffect(() => {
    if (user) {
      const socketio = io(`${BASE_URL}`, {
        query: {
          userId: user._id
        }
      });
      dispatch(setSocket(socketio));

      //litening events

      socketio.on('getOnlineUsers', (onlineUsers) => {
        console.log("fetched online users");

        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification', (notification)=>{
        dispatch(setNotification(notification));
        dispatch(setFollowerUser(notification.userId));
        
      });

      

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }

      } else if(socket) {
        return () => {
          socket.close();
          dispatch(setSocket(null));
        }
      }
      
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />

    </>

  )
}

export default App
