import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainBoard from './components/MainBoard';

function App() {
  return (
    <div className="bg-blue-100 h-screen">
      <Header />
      <div className='content flex'>
        <Sidebar />
        <MainBoard />
      </div>
    </div>
  );
}

export default App;
