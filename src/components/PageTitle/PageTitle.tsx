import { Card } from '@chakra-ui/react';

interface PageTitleProps {
  title: string;
  children?: any;
}

const PageTitle = (props: PageTitleProps) => {
  return (
    <div>
      <Card
        style={{
          color: '#7f7f7f',
          fontSize: '1.2em',
          justifyContent: 'space-between',
        }}
        className="p-3"
        direction="row"
      >
        <div>{props.title}</div>
        <div>{props.children}</div>
      </Card>
    </div>
  );
};

export default PageTitle;
