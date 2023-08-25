import { useRef } from 'react';
import Main from '@/layouts/Main';
import './App.css';
import constants from '@/constants';

function App() {
  const footerRef = useRef(null);

  return (
    <div className="App">
      {/* Рендер главного компонента, передача данных для выпадающих списков и рефа для проброски кнопки "Продолжить" в подвал при помощи ReactDOM.createPortal */}
      <Main footerRef={footerRef} {...constants} />
      <hr className="wide-line" />
      <div ref={footerRef} className="footer"></div>
    </div>
  );
}

export default App;
