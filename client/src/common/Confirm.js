import React, { useState } from 'react';

import { XSquare } from '@styled-icons/boxicons-solid';

import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';

const Confirm = ({ tipContent, onConfirm, position, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Tooltip arrow position='right' title={tipContent} disabled={visible}>
      <Tooltip
        theme='clear'
        interactive
        delay={[0, 0]}
        position={position}
        animation='none'
        duration={0}
        trigger='click'
        open={visible}
        html={
          <div className='flex px-4 py-2 justify-between text-sm ml-3'>
            <div
              className='w-full shadow-lg bg-green-500 text-white py-1 px-2 rounded text-center mr-4 cursor-pointer border-gray-600 border'
              onClick={() => {
                onConfirm();
                setVisible(!visible);
              }}>
              Confirm
            </div>
            <div
              className='w-full shadow-lg bg-red-500 text-white py-1 px-2 rounded text-center cursor-pointer border-gray-600 border'
              onClick={() => setVisible(!visible)}>
              Cancel
            </div>
          </div>
        }></Tooltip>

      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          ...child.props,
          onClick: () => setVisible(!visible),
        })
      )}
    </Tooltip>
  );
};
{
  /* 
// const Confirm = ({ tipContent, onConfirm }) => {
//   const [visible, setVisible] = useState(false);

//   useEffect(() => console.log(visible))

//   console.log(visible)

//   return (
//     <div>
//       <Tip placement='left' renderChildren content={tipContent}>
//         <Tippy

//           interactive
//           placement='left'
//           visible={visible}
//           onClickOutside={() => setVisible(false)}
//           render={ (attrs) => {
//             console.log(attrs)
//             return (
//               <div className='flex border border-gray-200 shadow-md rounded-sm px-4 py-2 justify-between bg-white text-sm'>
//                 <div
//                   className='w-full shadow-inner bg-green-500 text-white py-1 px-2 rounded text-center mr-4 cursor-pointer'
//                   onClick={() => onConfirm()}>
//                   Confirm
//                 </div>
//                 <div
//                   className='w-full shadow-inner bg-red-500 text-white py-1 px-2 rounded text-center cursor-pointer'
//                   onClick={() => setVisible(!visible)}>
//                   Cancel
//                 </div>
//               </div>
//             );
//           }}>
//           <XSquare
//             onClick={() => setVisible(!visible)}
//             color='red'
//             size='2rem'
//             className='cursor-pointer'></XSquare>
//         </Tippy>
//       </Tip>
//     </div>
//   );
// }; */
}

export default Confirm;
