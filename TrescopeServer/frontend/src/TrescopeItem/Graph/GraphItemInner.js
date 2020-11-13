import React from "react";
import ReactDOM from "react-dom";
import ForceGraph3D from "3d-force-graph";
import SpriteText from "three-spritetext";
import * as d3force from "d3-force-3d";

class GraphItemInner extends React.Component {
    constructor(props) {
        super(props);
        this.currentHighlight = {link: null, nodes: []};
    }

    static composeAndTransposeLinkEdge(link, edge) {
        let result = [];
        for (let i = 0; i < edge.length; i++)
            result.push({
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

        const sameSourceAndTargetClone = JSON.parse(
            JSON.stringify(sameSourceAndTargetEdge)
        );
        for (let i = 0; i < edge.length; i++) {
            const key = generateKey(edge[i]);
            if (1 === sameSourceAndTargetEdge[key]) edge[i]["rotation"] = 0;
            else
                edge[i]["rotation"] =
                    2 *
                    Math.PI *
                    (sameSourceAndTargetClone[key] /
                        sameSourceAndTargetEdge[key]);
            if (
                1 === sameSourceAndTargetEdge[key] &&
                edge[i]["source"] !== edge[i]["target"]
            )
                edge[i]["curvature"] = 0;
            else edge[i]["curvature"] = 0.25;
            sameSourceAndTargetClone[key] -= 1;
        }
        return edge;
    }

    static chooseByCurrent(current, arrayOrSingleOrNull, defaultValue) {
        if (Array.isArray(arrayOrSingleOrNull))
            return arrayOrSingleOrNull[current.id];
        if (!!arrayOrSingleOrNull) return arrayOrSingleOrNull;
        return defaultValue;
    }

    static labelToShow(current, vertexData, edgeData, linkOrNode) {
        const text = GraphItemInner.chooseByCurrent(
            current,
            "node" === linkOrNode ? vertexData : edgeData,
            current.id
        );
        if ("node" === linkOrNode)
            return `<div style="color: #000;">${text}</div>`;

        const sourceNodeText = GraphItemInner.chooseByCurrent(
            current.source,
            vertexData,
            current.source.id
        );
        const targetNodeText = GraphItemInner.chooseByCurrent(
            current.target,
            vertexData,
            current.target.id
        );
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
        if (
            (!currentNode && !this.currentHighlight.nodes.length) ||
            (this.currentHighlight.nodes.length === 1 &&
                this.currentHighlight.nodes[0] === currentNode)
        )
            return;

        this.currentHighlight.nodes = currentNode ? [currentNode] : [];
        this.updateHighlight();
    };
    onLinkHover = (currentLink, previousLink) => {
        if (this.currentHighlight.link === currentLink) return;

        this.currentHighlight.link = currentLink;
        this.currentHighlight.nodes = currentLink
            ? [currentLink.source, currentLink.target]
            : [];
        this.updateHighlight();
    };

    updateHighlight() {
        this.myGraph
            .linkDirectionalParticles(this.myGraph.linkDirectionalParticles())
            .linkDirectionalArrowLength(
                this.myGraph.linkDirectionalArrowLength()
            )
            .linkDirectionalParticleWidth(
                this.myGraph.linkDirectionalParticleWidth()
            )
            .linkWidth(this.myGraph.linkWidth())
            .linkThreeObject(this.myGraph.linkThreeObject())

            .nodeColor(this.myGraph.nodeColor())
            .nodeThreeObject(this.myGraph.nodeThreeObject());
    }

    updateGraphRender(previousProps) {
        const {width, height} = this.props;
        const {
            graphData: {vertex, link, edge, version}
        } = this.props.itemRenderer;

        const preWidth = previousProps ? previousProps.width : -1;
        const preHeight = previousProps ? previousProps.height : -1;
        const preVersion = previousProps
            ? previousProps.graphData.version
            : undefined;
        this.myGraph.backgroundColor("white").showNavInfo(false);
        if (preWidth !== width) this.myGraph.width(width);
        if (preHeight !== height) this.myGraph.height(height);
        if (preVersion === version) return;

        const highlightSizeFactor = 2;
        const dynamicSizeBaseOnEdgeWidth = (coefficient = 1) => link => {
            const regular =
                GraphItemInner.chooseByCurrent(link, edge.width) * coefficient;
            return link === this.currentHighlight.link
                ? highlightSizeFactor * regular
                : regular;
        };

        let nodes = vertex.data.map((element, index) => {
            return {id: index, data: element};
        });
        let links = GraphItemInner.composeAndTransposeLinkEdge(link, edge.data);
        links = GraphItemInner.calculateEdgeRotationAndCurvature(links);
        const graphData = {nodes, links};

        this.myGraph
            .graphData(graphData)

            .linkCurvature(link => link.curvature)
            .linkCurveRotation(link => link.rotation)
            .linkOpacity(edge.opacity)
            .linkLabel(link =>
                GraphItemInner.labelToShow(link, vertex.data, edge.data, "link")
            )
            .linkColor(link =>
                GraphItemInner.chooseByCurrent(link, edge.color, 0xff000000)
            )
            .linkDirectionalParticles(link =>
                link === this.currentHighlight.link ? 4 : 0
            )
            .linkDirectionalArrowLength(dynamicSizeBaseOnEdgeWidth(2))
            .linkDirectionalParticleWidth(dynamicSizeBaseOnEdgeWidth())

            .nodeRelSize(vertex.size)
            .nodeOpacity(vertex.opacity)
            .nodeLabel(node =>
                GraphItemInner.labelToShow(node, vertex.data, edge.data, "node")
            )
            .nodeColor(node =>
                -1 !== this.currentHighlight.nodes.indexOf(node)
                    ? 0xaaff0000
                    : GraphItemInner.chooseByCurrent(node, vertex.color)
            )

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
        if (blankContent(vertex.description)) {
            //show nothing
        } else {
            //show description or data
            this.myGraph
                .nodeThreeObject(node => {
                    const text = new SpriteText(
                        GraphItemInner.chooseByCurrent(
                            node,
                            vertex.description
                                ? vertex.description
                                : vertex.data
                        )
                    );
                    text.color = "#000";
                    text.textHeight = vertex.size;
                    text.fontWeight = "bold";
                    return text;
                })
                .nodeThreeObjectExtend(true);
        }

        if (blankContent(edge.description)) {
            //show nothing
            this.myGraph.linkWidth(dynamicSizeBaseOnEdgeWidth());
        } else {
            //show description or data
            this.myGraph
                .linkThreeObject(link => {
                    const text = new SpriteText(
                        GraphItemInner.chooseByCurrent(
                            link,
                            edge.description ? edge.description : edge.data
                        )
                    );
                    text.color = "#000";
                    text.textHeight = dynamicSizeBaseOnEdgeWidth(1)(link);
                    text.fontWeight = "bold";
                    return text;
                })
                .linkPositionUpdate((sprite, {start, end}) => {
                    const middlePos = Object.assign(
                        ...["x", "y", "z"].map(c => ({
                            [c]:
                            start[c] +
                            (end[c] - start[c]) / 2 /*calc middle point*/
                        }))
                    );
                    Object.assign(sprite.position, middlePos);
                    return false;
                })
                .linkThreeObjectExtend(true);
        }
    }

    componentDidMount() {
        this.myGraph = ForceGraph3D()(
            ReactDOM.findDOMNode(this.refs["graphDiv"])
        );
        this.updateGraphRender();
    }

    shouldComponentUpdate(nextProps) {
        const {itemRenderer, width, height} = this.props;
        if (
            nextProps.itemRenderer.version !== itemRenderer.version ||
            nextProps.width !== width ||
            nextProps.height !== height
        )
            return true;
        return false;
    }

    componentDidUpdate(previousProps, previousState, snapshot) {
        this.updateGraphRender(previousProps);
    }

    render() {
        const {width, height} = this.props;
        return (
            <div
                ref={"graphDiv"}
                style={{width: `${width}px`, height: `${height}px`}}
            />
        );
    }
}

export default GraphItemInner;
