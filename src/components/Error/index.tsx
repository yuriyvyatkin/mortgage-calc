import Icon from '@/assets/svg/warning-octagon.svg';
import './error.css';

interface ErrorProps {
  text: string;
}

// Компонент для отображения сообщения об ошибке
const Error = ({ text } : ErrorProps) => {
  return (
    <div className="error">
      <Icon className="error-icon" />
      <span className="error__text">{text}</span>
    </div>
  );
}

export { Error };
