import React from 'react';
// import scanning from '../images/scanning.gif';
// import searching from '../images/searching.gif';
import banner3 from '../images/banner3.jpg';
import screenshot1 from '../images/screenshot1.png';
import screenshot2 from '../images/screenshot2.png';
import screenshot3 from '../images/screenshot3.png';
import screenshot4 from '../images/screenshot4.png';
import axios from 'axios';


//TODO convert to functional component
export default class MarketingHome extends React.Component {
  state = { analytics: null };

  componentDidMount = async () => {
    const response = await axios.get('/api/data');
    this.setState({ analytics: { ...response.data, loaded: true } });
    if (this.props.referrer) {
      this.props.updateNavReferrer(this.props.referrer);
    }
    if (this.props.redirect) {
      this.props.updateNavReferrer(this.props.redirect);
    }
  };

  render = () => {
    return (
      <div>
        <div
          className="h-32 lg:h-64 bg-cover bg-local bg-center shadow-inner"
          style={{
            backgroundImage: `url(${banner3})`,
          }}></div>
        <div className="w-5/6 container mx-auto my-4">
          <div>
            <div className="m-auto">
              {this.props.redirect ? (
                <div className="bg-green-400 text-white text-center rounded-lg border-gray-300 border p-3 shadow-lg mb-2">
                  <div className="ml-2 mr-6">
                    Log in to view{' '}
                    {this.props.redirect === '/profile'
                      ? 'your profile!'
                      : this.props.redirect.indexOf('/book') > -1
                      ? 'that book!'
                      : 'Log in to be view that content!'}
                  </div>
                </div>
              ) : null}

              <div className="bg-white rounded-lg border-gray-300 border p-3 shadow-lg">
                <div className="flex flex-row">
                  <div className="px-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 1792 1792"
                      fill="#44C997"
                      xmlns="http://www.w3.org/2000/svg">
                      <path d="M1299 813l-422 422q-19 19-45 19t-45-19l-294-294q-19-19-19-45t19-45l102-102q19-19 45-19t45 19l147 147 275-275q19-19 45-19t45 19l102 102q19 19 19 45t-19 45zm141 83q0-148-73-273t-198-198-273-73-273 73-198 198-73 273 73 273 198 198 273 73 273-73 198-198 73-273zm224 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" />
                    </svg>
                  </div>

                  <div className="ml-2 mr-6">
                    <span className="font-semibold">
                      {this.state?.analytics?.users} user
                      {this.state?.analytics?.users > 1
                        ? 's'
                        : null} storing {this.state?.analytics?.books} books!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:my-4 p-4 grid grid-cols-2 md:border md:rounded-lg md:shadow-sm">
            <img alt="screenshot of Bookshelf" className=" shadow-lg rounded-lg" src={screenshot1}></img>
            <div className="text-3xl pl-10">Scan books</div>
          </div>
          <div className="md:my-4 p-4 grid grid-cols-2 md:border md:rounded-lg md:shadow-sm">
            <div className="text-3xl pr-10">Search for books</div>
            <img alt="screenshot of Bookshelf" className="shadow-lg rounded-lg" src={screenshot2}></img>
          </div>
          <div className="md:my-4 p-4 grid grid-cols-2 md:border md:rounded-lg md:shadow-sm">
            <img alt="screenshot of Bookshelf" className="shadow-lg rounded-lg" src={screenshot3}></img>
            <div className="text-3xl pl-10">Log notes</div>
          </div>
          <div className="md:my-4 p-4 grid grid-cols-2 md:border md:rounded-lg md:shadow-sm">
            <div className="text-3xl pr-10">Create a household</div>
            <img alt="screenshot of Bookshelf" className="shadow-lg rounded-lg" src={screenshot4}></img>
          </div>
        </div>
      </div>
    );
  };
}
