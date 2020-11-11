import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";

import { Context } from "../globalContext";

const Feed = (props) => {

    const [activities, setActivities] = useState([]);

    const global = useContext(Context);

    useEffect(() => {
        const fetchActivities = async () => {
            const result = await axios.get("/api/activities");

            setActivities(result.data);
        };

        fetchActivities();
    }, []);

    const determineAction = (actionNumber) => {
        switch (actionNumber) {
            case 1:
                return 'started reading'
            case 2:
                return 'read'
            case 3:
                return 'added'
            case 4:
                return 'removed'
            default:
                break;
        }
    }

    return (
        <div>
            <div className='text-2xl font-bold'>Friend Activity</div>
            {activities.map((item) => {
                return (
                    <div className="border-gray-400 border mt-2 mb-2 px-6 py-2 rounded flex items-center">
                        <img
                            alt="user"
                            src={item.friend_picture}
                            class="rounded-full h-12 w-12 border-solid border-white border-2 -mt-3"
                        ></img>
                        <div>
                            <div>
                                {item.user_id === global.currentUser.id ? 'You' : item.friend_full} {determineAction(item.action)}{" "}
                                <Link
                                    className="border-gray-600 border-dotted border-b"
                                    to={`/book/${item.object_id}`}
                                >
                                    {item.title}
                                </Link>
                            </div>
                            <div className="text-xs font-thin">
                                {moment.unix(item.timestamp / 1000).format("dddd, MMMM Do YYYY, h:mm:ss a")}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Feed;
