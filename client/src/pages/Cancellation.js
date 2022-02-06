import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import flow from "@prosperstack/flow";

const Cancellation = (props) => {
  window.__PROSPERSTACK_DEBUG_APP_HOST__ =
    "https://app.staging.prosperstack.com";
  window.__PROSPERSTACK_DEBUG_API_HOST__ =
    "https://api.staging.prosperstack.com";

  const [cancellationStatus, setCancellationStatus] = useState("");
  const [subscriberId, setsubscriberId] = useState("");
  const [testMode, setTestMode] = useState(true);

  const handleSubscriberIdChange = (e) => {
    setsubscriberId(e.target.value);
  };

  const callProsperstack = () => {
    flow({
      testMode: testMode,
      flowId: "j8cwF_Q46H42h91H4a_iB",
      subscription: {
        paymentProviderId: subscriberId,
      },
      onCompleted: (result) => {
        if (
          result.status === "saved" &&
          result.offer.id === "offr_vwXnBZyQiN10J6ii8YSjSPhU"
        ) {
          console.log("This customer should get access to the bonus feature!");
        }
        setCancellationStatus(JSON.stringify(result));
      },
    });
  };

  const updateTestMode = () => {
    if (testMode) {
      setsubscriberId("");
    }
    setTestMode(!testMode);
  };

  return (
    <div>
      <div
        className="text-center w-32 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-8 rounded cursor-pointer cente"
        onClick={callProsperstack}
      >
        Cancel
      </div>
      <div>{cancellationStatus.toLocaleLowerCase()}</div>
      <div>
        <label>
          <input
            type="checkbox"
            className="form-checkbox cursor-pointer"
            onChange={updateTestMode}
            checked={testMode}
          ></input>
          <span>Test Mode</span>
        </label>
      </div>
      {testMode ? null : (
        <div>
          <input
            placeholder="Stripe ID"
            onChange={handleSubscriberIdChange}
            value={subscriberId}
            className="border border-gray-400 rounded-sm w-1/4"
          ></input>
        </div>
      )}
    </div>
  );
};

export default withRouter(Cancellation);
