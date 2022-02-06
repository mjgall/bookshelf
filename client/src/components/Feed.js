import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";

import { Context } from "../globalContext";
import MoreMenu from "../common/MoreMenu";
import Button from "../common/Button";
import { ThumbUp } from "@styled-icons/heroicons-outline";
import { ThumbUp as ThumbUpSolid } from "@styled-icons/heroicons-solid";
import Tip from "../common/Tip";
import LoadingSpinner from "./LoadingSpinner";
import Select from "react-select";
import _ from "lodash";

const Feed = (props) => {
  const getSavedSelfFilter = () => {
    const local = JSON.parse(localStorage.getItem("hideSelf"));
    if (local) {
      return local;
    } else {
      return false;
    }
  };

  const getSavedOthersFilter = () => {
    const local = JSON.parse(localStorage.getItem("hideOthers"));
    if (local) {
      return local;
    } else {
      return false;
    }
  };

  const [activities, setActivities] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hideSelf, setHideSelf] = useState(getSavedSelfFilter());
  const [hideOthers, setHideOthers] = useState(getSavedOthersFilter());
  const [users, setUsers] = useState([]);
  const [userFilter, setUserFilter] = useState(undefined);

  const global = useContext(Context);

  const filter = () => {
    if (hideSelf) {
      return activities.filter((activity) => {
        return activity.user_id !== global.currentUser.id;
      });
    } else if (hideOthers) {
      return activities.filter((activity) => {
        return activity.user_id === global.currentUser.id;
      });
    } else if (userFilter?.length > 0) {
      return activities.forEach((activity) => {
        if (userFilter.map((user) => user.value).includes(activity.user_id)) {
          return activity;
        }
      });
    } else {
      return activities;
    }
  };

  const toggleHideSelf = () => {
    setHideSelf(!hideSelf);
    localStorage.setItem("hideSelf", !hideSelf);
    if (hideOthers) {
      toggleHideOthers();
    }
  };

  const toggleHideOthers = () => {
    setHideOthers(!hideOthers);
    localStorage.setItem("hideOthers", !hideOthers);
    if (hideSelf) {
      toggleHideSelf();
    }
  };

  const fetchNextPage = async () => {
    const result = await axios.get(
      `/api/activities?page=${currentPage + 1}&limit=10`
    );
    setActivities([...activities, ...result.data]);
    setCurrentPage(currentPage + 1);

    setUsers(
      _.uniqBy(
        [...activities, ...result.data].map((activity) => {
          return { value: activity.friend_id, label: activity.friend_full };
        }),
        "value"
      )
    );
    filter();
  };

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

  useEffect(() => {
    const fetchActivities = async () => {
      const result = await axios.get(`/api/activities?page=1&limit=10`);
      setActivities(result.data);
      setUsers(
        _.uniqBy(
          result.data.map((activity) => {
            return { value: activity.friend_id, label: activity.friend_full };
          }),
          "value"
        )
      );
      setLoaded(true);
    };
    fetchActivities();
  }, []);

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

  const updateLike = async (item) => {
    if (item.likeContent.likedByUser) {
      setActivities(
        activities.map((activity) => {
          if (activity.id === item.id) {
            let likeContent = {
              color: "lightgray",
              likedByUser: false,
              people: activity.likeContent.people,
              string: activity.likeContent.string,
            };

            likeContent.people = likeContent.people.filter(
              (person) => person !== "You"
            );
            likeContent.string = likeContent.people.join(",");
            likeContent.total = likeContent.people.length;

            return { ...activity, likeContent };
          } else {
            return activity;
          }
        })
      );
      await axios.post("/api/interactions", {
        type: "unlike",
        activityId: item.id,
      });
    } else {
      setActivities(
        activities.map((activity) => {
          if (activity.id === item.id) {
            let likeContent = {
              color: "newblue",
              likedByUser: true,
              people: activity.likeContent.people,
              string: activity.likeContent.string,
            };

            likeContent.people = ["You", ...likeContent.people];
            likeContent.string = likeContent.people.join(", ");
            likeContent.total = likeContent.people.length;
            return { ...activity, likeContent: likeContent };
          } else {
            return activity;
          }
        })
      );
      await axios.post("/api/interactions", {
        type: "like",
        activityId: item.id,
      });
    }
  };

  const handleUserFilter = (values) => {
    setUserFilter(values);
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      cursor: "pointer",
    }),
    control: () => ({
      // none of react-select's styles are passed to <Control />
      cursor: "pointer",
      alignItems: "center",
      backgroundColor: "white",
      borderColor: "hsl(0,0%,80%)",
      borderRadius: "4px",
      borderStyle: "solid",
      borderWidth: "1px",
      flexWrap: "wrap",
      justifyContent: "space-between",
      minHeight: "38px",
      outline: "0",
      position: "relative",
      transition: "all 100ms",
      boxSizing: "border-box",
      display: "flex",
    }),
  };

  return (
    <div>
      {!loaded ? (
        <LoadingSpinner></LoadingSpinner>
      ) : (
        <>
          <div className="md:text-left text-center">
            <div className="text-2xl font-bold">Friend Activity</div>
          </div>
          {!activities.length < 1 ? (
            <>
              <div className="flex">
                <div className="w-full md:w-1/3">
                  <Select
                    styles={customStyles}
                    isMulti={true}
                    placeholder="Filter users"
                    isSearchable={true}
                    value={userFilter}
                    onChange={handleUserFilter}
                    options={users}
                  ></Select>
                </div>
                {/* <div className="flex items-center ml-2">
									<input
										style={{
											height: "1.5rem",
											width: "1.5rem",
										}}
										className="mx-2 cursor-pointer"
										type="checkbox"
										checked={hideSelf}
										onChange={toggleHideSelf}
									></input>
									<div>Hide self</div>
								</div>
								<div className="flex items-center ml-2">
									<input
										style={{
											height: "1.5rem",
											width: "1.5rem",
										}}
										className="mx-2 cursor-pointer"
										type="checkbox"
										checked={hideOthers}
										onChange={toggleHideOthers}
									></input>
									<div>Hide others</div>
								</div> */}
              </div>
              <>
                {filter().map((item, index) => {
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
                                item.interacted_user_id ===
                                global.currentUser.id
                                  ? `you`
                                  : item.interacted_user_name
                              }`
                            : null}
                          {item.action === 6
                            ? ` from ${
                                item.interacted_user_id ===
                                global.currentUser.id
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
                        <div className="flex text-xs my-1">
                          <div
                            className="mr-2 cursor-pointer"
                            onClick={() => {
                              updateLike(item);
                            }}
                          >
                            {item.likeContent?.people.length > 0 ? (
                              <Tip
                                content={
                                  item.likeContent.string
                                    ? item.likeContent.string
                                    : "Like"
                                }
                                renderChildren
                                placement="right"
                              >
                                <ThumbUpSolid
                                  color={item.likeContent.color}
                                  size="1.5em"
                                ></ThumbUpSolid>
                              </Tip>
                            ) : (
                              <Tip
                                content="Like"
                                renderChildren
                                placement="right"
                              >
                                <ThumbUp
                                  color="lightgray"
                                  size="1.5em"
                                ></ThumbUp>
                              </Tip>
                            )}
                          </div>
                          <div>{item.likeContent?.total}</div>
                        </div>
                      </div>
                      <div className="ml-auto flex items-center">
                        <div>
                          <Link to={`/book/${item.object_id}`}>
                            {item.cover ? (
                              <img
                                alt="user"
                                src={item.cover}
                                className="h-16"
                              ></img>
                            ) : (
                              <div className="w-12 rounded h-16 border-gray-400 border"></div>
                            )}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
              <Button className="w-full" onClick={fetchNextPage}>
                More
              </Button>
            </>
          ) : (
            <div className="my-1 text-gray-500 italic font-weight-light">
              You don't have any friend or household connections. Add some from
              your Profile.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Feed;
