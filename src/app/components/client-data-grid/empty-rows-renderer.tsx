import React from 'react';

type Props = {
    message: string
}

const EmptyRowsRenderer = (props: Props) => {
  return (
    <div style={{
      display:        'flex', justifyContent: 'center', alignItems:     'center',
      textAlign:      'center', gridColumn:     '1/-1',
    }}>
      {props.message}
    </div>
  );
};

export default EmptyRowsRenderer;
