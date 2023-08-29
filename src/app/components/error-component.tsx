import React, { ReactNode } from 'react';

type Props = {
    children: ReactNode
}

const ErrorComponent = (props: Props) => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col p-2">
        <span className="text-2xl text-red-600">
        Error!
        </span>
        <span className="text-xl">
          {props.children}
        </span>
      </div>
    </div>
  );
};

export default ErrorComponent;
