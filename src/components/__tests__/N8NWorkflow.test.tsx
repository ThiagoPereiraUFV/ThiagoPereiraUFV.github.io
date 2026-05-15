import { render } from '@testing-library/react';
import N8NWorkflow from '../molecules/N8NWorkflow';
import { ILowCodeProject } from '@/interfaces/low-code-projects';

// Mock the dynamic import of n8n-demo-component
jest.mock('@n8n_io/n8n-demo-component/n8n-demo.bundled.js', () => ({}));

describe('N8NWorkflow Component', () => {
  const mockWorkflow: ILowCodeProject = {
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
    id: 'test-workflow-1',
    name: 'Test Workflow',
    active: true,
    nodes: [
      {
        id: 'node1',
        type: 'trigger',
        name: 'Test Trigger'
      }
    ],
    connections: {
      'node1': {
        'main': [
          {
            'node': 'node2',
            'type': 'main',
            'index': 0
          }
        ]
      }
    },
    settings: {
      saveDataSuccessExecution: 'all',
      saveDataErrorExecution: 'all'
    },
    staticData: {},
    meta: {
      description: 'Test workflow description'
    },
    pinData: {},
    versionId: 'v1.0.0',
    triggerCount: 5,
    shared: [],
    tags: ['test', 'automation']
  };

  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = '';
  });

  it('should render workflow name as heading', () => {
    const { container } = render(
      <N8NWorkflow workflowKey="test-key" workflow={mockWorkflow} />
    );
    
    const heading = container.querySelector('h3');
    expect(heading).toBeTruthy();
    expect(heading?.textContent).toBe('Test Workflow');
    expect(heading?.className).toContain('tw:text-sm');
  });

  it('should render n8n-demo custom element', () => {
    const { container } = render(
      <N8NWorkflow workflowKey="test-key" workflow={mockWorkflow} />
    );
    
    const n8nDemo = container.querySelector('n8n-demo');
    expect(n8nDemo).toBeTruthy();
  });

  it('should pass workflow data as JSON string to n8n-demo element', () => {
    const { container } = render(
      <N8NWorkflow workflowKey="test-key" workflow={mockWorkflow} />
    );
    
    const n8nDemo = container.querySelector('n8n-demo');
    const workflowAttr = n8nDemo?.getAttribute('workflow');
    
    expect(workflowAttr).toBeTruthy();
    
    // Parse the JSON to verify it's valid
    const parsedWorkflow = JSON.parse(workflowAttr!);
    expect(parsedWorkflow.id).toBe('test-workflow-1');
    expect(parsedWorkflow.name).toBe('Test Workflow');
    expect(parsedWorkflow.active).toBe(true);
  });

  it('should set data-key attribute on n8n-demo element', () => {
    const { container } = render(
      <N8NWorkflow workflowKey="unique-key" workflow={mockWorkflow} />
    );
    
    const n8nDemo = container.querySelector('n8n-demo');
    expect(n8nDemo?.getAttribute('data-key')).toBe('unique-key');
  });

  it('should render with correct structure', () => {
    const { container } = render(
      <N8NWorkflow workflowKey="test-key" workflow={mockWorkflow} />
    );
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper?.tagName.toLowerCase()).toBe('div');
    
    const heading = wrapper?.querySelector('h3');
    const n8nDemo = wrapper?.querySelector('n8n-demo');
    
    expect(heading).toBeTruthy();
    expect(n8nDemo).toBeTruthy();
  });

  it('should handle workflow with minimal data', () => {
    const minimalWorkflow: ILowCodeProject = {
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      id: 'minimal',
      name: 'Minimal Workflow',
      active: false,
      nodes: [],
      connections: {},
      settings: {},
      staticData: {},
      meta: {},
      pinData: {},
      versionId: 'v1',
      triggerCount: 0,
      shared: [],
      tags: []
    };

    const { container } = render(
      <N8NWorkflow workflowKey="minimal-key" workflow={minimalWorkflow} />
    );
    
    const heading = container.querySelector('h3');
    expect(heading?.textContent).toBe('Minimal Workflow');
    
    const n8nDemo = container.querySelector('n8n-demo');
    const workflowAttr = n8nDemo?.getAttribute('workflow');
    const parsedWorkflow = JSON.parse(workflowAttr!);
    
    expect(parsedWorkflow.id).toBe('minimal');
    expect(parsedWorkflow.nodes).toEqual([]);
    expect(parsedWorkflow.active).toBe(false);
  });

  it('should handle workflow with complex data structures', () => {
    const complexWorkflow: ILowCodeProject = {
      ...mockWorkflow,
      nodes: [
        {
          id: 'node1',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 1,
          position: [250, 300],
          parameters: {
            url: 'https://api.example.com/data',
            method: 'GET',
            headers: {
              'Authorization': 'Bearer token'
            }
          }
        }
      ],
      connections: {
        'node1': {
          'main': [
            {
              'node': 'node2',
              'type': 'main',
              'index': 0
            }
          ]
        }
      }
    };

    const { container } = render(
      <N8NWorkflow workflowKey="complex-key" workflow={complexWorkflow} />
    );
    
    const n8nDemo = container.querySelector('n8n-demo');
    const workflowAttr = n8nDemo?.getAttribute('workflow');
    const parsedWorkflow = JSON.parse(workflowAttr!);
    
    expect(parsedWorkflow.nodes).toHaveLength(1);
    expect(parsedWorkflow.nodes[0].type).toBe('n8n-nodes-base.httpRequest');
    expect(parsedWorkflow.connections).toHaveProperty('node1');
  });

  it('should handle different data-key values', () => {
    const keys = ['key1', 'another-key', '123', 'special-key-with-dashes'];
    
    keys.forEach(key => {
      const { container } = render(
        <N8NWorkflow workflowKey={key} workflow={mockWorkflow} />
      );
      
      const n8nDemo = container.querySelector('n8n-demo');
      expect(n8nDemo?.getAttribute('data-key')).toBe(key);
    });
  });

  it('should handle workflow names with special characters', () => {
    const specialWorkflow: ILowCodeProject = {
      ...mockWorkflow,
      name: 'Workflow with Special Characters: <>&"\'',
    };

    const { container } = render(
      <N8NWorkflow workflowKey="special-key" workflow={specialWorkflow} />
    );
    
    const heading = container.querySelector('h3');
    expect(heading?.textContent).toBe('Workflow with Special Characters: <>&"\'');
  });

  it('should serialize all workflow properties to JSON', () => {
    const { container } = render(
      <N8NWorkflow workflowKey="test-key" workflow={mockWorkflow} />
    );
    
    const n8nDemo = container.querySelector('n8n-demo');
    const workflowAttr = n8nDemo?.getAttribute('workflow');
    const parsedWorkflow = JSON.parse(workflowAttr!);
    
    // Check that all properties are preserved
    expect(parsedWorkflow).toHaveProperty('createdAt');
    expect(parsedWorkflow).toHaveProperty('updatedAt');
    expect(parsedWorkflow).toHaveProperty('id');
    expect(parsedWorkflow).toHaveProperty('name');
    expect(parsedWorkflow).toHaveProperty('active');
    expect(parsedWorkflow).toHaveProperty('nodes');
    expect(parsedWorkflow).toHaveProperty('connections');
    expect(parsedWorkflow).toHaveProperty('settings');
    expect(parsedWorkflow).toHaveProperty('staticData');
    expect(parsedWorkflow).toHaveProperty('meta');
    expect(parsedWorkflow).toHaveProperty('pinData');
    expect(parsedWorkflow).toHaveProperty('versionId');
    expect(parsedWorkflow).toHaveProperty('triggerCount');
    expect(parsedWorkflow).toHaveProperty('shared');
    expect(parsedWorkflow).toHaveProperty('tags');
  });
});