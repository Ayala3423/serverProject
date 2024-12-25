import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import Albums from './components/Albums/Albums';
import Posts from './components/Posts/Posts';
import Todos from './components/Todos/Todos';
import Info from './components/Info/Info';
import Photos from './components/Albums/Album/Photos/Photos';

function App() {
  return (
    <Router>
      <Routes>
        {/* מסלולים ראשיים */}
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />

        {/* מסלול המשתמשים */}
        <Route path="/home/users/:userId" element={<Home />}>
          <Route path="albums" element={<Albums />} />
          <Route path="albums/:albumId/photos" element={<Photos />} />
          <Route path="posts" element={<Posts />} />
          <Route path="todos" element={<Todos />} />
          <Route path="info" element={<Info />} />
        </Route>

        {/* מסלול 404 */}
        <Route path="*" element={<h1>404 Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;

