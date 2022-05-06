import Iframe from "react-iframe";
import {Component} from "react";
import {LoadingScreen} from "../../../common/loading";
import {getGoogleDocLink} from "../../../repository/repo";
import {getGoogleToolWidth, getGoogleToolHeight, GOOGLE_TOOL_MARGIN_LEFT} from "./etc";
import TopNavigation from "../TopNavigation";


/**
 * @class DocsContainer
 * @extends Component
 * Returns a container that displays Google Docs using the iframe component
 */
export class DocsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docLink: null,
            loading: true,
        }
    }

    /**
     * @method componentDidMount
     * @returns {void}
     * @description This method is called when the component is mounted. It fetches
     * the Google Docs link from the repository and sets it in the state.
     */
    componentDidMount() {
        getGoogleDocLink(this.props.group.groupid).then(res => {
            if (res.success === true) {
                this.setState({
                    docLink: res.content.docsLink,
                    loading: false,
                })
            }else{
                console.log(res.error)
            }
        })
    }

    render() {
        const {docLink, loading} = this.state;
        const {toolbarHidden, user, group} = this.props;

        return (
            <div style={{marginLeft: toolbarHidden === true ? GOOGLE_TOOL_MARGIN_LEFT : null}} id={'doc-container'} className="content-container">
                <TopNavigation showAllGroup={true} user={user} group={group} toolbarHidden={toolbarHidden} url={docLink} type={'- Google Doc'}/>
                {docLink === null ? <LoadingScreen/> : <div>
                    {loading ? <LoadingScreen/> : null}
                    <Iframe onLoad={() => {
                        this.setState({loading: false})
                    }} allowFullScreen={true} url={docLink} width={loading ? '0px' : getGoogleToolWidth(toolbarHidden)}
                            height={loading ? '0px' : getGoogleToolHeight()}/>
                </div>}

            </div>
        );
    }
}