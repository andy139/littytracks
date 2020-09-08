import React, { useState, useContext } from 'react';

import { useMutation } from '@apollo/react-hooks';
import { UserContext } from '../../App';
import { gql } from 'apollo-boost';
import { ME_QUERY } from '../../App';

const CREATE_PLAY_MUTATION = gql`
	mutation($trackId: Int!) {
		addPlaycount(trackId: $trackId) {
			track {
				id
			
			}
		}
	}
`;


const CreatePlay: React.FC<any> = ({ trackId, playCount }) => {
    const [createPlay, { data, loading }] = useMutation(CREATE_PLAY_MUTATION, {
        refetchQueries: [{ query: ME_QUERY }]
    });

    return (
        <span>
            {playCount}

        </span>
    )


}


export default CreatePlay;