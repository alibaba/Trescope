import React from "react";
import ForceGraph3D from "3d-force-graph";
import SpriteText from "three-spritetext";
import * as d3force from "d3-force-3d";

class GraphItem extends React.Component {
    constructor(props) {
        super(props);
        this.currentHighlight = {link: null, nodes: []};
        this.graphDiv = React.createRef();

        this.version = this.props.itemRenderer.version;
        this.size = {...this.props.size};
    }

    static composeAndTransposeLinkEdge(link, edge) {
        let result = [];
        for (let i = 0; i < edge.length; i++) result.push({
            source: link[0][i],
            target: link[1][i],
            data: edge[i],
            id: i
        });
        return result;
    }

    static calculateEdgeRotationAndCurvature(edge) {
        const generateKey = edge => `${edge["source"]}->${edge["target"]}`;

        const sameSourceAndTargetEdge = {};
        for (let i = 0; i < edge.length; i++) {
            const key = generateKey(edge[i]);
            if (sameSourceAndTargetEdge[key]) sameSourceAndTargetEdge[key] += 1;
            else sameSourceAndTargetEdge[key] = 1;
        }

        const sameSourceAndTargetClone = JSON.parse(JSON.stringify(sameSourceAndTargetEdge));
        for (let i = 0; i < edge.length; i++) {
            const key = generateKey(edge[i]);
            if (1 === sameSourceAndTargetEdge[key]) edge[i]["rotation"] = 0;
            else edge[i]["rotation"] = 2 * Math.PI * (sameSourceAndTargetClone[key] / sameSourceAndTargetEdge[key]);
            if (1 === sameSourceAndTargetEdge[key] && edge[i]["source"] !== edge[i]["target"]) edge[i]["curvature"] = 0;
            else edge[i]["curvature"] = 0.25;
            sameSourceAndTargetClone[key] -= 1;
        }
        return edge;
    }

    static chooseByCurrent(current, arrayOrSingleOrNull, defaultValue) {
        if (Array.isArray(arrayOrSingleOrNull)) return arrayOrSingleOrNull[current.id];
        if (!!arrayOrSingleOrNull) return arrayOrSingleOrNull;
        return defaultValue;
    }

    static labelToShow(current, vertexData, edgeData, linkOrNode) {
        const text = GraphItem.chooseByCurrent(current, "node" === linkOrNode ? vertexData : edgeData, current.id);
        if ("node" === linkOrNode) return `<div style="color: #000;">${text}</div>`;

        const sourceNodeText = GraphItem.chooseByCurrent(current.source, vertexData, current.source.id);
        const targetNodeText = GraphItem.chooseByCurrent(current.target, vertexData, current.target.id);
        return `<div style="color: #000;">(${sourceNodeText})-[${text}]->(${targetNodeText})</div>`;
    }

    onNodeClick = node => {
        const distance = 80;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
        this.myGraph.cameraPosition(
            {
                x: node.x * distRatio,
                y: node.y * distRatio,
                z: node.z * distRatio
            }, // new position
            node, // lookAt ({ x, y, z })
            500 // ms transition duration
        );
    };
    onNodeHover = (currentNode, previousNode) => {
        if ((!currentNode && !this.currentHighlight.nodes.length) || (this.currentHighlight.nodes.length === 1 && this.currentHighlight.nodes[0] === currentNode)) return;

        this.currentHighlight.nodes = currentNode ? [currentNode] : [];
        this.updateHighlight();
    };
    onLinkHover = (currentLink, previousLink) => {
        if (this.currentHighlight.link === currentLink) return;

        this.currentHighlight.link = currentLink;
        this.currentHighlight.nodes = currentLink ? [currentLink.source, currentLink.target] : [];
        this.updateHighlight();
    };

    updateHighlight() {
        this.myGraph
            .linkDirectionalParticles(this.myGraph.linkDirectionalParticles())
            .linkDirectionalArrowLength(this.myGraph.linkDirectionalArrowLength())
            .linkDirectionalParticleWidth(this.myGraph.linkDirectionalParticleWidth())
            .linkWidth(this.myGraph.linkWidth())
            .linkThreeObject(this.myGraph.linkThreeObject())

            .nodeColor(this.myGraph.nodeColor())
            .nodeThreeObject(this.myGraph.nodeThreeObject());
    }

    static transpose(array) {
        return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
    }

    updateGraphRender() {
        const {width, height} = this.props.size;
        const {vertex, link, edge} = this.props.itemRenderer.data[0];
        vertex.data = GraphItem.transpose(vertex.data);
        edge.data = GraphItem.transpose(edge.data);

        this.myGraph.backgroundColor("white").showNavInfo(false);
        this.myGraph.width(width).height(height);

        const highlightSizeFactor = 2;
        const dynamicSizeBaseOnEdgeWidth = (coefficient = 1) => link => {
            const regular = GraphItem.chooseByCurrent(link, edge.width) * coefficient;
            return link === this.currentHighlight.link ? highlightSizeFactor * regular : regular;
        };

        let nodes = vertex.data.map((element, index) => ({id: index, data: element}));
        let links = GraphItem.composeAndTransposeLinkEdge(link, edge.data);
        links = GraphItem.calculateEdgeRotationAndCurvature(links);
        const graphData = {nodes, links};

        this.myGraph
            .graphData(graphData)

            .linkCurvature(link => link.curvature)
            .linkCurveRotation(link => link.rotation)
            .linkOpacity(edge.opacity)
            .linkLabel(link => GraphItem.labelToShow(link, vertex.data, edge.data, "link"))
            .linkColor(link => GraphItem.chooseByCurrent(link, edge.color, 0xff000000))
            .linkDirectionalParticles(link => link === this.currentHighlight.link ? 4 : 0)
            .linkDirectionalArrowLength(dynamicSizeBaseOnEdgeWidth(2))
            .linkDirectionalParticleWidth(dynamicSizeBaseOnEdgeWidth())

            .nodeRelSize(vertex.size)
            .nodeOpacity(vertex.opacity)
            .nodeLabel(node => GraphItem.labelToShow(node, vertex.data, edge.data, "node"))
            .nodeColor(node => -1 !== this.currentHighlight.nodes.indexOf(node) ? 0xaaff0000 : GraphItem.chooseByCurrent(node, vertex.color))

            .onNodeClick(this.onNodeClick)
            .onNodeHover(this.onNodeHover)
            .onLinkHover(this.onLinkHover)

            .forceEngine("d3")
            .numDimensions(3)
            .d3Force(
                "charge",
                d3force
                    .forceManyBody()
                    .distanceMax(100)
                    .strength(-120)
            );
        // .d3Force('collide', d3force.forceCollide().radius(10).strength(100));

        const blankContent = desc =>
            typeof desc === "string" && desc.trim() === "";
        if (blankContent(vertex.description)) {//show nothing
        } else {//show description or data
            this.myGraph
                .nodeThreeObject(node => {
                    const text = new SpriteText(GraphItem.chooseByCurrent(node, vertex.description ? vertex.description : vertex.data));
                    text.color = "#000";
                    text.textHeight = vertex.size;
                    text.fontWeight = "bold";
                    return text;
                })
                .nodeThreeObjectExtend(true);
        }

        if (blankContent(edge.description)) {//show nothing
            this.myGraph.linkWidth(dynamicSizeBaseOnEdgeWidth());
        } else {//show description or data
            this.myGraph
                .linkThreeObject(link => {
                    const text = new SpriteText(GraphItem.chooseByCurrent(link, edge.description ? edge.description : edge.data));
                    text.color = "#000";
                    text.textHeight = dynamicSizeBaseOnEdgeWidth(1)(link);
                    text.fontWeight = "bold";
                    return text;
                })
                .linkPositionUpdate((sprite, {start, end}) => {
                    const middlePos = Object.assign(...["x", "y", "z"].map(c => ({[c]: start[c] + (end[c] - start[c]) / 2 /*calc middle point*/})));
                    Object.assign(sprite.position, middlePos);
                    return false;
                })
                .linkThreeObjectExtend(true);
        }
    }

    shouldComponentUpdate(nextProps) {
        const curVersion = this.version;
        const nextVersion = nextProps.itemRenderer.version;
        if (curVersion !== nextVersion) {
            this.version = nextProps.itemRenderer.version;
            this.size = {...nextProps.size};
            return true;
        }

        const curWidth = this.size.width;
        const nextWidth = nextProps.size.width;
        const curHeight = this.size.height;
        const nextHeight = nextProps.size.height;
        if (curWidth !== nextWidth || curHeight !== nextHeight) this.myGraph.width(nextWidth).height(nextHeight);
        this.version = nextProps.itemRenderer.version;
        this.size = {...nextProps.size};
        return false;
    }

    componentDidMount() {
        this.myGraph = ForceGraph3D()(this.graphDiv.current);
        this.updateGraphRender();
    }

    componentDidUpdate() {
        this.updateGraphRender();
    }

    render() {
        return <div ref={this.graphDiv} style={{overflow: 'hidden'}}/>;
    }
}

export default GraphItem;
