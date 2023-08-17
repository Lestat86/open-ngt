import React from 'react';

function stopEvent(event: React.MouseEvent<HTMLElement>) {
  event.stopPropagation();
}

type Props = {
    show?: boolean
    closeFun: () => void
    children?: React.ReactNode
}

const Modal = (props: Props) => {
  if (!props.show) {
    return null;
  }

  return (
    <div onClick={props.closeFun}
      className="absolute top-0 left-0 flex justify-center items-center h-screen w-screen bg-gray-900/75 z-30">
      <div className="flex flex-col justify-center items-center bg-white z-40">
        <div onClick={stopEvent} className="flex justify-center items-center w-full h-full">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
