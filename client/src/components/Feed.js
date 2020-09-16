import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";

import { Context } from "../globalContext";

const Feed = (props) => {
    const feedItems = [
        {
            user: "Michael Gallagher",
            picture:
                "https://lh3.googleusercontent.com/a-/AOh14GhV-6CvMLuMpqVwKpMzFEHqN8YhhdV7eHn7nFesAA",
            cover: "https://images.isbndb.com/covers/44/93/9780399144493.jpg",
            bookTitle: "Lindbergh",
            globalBookId: 333,
            bookType: "global",
            action: "read",
            timestamp: 1599495648787,
        },
        {
            user: "Michael Gallagher",
            picture:
                "https://lh3.googleusercontent.com/a-/AOh14GhV-6CvMLuMpqVwKpMzFEHqN8YhhdV7eHn7nFesAA",
            cover: "https://images.isbndb.com/covers/44/93/9780399144493.jpg",
            bookTitle: "Lindbergh",
            globalBookId: 333,
            bookType: "personal",
            action: "read",
            timestamp: 1599495648787,
        },
        {
            user: "Michael Gallagher",
            picture:
                "https://lh3.googleusercontent.com/a-/AOh14GhV-6CvMLuMpqVwKpMzFEHqN8YhhdV7eHn7nFesAA",
            cover: "https://images.isbndb.com/covers/44/93/9780399144493.jpg",
            bookTitle: "Lindbergh",
            globalBookId: 333,
            bookType: "personal",
            action: "read",
            timestamp: 1599495648787,
        },
    ];

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
        <div className="border-gray-400 border m-4 p-8 rounded">
            {activities.reverse().map((item) => {
                return (
                    <div className="border-gray-400 border m-2 px-6 py-2 rounded flex items-center">
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
