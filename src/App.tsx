import Main from "@/layouts/Main";
import './App.css';
import constants from '@/constants';

function App() {
  return (
    <div className="App">
      <Main {...constants} />
    </div>
  );
}

export default App;
