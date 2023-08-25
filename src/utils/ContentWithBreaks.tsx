import { Fragment } from 'react';

type Props = {
  content: string;
  separator?: string; // Опциональный разделитель для разбиения исходного текста
};

const ContentWithBreaks = ({ content, separator }: Props): JSX.Element => {
  // Массив, который будет содержать строки исходного контента и элементы <br /> для разбивки на строки
  const contentWithBreaks: Array<string | JSX.Element> = [];
  // Разбиение исходного контента на строки с использованием разделителя или переноса строки по умолчанию
  const lines = content.split(separator || '\n');

  // Добавление первой строки в массив
  contentWithBreaks.push(<Fragment key={0}>{lines[0]}</Fragment>);

  // Цикл по остальным строкам
  for (let i = 1; i < lines.length; i++) {
    // Добавление элемента <br /> для переноса строки
    contentWithBreaks.push(<br key={`br-${i}`} />);
    // Добавление строки
    contentWithBreaks.push(<Fragment key={i}>{lines[i]}</Fragment>);
  }

  // Возвращение всего массива в виде React элементов
  return <>{contentWithBreaks}</>;
};

export default ContentWithBreaks;
