import Iframe from "react-iframe";
import {Component} from "react";
import {LoadingScreen} from "../../../common/loading";
import {getGoogleDriveLink} from "../../../repository/repo";
import {getGoogleToolWidth, getGoogleToolHeight, GOOGLE_TOOL_MARGIN_LEFT} from "./etc";
import TopNavigation from "../TopNavigation";


export class DriveContainer extends Component{
    constructor(props) {
        super(props);
        this.state={
            driveLink:null,
            loading:true,
        }
    }

    componentDidMount() {
        getGoogleDriveLink().then(res => this.setState({driveLink:res}))
    }

    render() {
        const {driveLink, loading} = this.state;
        const {toolbarHidden} = this.props;



        return (
            <div style={{marginLeft: toolbarHidden === true ? GOOGLE_TOOL_MARGIN_LEFT : null}}  className="content-container">
                <TopNavigation toolbarHidden={toolbarHidden} url={driveLink} type={'-Google Drive'}/>

                {driveLink === null ? <LoadingScreen/> : <div>
                    {loading ? <LoadingScreen/> : null}
                    <Iframe onLoad={() => {
                        this.setState({loading: false})
                    }} allowFullScreen={true} url={driveLink} width={loading ? '0px' : getGoogleToolWidth(toolbarHidden)}
                            height={loading ? '0px' : getGoogleToolHeight()}/>
                </div>}
            </div>
        );
    }
}