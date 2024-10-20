import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
    
}
 
interface State {
    
}
 
class Home extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        // this.state = { t.t: t.t };
    }

    componentDidMount() {
        axios.get('api/animals')
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
        }
    render() { 
        return ( 'test' );
    }
}
 
export default Home;