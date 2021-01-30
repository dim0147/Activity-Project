import React, {useState, useEffect} from 'react';

import MemberCard from './ChatboxMemberCard';

import { getClubMember } from '../API/Club';

const LeftPanel = ({club}) => {

    const [listMember, setListMember] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        getClubMember(club.Id, (err, res) => {
            setLoading(false);
            if (err) return err;
            if (!res.data.success) return;
            setListMember(res.data.members);
        })

    }, [])

    return (
        <div className="col-5 px-0">
            <div className="bg-white">
                <div className="bg-gray px-4 py-2 bg-light">
                    <p className="h5 mb-0 py-1">Members</p>
                </div>
                <div className="messages-box">
                    <div className="list-group rounded-0">
                        {isLoading && <div className="text-center"><i className="fas fa-spinner fa-spin"></i>   Loading Members...</div>}
                        {!isLoading && listMember.map(member => <MemberCard member={member} key={member.Id} />)}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default LeftPanel;