import { Card } from '@chakra-ui/react';

interface PageTitleProps {
  title: string;
}

const PageTitle = (props: PageTitleProps) => {
  return (
    <div>
      <Card
        style={{
          color: '#7f7f7f',
          fontSize: '1.2em',
        }}
        className="p-3 d-flex align-items-start justify-content-center"
      >
        {props.title}
      </Card>
    </div>
  );
};

export default PageTitle;
