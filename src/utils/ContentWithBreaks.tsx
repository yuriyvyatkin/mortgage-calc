import { Fragment } from 'react';

type Props = {
  content: string;
  separator?: string;
};

const ContentWithBreaks = ({ content, separator }: Props): JSX.Element => {
  const contentWithBreaks: Array<string | JSX.Element> = [];
  const lines = content.split(separator || '\n');

  contentWithBreaks.push(<Fragment key={0}>{lines[0]}</Fragment>);

  for (let i = 1; i < lines.length; i++) {
    contentWithBreaks.push(<br key={`br-${i}`} />);

    contentWithBreaks.push(<Fragment key={i}>{lines[i]}</Fragment>);
  }

  return <>{contentWithBreaks}</>;
};

export default ContentWithBreaks;
