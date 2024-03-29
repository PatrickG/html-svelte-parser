import { render } from 'dom-serializer';
import {
	Text,
	isTag,
	isText,
	type ChildNode,
	type DomHandlerOptions,
	type Node as DomNode,
	type Element,
} from 'domhandler';
import { BROWSER } from 'esm-env';
import htmlToDom from 'html-dom-parser';
import type { ComponentType } from 'svelte';
import {
	NodeType,
	type ComponentNode,
	type Node,
	type Options,
	type ProcessNode,
	type TagNode,
} from './types.js';

const TEXTAREA_REGEX = /^<[^>]+>(.+)<\/[^<]+>$/;

const defaultOptions: Omit<Options, 'processNode'> = {
	lowerCaseAttributeNames: false,
};

export const parse = <C extends ComponentType | string = string>(
	html: string,
	options: Options<C> = {},
) => {
	const opts: Options<C> & DomHandlerOptions = {
		...defaultOptions,
		...options,
		withStartIndices: true,
		withEndIndices: true,
	};
	const { components, nodes } = transform<C>(html, htmlToDom(html, opts), opts);
	return {
		nodes,
		components: Array.from(components),
	};
};

const removeNode = (node: DomNode) => {
	const { prev, next, parent } = node;
	if (prev) prev.next = next;
	if (next) next.prev = prev;
	if (parent)
		parent.children.splice(parent.children.indexOf(node as ChildNode), 1);
};

const transform = <C extends ComponentType | string = ComponentType | string>(
	html: string,
	domNodes: DomNode[],
	options: Options<C>,
) => {
	const nodes: Node[] = [];
	const components = new Set<C>();

	for (const domNode of domNodes) {
		let processResult: ReturnType<ProcessNode<C>> = false;

		if (isText(domNode)) {
			processResult = options.processNode?.(domNode);
		} else if (isTag(domNode) && !options.filterTags?.includes(domNode.name)) {
			// fix textarea content on the server as good as possible
			// @see https://github.com/fb55/htmlparser2/issues/51
			if (
				!BROWSER &&
				domNode.name === 'textarea' &&
				domNode.children?.length &&
				domNode.startIndex !== null &&
				domNode.endIndex !== null
			) {
				const match = html
					.slice(domNode.startIndex, domNode.endIndex + 1)
					.match(TEXTAREA_REGEX);
				if (match) domNode.children = [new Text(match[1])];
			}

			// Filter `node.attribs` before processing node
			domNode.attribs = getFilteredAttributes(domNode, options).attributes;
			processResult = options.processNode?.(domNode);
		}

		if (processResult === false) {
			removeNode(domNode);
			continue;
		}

		if (processResult?.component) {
			components.add(processResult.component);
			const node: Node = {
				type: NodeType.Component,
				component: processResult.component,
			};

			if (processResult.props) node.props = processResult.props;

			if (processResult.rendererProps) {
				node.rendererProps = {};
				for (const [propName, childNodes] of Object.entries(
					processResult.rendererProps,
				)) {
					if (!childNodes) {
						node.rendererProps[propName] = [];
						continue;
					}

					const childDomNodes = Array.isArray(childNodes)
						? childNodes
						: [childNodes];

					const { nodes, components: childComponents } = transform<C>(
						html,
						childDomNodes,
						options,
					);

					node.rendererProps[propName] = nodes;

					for (const childComponent of childComponents) {
						components.add(childComponent);
					}

					// Don't bother removing child nodes if they won't be processed anyway.
					if (!processResult.noChildren) {
						for (const childDomNode of childDomNodes) {
							removeNode(childDomNode);
						}
					}
				}
			}

			if (
				!processResult.noChildren &&
				isTag(domNode) &&
				domNode.children?.length
			) {
				transformAndAddChildren(html, node, domNode, components, options);
			}

			nodes.push(node);
			continue;
		}

		if (isText(domNode)) {
			// If the previous node is a `TextNode` or `HtmlNode`, append text to data
			const prevNode = nodes.at(-1);
			if (
				prevNode?.type === NodeType.Text ||
				prevNode?.type === NodeType.Html
			) {
				prevNode.data += domNode.data;
				continue;
			}

			nodes.push({ type: NodeType.Text, data: domNode.data });
			continue;
		}

		if (isTag(domNode)) {
			if (domNode.name === 'script' || domNode.name === 'style') {
				addHtmlNode(domNode, nodes, options);
				continue;
			}

			const node: TagNode = { type: NodeType.Tag, tag: domNode.name };
			const { attributes, hasAttributes } = getFilteredAttributes(
				domNode,
				options,
			);
			if (hasAttributes) node.attributes = attributes;

			let hasChildComponents;
			if (domNode.children?.length) {
				hasChildComponents = transformAndAddChildren(
					html,
					node,
					domNode,
					components,
					options,
				);
			}

			if (options.noHtmlNodes || hasChildComponents) {
				nodes.push(node);
				continue;
			}

			addHtmlNode(domNode, nodes, options);
		}

		// Ignore all other node types
	}

	return { nodes, components };
};

const transformAndAddChildren = (
	html: string,
	node: TagNode | ComponentNode,
	domNode: Element,
	components: Set<ComponentType | string>,
	options: Options,
) => {
	const { nodes: childNodes, components: childComponents } = transform(
		html,
		domNode.children,
		options,
	);

	if (childNodes.length) {
		node.children = childNodes;
		for (const component of childComponents) {
			components.add(component);
		}

		return childComponents.size as unknown as boolean;
	}
};

const getFilteredAttributes = (domNode: Element, options: Options) => {
	const attributes: [PropertyKey, string][] = [];
	for (const [name, value] of Object.entries(domNode.attribs)) {
		if (
			typeof value === 'string' &&
			!options.filterAttributes?.includes(name) &&
			!(options.filterEventAttributes && name.startsWith('on'))
		) {
			attributes.push([name, value]);
		}
	}

	return {
		attributes: (domNode.attribs = Object.fromEntries(attributes)),
		hasAttributes: attributes.length,
	};
};

const addHtmlNode = (domNode: Element, nodes: Node[], options: Options) => {
	const html = render(domNode, options);

	// If the previous node is a `TextNode`, change it to `HtmlNode` and
	// append html to data
	const prevNode = nodes.at(-1);
	if (prevNode?.type === NodeType.Text) {
		(prevNode as Node).type = NodeType.Html;
		prevNode.data = prevNode.data + html;
		return;
	}

	// If the previous node is a `HtmlNode`, append html to data
	if (prevNode?.type === NodeType.Html) {
		prevNode.data += html;
		return;
	}

	nodes.push({
		type: NodeType.Html,
		data: html,
	});
};
