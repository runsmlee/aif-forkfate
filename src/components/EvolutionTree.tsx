import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import type { SimulationNodeDatum, SimulationLinkDatum } from 'd3';
import { useForkData } from '../hooks/useForkData';
import { useRepoStore } from '../stores/repo-store';
import type { TreeNode, ForkStatus } from '../lib/types';

interface SimNode extends SimulationNodeDatum {
  id: string;
  forkId: number;
  name: string;
  owner: string;
  status: ForkStatus;
  commitCount: number;
  activityScore: number;
}

interface SimLink extends SimulationLinkDatum<SimNode> {}

const NODE_RADIUS = 8;
const ACTIVE_COLOR = '#22C55E';
const DORMANT_COLOR = '#6B7280';
const DEAD_COLOR = '#374151';
const ROOT_COLOR = '#EF4444';

function getStatusColor(status: ForkStatus): string {
  switch (status) {
    case 'alive':
      return ACTIVE_COLOR;
    case 'dormant':
      return DORMANT_COLOR;
    case 'dead':
      return DEAD_COLOR;
    default:
      return ROOT_COLOR;
  }
}

function flattenTree(node: TreeNode): { nodes: SimNode[]; links: SimLink[] } {
  const nodes: SimNode[] = [];
  const links: SimLink[] = [];

  function traverse(n: TreeNode, parentId: string | null): void {
    const simNode: SimNode = {
      id: n.id,
      forkId: n.forkId,
      name: n.name,
      owner: n.owner,
      status: n.status,
      commitCount: n.commitCount,
      activityScore: n.activityScore,
    };
    nodes.push(simNode);

    if (parentId !== null) {
      const link: SimLink = {
        source: parentId as unknown as SimNode,
        target: n.id as unknown as SimNode,
      };
      links.push(link);
    }

    n.children.forEach((child) => traverse(child, n.id));
  }

  traverse(node, null);
  return { nodes, links };
}

export function EvolutionTree(): JSX.Element {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { tree } = useForkData();
  const loading = useRepoStore((s) => s.loading);
  const forks = useRepoStore((s) => s.forks);
  const darkMode = useRepoStore((s) => s.darkMode);
  const setSelectedFork = useRepoStore((s) => s.setSelectedFork);

  const handleNodeClick = useCallback(
    (forkId: number) => {
      if (forkId === 0) return;
      const fork = forks.find((f) => f.id === forkId);
      if (fork) {
        setSelectedFork(fork);
      }
    },
    [forks, setSelectedFork]
  );

  useEffect(() => {
    if (!tree || !svgRef.current || !containerRef.current) return;

    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
    svg.selectAll('*').remove();

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = Math.max(400, Math.min(600, container.clientHeight));

    svg.attr('width', width).attr('height', height);

    const { nodes, links } = flattenTree(tree);

    const simulation = d3
      .forceSimulation<SimNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((d: SimNode) => d.id)
          .distance(60)
      )
      .force('charge', d3.forceManyBody().strength(-120))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<SimNode>().radius(NODE_RADIUS + 4));

    const g = svg.append('g');

    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr('transform', event.transform.toString());
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    svg.call(zoomBehavior as any);

    // Draw links
    const link = g
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('class', 'link')
      .attr('stroke', darkMode ? '#374151' : '#D1D5DB')
      .attr('stroke-width', (d: SimLink) => {
        const target = d.target as SimNode;
        return Math.max(1, Math.min(6, target.commitCount / 5));
      })
      .attr('stroke-opacity', 0.6);

    // Draw nodes
    const node = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('class', (d: SimNode) => (d.status === 'alive' ? 'node node-alive' : 'node'))
      .attr('r', (d: SimNode) => (d.id === 'root' ? NODE_RADIUS + 4 : NODE_RADIUS))
      .attr('fill', (d: SimNode) => getStatusColor(d.status))
      .attr('stroke', darkMode ? '#1F2937' : '#FFFFFF')
      .attr('stroke-width', 2)
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', (d: SimNode) =>
        `${d.owner}/${d.name} - ${d.status} fork, ${d.commitCount} commits`
      )
      .style('cursor', 'pointer')
      .on('click', (_event: MouseEvent, d: SimNode) => {
        handleNodeClick(d.forkId);
      })
      .on('keydown', (event: KeyboardEvent, d: SimNode) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleNodeClick(d.forkId);
        }
      });

    // Tooltip
    node
      .append('title')
      .text(
        (d: SimNode) =>
          `${d.owner}/${d.name}\nStatus: ${d.status}\nCommits: ${d.commitCount}\nActivity: ${d.activityScore}%`
      );

    // Drag
    const dragBehavior = d3
      .drag<SVGCircleElement, SimNode>()
      .on('start', (event: d3.D3DragEvent<SVGCircleElement, SimNode, SimNode>, d: SimNode) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event: d3.D3DragEvent<SVGCircleElement, SimNode, SimNode>, d: SimNode) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event: d3.D3DragEvent<SVGCircleElement, SimNode, SimNode>, d: SimNode) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    node.call(dragBehavior as any);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: SimLink) => (d.source as SimNode).x ?? 0)
        .attr('y1', (d: SimLink) => (d.source as SimNode).y ?? 0)
        .attr('x2', (d: SimLink) => (d.target as SimNode).x ?? 0)
        .attr('y2', (d: SimLink) => (d.target as SimNode).y ?? 0);

      node
        .attr('cx', (d: SimNode) => d.x ?? 0)
        .attr('cy', (d: SimNode) => d.y ?? 0);
    });

    return () => {
      simulation.stop();
    };
  }, [tree, darkMode, handleNodeClick]);

  if (loading) {
    return (
      <div className="card" aria-busy="true">
        <div className="flex items-center gap-2 mb-4">
          <div className="skeleton h-6 w-40" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="skeleton h-4 w-4 rounded-full" />
              <div className="skeleton h-px flex-1" />
              <div className="skeleton h-4 w-4 rounded-full" />
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
          Building evolutionary tree...
        </p>
      </div>
    );
  }

  if (!tree) {
    return <></>;
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Evolutionary Tree
        </h2>
        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          Drag to explore · Scroll to zoom
        </span>
      </div>
      <div
        ref={containerRef}
        className="w-full rounded-xl overflow-hidden bg-gray-50/80 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800"
        style={{ height: '500px' }}
      >
        <svg
          ref={svgRef}
          className="tree-canvas"
          role="img"
          aria-label="Interactive fork lineage tree visualization showing active, dormant, and dead forks"
        />
      </div>
    </div>
  );
}
