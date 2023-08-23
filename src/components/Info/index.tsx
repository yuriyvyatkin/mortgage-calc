import Icon from '@/assets/svg/warning.svg';
import './info.css';
import ContentWithBreaks from '@/utils/ContentWithBreaks';

interface InfoProps {
  text: string;
}

const Info = ({ text }: InfoProps) => {
  return (
    <div className="info">
      <Icon className="info-icon" />
      <span className="info__text">
        <ContentWithBreaks content={text} separator='\n' />
      </span>
    </div>
  );
};

export { Info };
