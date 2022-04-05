import Iframe from "react-iframe";
import {Component} from "react";
import {LoadingScreen} from "../../../common/loading";
import {getGoogleDocLink} from "../../../repository/repo";


export class DocsContainer extends Component{
    constructor(props) {
        super(props);
        this.state={
            docLink:null,
        }
    }

    componentDidMount() {
        getGoogleDocLink().then(res => this.setState({docLink:res}))
    }

    render() {
        const {docLink} = this.state;

        if(docLink === null)
            return <LoadingScreen/>;

        return (
            <div className="docs-container">
                <Iframe url={docLink} width={'1080px'} height={'750px'}/>
            </div>
        );
    }
}