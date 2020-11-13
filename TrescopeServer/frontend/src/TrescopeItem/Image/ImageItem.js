import React from "react";

class ImageItem extends React.Component {
    render() {
        const {itemRenderer: {data}, size: {width, height}} = this.props;
        const {remoteOrLocalPath} = data[0];
        const src = `http://${window.location.host}/fetch?file=${remoteOrLocalPath}`;
        return <div style={{width: width, height: height, overflow: 'hidden', resize: 'both'}}>
            <img src={src} style={{height: '100%', width: '100%', objectFit: 'contain'}} alt=''/>
        </div>
    }
}

export default ImageItem;