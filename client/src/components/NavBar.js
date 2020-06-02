import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import logo from '../images/logo.png';

import { Context } from '../globalContext';

const NavBar = ({
  windowWidth,
  scrollPosition,
  location,
  history,
  clearReferrer,
  referrer,
}) => {
  const global = React.useContext(Context);

  const goHome = () => {
    history.push('');
  };

  const calcLogoSize = () => {
    if (
      windowWidth < 1025 ||
      scrollPosition > 0 ||
      location.pathname.indexOf('/book/') > -1
    ) {
      return '1.5rem';
    } else {
      return '3rem';
    }
  };

  return (
    <nav className='z-50 flex shadow-lg items-center justify-between flex-wrap bg-blue-500 px-8 py-1 md:py-3 sticky top-0'>
      <div className='flex items-center'>
        <div
          className='flex items-center flex-shrink-0 text-white mr-6 cursor-pointer'
          onClick={goHome}>
          <img
            alt='Bookshelf logo'
            className='mr-4'
            src={logo}
            style={{ width: calcLogoSize() }}></img>
          <span className='font-semibold text-lg tracking-tight'>
            Bookshelf
          </span>
        </div>
        <span className='hidden md:inline-block text-sm  text-white hover:text-white'>
          {global.currentUser
            ? `You have ${
                global.books.householdBooks
                  .concat(global.books.userBooks)
                  .filter((book) => book.user_id == global.currentUser.id)
                  .length
              } books!`
            : null}
        </span>
      </div>

      <div>
        {!global.currentUser ? (
          <a
            onClick={clearReferrer}
            href={
              referrer ? `/auth/google/redirect${referrer}` : `/auth/google`
            }
            className='inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white lg:mt-0 '>
            Login 📚
          </a>
        ) : (
          <>
            <Link
              to='/profile'
              className='inline-block mx-1 text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white lg:mt-0 hover:bg-white lg:mt-0 '>
              {global.householdMembers.some((membership) => {
                return (
                  !membership.invite_declined &&
                  !membership.invite_accepted &&
                  membership.user_id == global.currentUser.id
                );
              }) && windowWidth > 380 ? (
                <div className='mr-2 inline-block rounded-full bg-red-600 p-1 '></div>
              ) : null}
              <div className='inline-block'>Profile</div>
            </Link>
            <a
              href='/api/logout'
              className='inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white lg:mt-0'>
              Logout
            </a>
          </>
        )}
      </div>
    </nav>
  );
};

// class NavBar extends React.Component {
//   goHome = () => {
//     this.props.history.push('');
//   };
//   calcLogoSize = () => {
//     if (
//       this.props.windowWidth < 1025 ||
//       this.props.scrollPosition > 0 ||
//       this.props.location.pathname.indexOf('/book/') > -1
//     ) {
//       return '1.5rem';
//     } else {
//       return '3rem';
//     }
//   };

//   render = () => {
//     return (
//       <nav className='z-50 flex shadow-lg items-center justify-between flex-wrap bg-blue-500 px-8 py-1 md:py-3 sticky top-0'>
//         <div className='flex items-center'>
//           <div
//             className='flex items-center flex-shrink-0 text-white mr-6 cursor-pointer'
//             onClick={this.goHome}>
//             <img
//               alt='Bookshelf logo'
//               className='mr-4'
//               src={logo}
//               style={{ width: this.calcLogoSize() }}></img>
//             <span className='font-semibold text-lg tracking-tight'>
//               Bookshelf
//             </span>
//           </div>
//           <span className='hidden md:inline-block text-sm  text-white hover:text-white'>
//             {this.props.user
//               ? `You have ${
//                   this.props.books.filter(
//                     (book) => book.user_id == this.props.user.id
//                   ).length
//                 } books!`
//               : null}
//           </span>
//         </div>

//         <div>
//           {!this.props.user ? (
//             <a
//               onClick={this.props.clearReferrer}
//               href={
//                 this.props.referrer
//                   ? `/auth/google/redirect${this.props.referrer}`
//                   : `/auth/google`
//               }
//               className='inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white lg:mt-0 '>
//               Login 📚
//             </a>
//           ) : (
//             <>
//               <Link
//                 to='/profile'
//                 className='inline-block mx-1 text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white lg:mt-0 hover:bg-white lg:mt-0 '>
//                 {this.props.members.some((membership) => {
//                   return (
//                     !membership.invite_declined &&
//                     !membership.invite_accepted &&
//                     membership.user_id == this.props.user.id
//                   );
//                 }) && this.props.windowWidth > 380 ? (
//                   <div className='mr-2 inline-block rounded-full bg-red-600 p-1 '></div>
//                 ) : null}
//                 <div className='inline-block'>Profile</div>
//               </Link>
//               <a
//                 href='/api/logout'
//                 className='inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white lg:mt-0'>
//                 Logout
//               </a>
//             </>
//           )}
//         </div>
//       </nav>
//     );
//   };
// }

export default withRouter(NavBar);
