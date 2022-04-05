import Iframe from "react-iframe";
import {Component} from "react";
import {LoadingScreen} from "../../../common/loading";
import {getGoogleDocLink, getGoogleSheetLink} from "../../../repository/repo";


export class SheetsContainer extends Component{
    constructor(props) {
        super(props);
        this.state={
            sheetLink:null,
        }
    }

    componentDidMount() {
        getGoogleSheetLink().then(res => this.setState({sheetLink:res}))
    }

    render() {
        const {sheetLink} = this.state;

        if(sheetLink === null)
            return <LoadingScreen/>;

        return (
            <div className="docs-container">
                <Iframe url={sheetLink} width={'1080px'} height={'750px'}/>
            </div>
        );
    }
}