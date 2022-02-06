import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";

import { Context } from "../globalContext";

import MoreMenu from "../common/MoreMenu";

const BookFeed = (props) => {
  const global = useContext(Context);

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const result = await axios.get(`/api/activities/book/${props.bookId}`);
      setActivities(result.data);
    };

    fetchActivities();
  }, [props]);

  const updateActivity = async (id) => {
    const result = await axios.put("/api/activities", {
      field: "hidden",
      value: true,
      id,
      owner_id: global.currentUser.id,
    });
    if (result) {
      setActivities(
        activities.filter((activity) => activity.id !== result.data.id)
      );
    }
  };

  const determineAction = (actionNumber) => {
    switch (actionNumber) {
      case 1:
        return "started reading";
      case 2:
        return "read";
      case 3:
        return "added";
      case 4:
        return "removed";
      case 5:
        return "loaned";
      case 6:
        return "reclaimed";
      default:
        break;
    }
  };

  if (activities.length > 0) {
    return (
      <div>
        <div className="md:text-left text-center mt-1">
          <div className="text-2xl font-bold">Activity</div>
        </div>
        {activities.map((item, index) => {
          return (
            <div
              className="border-gray-400 border mt-2 mb-2 pr-6 rounded flex items-center"
              key={index}
            >
              <div className="flex items-center">
                {item.user_id === global.currentUser.id ? (
                  <div>
                    <MoreMenu
                      placement="left"
                      size="18px"
                      options={[
                        {
                          action: () => updateActivity(item.id),
                          confirm: true,
                          text: "Hide activity",
                        },
                      ]}
                    ></MoreMenu>
                  </div>
                ) : null}
                <div
                  className={
                    item.user_id === global.currentUser.id
                      ? "h-12 w-12 mr-2"
                      : "h-12 w-12 mr-2 ml-4"
                  }
                >
                  <img
                    alt="user"
                    src={item.friend_picture}
                    className="rounded-full h-12 w-12 mr-2"
                  ></img>
                </div>
              </div>
              <div>
                <div>
                  <span className="font-bold">
                    {item.user_id === global.currentUser.id
                      ? "You"
                      : item.friend_full}
                  </span>{" "}
                  {determineAction(item.action)}{" "}
                  <Link
                    className="border-gray-600 border-dotted border-b"
                    to={`/book/${item.object_id}`}
                  >
                    {item.title}
                  </Link>
                  {item.action === 5
                    ? ` to ${
                        item.interacted_user_id === global.currentUser.id
                          ? `you`
                          : item.interacted_user_name
                      }`
                    : item.action === 6
                    ? ` from ${
                        item.interacted_user_id === global.currentUser.id
                          ? `you`
                          : item.interacted_user_name
                      }`
                    : null}
                </div>

                <div className="text-xs font-thin">
                  {moment
                    .unix(item.timestamp / 1000)
                    .format("dddd, MMMM Do YYYY, h:mm:ss a")}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    return null;
  }
};

export default BookFeed;
