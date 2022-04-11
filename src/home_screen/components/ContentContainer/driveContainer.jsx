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
        console.log(this.props.group)
        getGoogleDriveLink(this.props.group.groupid).then(res => {
            if (res.success === true) {
                this.setState({
                    driveLink: res.content,
                    loading: false,
                })
            }else{
                console.log(res.error)
            }
        })
    }

    render() {
        const {driveLink, loading} = this.state;
        const {toolbarHidden, group} = this.props;



        return (
            <div style={{marginLeft: toolbarHidden === true ? GOOGLE_TOOL_MARGIN_LEFT : null}}  className="content-container">
                <TopNavigation group={group} toolbarHidden={toolbarHidden} url={driveLink} type={'- Google Drive'}/>

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