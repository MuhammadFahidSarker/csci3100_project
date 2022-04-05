import Iframe from "react-iframe";
import {Component} from "react";
import {LoadingScreen} from "../../../common/loading";
import {getGoogleDocLink, getGoogleDriveLink} from "../../../repository/repo";


export class DriveContainer extends Component{
    constructor(props) {
        super(props);
        this.state={
            driveLink:null,
        }
    }

    componentDidMount() {
        getGoogleDriveLink().then(res => this.setState({driveLink:res}))
    }

    render() {
        const {driveLink} = this.state;

        if(driveLink === null)
            return <LoadingScreen/>;

        return (
            <div className="docs-container">
                <Iframe url={driveLink} width={'1080px'} height={'750px'}/>
            </div>
        );
    }
}