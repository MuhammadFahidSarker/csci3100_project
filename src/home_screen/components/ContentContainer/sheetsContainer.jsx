import Iframe from "react-iframe";
import {Component} from "react";
import {LoadingScreen} from "../../../common/loading";
import {getGoogleDocLink, getGoogleSheetLink} from "../../../repository/repo";
import {getGoogleToolWidth, getGoogleToolHeight, GOOGLE_TOOL_MARGIN_LEFT} from "./etc";
import TopNavigation from "../TopNavigation";


export class SheetsContainer extends Component{
    constructor(props) {
        super(props);
        this.state={
            sheetLink:null,
            loading: true,

        }
    }

    componentDidMount() {
        getGoogleSheetLink(this.props.group.id).then(res => {
            if (res.success === true) {
                this.setState({
                    sheetLink: res.content,
                    loading: false,
                })
            }else{
                console.log(res.error)
            }
        })
    }

    render() {
        const {sheetLink, loading} = this.state;
        const {toolbarHidden, group} = this.props;


        return (
            <div style={{marginLeft: toolbarHidden === true ? GOOGLE_TOOL_MARGIN_LEFT : null}}  id={'doc-container'} className="content-container">
                <TopNavigation group={group} toolbarHidden={toolbarHidden} url={sheetLink} type={'- Google Sheet'}/>

                {sheetLink === null ? <LoadingScreen/> : <div>
                    {loading ? <LoadingScreen/> : null}
                    <Iframe onLoad={() => {
                        this.setState({loading: false})
                    }} allowFullScreen={true} url={sheetLink} width={loading ? '0px' : getGoogleToolWidth(toolbarHidden)}
                            height={loading ? '0px' : getGoogleToolHeight()}/>
                </div>}
            </div>
        );
    }
}