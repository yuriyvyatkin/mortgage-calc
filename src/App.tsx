import { useRef } from 'react';
import Main from "@/layouts/Main";
import './App.css';
import constants from '@/constants';

function App() {
  const footerRef = useRef(null);

  return (
    <div className="App">
      <Main footerRef={footerRef} {...constants} />
      <hr className="wide-line" />
      <div ref={footerRef} className="footer"></div>
    </div>
  );
}

export default App;
