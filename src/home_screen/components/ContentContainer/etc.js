

export function getGoogleToolHeight(){
    return (window.innerHeight-64)+'px';
}

export function getGoogleToolWidth (toolbarHidden) {
    if(toolbarHidden){
        return (window.innerWidth-64)+'px';
    }
    return (window.innerWidth - 315)+'px';
}

export const GOOGLE_TOOL_MARGIN_LEFT = '64px';