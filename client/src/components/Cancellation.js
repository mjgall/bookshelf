import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'

import flow from '@prosperstack/flow';


const Cancellation = (props) => {

    const callProsperstack = () => {
        flow({
            testMode: true,
            flowId: 'j8cwF_Q46H42h91H4a_iB',
            subscription: {
                paymentProviderId: 'sub_HrMJ3nNeVGMlV1',
            },
            onCompleted: (result) => {
                console.log('Flow complete!');
            },
        });
    }

    return (
        <div className="container mx-auto">
            <div className="mx-auto text-center w-32 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-8 rounded cursor-pointer" onClick={callProsperstack}>Cancel</div>
        </div>
    )
}

export default withRouter(Cancellation)