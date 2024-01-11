import type { DomSerializerOptions } from 'dom-serializer';
import type {
	DomHandlerOptions,
	Node as DomNode,
	Element,
	Text,
} from 'domhandler';
import type { ParserOptions } from 'htmlparser2';
import type { ComponentType } from 'svelte';

export enum NodeType {
	Text,
	Tag,
	Html,
	Component,
}

export type Attributes = Record<string, string>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Props = Record<string, any>;

export type RendererProps = {
	nodes: Node[];
	props: Record<string, Props>;
	components: Record<string, ComponentType>;
	fallback?: ComponentType;
};

export type TextNode = { type: NodeType.Text; data: string };

export type TagNode = {
	type: NodeType.Tag;
	tag: string;
	attributes?: Attributes;
	children?: Node[];
};

export type HtmlNode = { type: NodeType.Html; data: string };

export type ComponentNode = {
	type: NodeType.Component;
	component: ComponentType | string;
	props?: Props;
	children?: Node[];
	rendererProps?: Record<string, Node[]>;
};

export type Node = TextNode | TagNode | HtmlNode | ComponentNode;

export type ProcessNode<
	C extends ComponentType | string = ComponentType | string,
> = (node: Element | Text) =>
	| {
			component: C;

			/**
			 * Props that will be passed to `component`.
			 */
			props?: Props;

			/**
			 * If `true`, children of `node` will not be processed and no `default`
			 * slot is rendered for the `component`.
			 */
			noChildren?: boolean;

			/**
			 * Transform child nodes into a prop that will be passed to `component`
			 * which can be rendered to a named slot with the `Renderer` component.
			 *
			 * The nodes are automatically removed from the tree so that they do not
			 * end up in the `default` slot.
			 */
			rendererProps?: Record<
				string,
				DomNode | DomNode[] | null | undefined | void
			>;
	  }
	| false
	| void;

export type Options<C extends ComponentType | string = ComponentType | string> =
	ParserOptions &
		Omit<DomHandlerOptions, 'withStartIndices' | 'withEndIndices'> &
		DomSerializerOptions & {
			/**
			 * Modify, remove or replace a node.
			 */
			processNode?: ProcessNode<C>;

			/**
			 * Remove element nodes with the specified names.
			 *
			 * @default []
			 */
			filterTags?: string[];

			/**
			 * Remove element attributes with the specified names.
			 *
			 * @default []
			 */
			filterAttributes?: string[];

			/**
			 * Remove element attributes that start with `on:`.
			 *
			 * @default false
			 */
			filterEventAttributes?: boolean;

			/**
			 * Do not render children with sveltes `@html`.
			 *
			 * @default false
			 */
			noHtmlNodes?: boolean;

			/**
			 * If set to true, all attribute names will be lowercased. This has noticeable impact on speed.
			 *
			 * @default false
			 */
			lowerCaseAttributeNames?: boolean;
		};
