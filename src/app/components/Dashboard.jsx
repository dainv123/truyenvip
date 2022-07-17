/**
 * The dashboard is a simple React component that contains several lists of tasks,
 * one for each group that belongs to the user.
 */

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { ConnectedTaskList } from './TaskList'
import * as mutations from '../store/mutations'

function Dashboard ({ groups, test }) {
    useEffect(() => { test() }, []);

    return (
        <div className="row">
            {groups.map(group=>(
                <ConnectedTaskList key={group.id} {...group} className="col"/>
            ))}
            <p onClick={test}>test call api</p>
        </div>
    )
}

const mapStateToProps = ({groups})=>({groups});

const mapDispatchToProps = dispatch => ({
    test() {
        dispatch(mutations.test())
    }
})

export const ConnectedDashboard = connect(mapStateToProps, mapDispatchToProps)(Dashboard);
